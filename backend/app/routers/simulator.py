from fastapi import APIRouter
from pydantic import BaseModel, field_validator
from app.services.calculations import compute_option_payoff

router = APIRouter()


class PayoffRequest(BaseModel):
    strategy_type: str
    stock_price: float
    legs: list[dict]
    price_range: list[float] | None = None

    @field_validator("stock_price")
    @classmethod
    def stock_price_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("stock_price must be positive")
        return v

    @field_validator("legs")
    @classmethod
    def legs_must_be_valid(cls, legs: list[dict]) -> list[dict]:
        if not legs:
            raise ValueError("legs must not be empty")
        for leg in legs:
            strike = leg.get("strike")
            premium = leg.get("premium")
            if strike is not None and strike <= 0:
                raise ValueError("leg strike must be positive")
            if premium is not None and premium < 0:
                raise ValueError("leg premium must be non-negative")
        return legs

    @field_validator("price_range")
    @classmethod
    def price_range_must_be_valid(cls, v: list[float] | None) -> list[float] | None:
        if v is not None:
            if len(v) != 2:
                raise ValueError("price_range must have exactly 2 elements [min, max]")
            if v[0] <= 0 or v[1] <= 0:
                raise ValueError("price_range values must be positive")
            if v[0] >= v[1]:
                raise ValueError("price_range min must be less than max")
        return v


@router.post("/payoff")
def calculate_payoff(req: PayoffRequest):
    result = compute_option_payoff(
        strategy_type=req.strategy_type,
        stock_price=req.stock_price,
        legs=req.legs,
        price_range=req.price_range,
    )
    return result
