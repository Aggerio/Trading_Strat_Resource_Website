from fastapi import APIRouter
from pydantic import BaseModel
from app.services.calculations import compute_option_payoff

router = APIRouter()


class PayoffRequest(BaseModel):
    strategy_type: str
    stock_price: float
    legs: list[dict]
    price_range: list[float] | None = None


@router.post("/payoff")
def calculate_payoff(req: PayoffRequest):
    result = compute_option_payoff(
        strategy_type=req.strategy_type,
        stock_price=req.stock_price,
        legs=req.legs,
        price_range=req.price_range,
    )
    return result
