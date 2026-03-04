import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function Lessons() {
  const [lessons, setLessons] = useState([])
  const [module, setModule] = useState('')

  useEffect(() => {
    api.getLessons(module).then(setLessons)
  }, [module])

  const optionsLessons = lessons.filter(l => l.module === 'Options')
  const stocksLessons = lessons.filter(l => l.module === 'Stocks')

  const renderModule = (title, items, color) => (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 20, marginBottom: 16, color: `var(--accent-${color})` }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((l, i) => (
          <Link key={l.id} to={`/lessons/${l.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: l.completed ? 'var(--accent-green)' : 'var(--bg-hover)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, flexShrink: 0,
                color: l.completed ? 'white' : 'var(--text-secondary)',
              }}>
                {l.completed ? '✓' : l.order}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, marginBottom: 2 }}>{l.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{l.subtitle}</p>
              </div>
              <div className="card-meta">
                <span className={`badge badge-${color}`}>{l.strategy_count} strategies</span>
                <span className={`badge ${l.difficulty === 'beginner' ? 'badge-green' : l.difficulty === 'intermediate' ? 'badge-yellow' : 'badge-red'}`}>
                  {l.difficulty}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h2>Learning Path</h2>
        <p>Progressive lessons from fundamentals to advanced strategies</p>
      </div>

      <div className="filters-bar">
        <button className={`btn ${module === '' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setModule('')}>All</button>
        <button className={`btn ${module === 'Options' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setModule('Options')}>Options</button>
        <button className={`btn ${module === 'Stocks' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setModule('Stocks')}>Stocks</button>
      </div>

      {(!module || module === 'Options') && optionsLessons.length > 0 && renderModule('Options Module', optionsLessons, 'blue')}
      {(!module || module === 'Stocks') && stocksLessons.length > 0 && renderModule('Stocks Module', stocksLessons, 'green')}
    </div>
  )
}
