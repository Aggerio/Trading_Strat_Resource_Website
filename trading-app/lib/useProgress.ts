import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'trading-strategy-progress';

export interface UserProgress {
  strategyId: number;
  status: 'not_started' | 'studied' | 'completed';
  lastAccessed: string;
}

export interface LessonProgress {
  lessonId: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessed: string;
}

export interface QuizProgress {
  quizId: number;
  status: 'not_started' | 'passed' | 'failed';
  score: number | null;
  attempts: number;
  lastAccessed: string;
}

interface ProgressData {
  strategies: UserProgress[];
  lessons: LessonProgress[];
  quizzes: QuizProgress[];
}

function loadFromStorage(): ProgressData {
  if (typeof window === 'undefined') {
    return { strategies: [], lessons: [], quizzes: [] };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { strategies: [], lessons: [], quizzes: [] };
  } catch {
    return { strategies: [], lessons: [], quizzes: [] };
  }
}

function saveToStorage(data: ProgressData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>({
    strategies: [],
    lessons: [],
    quizzes: [],
  });

  useEffect(() => {
    setProgress(loadFromStorage());
  }, []);

  const markStrategyStudied = useCallback((strategyId: number) => {
    setProgress((prev) => {
      const strategies = prev.strategies.filter((s) => s.strategyId !== strategyId);
      strategies.push({
        strategyId,
        status: 'studied',
        lastAccessed: new Date().toISOString(),
      });
      const newData = { ...prev, strategies };
      saveToStorage(newData);
      return newData;
    });
  }, []);

  const markLessonCompleted = useCallback((lessonId: number) => {
    setProgress((prev) => {
      const lessons = prev.lessons.filter((l) => l.lessonId !== lessonId);
      lessons.push({
        lessonId,
        status: 'completed',
        lastAccessed: new Date().toISOString(),
      });
      const newData = { ...prev, lessons };
      saveToStorage(newData);
      return newData;
    });
  }, []);

  const markQuizPassed = useCallback((quizId: number, score: number) => {
    setProgress((prev) => {
      const quizzes = prev.quizzes.filter((q) => q.quizId !== quizId);
      const existing = prev.quizzes.find((q) => q.quizId === quizId);
      quizzes.push({
        quizId,
        status: 'passed',
        score,
        attempts: existing ? existing.attempts + 1 : 1,
        lastAccessed: new Date().toISOString(),
      });
      const newData = { ...prev, quizzes };
      saveToStorage(newData);
      return newData;
    });
  }, []);

  const getStrategyStatus = useCallback(
    (strategyId: number): 'not_started' | 'studied' | 'completed' => {
      const p = progress.strategies.find((s) => s.strategyId === strategyId);
      return p?.status || 'not_started';
    },
    [progress.strategies]
  );

  const getLessonStatus = useCallback(
    (lessonId: number): 'not_started' | 'in_progress' | 'completed' => {
      const p = progress.lessons.find((l) => l.lessonId === lessonId);
      return p?.status || 'not_started';
    },
    [progress.lessons]
  );

  const getQuizProgress = useCallback(
    (quizId: number): QuizProgress | null => {
      return progress.quizzes.find((q) => q.quizId === quizId) || null;
    },
    [progress.quizzes]
  );

  const getSummary = useCallback(() => {
    const strategiesStudied = progress.strategies.filter(
      (s) => s.status === 'studied' || s.status === 'completed'
    ).length;
    const lessonsCompleted = progress.lessons.filter(
      (l) => l.status === 'completed'
    ).length;
    const quizzesPassed = progress.quizzes.filter((q) => q.status === 'passed').length;
    const totalQuizzes = 14;
    const avgScore =
      progress.quizzes.length > 0
        ? progress.quizzes.reduce((sum, q) => sum + (q.score || 0), 0) /
          progress.quizzes.filter((q) => q.score !== null).length
        : 0;

    return {
      strategiesStudied,
      lessonsCompleted,
      quizzesPassed,
      totalQuizzes,
      averageQuizScore: Math.round(avgScore * 100) / 100,
    };
  }, [progress]);

  return {
    progress,
    markStrategyStudied,
    markLessonCompleted,
    markQuizPassed,
    getStrategyStatus,
    getLessonStatus,
    getQuizProgress,
    getSummary,
  };
}