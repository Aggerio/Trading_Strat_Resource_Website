'use client';

import { useEffect, useState } from 'react';

interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  category: string;
  related_terms: string[];
}

export default function Glossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    
    fetch(`/api/glossary?${params}`)
      .then((res) => res.json())
      .then((data: GlossaryTerm[]) => {
        setTerms(data);
        const cats = [...new Set(data.map((t) => t.category))];
        setCategories(cats as string[]);
      });
  }, [search, category]);

  return (
    <div>
      <div className="page-header">
        <h2>Glossary</h2>
        <p>Search trading terms and definitions</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="glossary-list">
        {terms.map((term) => (
          <div key={term.id} className="glossary-item">
            <div className="term-name">{term.term}</div>
            <div className="term-def">{term.definition}</div>
            <div className="term-cat">{term.category}</div>
          </div>
        ))}
      </div>

      {terms.length === 0 && (
        <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>No terms found.</p>
      )}
    </div>
  );
}