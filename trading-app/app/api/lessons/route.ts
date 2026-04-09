import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

function getLessonsData() {
  const lessons = [
    { module: 'Options', order: 1, title: 'Options Fundamentals', subtitle: 'Calls, puts, moneyness, and payoff notation', difficulty: 'beginner', content: _optionsLesson1() },
    { module: 'Options', order: 2, title: 'Single-Leg + Stock Strategies', subtitle: 'Covered calls/puts, protective puts/calls', difficulty: 'beginner', content: _optionsLesson2() },
    { module: 'Options', order: 3, title: 'Vertical Spreads', subtitle: 'Bull/bear call and put spreads', difficulty: 'beginner', content: _optionsLesson3() },
    { module: 'Options', order: 4, title: 'Synthetic Positions', subtitle: 'Synthetic forwards, combos, and risk reversals', difficulty: 'intermediate', content: _optionsLesson4() },
    { module: 'Options', order: 5, title: 'Multi-Leg Spreads', subtitle: 'Ladders, calendar spreads, and diagonal spreads', difficulty: 'intermediate', content: _optionsLesson5() },
    { module: 'Options', order: 6, title: 'Volatility Strategies', subtitle: 'Straddles, strangles, guts, strips, and straps', difficulty: 'intermediate', content: _optionsLesson6() },
    { module: 'Options', order: 7, title: 'Ratio Strategies & Butterflies', subtitle: 'Ratio spreads, backspreads, and butterfly spreads', difficulty: 'advanced', content: _optionsLesson7() },
    { module: 'Options', order: 8, title: 'Complex Structures', subtitle: 'Condors, iron condors, boxes, collars, and seagulls', difficulty: 'advanced', content: _optionsLesson8() },
    { module: 'Stocks', order: 1, title: 'Momentum Strategies', subtitle: 'Price-momentum, earnings-momentum, and residual momentum', difficulty: 'beginner', content: _stocksLesson1() },
    { module: 'Stocks', order: 2, title: 'Value & Factor Strategies', subtitle: 'Value, low-volatility anomaly, implied volatility, and multifactor portfolios', difficulty: 'intermediate', content: _stocksLesson2() },
    { module: 'Stocks', order: 3, title: 'Mean-Reversion Strategies', subtitle: 'Pairs trading and cluster-based mean-reversion', difficulty: 'intermediate', content: _stocksLesson3() },
    { module: 'Stocks', order: 4, title: 'Technical Strategies', subtitle: 'Moving averages, support/resistance, and channels', difficulty: 'beginner', content: _stocksLesson4() },
    { module: 'Stocks', order: 5, title: 'Event-Driven & Machine Learning', subtitle: 'M&A event trading and KNN classification', difficulty: 'advanced', content: _stocksLesson5() },
    { module: 'Stocks', order: 6, title: 'Advanced Quantitative Strategies', subtitle: 'Statistical arbitrage, market-making, and alpha combos', difficulty: 'advanced', content: _stocksLesson6() },
  ];
  
  return lessons.map((l, i) => ({
    id: i + 1,
    ...l,
    lesson_id: i + 1,
  }));
}

function _optionsLesson1() { return `## What Are Options?

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
   - **Sideways strategies**: Profit when price remains stable`; }

function _optionsLesson2() { return `## Single-Leg + Stock Strategies

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

Short stock and buy a call option as hedge. **Bearish** outlook with upside protection.`; }

function _optionsLesson3() { return `## Vertical Spreads

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

Debit spreads (bull call, bear put) are **capital gain** strategies — you pay upfront and hope the spread widens. Credit spreads (bull put, bear call) are **income** strategies — you collect premium and hope the spread stays narrow.`; }

function _optionsLesson4() { return `## Synthetic Positions

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

Buy an OTM put and sell an OTM call. The mirror image of the long combo.`; }

function _optionsLesson5() { return `## Multi-Leg Spreads

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

**Diagonal Call Spread**: Long deep ITM call (long-dated) + short OTM call (short-dated). More protection than a calendar spread because the deep ITM call closely mimics the underlying stock.`; }

function _optionsLesson6() { return `## Volatility Strategies

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

Replicate straddle payoffs using stock + options combinations. Example: short stock + 2 long calls = long call synthetic straddle.`; }

function _optionsLesson7() { return `## Ratio Strategies & Butterflies

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

**Iron Butterfly**: Uses both puts and calls — a combination of a bull put spread and a bear call spread.`; }

function _optionsLesson8() { return `## Complex Structures

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
- And their mirror images`; }

function _stocksLesson1() { return `## Momentum Strategies

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

The residuals \\(\\epsilon_i(t)\\) strip out market, size, and value factor exposures, isolating stock-specific momentum.`; }

function _stocksLesson2() { return `## Value & Factor Strategies

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

where \\(s_{Ai} = rank(f_{Ai}) - \\frac{1}{N}\\sum_j rank(f_{Aj})\\)`; }

function _stocksLesson3() { return `## Mean-Reversion Strategies

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

Use weighted regression to estimate the equilibrium relationship between related stocks, providing more sophisticated entry/exit signals.`; }

function _stocksLesson4() { return `## Technical Strategies

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

Define a price channel with upper and lower bounds. Trade within the channel (buy at lower bound, sell at upper bound) or trade breakouts.`; }

function _stocksLesson5() { return `## Event-Driven & Machine Learning

### Event-Driven — M&A (Section 3.16)

Trade around merger and acquisition announcements. In stock-for-stock deals: buy the target company, short the acquirer. Profit from the spread narrowing as the deal closes.

### Machine Learning — KNN (Section 3.17)

Use k-nearest neighbor (KNN) classification for single-stock trading signals:

1. Construct feature vectors from technical indicators
2. For each new data point, find the k closest historical points
3. Classify based on majority vote of neighbors
4. Generate buy/sell signals based on the classification

Features can include moving averages, RSI, volume indicators, and volatility measures.`; }

function _stocksLesson6() { return `## Advanced Quantitative Strategies

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
- Tens of thousands of signals combined to amplify weak individual signals into a tradable composite signal`; }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const module = searchParams.get('module');
  const id = searchParams.get('id');
  
  let lessons = getLessonsData();
  
  if (module) {
    lessons = lessons.filter((l: any) => l.module === module);
  }
  
  if (id) {
    lessons = lessons.filter((l: any) => l.id === parseInt(id));
  }
  
  return NextResponse.json(lessons);
}