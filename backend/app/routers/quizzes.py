from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db
from app.models import Quiz, QuizQuestion, UserProgress

router = APIRouter()


class SubmitAnswers(BaseModel):
    answers: dict[str, str]


@router.get("/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        return {"error": "Not found"}
    return {
        "id": quiz.id,
        "title": quiz.title,
        "lesson_id": quiz.lesson_id,
        "passing_score": quiz.passing_score,
        "questions": [
            {
                "id": q.id,
                "question_type": q.question_type,
                "question_text": q.question_text,
                "options": q.options,
                "order": q.order,
            }
            for q in sorted(quiz.questions, key=lambda x: x.order)
        ],
    }


@router.post("/{quiz_id}/submit")
def submit_quiz(quiz_id: int, body: SubmitAnswers, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        return {"error": "Not found"}

    total = len(quiz.questions)
    correct = 0
    results = []
    for q in quiz.questions:
        user_answer = body.answers.get(str(q.id), "")
        is_correct = user_answer.strip().lower() == q.correct_answer.strip().lower()
        if is_correct:
            correct += 1
        results.append({
            "question_id": q.id,
            "correct": is_correct,
            "user_answer": user_answer,
            "correct_answer": q.correct_answer,
            "explanation": q.explanation,
        })

    score = correct / total if total > 0 else 0
    passed = score >= quiz.passing_score

    prog = db.query(UserProgress).filter(
        UserProgress.quiz_id == quiz_id
    ).first()
    if not prog:
        prog = UserProgress(quiz_id=quiz_id, lesson_id=quiz.lesson_id)
        db.add(prog)
    prog.score = score
    prog.attempts += 1
    prog.status = "completed" if passed else "attempted"
    prog.last_accessed = datetime.now(timezone.utc)
    if passed:
        lesson_prog = db.query(UserProgress).filter(
            UserProgress.lesson_id == quiz.lesson_id,
            UserProgress.quiz_id.is_(None),
            UserProgress.strategy_id.is_(None),
        ).first()
        if not lesson_prog:
            lesson_prog = UserProgress(lesson_id=quiz.lesson_id, status="completed")
            db.add(lesson_prog)
        else:
            lesson_prog.status = "completed"
    db.commit()

    return {
        "score": score,
        "passed": passed,
        "correct": correct,
        "total": total,
        "results": results,
    }
