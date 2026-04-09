import { NextResponse } from 'next/server';

interface Leg {
  type: string;
  position: string;
  strike: number;
  premium: number;
  quantity: number;
}

interface CalculationResult {
  prices: number[];
  profit_loss: number[];
  max_profit: string;
  max_loss: string;
  breakevens: number[];
  net_cost: number;
}

function calculateLegPayoff(leg: Leg, stockPrice: number, s: number): number {
  const { type, position, strike, premium, quantity } = leg;
  let payoff = 0;

  if (type === 'stock') {
    payoff = position === 'long' ? s - stockPrice : stockPrice - s;
  } else if (type === 'call') {
    const intrinsic = Math.max(s - strike, 0);
    if (position === 'long') {
      payoff = (intrinsic - premium) * quantity;
    } else {
      payoff = (premium - intrinsic) * quantity;
    }
  } else if (type === 'put') {
    const intrinsic = Math.max(strike - s, 0);
    if (position === 'long') {
      payoff = (intrinsic - premium) * quantity;
    } else {
      payoff = (premium - intrinsic) * quantity;
    }
  }

  return payoff;
}

function calculatePayoff(legs: Leg[], stockPrice: number, spotPrice: number): { prices: number[], payoffs: number[], net_cost: number } {
  const prices: number[] = [];
  const payoffs: number[] = [];

  const range = spotPrice * 0.5;
  const minPrice = spotPrice - range;
  const maxPrice = spotPrice + range;
  const steps = 50;
  const stepSize = (maxPrice - minPrice) / steps;

  let netCost = 0;
  for (const leg of legs) {
    if (leg.type === 'stock') {
      netCost += leg.position === 'long' ? -stockPrice : stockPrice;
    } else {
      netCost += leg.position === 'long' ? -leg.premium * leg.quantity : leg.premium * leg.quantity;
    }
  }

  for (let i = 0; i <= steps; i++) {
    const s = minPrice + i * stepSize;
    prices.push(Math.round(s * 100) / 100);

    let totalPayoff = 0;
    for (const leg of legs) {
      totalPayoff += calculateLegPayoff(leg, stockPrice, s);
    }
    payoffs.push(Math.round(totalPayoff * 100) / 100);
  }

  return { prices, payoffs, net_cost: netCost };
}

function findBreakevens(payoffs: number[], prices: number[]): number[] {
  const breakevens: number[] = [];
  for (let i = 1; i < payoffs.length; i++) {
    if ((payoffs[i - 1] < 0 && payoffs[i] >= 0) || (payoffs[i - 1] >= 0 && payoffs[i] < 0)) {
      const ratio = Math.abs(payoffs[i - 1]) / (Math.abs(payoffs[i - 1]) + Math.abs(payoffs[i]));
      const breakeven = prices[i - 1] + ratio * (prices[i] - prices[i - 1]);
      breakevens.push(Math.round(breakeven * 100) / 100);
    }
  }
  return breakevens;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { strategy, stock_price = 100, legs = [], strikes = [], premium = 0 } = body;

  const spotPrice = stock_price;

  let result: CalculationResult;

  if (strategy === 'custom' && legs.length > 0) {
    const { prices, payoffs, net_cost } = calculatePayoff(legs, stock_price, spotPrice);
    const breakevens = findBreakevens(payoffs, prices);

    const maxProfit = Math.max(...payoffs);
    const maxLoss = Math.min(...payoffs);

    result = {
      prices,
      profit_loss: payoffs,
      max_profit: maxProfit > 10000 ? 'Unlimited' : `$${maxProfit.toFixed(2)}`,
      max_loss: maxLoss < -10000 ? 'Unlimited' : `$${Math.abs(maxLoss).toFixed(2)}`,
      breakevens,
      net_cost,
    };
  } else {
    const generatePayoff = (strategyType: string): { prices: number[], payoffs: number[] } => {
      const prices: number[] = [];
      const payoffs: number[] = [];
      
      const center = spotPrice;
      const range = center * 0.5;
      const minPrice = center - range;
      const maxPrice = center + range;
      const steps = 50;
      const stepSize = (maxPrice - minPrice) / steps;
      
      for (let i = 0; i <= steps; i++) {
        const s = minPrice + i * stepSize;
        prices.push(Math.round(s * 100) / 100);
        
        let payoff = 0;
        
        switch (strategyType) {
          case 'covered_call':
            payoff = (s - spotPrice) + premium - Math.max(s - (strikes[0] || spotPrice * 1.05), 0);
            break;
          case 'protective_put':
            payoff = (s - spotPrice) - premium + Math.max((strikes[0] || spotPrice * 0.95) - s, 0);
            break;
          case 'bull_call_spread': {
            const lowerStrike = strikes[0] || spotPrice * 0.95;
            const upperStrike = strikes[1] || spotPrice * 1.05;
            payoff = Math.max(s - lowerStrike, 0) - Math.max(s - upperStrike, 0) - premium;
            break;
          }
          case 'bear_put_spread': {
            const highStrike = strikes[0] || spotPrice * 1.05;
            const lowStrike = strikes[1] || spotPrice * 0.95;
            payoff = Math.max(highStrike - s, 0) - Math.max(lowStrike - s, 0) - premium;
            break;
          }
          case 'long_straddle':
            payoff = Math.max(s - (strikes[0] || spotPrice), 0) + Math.max((strikes[0] || spotPrice) - s, 0) - premium * 2;
            break;
          case 'long_strangle': {
            const callStrike = strikes[0] || spotPrice * 1.05;
            const putStrike = strikes[1] || spotPrice * 0.95;
            payoff = Math.max(s - callStrike, 0) + Math.max(putStrike - s, 0) - premium * 2;
            break;
          }
          case 'long_call':
            payoff = Math.max(s - (strikes[0] || spotPrice), 0) - premium;
            break;
          case 'long_put':
            payoff = Math.max((strikes[0] || spotPrice) - s, 0) - premium;
            break;
          case 'short_call':
            payoff = premium - Math.max(s - (strikes[0] || spotPrice * 1.05), 0);
            break;
          case 'short_put':
            payoff = premium - Math.max((strikes[0] || spotPrice * 0.95) - s, 0);
            break;
          case 'synthetic_long':
            payoff = s - spotPrice;
            break;
          case 'synthetic_short':
            payoff = spotPrice - s;
            break;
          default:
            payoff = 0;
        }
        
        payoffs.push(Math.round(payoff * 100) / 100);
      }
      
      return { prices, payoffs };
    };
    
    const { prices, payoffs } = generatePayoff(strategy);
    const breakevens = findBreakevens(payoffs, prices);
    const maxProfit = Math.max(...payoffs);
    const maxLoss = Math.min(...payoffs);

    result = {
      prices,
      profit_loss: payoffs,
      max_profit: maxProfit > 10000 ? 'Unlimited' : `$${maxProfit.toFixed(2)}`,
      max_loss: maxLoss < -10000 ? 'Unlimited' : `$${Math.abs(maxLoss).toFixed(2)}`,
      breakevens,
      net_cost: premium,
    };
  }

  return NextResponse.json(result);
}