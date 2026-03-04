from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import Strategy

router = APIRouter()


@router.get("/")
def list_strategies(
    asset_class: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    strategy_type: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Strategy)
    if asset_class:
        q = q.filter(Strategy.asset_class == asset_class)
    if category:
        q = q.filter(Strategy.category == category)
    if strategy_type:
        q = q.filter(Strategy.strategy_type == strategy_type)
    if difficulty:
        q = q.filter(Strategy.difficulty == difficulty)
    if search:
        q = q.filter(Strategy.name.ilike(f"%{search}%"))
    strategies = q.order_by(Strategy.asset_class, Strategy.paper_ref).all()
    return [_serialize_strategy(s) for s in strategies]


@router.get("/filters")
def get_filters(db: Session = Depends(get_db)):
    asset_classes = [r[0] for r in db.query(Strategy.asset_class).distinct().all()]
    categories = [r[0] for r in db.query(Strategy.category).distinct().all()]
    strategy_types = [r[0] for r in db.query(Strategy.strategy_type).distinct().all() if r[0]]
    difficulties = [r[0] for r in db.query(Strategy.difficulty).distinct().all() if r[0]]
    return {
        "asset_classes": sorted(asset_classes),
        "categories": sorted(categories),
        "strategy_types": sorted(strategy_types),
        "difficulties": difficulties,
    }


@router.get("/{strategy_id}")
def get_strategy(strategy_id: int, db: Session = Depends(get_db)):
    s = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if not s:
        return {"error": "Not found"}
    return _serialize_strategy(s, full=True)


def _serialize_strategy(s: Strategy, full: bool = False):
    data = {
        "id": s.id,
        "paper_ref": s.paper_ref,
        "name": s.name,
        "asset_class": s.asset_class,
        "category": s.category,
        "strategy_type": s.strategy_type,
        "outlook": s.outlook,
        "difficulty": s.difficulty,
        "short_description": s.short_description,
        "max_profit": s.max_profit,
        "max_loss": s.max_loss,
        "breakeven": s.breakeven,
    }
    if full:
        data.update({
            "full_description": s.full_description,
            "formulas": s.formulas,
            "legs": s.legs,
            "related_strategies": s.related_strategies,
            "references": s.references,
            "lesson_id": s.lesson_id,
        })
    return data
