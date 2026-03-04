const BASE = '/api';

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}

export const api = {
  getStrategies: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return fetchJSON(`/strategies/${qs ? '?' + qs : ''}`);
  },
  getStrategy: (id) => fetchJSON(`/strategies/${id}`),
  getFilters: () => fetchJSON('/strategies/filters'),

  getLessons: (module) => fetchJSON(`/lessons/${module ? '?module=' + module : ''}`),
  getLesson: (id) => fetchJSON(`/lessons/${id}`),

  getQuiz: (id) => fetchJSON(`/quizzes/${id}`),
  submitQuiz: (id, answers) =>
    fetchJSON(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getGlossary: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return fetchJSON(`/glossary/${qs ? '?' + qs : ''}`);
  },
  getGlossaryCategories: () => fetchJSON('/glossary/categories'),

  getProgress: () => fetchJSON('/progress/'),
  markStudied: (strategyId) =>
    fetchJSON('/progress/study', {
      method: 'POST',
      body: JSON.stringify({ strategy_id: strategyId }),
    }),

  calculatePayoff: (data) =>
    fetchJSON('/simulator/payoff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
