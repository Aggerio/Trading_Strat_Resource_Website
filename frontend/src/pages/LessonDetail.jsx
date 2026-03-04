import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import MarkdownRenderer from '../components/MarkdownRenderer'

export default function LessonDetail() {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)

  useEffect(() => {
    api.getLesson(id).then(setLesson)
  }, [id])

  if (!lesson) return <p>Loading...</p>

  return (
    <div className="detail-page">
      <Link to="/lessons" className="back-link">← Back to Learning Path</Link>

      <h2>{lesson.title}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>{lesson.subtitle}</p>

      <div className="meta-row">
        <span className={`badge ${lesson.module === 'Options' ? 'badge-blue' : 'badge-green'}`}>
          {lesson.module}
        </span>
        <span className={`badge ${lesson.difficulty === 'beginner' ? 'badge-green' : lesson.difficulty === 'intermediate' ? 'badge-yellow' : 'badge-red'}`}>
          {lesson.difficulty}
        </span>
        <span className="badge badge-purple">Lesson {lesson.order}</span>
      </div>

      <div className="detail-section">
        <MarkdownRenderer content={lesson.content} />
      </div>

      {lesson.strategies && lesson.strategies.length > 0 && (
        <div className="detail-section">
          <h4>Strategies in this Lesson</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lesson.strategies.map(s => (
              <Link key={s.id} to={`/strategies/${s.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '8px 12px', background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius)', fontSize: 14,
                  display: 'flex', gap: 8, alignItems: 'center',
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.paper_ref}</span>
                  <span>{s.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {lesson.quizzes && lesson.quizzes.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {lesson.quizzes.map(q => (
            <Link key={q.id} to={`/quiz/${q.id}`}>
              <button className="btn btn-primary" style={{ marginRight: 12 }}>
                Take Quiz: {q.title}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
