from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import GlossaryTerm

router = APIRouter()


@router.get("/")
def list_terms(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    letter: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(GlossaryTerm)
    if search:
        q = q.filter(GlossaryTerm.term.ilike(f"%{search}%"))
    if category:
        q = q.filter(GlossaryTerm.category == category)
    if letter:
        q = q.filter(GlossaryTerm.term.ilike(f"{letter}%"))
    terms = q.order_by(GlossaryTerm.term).all()
    return [
        {
            "id": t.id,
            "term": t.term,
            "definition": t.definition,
            "category": t.category,
        }
        for t in terms
    ]


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    cats = [r[0] for r in db.query(GlossaryTerm.category).distinct().all() if r[0]]
    return sorted(cats)


@router.get("/{term_id}")
def get_term(term_id: int, db: Session = Depends(get_db)):
    t = db.query(GlossaryTerm).filter(GlossaryTerm.id == term_id).first()
    if not t:
        return {"error": "Not found"}
    return {
        "id": t.id,
        "term": t.term,
        "definition": t.definition,
        "category": t.category,
        "related_terms": t.related_terms,
        "related_strategy_ids": t.related_strategy_ids,
    }
