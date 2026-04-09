import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

function getStrategies() {
  const options = fs.readFileSync(path.join(dataDir, 'options_strategies.json'), 'utf-8');
  const stocks = fs.readFileSync(path.join(dataDir, 'stocks_strategies.json'), 'utf-8');
  return [...JSON.parse(options), ...JSON.parse(stocks)];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assetClass = searchParams.get('asset_class');
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');

  let strategies = getStrategies();

  if (assetClass) {
    strategies = strategies.filter((s: any) => s.asset_class === assetClass);
  }
  if (category) {
    strategies = strategies.filter((s: any) => s.category === category);
  }
  if (difficulty) {
    strategies = strategies.filter((s: any) => s.difficulty === difficulty);
  }

  return NextResponse.json(strategies);
}