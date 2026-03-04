import numpy as np
from typing import Optional


def compute_option_payoff(
    strategy_type: str,
    stock_price: float,
    legs: list[dict],
    price_range: Optional[list[float]] = None,
) -> dict:
    """
    Compute the payoff diagram for any options strategy.

    Each leg is a dict with keys:
      - type: "call" | "put" | "stock"
      - position: "long" | "short"
      - strike: float (not needed for stock)
      - premium: float
      - quantity: int (default 1)
    """
    if price_range is None:
        strikes = [l.get("strike", stock_price) for l in legs]
        low = min(strikes + [stock_price]) * 0.5
        high = max(strikes + [stock_price]) * 1.5
        price_range = [low, high]

    prices = np.linspace(price_range[0], price_range[1], 200)
    total_payoff = np.zeros_like(prices)
    total_cost = 0.0

    for leg in legs:
        leg_type = leg.get("type", "call")
        position = leg.get("position", "long")
        strike = leg.get("strike", stock_price)
        premium = leg.get("premium", 0.0)
        qty = leg.get("quantity", 1)
        sign = 1 if position == "long" else -1

        if leg_type == "call":
            intrinsic = np.maximum(prices - strike, 0)
            total_payoff += sign * qty * intrinsic
            total_cost += sign * qty * premium
        elif leg_type == "put":
            intrinsic = np.maximum(strike - prices, 0)
            total_payoff += sign * qty * intrinsic
            total_cost += sign * qty * premium
        elif leg_type == "stock":
            total_payoff += sign * qty * (prices - stock_price)

    profit_loss = total_payoff - total_cost

    breakevens = _find_breakevens(prices, profit_loss)
    max_profit = float(np.max(profit_loss))
    max_loss = float(np.min(profit_loss))
    if max_profit > 1e6:
        max_profit_str = "Unlimited"
    else:
        max_profit_str = f"${max_profit:.2f}"
    if max_loss < -1e6:
        max_loss_str = "Unlimited"
    else:
        max_loss_str = f"${max_loss:.2f}"

    return {
        "prices": prices.tolist(),
        "profit_loss": profit_loss.tolist(),
        "breakevens": breakevens,
        "max_profit": max_profit_str,
        "max_loss": max_loss_str,
        "net_cost": float(total_cost),
    }


def _find_breakevens(prices: np.ndarray, pnl: np.ndarray) -> list[float]:
    breakevens = []
    for i in range(len(pnl) - 1):
        if pnl[i] * pnl[i + 1] < 0:
            x = prices[i] - pnl[i] * (prices[i + 1] - prices[i]) / (pnl[i + 1] - pnl[i])
            breakevens.append(round(float(x), 2))
    return breakevens


def compute_stock_indicators(
    prices: list[float],
    indicator: str,
    params: dict,
) -> dict:
    arr = np.array(prices, dtype=float)
    if indicator == "sma":
        period = params.get("period", 20)
        sma = _simple_moving_average(arr, period)
        return {"values": sma.tolist(), "label": f"SMA({period})"}
    elif indicator == "ema":
        period = params.get("period", 20)
        ema = _exponential_moving_average(arr, period)
        return {"values": ema.tolist(), "label": f"EMA({period})"}
    elif indicator == "rsi":
        period = params.get("period", 14)
        rsi = _rsi(arr, period)
        return {"values": rsi.tolist(), "label": f"RSI({period})"}
    elif indicator == "momentum":
        period = params.get("period", 12)
        returns = np.diff(np.log(arr))
        cum_ret = np.convolve(returns, np.ones(period), mode="valid")
        return {"values": cum_ret.tolist(), "label": f"Momentum({period})"}
    return {"values": [], "label": "unknown"}


def _simple_moving_average(arr: np.ndarray, period: int) -> np.ndarray:
    if len(arr) < period:
        return arr
    cumsum = np.cumsum(arr)
    cumsum[period:] = cumsum[period:] - cumsum[:-period]
    result = np.full_like(arr, np.nan)
    result[period - 1:] = cumsum[period - 1:] / period
    return result


def _exponential_moving_average(arr: np.ndarray, period: int) -> np.ndarray:
    alpha = 2.0 / (period + 1)
    result = np.full_like(arr, np.nan, dtype=float)
    result[0] = arr[0]
    for i in range(1, len(arr)):
        result[i] = alpha * arr[i] + (1 - alpha) * result[i - 1]
    return result


def _rsi(arr: np.ndarray, period: int) -> np.ndarray:
    deltas = np.diff(arr)
    gains = np.where(deltas > 0, deltas, 0.0)
    losses = np.where(deltas < 0, -deltas, 0.0)
    result = np.full(len(arr), np.nan)
    if len(gains) < period:
        return result
    avg_gain = np.mean(gains[:period])
    avg_loss = np.mean(losses[:period])
    for i in range(period, len(deltas)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period
        if avg_loss == 0:
            result[i + 1] = 100.0
        else:
            rs = avg_gain / avg_loss
            result[i + 1] = 100.0 - 100.0 / (1.0 + rs)
    return result
