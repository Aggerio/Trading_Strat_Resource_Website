'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProgress } from '@/lib/useProgress';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Lesson {
  id: number;
  module: string;
  order: number;
  title: string;
  subtitle: string;
  difficulty: string;
  content: string;
}

export default function LessonDetail() {
  const params = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getLessonStatus, markLessonCompleted } = useProgress();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/lessons?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!lesson) return <div className="error">Lesson not found</div>;

  const status = getLessonStatus(lesson.id);

  return (
    <div className="detail-page">
      <Link href="/lessons" className="back-link">
        ← Back to Lessons
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
        <div>
          <h2>{lesson.title}</h2>
          <div className="meta-row">
            <span className="badge badge-blue">{lesson.module}</span>
            <span className={`badge ${lesson.difficulty === 'beginner' ? 'badge-green' : lesson.difficulty === 'advanced' ? 'badge-red' : 'badge-yellow'}`}>
              {lesson.difficulty}
            </span>
            {status === 'completed' && <span className="badge badge-green">Completed</span>}
          </div>
        </div>
        {status !== 'completed' && (
          <button 
            type="button"
            className="btn btn-primary"
            onClick={() => markLessonCompleted(lesson.id)}
          >
            Mark as Completed
          </button>
        )}
      </div>

      <div className="detail-section">
        <MarkdownRenderer content={lesson.content} />
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href={`/quiz/${lesson.id}`} className="btn btn-secondary">
          Take Quiz →
        </Link>
      </div>
    </div>
  );
}