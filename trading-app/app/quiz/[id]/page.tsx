'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProgress } from '@/lib/useProgress';

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  passing_score: number;
  questions: Question[];
}

export default function QuizPage() {
  const params = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const { markQuizPassed, getQuizProgress } = useProgress();

  useEffect(() => {
    fetch(`/api/quizzes?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  }, [params.id]);

  if (!quiz) return <div className="loading">Loading...</div>;

  const handleSubmit = async () => {
    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: quiz.id, answers }),
    });
    const data = await res.json();
    setResults(data.results);
    setScore(data.score);
    setSubmitted(true);
    
    if (data.passed) {
      markQuizPassed(quiz.id, data.score);
    }
  };

  const scorePercent = Math.round(score * 100);

  if (submitted) {
    return (
      <div className="detail-page">
        <Link href={`/lessons/${params.id}`} className="back-link">
          ← Back to Lesson
        </Link>
        
        <div className={`quiz-result ${scorePercent >= quiz.passing_score * 100 ? 'passed' : 'failed'}`}>
          <h3>{scorePercent >= quiz.passing_score * 100 ? 'Passed!' : 'Failed'}</h3>
          <p>Your score: {scorePercent}% (passing: {quiz.passing_score * 100}%)</p>
          
          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={() => { setSubmitted(false); setAnswers({ }); }}
            style={{ marginTop: 16 }}
          >
            Try Again
          </button>
        </div>

        <div style={{ marginTop: 32 }}>
          {quiz.questions.map((q) => {
            const result = results.find((r) => r.questionId === q.id);
            const selected = answers[q.id];
            return (
              <div key={q.id} className="quiz-question">
                <h4>{q.question_text}</h4>
                {q.options.map((opt) => (
                  <div
                    key={opt}
                    className={`quiz-option ${selected === opt ? 'selected' : ''} ${result ? (opt === q.correct_answer ? 'correct' : selected === opt ? 'incorrect' : '') : ''}`}
                  >
                    {opt}
                  </div>
                ))}
                {selected !== q.correct_answer && (
                  <div className="quiz-explanation">
                    Correct answer: {q.correct_answer}
                  </div>
                )}
                <div className="quiz-explanation" style={{ marginTop: 8 }}>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Link href={`/lessons/${params.id}`} className="back-link">
        ← Back to Lesson
      </Link>

      <h2>{quiz.title}</h2>
      <p style={{ marginBottom: 24 }}>Select your answers and submit to see your score.</p>

      {quiz.questions.map((q) => (
        <div key={q.id} className="quiz-question">
          <h4>{q.question_text}</h4>
          {q.options.map((opt) => (
            <button
              type="button"
              key={opt}
              className={`quiz-option ${answers[q.id] === opt ? 'selected' : ''}`}
              onClick={() => setAnswers({ ...answers, [q.id]: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      ))}

      <button 
        type="button"
        className="btn btn-primary" 
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== quiz.questions.length}
      >
        Submit Answers
      </button>
    </div>
  );
}