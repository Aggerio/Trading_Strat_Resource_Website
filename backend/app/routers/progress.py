from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db
from app.models import UserProgress, Strategy, Lesson, Quiz

router = APIRouter()


class MarkStudied(BaseModel):
    strategy_id: int


@router.get("/")
def get_progress(db: Session = Depends(get_db)):
    all_progress = db.query(UserProgress).all()
    total_strategies = db.query(Strategy).count()
    studied = db.query(UserProgress).filter(
        UserProgress.strategy_id.isnot(None),
        UserProgress.status.in_(["studied", "completed"]),
    ).count()
    total_lessons = db.query(Lesson).count()
    completed_lessons = db.query(UserProgress).filter(
        UserProgress.lesson_id.isnot(None),
        UserProgress.strategy_id.is_(None),
        UserProgress.quiz_id.is_(None),
        UserProgress.status == "completed",
    ).count()
    total_quizzes = db.query(Quiz).count()
    quiz_progress = db.query(UserProgress).filter(
        UserProgress.quiz_id.isnot(None)
    ).all()
    quizzes_passed = sum(1 for p in quiz_progress if p.status == "completed")
    avg_score = (
        sum(p.score for p in quiz_progress if p.score is not None) / len(quiz_progress)
        if quiz_progress
        else 0
    )

    return {
        "strategies_studied": studied,
        "total_strategies": total_strategies,
        "lessons_completed": completed_lessons,
        "total_lessons": total_lessons,
        "quizzes_passed": quizzes_passed,
        "total_quizzes": total_quizzes,
        "average_quiz_score": round(avg_score, 2),
        "recent_activity": [
            {
                "id": p.id,
                "strategy_id": p.strategy_id,
                "lesson_id": p.lesson_id,
                "quiz_id": p.quiz_id,
                "status": p.status,
                "score": p.score,
                "last_accessed": p.last_accessed.isoformat() if p.last_accessed else None,
            }
            for p in sorted(all_progress, key=lambda x: x.last_accessed or datetime.min.replace(tzinfo=timezone.utc), reverse=True)[:10]
        ],
    }


@router.post("/study")
def mark_studied(body: MarkStudied, db: Session = Depends(get_db)):
    prog = db.query(UserProgress).filter(
        UserProgress.strategy_id == body.strategy_id,
        UserProgress.quiz_id.is_(None),
    ).first()
    if not prog:
        prog = UserProgress(strategy_id=body.strategy_id, status="studied")
        db.add(prog)
    else:
        prog.status = "studied"
    prog.last_accessed = datetime.now(timezone.utc)
    db.commit()
    return {"status": "ok"}
