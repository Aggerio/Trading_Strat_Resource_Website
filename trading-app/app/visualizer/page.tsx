'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const DEFAULT_LEGS = [
  { type: 'call', position: 'long', strike: 100, premium: 5, quantity: 1 },
];

const PRESETS: Record<string, { type: string; position: string; strike: number; premium: number; quantity: number }[]> = {
  'Covered Call': [
    { type: 'stock', position: 'long', strike: 100, premium: 0, quantity: 1 },
    { type: 'call', position: 'short', strike: 110, premium: 3, quantity: 1 },
  ],
  'Protective Put': [
    { type: 'stock', position: 'long', strike: 100, premium: 0, quantity: 1 },
    { type: 'put', position: 'long', strike: 95, premium: 2, quantity: 1 },
  ],
  'Bull Call Spread': [
    { type: 'call', position: 'long', strike: 100, premium: 5, quantity: 1 },
    { type: 'call', position: 'short', strike: 110, premium: 2, quantity: 1 },
  ],
  'Bear Put Spread': [
    { type: 'put', position: 'long', strike: 100, premium: 5, quantity: 1 },
    { type: 'put', position: 'short', strike: 90, premium: 2, quantity: 1 },
  ],
  'Long Straddle': [
    { type: 'call', position: 'long', strike: 100, premium: 4, quantity: 1 },
    { type: 'put', position: 'long', strike: 100, premium: 4, quantity: 1 },
  ],
  'Short Strangle': [
    { type: 'call', position: 'short', strike: 110, premium: 3, quantity: 1 },
    { type: 'put', position: 'short', strike: 90, premium: 3, quantity: 1 },
  ],
  'Iron Condor': [
    { type: 'put', position: 'long', strike: 85, premium: 1, quantity: 1 },
    { type: 'put', position: 'short', strike: 90, premium: 2, quantity: 1 },
    { type: 'call', position: 'short', strike: 110, premium: 2, quantity: 1 },
    { type: 'call', position: 'long', strike: 115, premium: 1, quantity: 1 },
  ],
  'Long Call Butterfly': [
    { type: 'call', position: 'long', strike: 90, premium: 12, quantity: 1 },
    { type: 'call', position: 'short', strike: 100, premium: 6, quantity: 2 },
    { type: 'call', position: 'long', strike: 110, premium: 2, quantity: 1 },
  ],
  'Collar': [
    { type: 'stock', position: 'long', strike: 100, premium: 0, quantity: 1 },
    { type: 'put', position: 'long', strike: 95, premium: 2, quantity: 1 },
    { type: 'call', position: 'short', strike: 105, premium: 2, quantity: 1 },
  ],
};

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

export default function PayoffVisualizer() {
  const [stockPrice, setStockPrice] = useState(100);
  const [legs, setLegs] = useState<Leg[]>(DEFAULT_LEGS);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulator/payoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy_type: 'custom',
          stock_price: stockPrice,
          legs,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Calculation error:', err);
    }
    setLoading(false);
  }, [stockPrice, legs]);

  const addLeg = () => {
    setLegs([...legs, { type: 'call', position: 'long', strike: stockPrice, premium: 0, quantity: 1 }]);
  };

  const removeLeg = (i: number) => {
    setLegs(legs.filter((_, idx) => idx !== i));
  };

  const updateLeg = (i: number, field: string, value: string) => {
    const updated = [...legs];
    updated[i] = {
      ...updated[i],
      [field]: field === 'type' || field === 'position' ? value : parseFloat(value) || 0,
    };
    setLegs(updated);
  };

  const loadPreset = (name: string) => {
    setLegs(PRESETS[name].map((l) => ({ ...l })));
    setStockPrice(100);
    setResult(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Options Payoff Visualizer</h2>
        <p>Build any options strategy and visualize its payoff at expiration</p>
      </div>

      <div className="detail-section">
        <h4>Presets</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {Object.keys(PRESETS).map((name) => (
            <button key={name} type="button" className="btn btn-secondary" onClick={() => loadPreset(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h4>Configuration</h4>
        <div className="viz-controls">
          <label>
            Current Stock Price ($)
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
            />
          </label>
        </div>

        <h4 style={{ marginTop: 16 }}>Strategy Legs</h4>
        <div className="legs-list">
          {legs.map((leg, i) => (
            <div key={i} className="leg-row">
              <select value={leg.position} onChange={(e) => updateLeg(i, 'position', e.target.value)}>
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
              <select value={leg.type} onChange={(e) => updateLeg(i, 'type', e.target.value)}>
                <option value="call">Call</option>
                <option value="put">Put</option>
                <option value="stock">Stock</option>
              </select>
              {leg.type !== 'stock' && (
                <>
                  <label style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    K:
                    <input
                      type="number"
                      value={leg.strike}
                      onChange={(e) => updateLeg(i, 'strike', e.target.value)}
                      style={{ width: 80 }}
                    />
                  </label>
                  <label style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    Premium:
                    <input
                      type="number"
                      value={leg.premium}
                      onChange={(e) => updateLeg(i, 'premium', e.target.value)}
                      style={{ width: 80 }}
                    />
                  </label>
                </>
              )}
              <label style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                Qty:
                <input
                  type="number"
                  value={leg.quantity}
                  onChange={(e) => updateLeg(i, 'quantity', e.target.value)}
                  style={{ width: 60 }}
                />
              </label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => removeLeg(i)}
                style={{ padding: '4px 10px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-secondary" onClick={addLeg}>
            + Add Leg
          </button>
          <button type="button" className="btn btn-primary" onClick={calculate} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Payoff'}
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="stats-grid" style={{ marginTop: 16 }}>
            <div className="stat-card">
              <div className="stat-label">Max Profit</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent-green)', marginTop: 4 }}>
                {result.max_profit}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Max Loss</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent-red)', marginTop: 4 }}>
                {result.max_loss}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Break-even</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>
                {result.breakevens.length > 0 ? result.breakevens.map((b) => `$${b}`).join(', ') : 'None'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Net Cost</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>
                ${result.net_cost.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <Plot
              data={[
                {
                  x: result.prices,
                  y: result.profit_loss,
                  type: 'scatter',
                  mode: 'lines',
                  name: 'P&L',
                  line: { color: '#3b82f6', width: 2 },
                  fill: 'tozeroy',
                  fillcolor: 'rgba(59,130,246,0.1)',
                },
                {
                  x: result.prices,
                  y: result.prices.map(() => 0),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Zero',
                  line: { color: '#6b7280', width: 1, dash: 'dash' },
                  showlegend: false,
                },
              ]}
              layout={{
                title: { text: 'Profit / Loss at Expiration', font: { color: '#e8eaed', size: 16 } },
                xaxis: {
                  title: { text: 'Stock Price at Expiration ($)', font: { color: '#9aa0b2' } },
                  gridcolor: '#2d3348',
                  zerolinecolor: '#6b7280',
                  tickfont: { color: '#9aa0b2' },
                },
                yaxis: {
                  title: { text: 'Profit / Loss ($)', font: { color: '#9aa0b2' } },
                  gridcolor: '#2d3348',
                  zerolinecolor: '#6b7280',
                  tickfont: { color: '#9aa0b2' },
                },
                paper_bgcolor: '#222639',
                plot_bgcolor: '#1a1d29',
                margin: { t: 50, r: 30, b: 60, l: 60 },
                showlegend: false,
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: 400 }}
            />
          </div>
        </>
      )}
    </div>
  );
}