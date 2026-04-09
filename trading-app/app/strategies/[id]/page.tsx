'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProgress } from '@/lib/useProgress';

interface Strategy {
  id: number;
  paper_ref: string;
  name: string;
  asset_class: string;
  category: string;
  difficulty: string;
  outlook: string;
  short_description: string;
  full_description: string;
  formulas: Record<string, string>;
  max_profit: string;
  max_loss: string;
  breakeven: string;
  legs: { type: string; position: string; strike_description: string; moneyness: string }[];
  related_strategies: string[];
}

export default function StrategyDetail() {
  const params = useParams();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const { getStrategyStatus, markStrategyStudied } = useProgress();

  useEffect(() => {
    fetch(`/api/strategies?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => setStrategy(data[0] || null));
  }, [params.id]);

  if (!strategy) return <div className="loading">Loading...</div>;

  const status = getStrategyStatus(strategy.id);
  const isStudied = status !== 'not_started';

  return (
    <div className="detail-page">
      <Link href="/strategies" className="back-link">
        ← Back to Library
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
        <div>
          <h2>{strategy.name}</h2>
          <div className="meta-row">
            <span className="badge badge-blue">{strategy.asset_class}</span>
            <span className="badge badge-purple">{strategy.category}</span>
            <span className={`badge ${strategy.difficulty === 'beginner' ? 'badge-green' : strategy.difficulty === 'advanced' ? 'badge-red' : 'badge-yellow'}`}>
              {strategy.difficulty}
            </span>
            {isStudied && <span className="badge badge-green">Studied</span>}
          </div>
        </div>
        {!isStudied && (
          <button 
            className="btn btn-primary"
            onClick={() => markStrategyStudied(strategy.id)}
          >
            Mark as Studied
          </button>
        )}
      </div>

      <div className="detail-section">
        <h4>Description</h4>
        <p>{strategy.full_description || strategy.short_description}</p>
      </div>

      {strategy.outlook && (
        <div className="detail-section">
          <h4>Outlook</h4>
          <p>{strategy.outlook}</p>
        </div>
      )}

      {strategy.formulas && (
        <div className="detail-section">
          <h4>Formulas</h4>
          {Object.entries(strategy.formulas).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <strong>{key}:</strong> <code>{value}</code>
            </div>
          ))}
        </div>
      )}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Max Profit</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{strategy.max_profit}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Max Loss</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{strategy.max_loss}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Breakeven</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{strategy.breakeven}</div>
        </div>
      </div>

      {strategy.legs && strategy.legs.length > 0 && (
        <div className="detail-section">
          <h4>Option Legs</h4>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Position</th>
                <th>Strike</th>
                <th>Moneyness</th>
              </tr>
            </thead>
            <tbody>
              {strategy.legs.map((leg, i) => (
                <tr key={i}>
                  <td>{leg.type}</td>
                  <td>{leg.position}</td>
                  <td>{leg.strike_description}</td>
                  <td>{leg.moneyness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {strategy.related_strategies && strategy.related_strategies.length > 0 && (
        <div className="detail-section">
          <h4>Related Strategies</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {strategy.related_strategies.map((ref) => (
              <span key={ref} className="badge badge-blue">{ref}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}