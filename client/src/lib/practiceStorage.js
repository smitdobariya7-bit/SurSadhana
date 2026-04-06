const TASKS_PREFIX = 'sursadhana_tasks';
const PRACTICE_PREFIX = 'sursadhana_practice_metrics';

const getUserStorageId = (user) => {
  if (!user) return 'guest';
  return user.id || user.email || user._id || 'guest';
};

export const getTasksStorageKey = (user) => `${TASKS_PREFIX}:${getUserStorageId(user)}`;

export const getPracticeMetricsStorageKey = (user) =>
  `${PRACTICE_PREFIX}:${getUserStorageId(user)}`;

export const loadTasksForUser = (user) => {
  try {
    const raw = localStorage.getItem(getTasksStorageKey(user));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveTasksForUser = (user, tasks) => {
  localStorage.setItem(getTasksStorageKey(user), JSON.stringify(tasks));
};

export const createEmptyPracticeMetrics = () => ({
  totalPracticeSeconds: 0,
  tanpuraPracticeSeconds: 0,
  sessionCount: 0,
  lastPracticedAt: null,
  practiceDays: {},
});

export const loadPracticeMetricsForUser = (user) => {
  try {
    const raw = localStorage.getItem(getPracticeMetricsStorageKey(user));
    if (!raw) return createEmptyPracticeMetrics();

    const parsed = JSON.parse(raw);
    return {
      ...createEmptyPracticeMetrics(),
      ...parsed,
      practiceDays: parsed.practiceDays || {},
    };
  } catch {
    return createEmptyPracticeMetrics();
  }
};

export const savePracticeMetricsForUser = (user, metrics) => {
  localStorage.setItem(getPracticeMetricsStorageKey(user), JSON.stringify(metrics));
};

export const buildUpdatedPracticeMetrics = (currentMetrics, deltaSeconds) => {
  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10);
  const practiceDays = currentMetrics.practiceDays || {};

  return {
    ...createEmptyPracticeMetrics(),
    ...currentMetrics,
    totalPracticeSeconds: (currentMetrics.totalPracticeSeconds || 0) + deltaSeconds,
    tanpuraPracticeSeconds: (currentMetrics.tanpuraPracticeSeconds || 0) + deltaSeconds,
    sessionCount: currentMetrics.sessionCount || 0,
    lastPracticedAt: now.toISOString(),
    practiceDays: {
      ...practiceDays,
      [dayKey]: (practiceDays[dayKey] || 0) + deltaSeconds,
    },
  };
};
