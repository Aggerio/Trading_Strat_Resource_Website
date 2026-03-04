import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import KaTeX from '../components/KaTeX'

export default function StrategyDetail() {
  const { id } = useParams()
  const [strategy, setStrategy] = useState(null)
  const [studied, setStudied] = useState(false)

  useEffect(() => {
    api.getStrategy(id).then(setStrategy)
  }, [id])

  const handleMarkStudied = async () => {
    await api.markStudied(parseInt(id))
    setStudied(true)
  }

  if (!strategy) return <p>Loading...</p>

  return (
    <div className="detail-page">
      <Link to="/strategies" className="back-link">← Back to Library</Link>

      <h2>{strategy.paper_ref} — {strategy.name}</h2>
      <div className="meta-row">
        <span className={`badge ${strategy.asset_class === 'Options' ? 'badge-blue' : 'badge-green'}`}>
          {strategy.asset_class}
        </span>
        <span className="badge badge-purple">{strategy.category}</span>
        {strategy.outlook && <span className="badge badge-yellow">{strategy.outlook}</span>}
        {strategy.difficulty && <span className="badge badge-red">{strategy.difficulty}</span>}
      </div>

      <div className="detail-section">
        <h4>Description</h4>
        <p>{strategy.full_description || strategy.short_description}</p>
      </div>

      {strategy.formulas && Object.keys(strategy.formulas).length > 0 && (
        <div className="detail-section">
          <h4>Formulas</h4>
          {Object.entries(strategy.formulas).map(([key, formula]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'capitalize' }}>
                {key.replace(/_/g, ' ')}
              </div>
              <KaTeX math={formula} display />
            </div>
          ))}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Max Profit</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent-green)', marginTop: 4 }}>
            {strategy.max_profit || 'N/A'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Max Loss</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent-red)', marginTop: 4 }}>
            {strategy.max_loss || 'N/A'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Break-even</div>
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>
            {strategy.breakeven || 'N/A'}
          </div>
        </div>
      </div>

      {strategy.legs && strategy.legs.length > 0 && (
        <div className="detail-section">
          <h4>Strategy Legs</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', textAlign: 'left', fontSize: 13 }}>Position</th>
                <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', textAlign: 'left', fontSize: 13 }}>Type</th>
                <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', textAlign: 'left', fontSize: 13 }}>Strike</th>
                <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', textAlign: 'left', fontSize: 13 }}>Moneyness</th>
              </tr>
            </thead>
            <tbody>
              {strategy.legs.map((leg, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    <span className={`badge ${leg.position === 'long' ? 'badge-green' : 'badge-red'}`}>
                      {leg.position}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    {leg.type}
                  </td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    {leg.strike_description || '-'}
                  </td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    {leg.moneyness || '-'}
                  </td>
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
            {strategy.related_strategies.map(ref => (
              <span key={ref} className="badge badge-blue">{ref}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <button className={`btn ${studied ? 'btn-success' : 'btn-primary'}`} onClick={handleMarkStudied}>
          {studied ? 'Marked as Studied' : 'Mark as Studied'}
        </button>
        {strategy.lesson_id && (
          <Link to={`/lessons/${strategy.lesson_id}`}>
            <button className="btn btn-secondary">Go to Lesson</button>
          </Link>
        )}
      </div>
    </div>
  )
}
