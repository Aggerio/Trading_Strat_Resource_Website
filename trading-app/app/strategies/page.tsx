'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/useProgress';

interface Strategy {
  id: number;
  paper_ref: string;
  name: string;
  asset_class: string;
  category: string;
  difficulty: string;
  short_description: string;
}

export default function StrategyLibrary() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filters, setFilters] = useState({ asset_class: '', category: '', difficulty: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const { getStrategyStatus, markStrategyStudied } = useProgress();

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.asset_class) params.set('asset_class', filters.asset_class);
    if (filters.category) params.set('category', filters.category);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    
    fetch(`/api/strategies?${params}`)
      .then((res) => res.json())
      .then((data: Strategy[]) => {
        setStrategies(data);
        const cats = [...new Set(data.map((s) => s.category))];
        setCategories(cats as string[]);
      });
  }, [filters]);

  return (
    <div>
      <div className="page-header">
        <h2>Strategy Library</h2>
        <p>Browse all trading strategies with detailed descriptions and formulas</p>
      </div>

      <div className="filters-bar">
        <select
          value={filters.asset_class}
          onChange={(e) => setFilters({ ...filters, asset_class: e.target.value })}
        >
          <option value="">All Asset Classes</option>
          <option value="Options">Options</option>
          <option value="Stocks">Stocks</option>
        </select>
        
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="card-grid">
        {strategies.map((strategy) => {
          const status = getStrategyStatus(strategy.id);
          return (
            <Link key={strategy.id} href={`/strategies/${strategy.id}`} style={{ textDecoration: 'none' }}>
              <div className="strategy-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h4>{strategy.name}</h4>
                  {status !== 'not_started' && (
                    <span className="badge badge-green">Studied</span>
                  )}
                </div>
                <p>{strategy.short_description}</p>
                <div className="meta">
                  <span className="badge badge-blue">{strategy.asset_class}</span>
                  <span className="badge badge-purple">{strategy.category}</span>
                  <span className={`badge ${strategy.difficulty === 'beginner' ? 'badge-green' : strategy.difficulty === 'advanced' ? 'badge-red' : 'badge-yellow'}`}>
                    {strategy.difficulty}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}