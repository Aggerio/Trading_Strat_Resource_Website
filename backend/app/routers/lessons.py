from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import Lesson, UserProgress

router = APIRouter()


@router.get("/")
def list_lessons(module: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Lesson)
    if module:
        q = q.filter(Lesson.module == module)
    lessons = q.order_by(Lesson.module, Lesson.order).all()
    result = []
    for l in lessons:
        prog = db.query(UserProgress).filter(
            UserProgress.lesson_id == l.id,
            UserProgress.status == "completed"
        ).first()
        result.append({
            "id": l.id,
            "module": l.module,
            "order": l.order,
            "title": l.title,
            "subtitle": l.subtitle,
            "difficulty": l.difficulty,
            "prerequisites": l.prerequisites,
            "completed": prog is not None,
            "strategy_count": len(l.strategies),
        })
    return result


@router.get("/{lesson_id}")
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    l = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not l:
        return {"error": "Not found"}
    return {
        "id": l.id,
        "module": l.module,
        "order": l.order,
        "title": l.title,
        "subtitle": l.subtitle,
        "content": l.content,
        "difficulty": l.difficulty,
        "prerequisites": l.prerequisites,
        "strategies": [
            {"id": s.id, "name": s.name, "paper_ref": s.paper_ref}
            for s in l.strategies
        ],
        "quizzes": [
            {"id": q.id, "title": q.title, "passing_score": q.passing_score}
            for q in l.quizzes
        ],
    }
