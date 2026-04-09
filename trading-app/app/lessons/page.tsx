'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/useProgress';

interface Lesson {
  id: number;
  module: string;
  order: number;
  title: string;
  subtitle: string;
  difficulty: string;
}

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [module, setModule] = useState('');
  const { getLessonStatus } = useProgress();

  useEffect(() => {
    const params = module ? `?module=${module}` : '';
    fetch(`/api/lessons${params}`)
      .then((res) => res.json())
      .then(setLessons);
  }, [module]);

  const optionsLessons = lessons.filter((l) => l.module === 'Options');
  const stocksLessons = lessons.filter((l) => l.module === 'Stocks');

  return (
    <div>
      <div className="page-header">
        <h2>Learning Path</h2>
        <p>Progressive lessons from beginner to advanced</p>
      </div>

      <div className="filters-bar">
        <select value={module} onChange={(e) => setModule(e.target.value)}>
          <option value="">All Modules</option>
          <option value="Options">Options</option>
          <option value="Stocks">Stocks</option>
        </select>
      </div>

      {!module && (
        <>
          <h3 style={{ marginBottom: 16, color: 'var(--accent-purple)' }}>Options Strategies</h3>
          {optionsLessons.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            return (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} style={{ textDecoration: 'none' }}>
                <div className="lesson-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>{lesson.title}</h4>
                    {status === 'completed' && <span className="badge badge-green">Completed</span>}
                  </div>
                  <p>{lesson.subtitle}</p>
                </div>
              </Link>
            );
          })}

          <h3 style={{ marginTop: 32, marginBottom: 16, color: 'var(--accent-yellow)' }}>Stock Strategies</h3>
          {stocksLessons.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            return (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} style={{ textDecoration: 'none' }}>
                <div className="lesson-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>{lesson.title}</h4>
                    {status === 'completed' && <span className="badge badge-green">Completed</span>}
                  </div>
                  <p>{lesson.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </>
      )}

      {module === 'Options' && optionsLessons.map((lesson) => {
        const status = getLessonStatus(lesson.id);
        return (
          <Link key={lesson.id} href={`/lessons/${lesson.id}`} style={{ textDecoration: 'none' }}>
            <div className="lesson-item">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>{lesson.title}</h4>
                {status === 'completed' && <span className="badge badge-green">Completed</span>}
              </div>
              <p>{lesson.subtitle}</p>
            </div>
          </Link>
        );
      })}

      {module === 'Stocks' && stocksLessons.map((lesson) => {
        const status = getLessonStatus(lesson.id);
        return (
          <Link key={lesson.id} href={`/lessons/${lesson.id}`} style={{ textDecoration: 'none' }}>
            <div className="lesson-item">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>{lesson.title}</h4>
                {status === 'completed' && <span className="badge badge-green">Completed</span>}
              </div>
              <p>{lesson.subtitle}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}