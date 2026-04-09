import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

function getQuizzesData() {
  const quizzes = [
    { id: 1, lesson_id: 1, module: 'Options', title: 'Options Fundamentals Quiz', passing_score: 0.7, questions: _optionsQuiz1() },
    { id: 2, lesson_id: 2, module: 'Options', title: 'Single-Leg + Stock Strategies Quiz', passing_score: 0.7, questions: _optionsQuiz2() },
    { id: 3, lesson_id: 3, module: 'Options', title: 'Vertical Spreads Quiz', passing_score: 0.7, questions: _optionsQuiz3() },
    { id: 4, lesson_id: 4, module: 'Options', title: 'Synthetic Positions Quiz', passing_score: 0.7, questions: _optionsQuiz4() },
    { id: 5, lesson_id: 5, module: 'Options', title: 'Multi-Leg Spreads Quiz', passing_score: 0.7, questions: _optionsQuiz5() },
    { id: 6, lesson_id: 6, module: 'Options', title: 'Volatility Strategies Quiz', passing_score: 0.7, questions: _optionsQuiz6() },
    { id: 7, lesson_id: 7, module: 'Options', title: 'Ratio Strategies & Butterflies Quiz', passing_score: 0.7, questions: _optionsQuiz7() },
    { id: 8, lesson_id: 8, module: 'Options', title: 'Complex Structures Quiz', passing_score: 0.7, questions: _optionsQuiz8() },
    { id: 9, lesson_id: 9, module: 'Stocks', title: 'Momentum Strategies Quiz', passing_score: 0.7, questions: _stocksQuiz1() },
    { id: 10, lesson_id: 10, module: 'Stocks', title: 'Value & Factor Strategies Quiz', passing_score: 0.7, questions: _stocksQuiz2() },
    { id: 11, lesson_id: 11, module: 'Stocks', title: 'Mean-Reversion Strategies Quiz', passing_score: 0.7, questions: _stocksQuiz3() },
    { id: 12, lesson_id: 12, module: 'Stocks', title: 'Technical Strategies Quiz', passing_score: 0.7, questions: _stocksQuiz4() },
    { id: 13, lesson_id: 13, module: 'Stocks', title: 'Event-Driven & ML Quiz', passing_score: 0.7, questions: _stocksQuiz5() },
    { id: 14, lesson_id: 14, module: 'Stocks', title: 'Advanced Quantitative Strategies Quiz', passing_score: 0.7, questions: _stocksQuiz6() },
  ];
  return quizzes;
}

function _optionsQuiz1() { return [
  { id: 1, question_text: "What does a call option give the holder the right to do?", options: ["Buy the underlying at the strike price", "Sell the underlying at the strike price", "Borrow money at a fixed rate", "Short sell the underlying"], correct_answer: "Buy the underlying at the strike price", explanation: "A call option gives the holder the right, but not the obligation, to buy the underlying asset at the strike price." },
  { id: 2, question_text: "A put option is 'in-the-money' when:", options: ["S > K", "S < K", "S = K", "S > 2K"], correct_answer: "S < K", explanation: "A put is ITM when the stock price is below the strike price, because exercising would be profitable." },
  { id: 3, question_text: "What is the payoff of a call option at expiration?", options: ["max(S_T - K, 0)", "max(K - S_T, 0)", "S_T - K", "K - S_T"], correct_answer: "max(S_T - K, 0)", explanation: "The call payoff is (S_T - K)+ = max(S_T - K, 0). It's zero if the stock is below the strike." },
  { id: 4, question_text: "Which strategy is NOT a directional strategy?", options: ["Bull call spread", "Long straddle", "Protective put", "Covered call"], correct_answer: "Long straddle", explanation: "A long straddle is a non-directional (neutral) volatility strategy that profits from large moves in either direction." },
  { id: 5, question_text: "What does 'ATM' stand for in options trading?", options: ["At-the-money", "After-the-market", "Automatic trade mechanism", "Average trading margin"], correct_answer: "At-the-money", explanation: "ATM means at-the-money — the strike price is approximately equal to the current stock price." },
]; }

function _optionsQuiz2() { return [
  { id: 1, question_text: "A covered call strategy involves:", options: ["Buying stock and writing a call", "Buying stock and buying a call", "Shorting stock and writing a put", "Buying a call and a put"], correct_answer: "Buying stock and writing a call", explanation: "A covered call (buy-write) = long stock + short call." },
  { id: 2, question_text: "What is the maximum profit of a covered call?", options: ["K - S0 + C", "Unlimited", "C", "S0 - C"], correct_answer: "K - S0 + C", explanation: "Max profit = strike minus purchase price plus premium received, achieved when S_T >= K." },
  { id: 3, question_text: "A protective put is best described as:", options: ["Insurance on a long stock position", "A way to generate income", "A bearish strategy", "An arbitrage strategy"], correct_answer: "Insurance on a long stock position", explanation: "The protective put hedges downside risk of a long stock position." },
  { id: 4, question_text: "The break-even of a protective put is:", options: ["S0 + D", "S0 - D", "K + D", "K - D"], correct_answer: "S0 + D", explanation: "You need the stock to rise above your purchase price plus the put premium to break even." },
  { id: 5, question_text: "A covered put has the same payoff as:", options: ["Writing a naked call", "Writing a naked put", "A long straddle", "A bull call spread"], correct_answer: "Writing a naked call", explanation: "Covered put (short stock + short put) has the same payoff profile as a naked short call." },
]; }

function _optionsQuiz3() { return [
  { id: 1, question_text: "A bull call spread is a:", options: ["Net debit trade", "Net credit trade", "Zero-cost trade", "Cash-secured trade"], correct_answer: "Net debit trade", explanation: "You buy a cheaper call and sell a more expensive call, paying a net debit." },
  { id: 2, question_text: "What is the maximum loss of a bull call spread?", options: ["D (the net debit paid)", "K2 - K1", "Unlimited", "K1 + D"], correct_answer: "D (the net debit paid)", explanation: "If the stock stays below K1, both calls expire worthless and you lose only the net debit." },
  { id: 3, question_text: "A bear put spread profits when:", options: ["The stock price falls", "The stock price rises", "Volatility increases", "The stock stays flat"], correct_answer: "The stock price falls", explanation: "A bear put spread is a bearish strategy that profits from declining stock prices." },
  { id: 4, question_text: "Credit spreads (bull put, bear call) are classified as:", options: ["Income strategies", "Capital gain strategies", "Hedging strategies", "Arbitrage strategies"], correct_answer: "Income strategies", explanation: "Credit spreads collect premium upfront (income) and profit if the spread stays out of the money." },
  { id: 5, question_text: "The break-even of a bull call spread is:", options: ["K1 + D", "K2 - D", "K1 - D", "(K1 + K2) / 2"], correct_answer: "K1 + D", explanation: "Break-even = lower strike plus the net debit paid." },
]; }

function _optionsQuiz4() { return [
  { id: 1, question_text: "A long synthetic forward replicates:", options: ["A long stock/futures position", "A short stock position", "A straddle", "A covered call"], correct_answer: "A long stock/futures position", explanation: "Long call + short put at the same ATM strike replicates a long forward contract." },
  { id: 2, question_text: "A 'risk reversal' is another name for:", options: ["A combo (long or short)", "A straddle", "A butterfly", "A calendar spread"], correct_answer: "A combo (long or short)", explanation: "A long combo is also called a long risk reversal." },
  { id: 3, question_text: "Put-call parity relates:", options: ["Calls, puts, stock, and the risk-free rate", "Only calls and puts", "Stocks and bonds", "Futures and options"], correct_answer: "Calls, puts, stock, and the risk-free rate", explanation: "Put-call parity: C - P = S - K*e^(-rT)." },
  { id: 4, question_text: "The payoff of a short synthetic forward is:", options: ["K - S_T - H", "S_T - K - H", "(S_T - K)+", "max(K - S_T, 0)"], correct_answer: "K - S_T - H", explanation: "Short synthetic forward: long put + short call = K - S_T - H." },
]; }

function _optionsQuiz5() { return [
  { id: 1, question_text: "A calendar call spread profits most when at expiration of the short leg:", options: ["S_T = K (at the strike)", "S_T is far above K", "S_T is far below K", "Volatility is very high"], correct_answer: "S_T = K (at the strike)", explanation: "The ideal scenario is S_T = K, where the short call expires worthless while the long call retains maximum time value." },
  { id: 2, question_text: "What makes a diagonal spread different from a calendar spread?", options: ["Different strikes AND different expirations", "Same strikes, same expirations", "Only different expirations", "Only different strikes"], correct_answer: "Different strikes AND different expirations", explanation: "Diagonal spreads combine features of vertical and calendar spreads." },
  { id: 3, question_text: "A bull call ladder is best described as:", options: ["A bull call spread with an extra sold OTM call", "Three bought calls", "A straddle plus a call", "Two calendar spreads"], correct_answer: "A bull call spread with an extra sold OTM call", explanation: "The third sold call finances the bull call spread." },
]; }

function _optionsQuiz6() { return [
  { id: 1, question_text: "A long straddle profits when:", options: ["The stock moves significantly in either direction", "The stock stays flat", "Only when the stock rises", "Only when the stock falls"], correct_answer: "The stock moves significantly in either direction", explanation: "A straddle is a volatility strategy that profits from large price moves regardless of direction." },
  { id: 2, question_text: "What is the maximum loss of a long straddle?", options: ["D (total premium paid)", "Unlimited", "K", "S0"], correct_answer: "D (total premium paid)", explanation: "Max loss = total debit paid for both options." },
  { id: 3, question_text: "A strap has a bias toward:", options: ["Bullish moves (2 calls, 1 put)", "Bearish moves (1 call, 2 puts)", "No bias", "Sideways movement"], correct_answer: "Bullish moves (2 calls, 1 put)", explanation: "A strap uses 2 calls and 1 put, so it profits more from upward moves." },
  { id: 4, question_text: "A short strangle is less risky than a short straddle because:", options: ["Both options are OTM, creating a wider profit zone", "It uses fewer options", "It has no risk", "It requires more premium"], correct_answer: "Both options are OTM, creating a wider profit zone", explanation: "With OTM options, the stock can move more before hitting a strike." },
]; }

function _optionsQuiz7() { return [
  { id: 1, question_text: "In a call ratio backspread, you buy:", options: ["More calls than you sell (N_L > N_S)", "Fewer calls than you sell (N_L < N_S)", "Equal numbers", "Only puts"], correct_answer: "More calls than you sell (N_L > N_S)", explanation: "Backspreads buy more than they sell, giving unlimited profit potential in one direction." },
  { id: 2, question_text: "A long call butterfly has equidistant strikes where:", options: ["K2 - K3 = K1 - K2 = kappa", "All strikes are equal", "K1 = 2K2", "Strikes are random"], correct_answer: "K2 - K3 = K1 - K2 = kappa", explanation: "Butterfly strikes are equidistant with the middle strike centered between the wings." },
  { id: 3, question_text: "An iron butterfly is a combination of:", options: ["A bull put spread and a bear call spread", "Two straddles", "A box spread", "A collar and a strangle"], correct_answer: "A bull put spread and a bear call spread", explanation: "An iron butterfly combines a bull put spread and a bear call spread." },
  { id: 4, question_text: "The maximum profit of a long call butterfly is:", options: ["kappa - D", "Unlimited", "D", "2*kappa"], correct_answer: "kappa - D", explanation: "Max profit = strike distance minus net debit, achieved when S_T = K2." },
]; }

function _optionsQuiz8() { return [
  { id: 1, question_text: "How does a condor differ from a butterfly?", options: ["4 different strikes creating a wider profit zone", "Only 2 strikes", "Uses only puts", "Has unlimited profit"], correct_answer: "4 different strikes creating a wider profit zone", explanation: "A condor uses 4 equidistant strikes instead of 3, creating a wider but lower-profit zone." },
  { id: 2, question_text: "A collar strategy combines:", options: ["Long stock + long OTM put + short OTM call", "Short stock + long call + short put", "Two calls and two puts", "Only stock and a call"], correct_answer: "Long stock + long OTM put + short OTM call", explanation: "A collar is a covered call with a protective put." },
  { id: 3, question_text: "A long box spread produces:", options: ["A risk-free payoff of K1 - K2", "Unlimited profit", "A delta-neutral position", "Maximum income"], correct_answer: "A risk-free payoff of K1 - K2", explanation: "A box spread locks in the difference between strikes." },
  { id: 4, question_text: "Seagull spreads typically aim to be:", options: ["Zero-cost (self-financing)", "Maximum premium income", "Risk-free", "Delta-neutral"], correct_answer: "Zero-cost (self-financing)", explanation: "Seagull spreads are ideally structured to have zero cost." },
]; }

function _stocksQuiz1() { return [
  { id: 1, question_text: "In the price-momentum strategy, why is the most recent month typically skipped?", options: ["Due to empirically observed short-term mean-reversion", "Data is not available", "To reduce transaction costs", "For tax purposes"], correct_answer: "Due to empirically observed short-term mean-reversion", explanation: "The most recent month shows mean-reversion effects." },
  { id: 2, question_text: "What is the typical formation period for price-momentum?", options: ["12 months", "1 month", "5 years", "1 week"], correct_answer: "12 months", explanation: "The standard formation period is T = 12 months." },
  { id: 3, question_text: "SUE in earnings-momentum stands for:", options: ["Standardized Unexpected Earnings", "Standard Unit of Earnings", "Stock Underlying Equity", "Systematic Unexpected Error"], correct_answer: "Standardized Unexpected Earnings", explanation: "SUE = (E_i - E'_i) / sigma_i." },
  { id: 4, question_text: "Residual momentum uses residuals from which regression?", options: ["Fama-French 3-factor model", "Simple linear regression on price", "CAPM only", "No regression is used"], correct_answer: "Fama-French 3-factor model", explanation: "Residual momentum regresses returns on MKT, SMB, and HML factors." },
]; }

function _stocksQuiz2() { return [
  { id: 1, question_text: "The value strategy selects stocks based on:", options: ["Book-to-Price (B/P) ratio", "Price-to-Earnings ratio only", "Market capitalization", "Trading volume"], correct_answer: "Book-to-Price (B/P) ratio", explanation: "Value is defined using the B/P ratio." },
  { id: 2, question_text: "The low-volatility anomaly states that:", options: ["Low-vol stocks outperform high-vol stocks risk-adjusted", "High-vol stocks always outperform", "Volatility doesn't affect returns", "Only tech stocks are volatile"], correct_answer: "Low-vol stocks outperform high-vol stocks risk-adjusted", explanation: "This contradicts naive risk-return theory." },
  { id: 3, question_text: "In multifactor portfolios, demeaned ranks are computed as:", options: ["rank(f_Ai) - (1/N) * sum rank(f_Aj)", "f_Ai / max(f_Ai)", "log(f_Ai)", "f_Ai - mean(f_Ai)"], correct_answer: "rank(f_Ai) - (1/N) * sum rank(f_Aj)", explanation: "Demeaned ranks center the rankings around zero." },
]; }

function _stocksQuiz3() { return [
  { id: 1, question_text: "In pairs trading, you trade the spread when:", options: ["The z-score exceeds a threshold", "The stock price hits a round number", "Volume spikes", "Earnings are announced"], correct_answer: "The z-score exceeds a threshold", explanation: "The spread's z-score measures deviation from historical norms." },
  { id: 2, question_text: "Single-cluster mean-reversion weights are set as:", options: ["w_i = -gamma(R_i - R_m)", "w_i = R_i", "w_i = 1/N", "w_i = sigma_i"], correct_answer: "w_i = -gamma(R_i - R_m)", explanation: "The negative sign means you buy losers and sell winners." },
  { id: 3, question_text: "Pairs trading is an example of:", options: ["A mean-reversion strategy", "A momentum strategy", "A buy-and-hold strategy", "A market-making strategy"], correct_answer: "A mean-reversion strategy", explanation: "Pairs trading bets that the spread will revert to its historical mean." },
]; }

function _stocksQuiz4() { return [
  { id: 1, question_text: "A 'golden cross' occurs when:", options: ["Short MA crosses above long MA", "Price drops below the MA", "Volume exceeds average", "RSI goes above 70"], correct_answer: "Short MA crosses above long MA", explanation: "A golden cross is a bullish signal." },
  { id: 2, question_text: "Support levels are price levels where:", options: ["The stock has historically bounced upward", "The stock always breaks down", "Volume is zero", "Earnings are reported"], correct_answer: "The stock has historically bounced upward", explanation: "Support is a price level where buying pressure has prevented further decline." },
  { id: 3, question_text: "A simple moving average MA(T) is computed as:", options: ["(1/T) * sum P_i(t) over T periods", "The median price over T periods", "The highest price over T periods", "The last price only"], correct_answer: "(1/T) * sum P_i(t) over T periods", explanation: "SMA is the arithmetic mean of prices." },
]; }

function _stocksQuiz5() { return [
  { id: 1, question_text: "In event-driven M&A trading for stock deals, you typically:", options: ["Buy the target, short the acquirer", "Buy both companies", "Short both companies", "Buy the acquirer only"], correct_answer: "Buy the target, short the acquirer", explanation: "The target usually trades at a discount to the deal price." },
  { id: 2, question_text: "KNN stands for:", options: ["k-nearest neighbors", "Key neural network", "Kernel normal notation", "Kalman noise neutralizer"], correct_answer: "k-nearest neighbors", explanation: "KNN is a machine learning algorithm." },
]; }

function _stocksQuiz6() { return [
  { id: 1, question_text: "In statistical arbitrage optimization, weights are determined by:", options: ["w = gamma * C^-1 * E", "Equal weighting", "Market cap weighting", "Random selection"], correct_answer: "w = gamma * C^-1 * E", explanation: "Mean-variance optimization uses the inverse covariance matrix." },
  { id: 2, question_text: "Market-makers profit primarily from:", options: ["The bid-ask spread", "Long-term stock appreciation", "Dividend income", "Short selling"], correct_answer: "The bid-ask spread", explanation: "Market-makers earn the spread between bid and ask." },
  { id: 3, question_text: "Alpha combos involve:", options: ["Combining many weak trading signals into a stronger composite", "Trading only one stock", "Using a single indicator", "Investing in index funds"], correct_answer: "Combining many weak trading signals into a stronger composite", explanation: "Combining thousands of signals can produce a strong signal." },
]; }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const quizzes = getQuizzesData();
  
  if (id) {
    const quiz = quizzes.find((q: any) => q.id === parseInt(id));
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    return NextResponse.json(quiz);
  }
  
  return NextResponse.json(quizzes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, answers } = body;
  
  const quizzes = getQuizzesData();
  const quiz = quizzes.find((q: any) => q.id === id);
  
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  
  let correct = 0;
  const results = quiz.questions.map((q: any) => {
    const isCorrect = answers[q.id] === q.correct_answer;
    if (isCorrect) correct++;
    return { questionId: q.id, correct: isCorrect };
  });
  
  const score = correct / quiz.questions.length;
  const passed = score >= quiz.passing_score;
  
  return NextResponse.json({ score, passed, results });
}