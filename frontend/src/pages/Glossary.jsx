import { useState, useEffect } from 'react'
import { api } from '../services/api'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Glossary() {
  const [terms, setTerms] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [letter, setLetter] = useState('')

  useEffect(() => {
    api.getGlossaryCategories().then(setCategories)
  }, [])

  useEffect(() => {
    api.getGlossary({ search, category, letter }).then(setTerms)
  }, [search, category, letter])

  return (
    <div>
      <div className="page-header">
        <h2>Glossary</h2>
        <p>{terms.length} trading terms and definitions</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={e => { setSearch(e.target.value); setLetter('') }}
          style={{ minWidth: 240 }}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          className={`btn ${letter === '' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 8px', fontSize: 12 }}
          onClick={() => { setLetter(''); setSearch('') }}
        >
          All
        </button>
        {LETTERS.map(l => (
          <button
            key={l}
            className={`btn ${letter === l ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 8px', fontSize: 12, minWidth: 30 }}
            onClick={() => { setLetter(l); setSearch('') }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="glossary-list">
        {terms.map(t => (
          <div key={t.id} className="glossary-item">
            <div className="term-name">{t.term}</div>
            <div className="term-def">{t.definition}</div>
            {t.category && <div className="term-cat">{t.category}</div>}
          </div>
        ))}
        {terms.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
            No terms found. Try a different search or filter.
          </p>
        )}
      </div>
    </div>
  )
}
