'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/useProgress';

export default function Dashboard() {
  const [strategiesCount, setStrategiesCount] = useState(0);
  const { getSummary } = useProgress();
  const summary = getSummary();

  useEffect(() => {
    fetch('/api/strategies')
      .then((res) => res.json())
      .then((data) => setStrategiesCount(data.length));
  }, []);

  const stratPct = strategiesCount > 0 ? Math.round((summary.strategiesStudied / strategiesCount) * 100) : 0;
  const lessonPct = Math.round((summary.lessonsCompleted / 14) * 100);
  const quizPct = summary.totalQuizzes > 0 ? Math.round((summary.quizzesPassed / summary.totalQuizzes) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Track your progress mastering 151 Trading Strategies</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{summary.strategiesStudied}/{strategiesCount}</div>
          <div className="stat-label">Strategies Studied</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${stratPct}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.lessonsCompleted}/14</div>
          <div className="stat-label">Lessons Completed</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${lessonPct}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.quizzesPassed}/{summary.totalQuizzes}</div>
          <div className="stat-label">Quizzes Passed</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${quizPct}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.averageQuizScore}%</div>
          <div className="stat-label">Avg Quiz Score</div>
        </div>
      </div>

      <div className="card-grid" style={{ marginTop: 32 }}>
        <Link href="/strategies" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>Strategy Library</h3>
            <p>Browse all options and stock strategies with formulas, payoff diagrams, and detailed descriptions.</p>
            <div className="card-meta">
              <span className="badge badge-blue">Options</span>
              <span className="badge badge-green">Stocks</span>
            </div>
          </div>
        </Link>
        <Link href="/lessons" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>Learning Path</h3>
            <p>Progressive lessons from beginner to advanced, with quizzes to test your understanding.</p>
            <div className="card-meta">
              <span className="badge badge-purple">8 Options Lessons</span>
              <span className="badge badge-yellow">6 Stock Lessons</span>
            </div>
          </div>
        </Link>
        <Link href="/visualizer" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>Payoff Visualizer</h3>
            <p>Build any options strategy and see the interactive payoff diagram with break-even analysis.</p>
            <div className="card-meta">
              <span className="badge badge-green">Interactive</span>
            </div>
          </div>
        </Link>
        <Link href="/glossary" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>Glossary</h3>
            <p>Search trading terms, concepts, and definitions across all asset classes.</p>
            <div className="card-meta">
              <span className="badge badge-yellow">Terms</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}