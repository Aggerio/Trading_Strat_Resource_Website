import json
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Strategy, Lesson, Quiz, QuizQuestion, GlossaryTerm

SEED_DIR = os.path.join(os.path.dirname(__file__), "seed")


def seed_database():
    db = SessionLocal()
    try:
        if db.query(Strategy).count() > 0:
            return
        _seed_lessons(db)
        _seed_strategies(db)
        _seed_glossary(db)
        _seed_quizzes(db)
        db.commit()
    finally:
        db.close()


def _seed_lessons(db: Session):
    lessons_data = [
        # Options lessons
        {"module": "Options", "order": 1, "title": "Options Fundamentals",
         "subtitle": "Calls, puts, moneyness, and payoff notation",
         "difficulty": "beginner",
         "content": _options_lesson_1()},
        {"module": "Options", "order": 2, "title": "Single-Leg + Stock Strategies",
         "subtitle": "Covered calls/puts, protective puts/calls",
         "difficulty": "beginner",
         "content": _options_lesson_2()},
        {"module": "Options", "order": 3, "title": "Vertical Spreads",
         "subtitle": "Bull/bear call and put spreads",
         "difficulty": "beginner",
         "content": _options_lesson_3()},
        {"module": "Options", "order": 4, "title": "Synthetic Positions",
         "subtitle": "Synthetic forwards, combos, and risk reversals",
         "difficulty": "intermediate",
         "content": _options_lesson_4()},
        {"module": "Options", "order": 5, "title": "Multi-Leg Spreads",
         "subtitle": "Ladders, calendar spreads, and diagonal spreads",
         "difficulty": "intermediate",
         "content": _options_lesson_5()},
        {"module": "Options", "order": 6, "title": "Volatility Strategies",
         "subtitle": "Straddles, strangles, guts, strips, and straps",
         "difficulty": "intermediate",
         "content": _options_lesson_6()},
        {"module": "Options", "order": 7, "title": "Ratio Strategies & Butterflies",
         "subtitle": "Ratio spreads, backspreads, and butterfly spreads",
         "difficulty": "advanced",
         "content": _options_lesson_7()},
        {"module": "Options", "order": 8, "title": "Complex Structures",
         "subtitle": "Condors, iron condors, boxes, collars, and seagulls",
         "difficulty": "advanced",
         "content": _options_lesson_8()},
        # Stocks lessons
        {"module": "Stocks", "order": 1, "title": "Momentum Strategies",
         "subtitle": "Price-momentum, earnings-momentum, and residual momentum",
         "difficulty": "beginner",
         "content": _stocks_lesson_1()},
        {"module": "Stocks", "order": 2, "title": "Value & Factor Strategies",
         "subtitle": "Value, low-volatility anomaly, implied volatility, and multifactor portfolios",
         "difficulty": "intermediate",
         "content": _stocks_lesson_2()},
        {"module": "Stocks", "order": 3, "title": "Mean-Reversion Strategies",
         "subtitle": "Pairs trading and cluster-based mean-reversion",
         "difficulty": "intermediate",
         "content": _stocks_lesson_3()},
        {"module": "Stocks", "order": 4, "title": "Technical Strategies",
         "subtitle": "Moving averages, support/resistance, and channels",
         "difficulty": "beginner",
         "content": _stocks_lesson_4()},
        {"module": "Stocks", "order": 5, "title": "Event-Driven & Machine Learning",
         "subtitle": "M&A event trading and KNN classification",
         "difficulty": "advanced",
         "content": _stocks_lesson_5()},
        {"module": "Stocks", "order": 6, "title": "Advanced Quantitative Strategies",
         "subtitle": "Statistical arbitrage, market-making, and alpha combos",
         "difficulty": "advanced",
         "content": _stocks_lesson_6()},
    ]
    for ld in lessons_data:
        lesson = Lesson(**ld)
        db.add(lesson)
    db.flush()


def _seed_strategies(db: Session):
    lesson_map = {}
    for l in db.query(Lesson).all():
        lesson_map[(l.module, l.order)] = l.id

    category_to_lesson_order = {
        "Single-Leg + Stock": 2, "Vertical Spreads": 3,
        "Synthetic Positions": 4, "Multi-Leg Spreads": 5,
        "Volatility Strategies": 6, "Ratio Strategies": 7,
        "Complex Structures": 8,
        "Momentum": 1, "Value & Factors": 2,
        "Mean-Reversion": 3, "Technical": 4,
        "Event & ML": 5, "Advanced": 6,
    }

    for fname in ["options_strategies.json", "stocks_strategies.json"]:
        path = os.path.join(SEED_DIR, fname)
        with open(path) as f:
            strategies = json.load(f)
        for s in strategies:
            module = s["asset_class"]
            cat = s["category"]
            order = category_to_lesson_order.get(cat)
            lid = lesson_map.get((module, order)) if order else None
            strat = Strategy(
                paper_ref=s["paper_ref"],
                name=s["name"],
                asset_class=s["asset_class"],
                category=s["category"],
                strategy_type=s.get("strategy_type"),
                outlook=s.get("outlook"),
                difficulty=s.get("difficulty", "intermediate"),
                short_description=s.get("short_description"),
                full_description=s.get("full_description"),
                formulas=s.get("formulas"),
                max_profit=s.get("max_profit"),
                max_loss=s.get("max_loss"),
                breakeven=s.get("breakeven"),
                legs=s.get("legs"),
                related_strategies=s.get("related_strategies"),
                references=s.get("references"),
                lesson_id=lid,
            )
            db.add(strat)
    db.flush()


def _seed_glossary(db: Session):
    path = os.path.join(SEED_DIR, "glossary.json")
    with open(path) as f:
        terms = json.load(f)
    for t in terms:
        term = GlossaryTerm(
            term=t["term"],
            definition=t["definition"],
            category=t.get("category"),
            related_terms=t.get("related_terms"),
        )
        db.add(term)
    db.flush()


def _seed_quizzes(db: Session):
    lessons = db.query(Lesson).all()
    for lesson in lessons:
        quiz = Quiz(
            lesson_id=lesson.id,
            title=f"{lesson.title} Quiz",
            passing_score=0.7,
        )
        db.add(quiz)
        db.flush()

        questions = _generate_quiz_questions(lesson)
        for i, q in enumerate(questions):
            qq = QuizQuestion(
                quiz_id=quiz.id,
                question_type=q["type"],
                question_text=q["text"],
                options=q.get("options"),
                correct_answer=q["answer"],
                explanation=q.get("explanation", ""),
                order=i + 1,
            )
            db.add(qq)


def _generate_quiz_questions(lesson: Lesson) -> list[dict]:
    module = lesson.module
    order = lesson.order

    if module == "Options":
        return _options_quiz(order)
    elif module == "Stocks":
        return _stocks_quiz(order)
    return []


# --- LESSON CONTENT ---

def _options_lesson_1():
    return """## What Are Options?

An option is a financial derivative — a contract sold by an option writer to an option holder. It gives the holder the **right, but not the obligation**, to buy or sell an underlying asset at an agreed-upon price (the **strike price**) during a certain period or on a specific date (the **exercise/expiration date**).

### Key Concepts

**Call Option**: The right to **buy** the underlying asset at the strike price. If the stock price \\(S_T > K\\), the call is worth \\(S_T - K\\). Otherwise, it expires worthless.

$$f^{call}(S_T, K) = \\max(S_T - K, 0) = (S_T - K)^+$$

**Put Option**: The right to **sell** the underlying asset at the strike price. If \\(S_T < K\\), the put is worth \\(K - S_T\\).

$$f^{put}(S_T, K) = \\max(K - S_T, 0) = (K - S_T)^+$$

### Moneyness

| Term | Call | Put |
|------|------|-----|
| **In-the-money (ITM)** | \\(S > K\\) | \\(S < K\\) |
| **At-the-money (ATM)** | \\(S \\approx K\\) | \\(S \\approx K\\) |
| **Out-of-the-money (OTM)** | \\(S < K\\) | \\(S > K\\) |

### Payoff Notation

Throughout this course, we use the following notation from the paper:
- \\(S_0\\): Stock price at time of entering the trade
- \\(S_T\\): Stock price at maturity
- \\(C\\): Net credit received at \\(t = 0\\)
- \\(D\\): Net debit required at \\(t = 0\\)
- \\(H = D\\) for net debit trades, \\(H = -C\\) for net credit trades
- \\(S^*\\): Break-even stock price(s) at maturity
- \\(P_{max}\\): Maximum profit at maturity
- \\(L_{max}\\): Maximum loss at maturity

### Strategy Classification

Options strategies fall into two main groups:
1. **Directional strategies**: Profit depends on which direction the stock moves (bullish or bearish)
2. **Non-directional (neutral) strategies**: Not based on direction — subdivided into:
   - **Volatility strategies**: Profit from large price movements
   - **Sideways strategies**: Profit when price remains stable"""


def _options_lesson_2():
    return """## Single-Leg + Stock Strategies

These strategies combine an option position with a stock position. They are among the most fundamental options strategies.

### Covered Call (Section 2.2)

Buy stock and write (sell) a call option against it. Your outlook is **neutral to bullish**.

$$f_T = S_T - S_0 - (S_T - K)^+ + C$$

- **Max Profit**: \\(K - S_0 + C\\) — achieved when \\(S_T \\geq K\\)
- **Max Loss**: \\(S_0 - C\\) — if stock goes to zero
- **Break-even**: \\(S^* = S_0 - C\\)

The covered call generates income from the premium while you hold the stock. The trade-off: you cap your upside at the strike price.

### Protective Put (Section 2.4)

Buy stock and buy a put option as insurance. Your outlook is **bullish** with downside protection.

$$f_T = S_T - S_0 + (K - S_T)^+ - D$$

- **Max Profit**: Unlimited (stock can rise indefinitely)
- **Max Loss**: \\(S_0 - K + D\\) — limited by the put
- **Break-even**: \\(S^* = S_0 + D\\)

The protective put is like buying insurance on your stock position. You pay a premium (the put cost) but limit your downside.

### Covered Put (Section 2.3)

Short stock and write a put option. **Neutral to bearish** outlook.

### Protective Call (Section 2.5)

Short stock and buy a call option as hedge. **Bearish** outlook with upside protection."""


def _options_lesson_3():
    return """## Vertical Spreads

Vertical spreads involve buying and selling options of the same type (both calls or both puts) with different strike prices but the same expiration. They are excellent tools for defining your risk/reward precisely.

### Bull Call Spread (Section 2.6)

Buy a near-ATM call at \\(K_1\\), sell an OTM call at \\(K_2\\) (where \\(K_2 > K_1\\)). **Net debit** trade. Bullish outlook.

$$f_T = (S_T - K_1)^+ - (S_T - K_2)^+ - D$$

- **Max Profit**: \\(K_2 - K_1 - D\\) — when \\(S_T \\geq K_2\\)
- **Max Loss**: \\(D\\) — when \\(S_T \\leq K_1\\)
- **Break-even**: \\(S^* = K_1 + D\\)

### Bear Put Spread (Section 2.9)

Buy a near-ATM put at \\(K_1\\), sell an OTM put at \\(K_2\\) (where \\(K_2 < K_1\\)). **Net debit**. Bearish.

$$f_T = (K_1 - S_T)^+ - (K_2 - S_T)^+ - D$$

### Bull Put Spread (Section 2.7)

Credit spread. Sell a higher-strike put, buy a lower-strike put. **Income strategy**.

### Bear Call Spread (Section 2.8)

Credit spread. Sell a lower-strike call, buy a higher-strike call. **Income strategy**.

### Key Insight

Debit spreads (bull call, bear put) are **capital gain** strategies — you pay upfront and hope the spread widens. Credit spreads (bull put, bear call) are **income** strategies — you collect premium and hope the spread stays narrow."""


def _options_lesson_4():
    return """## Synthetic Positions

Synthetic positions replicate the payoff of one instrument using combinations of others. They exploit the fundamental relationship between calls, puts, and the underlying — known as **put-call parity**.

### Long Synthetic Forward (Section 2.10)

Buy an ATM call and sell an ATM put at strike \\(K = S_0\\). This replicates a long forward contract.

$$f_T = S_T - K - H$$

### Short Synthetic Forward (Section 2.11)

Buy an ATM put and sell an ATM call at \\(K = S_0\\). Replicates a short forward.

$$f_T = K - S_T - H$$

### Long Combo / Risk Reversal (Section 2.12)

Buy an OTM call and sell an OTM put. Similar to a synthetic forward but with a gap between strikes, reducing the cost.

### Short Combo / Risk Reversal (Section 2.13)

Buy an OTM put and sell an OTM call. The mirror image of the long combo."""


def _options_lesson_5():
    return """## Multi-Leg Spreads

These strategies add complexity with three or more legs, or use options with different expirations.

### Ladder Strategies (Sections 2.14–2.17)

Ladders are vertical spreads with an additional sold or bought option to adjust the outlook or reduce cost.

**Bull Call Ladder**: Long call \\(K_1\\) + short call \\(K_2\\) + short call \\(K_3\\). A bull call spread financed by selling an extra OTM call.

### Calendar Spreads (Sections 2.18–2.19)

Buy a longer-dated option and sell a shorter-dated option at the **same strike**. Profit from time decay differential.

- **Calendar Call Spread**: Neutral to bullish
- **Calendar Put Spread**: Neutral to bearish

### Diagonal Spreads (Sections 2.20–2.21)

Combine features of vertical and calendar spreads — different strikes AND different expirations.

**Diagonal Call Spread**: Long deep ITM call (long-dated) + short OTM call (short-dated). More protection than a calendar spread because the deep ITM call closely mimics the underlying stock."""


def _options_lesson_6():
    return """## Volatility Strategies

These strategies profit from the **magnitude** of price movement, not the direction. They are non-directional.

### Long Straddle (Section 2.22)

Buy ATM call + buy ATM put at strike \\(K\\).

$$f_T = (S_T - K)^+ + (K - S_T)^+ - D$$

You profit if the stock moves **significantly** in either direction. Max loss is the total premium paid \\(D\\).

### Long Strangle (Section 2.23)

Buy OTM call \\(K_1\\) + buy OTM put \\(K_2\\). Cheaper than a straddle but requires a larger move.

### Short Straddle (Section 2.25) / Short Strangle (Section 2.26)

Sell options instead — profit if the stock stays **stable**. These are income strategies with unlimited risk.

### Strap (Section 2.34)

2 calls + 1 put at the same strike. Neutral with **bullish bias** — makes more money on upside moves.

### Strip (Section 2.35)

1 call + 2 puts at the same strike. Neutral with **bearish bias** — makes more money on downside moves.

### Synthetic Straddles (Sections 2.28–2.31)

Replicate straddle payoffs using stock + options combinations. Example: short stock + 2 long calls = long call synthetic straddle."""


def _options_lesson_7():
    return """## Ratio Strategies & Butterflies

### Ratio Backspreads (Sections 2.36–2.37)

Buy more options than you sell (\\(N_L > N_S\\)).

**Call Ratio Backspread**: Short \\(N_S\\) ATM calls + long \\(N_L\\) OTM calls. Strongly bullish — unlimited upside, limited downside.

**Put Ratio Backspread**: Strongly bearish equivalent.

### Ratio Spreads (Sections 2.38–2.39)

Sell more than you buy (\\(N_L < N_S\\)). Income strategies with unlimited risk on one side.

### Butterfly Spreads (Sections 2.40–2.45)

Butterflies combine 4 options to create a position that profits from low volatility with defined risk.

**Long Call Butterfly**: Long call \\(K_1\\) + 2 short calls \\(K_2\\) + long call \\(K_3\\), with equidistant strikes (\\(K_2 - K_3 = K_1 - K_2 = \\kappa\\)).

$$f_T = (S_T - K_1)^+ + (S_T - K_3)^+ - 2(S_T - K_2)^+ - D$$

**Iron Butterfly**: Uses both puts and calls — a combination of a bull put spread and a bear call spread."""


def _options_lesson_8():
    return """## Complex Structures

### Condor Spreads (Sections 2.46–2.51)

Condors are like butterflies but with 4 different strike prices, creating a wider profit zone.

**Long Call Condor**: Long ITM call \\(K_1\\) + short ITM call \\(K_2\\) + short OTM call \\(K_3\\) + long OTM call \\(K_4\\).

**Iron Condor**: Uses both puts and calls. The **long iron condor** is a popular income strategy that profits when the stock stays within a range.

### Long Box (Section 2.52)

A combination of a bull call spread and a bear put spread that produces a risk-free payoff: \\(f_T = K_1 - K_2 - D\\). Used primarily for tax or arbitrage purposes.

### Collar (Section 2.53)

Buy stock + buy OTM put + sell OTM call. A covered call with downside protection. Moderately bullish with defined risk on both sides.

$$f_T = S_T - S_0 + (K_1 - S_T)^+ - (S_T - K_2)^+ - H$$

### Seagull Spreads (Sections 2.54–2.57)

Three-legged strategies combining a spread with a sold option for financing:
- **Bullish Short Seagull**: Bull call spread financed by selling an OTM put
- **Bearish Long Seagull**: Short combo hedged with a bought OTM call
- And their mirror images"""


def _stocks_lesson_1():
    return """## Momentum Strategies

Momentum strategies exploit the empirical observation that stocks which have performed well tend to continue performing well, and vice versa.

### Price-Momentum (Section 3.1)

The most fundamental momentum strategy. Buy **winners** and sell **losers** based on past returns.

**Key Formulas:**

Monthly return: \\(R_i(t) = \\frac{P_i(t)}{P_i(t+1)} - 1\\)

Cumulative return over formation period: \\(R_i^{cum} = \\frac{P_i(S)}{P_i(S+T)} - 1\\)

Risk-adjusted return: \\(R_i^{risk.adj} = \\frac{R_i^{mean}}{\\sigma_i}\\)

**Typical parameters:**
- Formation period \\(T = 12\\) months
- Skip period \\(S = 1\\) month (skip the most recent month due to mean-reversion)
- Buy top decile, sell bottom decile
- Dollar-neutral: \\(\\sum |w_i| = 1\\), \\(\\sum w_i = 0\\)

### Earnings-Momentum (Section 3.2)

Selection based on Standardized Unexpected Earnings:

$$SUE_i = \\frac{E_i - E'_i}{\\sigma_i}$$

where \\(E_i\\) is the most recent quarterly EPS and \\(E'_i\\) is EPS from 4 quarters ago.

### Residual Momentum (Section 3.7)

Uses residuals from a Fama-French 3-factor regression instead of raw returns:

$$R_i(t) = \\alpha_i + \\beta_{1,i} MKT(t) + \\beta_{2,i} SMB(t) + \\beta_{3,i} HML(t) + \\epsilon_i(t)$$

The residuals \\(\\epsilon_i(t)\\) strip out market, size, and value factor exposures, isolating stock-specific momentum."""


def _stocks_lesson_2():
    return """## Value & Factor Strategies

### Value Strategy (Section 3.3)

Buy stocks with high Book-to-Price (B/P) ratios, sell stocks with low B/P ratios. The B/P ratio measures how "cheap" a stock is relative to its book value.

### Low-Volatility Anomaly (Section 3.4)

Counter-intuitively, **low-volatility stocks tend to outperform** high-volatility stocks on a risk-adjusted basis. Buy the bottom decile by historical volatility \\(\\sigma_i\\), sell the top decile.

### Implied Volatility (Section 3.5)

Stocks with larger increases in **call implied volatility** tend to have higher future returns. Stocks with larger increases in **put implied volatility** tend to have lower future returns.

### Multifactor Portfolio (Section 3.6)

Combine multiple factors (momentum, value, low-vol, etc.) with weights \\(w_A\\):

$$\\sum_{A=1}^{F} w_A = 1$$

Methods for combining:
1. **Simple allocation**: Split investment across factor portfolios
2. **Rank blending**: Average the demeaned ranks across factors

$$s_i = \\frac{1}{F} \\sum_{A=1}^{F} s_{Ai}$$

where \\(s_{Ai} = rank(f_{Ai}) - \\frac{1}{N}\\sum_j rank(f_{Aj})\\)"""


def _stocks_lesson_3():
    return """## Mean-Reversion Strategies

Mean-reversion exploits the tendency of prices to revert to some equilibrium or average level.

### Pairs Trading (Section 3.8)

Find two historically correlated stocks A and B. When their relationship deviates, trade the spread:

$$S_t = \\ln(P_A(t)) - \\ln(P_B(t))$$

When the spread widens beyond a threshold (measured in z-scores), short the "rich" stock and buy the "cheap" stock. Close when the spread reverts.

### Mean-Reversion — Single Cluster (Section 3.9)

Within a group of correlated stocks, compute the equally-weighted market index return:

$$R_m = \\frac{1}{N}\\sum_{i=1}^{N} R_i$$

Set weights: \\(w_i = -\\gamma(R_i - R_m)\\)

This is automatically dollar-neutral. You buy losers and sell winners relative to the group average.

### Mean-Reversion — Multiple Clusters (Section 3.9.1)

Extend to K clusters (industries, sectors). Within each cluster, apply the single-cluster approach. Combining across clusters provides diversification.

### Weighted Regression (Section 3.10)

Use weighted regression to estimate the equilibrium relationship between related stocks, providing more sophisticated entry/exit signals."""


def _stocks_lesson_4():
    return """## Technical Strategies

Technical strategies use price and volume patterns to generate trading signals.

### Single Moving Average (Section 3.11)

Buy when price crosses above the moving average, sell when below:

$$MA_i(T) = \\frac{1}{T}\\sum_{t=1}^{T} P_i(t)$$

### Two Moving Averages (Section 3.12)

Use a short-period and long-period MA:
- **Golden Cross**: Short MA crosses above long MA → **Buy**
- **Death Cross**: Short MA crosses below long MA → **Sell**

### Three Moving Averages (Section 3.13)

Add a medium-period MA for confirmation. Buy when short > medium > long.

### Support and Resistance (Section 3.14)

Identify horizontal price levels where the stock has historically bounced (support) or been rejected (resistance). Buy near support, sell near resistance.

### Channel Strategy (Section 3.15)

Define a price channel with upper and lower bounds. Trade within the channel (buy at lower bound, sell at upper bound) or trade breakouts."""


def _stocks_lesson_5():
    return """## Event-Driven & Machine Learning

### Event-Driven — M&A (Section 3.16)

Trade around merger and acquisition announcements. In stock-for-stock deals: buy the target company, short the acquirer. Profit from the spread narrowing as the deal closes.

### Machine Learning — KNN (Section 3.17)

Use k-nearest neighbor (KNN) classification for single-stock trading signals:

1. Construct feature vectors from technical indicators
2. For each new data point, find the k closest historical points
3. Classify based on majority vote of neighbors
4. Generate buy/sell signals based on the classification

Features can include moving averages, RSI, volume indicators, and volatility measures."""


def _stocks_lesson_6():
    return """## Advanced Quantitative Strategies

### Statistical Arbitrage — Optimization (Section 3.18)

Use mean-variance optimization to determine portfolio weights:

$$w = \\gamma \\cdot C^{-1} \\cdot E$$

where \\(C\\) is the covariance matrix and \\(E\\) is the vector of expected returns. Subject to constraints like dollar-neutrality (\\(\\sum w_i = 0\\)) and position bounds.

### Market-Making (Section 3.19)

Provide liquidity by continuously posting bid and ask quotes. Profit from the bid-ask spread. Requires sophisticated inventory management and risk controls.

### Alpha Combos (Section 3.20)

Combine multiple trading signals (alphas) with weights:
- Simple averaging of alpha signals
- Optimization-based weight selection using historical performance
- Tens of thousands of signals combined to amplify weak individual signals into a tradable composite signal"""


# --- QUIZ QUESTIONS ---

def _options_quiz(order: int) -> list[dict]:
    quizzes = {
        1: [
            {"type": "multiple_choice", "text": "What does a call option give the holder the right to do?",
             "options": ["Buy the underlying at the strike price", "Sell the underlying at the strike price", "Borrow money at a fixed rate", "Short sell the underlying"],
             "answer": "Buy the underlying at the strike price",
             "explanation": "A call option gives the holder the right, but not the obligation, to buy the underlying asset at the strike price."},
            {"type": "multiple_choice", "text": "A put option is 'in-the-money' when:",
             "options": ["S > K", "S < K", "S = K", "S > 2K"],
             "answer": "S < K",
             "explanation": "A put is ITM when the stock price is below the strike price, because exercising would be profitable."},
            {"type": "multiple_choice", "text": "What is the payoff of a call option at expiration?",
             "options": ["max(S_T - K, 0)", "max(K - S_T, 0)", "S_T - K", "K - S_T"],
             "answer": "max(S_T - K, 0)",
             "explanation": "The call payoff is (S_T - K)+ = max(S_T - K, 0). It's zero if the stock is below the strike."},
            {"type": "multiple_choice", "text": "Which strategy is NOT a directional strategy?",
             "options": ["Bull call spread", "Long straddle", "Protective put", "Covered call"],
             "answer": "Long straddle",
             "explanation": "A long straddle is a non-directional (neutral) volatility strategy that profits from large moves in either direction."},
            {"type": "multiple_choice", "text": "What does 'ATM' stand for in options trading?",
             "options": ["At-the-money", "After-the-market", "Automatic trade mechanism", "Average trading margin"],
             "answer": "At-the-money",
             "explanation": "ATM means at-the-money — the strike price is approximately equal to the current stock price."},
        ],
        2: [
            {"type": "multiple_choice", "text": "A covered call strategy involves:",
             "options": ["Buying stock and writing a call", "Buying stock and buying a call", "Shorting stock and writing a put", "Buying a call and a put"],
             "answer": "Buying stock and writing a call",
             "explanation": "A covered call (buy-write) = long stock + short call. The stock 'covers' the obligation of the sold call."},
            {"type": "multiple_choice", "text": "What is the maximum profit of a covered call?",
             "options": ["K - S₀ + C", "Unlimited", "C", "S₀ - C"],
             "answer": "K - S₀ + C",
             "explanation": "Max profit = strike minus purchase price plus premium received, achieved when S_T >= K."},
            {"type": "multiple_choice", "text": "A protective put is best described as:",
             "options": ["Insurance on a long stock position", "A way to generate income", "A bearish strategy", "An arbitrage strategy"],
             "answer": "Insurance on a long stock position",
             "explanation": "The protective put hedges downside risk of a long stock position, like an insurance policy."},
            {"type": "multiple_choice", "text": "The break-even of a protective put is:",
             "options": ["S₀ + D", "S₀ - D", "K + D", "K - D"],
             "answer": "S₀ + D",
             "explanation": "You need the stock to rise above your purchase price plus the put premium to break even."},
            {"type": "multiple_choice", "text": "A covered put has the same payoff as:",
             "options": ["Writing a naked call", "Writing a naked put", "A long straddle", "A bull call spread"],
             "answer": "Writing a naked call",
             "explanation": "Covered put (short stock + short put) has the same payoff profile as a naked short call."},
        ],
        3: [
            {"type": "multiple_choice", "text": "A bull call spread is a:",
             "options": ["Net debit trade", "Net credit trade", "Zero-cost trade", "Cash-secured trade"],
             "answer": "Net debit trade",
             "explanation": "You buy a cheaper (lower strike) call and sell a more expensive (higher strike) call, paying a net debit."},
            {"type": "multiple_choice", "text": "What is the maximum loss of a bull call spread?",
             "options": ["D (the net debit paid)", "K₂ - K₁", "Unlimited", "K₁ + D"],
             "answer": "D (the net debit paid)",
             "explanation": "If the stock stays below K₁, both calls expire worthless and you lose only the net debit."},
            {"type": "multiple_choice", "text": "A bear put spread profits when:",
             "options": ["The stock price falls", "The stock price rises", "Volatility increases", "The stock stays flat"],
             "answer": "The stock price falls",
             "explanation": "A bear put spread is a bearish strategy that profits from declining stock prices."},
            {"type": "multiple_choice", "text": "Credit spreads (bull put, bear call) are classified as:",
             "options": ["Income strategies", "Capital gain strategies", "Hedging strategies", "Arbitrage strategies"],
             "answer": "Income strategies",
             "explanation": "Credit spreads collect premium upfront (income) and profit if the spread stays out of the money."},
            {"type": "multiple_choice", "text": "The break-even of a bull call spread is:",
             "options": ["K₁ + D", "K₂ - D", "K₁ - D", "(K₁ + K₂) / 2"],
             "answer": "K₁ + D",
             "explanation": "Break-even = lower strike plus the net debit paid."},
        ],
        4: [
            {"type": "multiple_choice", "text": "A long synthetic forward replicates:",
             "options": ["A long stock/futures position", "A short stock position", "A straddle", "A covered call"],
             "answer": "A long stock/futures position",
             "explanation": "Long call + short put at the same ATM strike replicates a long forward contract."},
            {"type": "multiple_choice", "text": "A 'risk reversal' is another name for:",
             "options": ["A combo (long or short)", "A straddle", "A butterfly", "A calendar spread"],
             "answer": "A combo (long or short)",
             "explanation": "A long combo is also called a long risk reversal (buy OTM call, sell OTM put)."},
            {"type": "multiple_choice", "text": "Put-call parity relates:",
             "options": ["Calls, puts, stock, and the risk-free rate", "Only calls and puts", "Stocks and bonds", "Futures and options"],
             "answer": "Calls, puts, stock, and the risk-free rate",
             "explanation": "Put-call parity: C - P = S - K*e^(-rT), linking calls, puts, the underlying, and the risk-free rate."},
            {"type": "multiple_choice", "text": "The payoff of a short synthetic forward is:",
             "options": ["K - S_T - H", "S_T - K - H", "(S_T - K)+", "max(K - S_T, 0)"],
             "answer": "K - S_T - H",
             "explanation": "Short synthetic forward: long put + short call = K - S_T - H, mimicking a short forward."},
        ],
        5: [
            {"type": "multiple_choice", "text": "A calendar call spread profits most when at expiration of the short leg:",
             "options": ["S_T = K (at the strike)", "S_T is far above K", "S_T is far below K", "Volatility is very high"],
             "answer": "S_T = K (at the strike)",
             "explanation": "The ideal scenario is S_T = K, where the short call expires worthless while the long call retains maximum time value."},
            {"type": "multiple_choice", "text": "What makes a diagonal spread different from a calendar spread?",
             "options": ["Different strikes AND different expirations", "Same strikes, same expirations", "Only different expirations", "Only different strikes"],
             "answer": "Different strikes AND different expirations",
             "explanation": "Diagonal spreads combine features of vertical (different strikes) and calendar (different expirations) spreads."},
            {"type": "multiple_choice", "text": "A bull call ladder is best described as:",
             "options": ["A bull call spread with an extra sold OTM call", "Three bought calls", "A straddle plus a call", "Two calendar spreads"],
             "answer": "A bull call spread with an extra sold OTM call",
             "explanation": "The third sold call finances the bull call spread, adjusting the outlook to conservatively bullish."},
        ],
        6: [
            {"type": "multiple_choice", "text": "A long straddle profits when:",
             "options": ["The stock moves significantly in either direction", "The stock stays flat", "Only when the stock rises", "Only when the stock falls"],
             "answer": "The stock moves significantly in either direction",
             "explanation": "A straddle is a volatility strategy that profits from large price moves regardless of direction."},
            {"type": "multiple_choice", "text": "What is the maximum loss of a long straddle?",
             "options": ["D (total premium paid)", "Unlimited", "K", "S₀"],
             "answer": "D (total premium paid)",
             "explanation": "Max loss = total debit paid for both options, occurring when S_T = K exactly."},
            {"type": "multiple_choice", "text": "A strap has a bias toward:",
             "options": ["Bullish moves (2 calls, 1 put)", "Bearish moves (1 call, 2 puts)", "No bias", "Sideways movement"],
             "answer": "Bullish moves (2 calls, 1 put)",
             "explanation": "A strap uses 2 calls and 1 put, so it profits more from upward moves than downward moves."},
            {"type": "multiple_choice", "text": "A short strangle is less risky than a short straddle because:",
             "options": ["Both options are OTM, creating a wider profit zone", "It uses fewer options", "It has no risk", "It requires more premium"],
             "answer": "Both options are OTM, creating a wider profit zone",
             "explanation": "With OTM options, the stock can move more before hitting a strike, providing a wider break-even range."},
        ],
        7: [
            {"type": "multiple_choice", "text": "In a call ratio backspread, you buy:",
             "options": ["More calls than you sell (N_L > N_S)", "Fewer calls than you sell (N_L < N_S)", "Equal numbers", "Only puts"],
             "answer": "More calls than you sell (N_L > N_S)",
             "explanation": "Backspreads buy more than they sell, giving unlimited profit potential in one direction."},
            {"type": "multiple_choice", "text": "A long call butterfly has equidistant strikes where:",
             "options": ["K₂ - K₃ = K₁ - K₂ = κ", "All strikes are equal", "K₁ = 2K₂", "Strikes are random"],
             "answer": "K₂ - K₃ = K₁ - K₂ = κ",
             "explanation": "Butterfly strikes are equidistant with the middle strike centered between the wings."},
            {"type": "multiple_choice", "text": "An iron butterfly is a combination of:",
             "options": ["A bull put spread and a bear call spread", "Two straddles", "A box spread", "A collar and a strangle"],
             "answer": "A bull put spread and a bear call spread",
             "explanation": "An iron butterfly combines a bull put spread and a bear call spread sharing the middle strike."},
            {"type": "multiple_choice", "text": "The maximum profit of a long call butterfly is:",
             "options": ["κ - D", "Unlimited", "D", "2κ"],
             "answer": "κ - D",
             "explanation": "Max profit = strike distance minus net debit, achieved when S_T = K₂ (the middle strike)."},
        ],
        8: [
            {"type": "multiple_choice", "text": "How does a condor differ from a butterfly?",
             "options": ["4 different strikes creating a wider profit zone", "Only 2 strikes", "Uses only puts", "Has unlimited profit"],
             "answer": "4 different strikes creating a wider profit zone",
             "explanation": "A condor uses 4 equidistant strikes instead of 3, creating a wider but lower-profit zone."},
            {"type": "multiple_choice", "text": "A collar strategy combines:",
             "options": ["Long stock + long OTM put + short OTM call", "Short stock + long call + short put", "Two calls and two puts", "Only stock and a call"],
             "answer": "Long stock + long OTM put + short OTM call",
             "explanation": "A collar is a covered call with a protective put added for downside protection."},
            {"type": "multiple_choice", "text": "A long box spread produces:",
             "options": ["A risk-free payoff of K₁ - K₂", "Unlimited profit", "A delta-neutral position", "Maximum income"],
             "answer": "A risk-free payoff of K₁ - K₂",
             "explanation": "A box spread locks in the difference between strikes regardless of where the stock ends up."},
            {"type": "multiple_choice", "text": "Seagull spreads typically aim to be:",
             "options": ["Zero-cost (self-financing)", "Maximum premium income", "Risk-free", "Delta-neutral"],
             "answer": "Zero-cost (self-financing)",
             "explanation": "Seagull spreads are ideally structured to have zero cost by using one sold option to finance the spread."},
        ],
    }
    return quizzes.get(order, [])


def _stocks_quiz(order: int) -> list[dict]:
    quizzes = {
        1: [
            {"type": "multiple_choice", "text": "In the price-momentum strategy, why is the most recent month typically skipped?",
             "options": ["Due to empirically observed short-term mean-reversion", "Data is not available", "To reduce transaction costs", "For tax purposes"],
             "answer": "Due to empirically observed short-term mean-reversion",
             "explanation": "The most recent month shows mean-reversion (contrarian) effects, possibly due to liquidity/microstructure issues."},
            {"type": "multiple_choice", "text": "What is the typical formation period for price-momentum?",
             "options": ["12 months", "1 month", "5 years", "1 week"],
             "answer": "12 months",
             "explanation": "The standard formation period is T = 12 months, looking back at cumulative returns."},
            {"type": "multiple_choice", "text": "SUE in earnings-momentum stands for:",
             "options": ["Standardized Unexpected Earnings", "Standard Unit of Earnings", "Stock Underlying Equity", "Systematic Unexpected Error"],
             "answer": "Standardized Unexpected Earnings",
             "explanation": "SUE = (E_i - E'_i) / σ_i, measuring how surprising the earnings are relative to history."},
            {"type": "multiple_choice", "text": "Residual momentum uses residuals from which regression?",
             "options": ["Fama-French 3-factor model", "Simple linear regression on price", "CAPM only", "No regression is used"],
             "answer": "Fama-French 3-factor model",
             "explanation": "Residual momentum regresses returns on MKT, SMB, and HML factors, then uses the residuals."},
        ],
        2: [
            {"type": "multiple_choice", "text": "The value strategy selects stocks based on:",
             "options": ["Book-to-Price (B/P) ratio", "Price-to-Earnings ratio only", "Market capitalization", "Trading volume"],
             "answer": "Book-to-Price (B/P) ratio",
             "explanation": "Value is defined using the B/P ratio — high B/P stocks are considered 'cheap' or 'value' stocks."},
            {"type": "multiple_choice", "text": "The low-volatility anomaly states that:",
             "options": ["Low-vol stocks outperform high-vol stocks risk-adjusted", "High-vol stocks always outperform", "Volatility doesn't affect returns", "Only tech stocks are volatile"],
             "answer": "Low-vol stocks outperform high-vol stocks risk-adjusted",
             "explanation": "This contradicts naive risk-return theory — lower risk stocks actually deliver better risk-adjusted returns."},
            {"type": "multiple_choice", "text": "In multifactor portfolios, demeaned ranks are computed as:",
             "options": ["rank(f_Ai) - (1/N) × Σ rank(f_Aj)", "f_Ai / max(f_Ai)", "log(f_Ai)", "f_Ai - mean(f_Ai)"],
             "answer": "rank(f_Ai) - (1/N) × Σ rank(f_Aj)",
             "explanation": "Demeaned ranks center the rankings around zero for proper combination across factors."},
        ],
        3: [
            {"type": "multiple_choice", "text": "In pairs trading, you trade the spread when:",
             "options": ["The z-score exceeds a threshold", "The stock price hits a round number", "Volume spikes", "Earnings are announced"],
             "answer": "The z-score exceeds a threshold",
             "explanation": "The spread's z-score measures deviation from historical norms — trading occurs when it's extreme."},
            {"type": "multiple_choice", "text": "Single-cluster mean-reversion weights are set as:",
             "options": ["w_i = -γ(R_i - R_m)", "w_i = R_i", "w_i = 1/N", "w_i = σ_i"],
             "answer": "w_i = -γ(R_i - R_m)",
             "explanation": "The negative sign means you buy losers (negative R_i - R_m) and sell winners. It's automatically dollar-neutral."},
            {"type": "multiple_choice", "text": "Pairs trading is an example of:",
             "options": ["A mean-reversion strategy", "A momentum strategy", "A buy-and-hold strategy", "A market-making strategy"],
             "answer": "A mean-reversion strategy",
             "explanation": "Pairs trading bets that the spread between two correlated stocks will revert to its historical mean."},
        ],
        4: [
            {"type": "multiple_choice", "text": "A 'golden cross' occurs when:",
             "options": ["Short MA crosses above long MA", "Price drops below the MA", "Volume exceeds average", "RSI goes above 70"],
             "answer": "Short MA crosses above long MA",
             "explanation": "A golden cross is a bullish signal when a shorter-period MA crosses above a longer-period MA."},
            {"type": "multiple_choice", "text": "Support levels are price levels where:",
             "options": ["The stock has historically bounced upward", "The stock always breaks down", "Volume is zero", "Earnings are reported"],
             "answer": "The stock has historically bounced upward",
             "explanation": "Support is a price level where buying pressure has historically prevented further decline."},
            {"type": "multiple_choice", "text": "A simple moving average MA(T) is computed as:",
             "options": ["(1/T) × Σ P_i(t) over T periods", "The median price over T periods", "The highest price over T periods", "The last price only"],
             "answer": "(1/T) × Σ P_i(t) over T periods",
             "explanation": "SMA is the arithmetic mean of prices over the lookback period T."},
        ],
        5: [
            {"type": "multiple_choice", "text": "In event-driven M&A trading for stock deals, you typically:",
             "options": ["Buy the target, short the acquirer", "Buy both companies", "Short both companies", "Buy the acquirer only"],
             "answer": "Buy the target, short the acquirer",
             "explanation": "The target's price usually trades at a discount to the deal price, while the acquirer may decline."},
            {"type": "multiple_choice", "text": "KNN stands for:",
             "options": ["k-nearest neighbors", "Key neural network", "Kernel normal notation", "Kalman noise neutralizer"],
             "answer": "k-nearest neighbors",
             "explanation": "KNN is a machine learning algorithm that classifies based on the majority class of the k closest data points."},
        ],
        6: [
            {"type": "multiple_choice", "text": "In statistical arbitrage optimization, weights are determined by:",
             "options": ["w = γ × C⁻¹ × E (inverse covariance times expected returns)", "Equal weighting", "Market cap weighting", "Random selection"],
             "answer": "w = γ × C⁻¹ × E (inverse covariance times expected returns)",
             "explanation": "Mean-variance optimization uses the inverse covariance matrix to account for correlations between stocks."},
            {"type": "multiple_choice", "text": "Market-makers profit primarily from:",
             "options": ["The bid-ask spread", "Long-term stock appreciation", "Dividend income", "Short selling"],
             "answer": "The bid-ask spread",
             "explanation": "Market-makers provide liquidity by posting both bid and ask quotes, earning the spread between them."},
            {"type": "multiple_choice", "text": "Alpha combos involve:",
             "options": ["Combining many weak trading signals into a stronger composite", "Trading only one stock", "Using a single indicator", "Investing in index funds"],
             "answer": "Combining many weak trading signals into a stronger composite",
             "explanation": "Individual signals may be too weak to trade profitably, but combining thousands can produce a strong, diversified signal."},
        ],
    }
    return quizzes.get(order, [])
