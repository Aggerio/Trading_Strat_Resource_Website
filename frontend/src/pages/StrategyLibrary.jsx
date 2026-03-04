import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const DIFFICULTY_COLORS = {
  beginner: 'badge-green',
  intermediate: 'badge-yellow',
  advanced: 'badge-red',
}

export default function StrategyLibrary() {
  const [strategies, setStrategies] = useState([])
  const [filters, setFilters] = useState({})
  const [params, setParams] = useState({
    asset_class: '', category: '', strategy_type: '', difficulty: '', search: '',
  })

  useEffect(() => {
    api.getFilters().then(setFilters)
  }, [])

  useEffect(() => {
    api.getStrategies(params).then(setStrategies)
  }, [params])

  const updateFilter = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <div className="page-header">
        <h2>Strategy Library</h2>
        <p>Browse and study {strategies.length} trading strategies from the paper</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search strategies..."
          value={params.search}
          onChange={e => updateFilter('search', e.target.value)}
          style={{ minWidth: 200 }}
        />
        <select value={params.asset_class} onChange={e => updateFilter('asset_class', e.target.value)}>
          <option value="">All Asset Classes</option>
          {(filters.asset_classes || []).map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={params.category} onChange={e => updateFilter('category', e.target.value)}>
          <option value="">All Categories</option>
          {(filters.categories || []).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={params.difficulty} onChange={e => updateFilter('difficulty', e.target.value)}>
          <option value="">All Difficulties</option>
          {(filters.difficulties || []).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="card-grid">
        {strategies.map(s => (
          <Link key={s.id} to={`/strategies/${s.id}`} style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>{s.paper_ref} — {s.name}</h3>
              <p>{s.short_description}</p>
              <div className="card-meta">
                <span className={`badge ${s.asset_class === 'Options' ? 'badge-blue' : 'badge-green'}`}>
                  {s.asset_class}
                </span>
                <span className={`badge ${DIFFICULTY_COLORS[s.difficulty] || 'badge-yellow'}`}>
                  {s.difficulty}
                </span>
                {s.outlook && (
                  <span className="badge badge-purple">{s.outlook}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
