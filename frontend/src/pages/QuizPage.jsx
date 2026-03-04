import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function QuizPage() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)

  useEffect(() => {
    api.getQuiz(id).then(setQuiz)
    setAnswers({})
    setResults(null)
  }, [id])

  const handleSelect = (questionId, option) => {
    if (results) return
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const handleSubmit = async () => {
    const res = await api.submitQuiz(id, answers)
    setResults(res)
  }

  if (!quiz) return <p>Loading...</p>

  return (
    <div className="detail-page">
      <Link to={`/lessons/${quiz.lesson_id}`} className="back-link">← Back to Lesson</Link>

      <h2>{quiz.title}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        {results
          ? `Score: ${results.correct}/${results.total} (${Math.round(results.score * 100)}%) — ${results.passed ? 'PASSED' : 'Not passed'}`
          : `${quiz.questions.length} questions · ${Math.round(quiz.passing_score * 100)}% to pass`}
      </p>

      {results && (
        <div className="detail-section" style={{
          borderColor: results.passed ? 'var(--accent-green)' : 'var(--accent-red)',
          marginBottom: 24,
        }}>
          <h4 style={{ color: results.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {results.passed ? 'Congratulations! You passed!' : 'Keep studying — you can retry!'}
          </h4>
        </div>
      )}

      {quiz.questions.map((q, qi) => {
        const qResult = results?.results?.find(r => r.question_id === q.id)
        return (
          <div key={q.id} className="quiz-question">
            <h4>Q{qi + 1}. {q.question_text}</h4>
            {q.options?.map((opt, oi) => {
              let cls = 'quiz-option'
              if (results) {
                if (opt === qResult?.correct_answer) cls += ' correct'
                else if (opt === qResult?.user_answer && !qResult?.correct) cls += ' incorrect'
              } else if (answers[q.id] === opt) {
                cls += ' selected'
              }
              return (
                <button key={oi} className={cls} onClick={() => handleSelect(q.id, opt)}>
                  {opt}
                </button>
              )
            })}
            {qResult && qResult.explanation && (
              <div className="quiz-explanation">{qResult.explanation}</div>
            )}
          </div>
        )
      })}

      {!results && (
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < quiz.questions.length}
          style={{ marginTop: 16, opacity: Object.keys(answers).length < quiz.questions.length ? 0.5 : 1 }}
        >
          Submit Answers
        </button>
      )}

      {results && !results.passed && (
        <button
          className="btn btn-secondary"
          onClick={() => { setResults(null); setAnswers({}) }}
          style={{ marginTop: 16 }}
        >
          Retry Quiz
        </button>
      )}
    </div>
  )
}
