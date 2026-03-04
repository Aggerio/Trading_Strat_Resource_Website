import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function Dashboard() {
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    api.getProgress().then(setProgress)
  }, [])

  if (!progress) return <p>Loading...</p>

  const stratPct = progress.total_strategies
    ? Math.round((progress.strategies_studied / progress.total_strategies) * 100)
    : 0
  const lessonPct = progress.total_lessons
    ? Math.round((progress.lessons_completed / progress.total_lessons) * 100)
    : 0
  const quizPct = progress.total_quizzes
    ? Math.round((progress.quizzes_passed / progress.total_quizzes) * 100)
    : 0

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Track your progress mastering 151 Trading Strategies</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{progress.strategies_studied}/{progress.total_strategies}</div>
          <div className="stat-label">Strategies Studied</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${stratPct}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progress.lessons_completed}/{progress.total_lessons}</div>
          <div className="stat-label">Lessons Completed</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${lessonPct}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progress.quizzes_passed}/{progress.total_quizzes}</div>
          <div className="stat-label">Quizzes Passed</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${quizPct}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round(progress.average_quiz_score * 100)}%</div>
          <div className="stat-label">Avg Quiz Score</div>
        </div>
      </div>

      <div className="card-grid" style={{ marginTop: 32 }}>
        <Link to="/strategies" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>Strategy Library</h3>
            <p>Browse all 77 options and stock strategies with formulas, payoff diagrams, and detailed descriptions.</p>
            <div className="card-meta">
              <span className="badge badge-blue">56 Options</span>
              <span className="badge badge-green">21 Stocks</span>
            </div>
          </div>
        </Link>
        <Link to="/lessons" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>Learning Path</h3>
            <p>Progressive lessons from beginner to advanced, with quizzes to test your understanding.</p>
            <div className="card-meta">
              <span className="badge badge-purple">8 Options Lessons</span>
              <span className="badge badge-yellow">6 Stock Lessons</span>
            </div>
          </div>
        </Link>
        <Link to="/visualizer" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>Payoff Visualizer</h3>
            <p>Build any options strategy and see the interactive payoff diagram with break-even analysis.</p>
            <div className="card-meta">
              <span className="badge badge-green">Interactive</span>
            </div>
          </div>
        </Link>
        <Link to="/glossary" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3>Glossary</h3>
            <p>Search 150+ trading terms, concepts, and definitions across all asset classes.</p>
            <div className="card-meta">
              <span className="badge badge-yellow">150+ Terms</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
