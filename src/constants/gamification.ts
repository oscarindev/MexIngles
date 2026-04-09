// Gamification constants
export const XP_VALUES = {
  LESSON_COMPLETE: 10,
  LESSON_PERFECT: 5, // bonus for no mistakes
  EXERCISE_CORRECT: 1,
  REVIEW_COMPLETE: 5,
  STORY_COMPLETE: 15,
  STREAK_BONUS: 2, // per day of streak (capped)
  STREAK_BONUS_CAP: 20,
  CHALLENGE_WIN: 20,
  ACHIEVEMENT_BONUS: 10,
};

export const HEARTS = {
  MAX: 5,
  REFILL_INTERVAL_MINUTES: 30, // one heart every 30 min
  COST_PER_MISTAKE: 1,
};

export const STREAK = {
  FREEZE_MAX: 2,
  FREEZE_COST_GEMS: 10,
};

export const DAILY_GOALS = [10, 20, 30, 50]; // XP options

export const LEAGUES = [
  { id: 'bronce', name: 'Bronce', minXP: 0, icon: '🥉' },
  { id: 'plata', name: 'Plata', minXP: 500, icon: '🥈' },
  { id: 'oro', name: 'Oro', minXP: 1500, icon: '🥇' },
  { id: 'diamante', name: 'Diamante', minXP: 5000, icon: '💎' },
  { id: 'corona', name: 'Corona', minXP: 15000, icon: '👑' },
];

export const ACHIEVEMENTS = [
  // Streak achievements
  { slug: 'streak_3', titleEs: 'Racha de 3 dias', type: 'streak_days', value: 3, icon: '🔥' },
  { slug: 'streak_7', titleEs: 'Racha de 7 dias', type: 'streak_days', value: 7, icon: '🔥' },
  { slug: 'streak_30', titleEs: 'Racha de 30 dias', type: 'streak_days', value: 30, icon: '🔥' },
  { slug: 'streak_100', titleEs: 'Racha de 100 dias', type: 'streak_days', value: 100, icon: '🔥' },
  { slug: 'streak_365', titleEs: 'Racha de 365 dias', type: 'streak_days', value: 365, icon: '🏆' },

  // Lesson achievements
  { slug: 'lessons_1', titleEs: 'Primera leccion', type: 'lessons_completed', value: 1, icon: '📖' },
  { slug: 'lessons_10', titleEs: '10 lecciones', type: 'lessons_completed', value: 10, icon: '📚' },
  { slug: 'lessons_50', titleEs: '50 lecciones', type: 'lessons_completed', value: 50, icon: '📚' },
  { slug: 'lessons_100', titleEs: '100 lecciones', type: 'lessons_completed', value: 100, icon: '🎓' },

  // XP achievements
  { slug: 'xp_100', titleEs: '100 XP', type: 'xp_total', value: 100, icon: '⭐' },
  { slug: 'xp_500', titleEs: '500 XP', type: 'xp_total', value: 500, icon: '⭐' },
  { slug: 'xp_1000', titleEs: '1000 XP', type: 'xp_total', value: 1000, icon: '🌟' },
  { slug: 'xp_5000', titleEs: '5000 XP', type: 'xp_total', value: 5000, icon: '💫' },

  // Perfect scores
  { slug: 'perfect_1', titleEs: 'Primera perfeccion', type: 'perfect_lessons', value: 1, icon: '💯' },
  { slug: 'perfect_10', titleEs: '10 perfectas', type: 'perfect_lessons', value: 10, icon: '💯' },

  // Vocabulary
  { slug: 'words_50', titleEs: '50 palabras', type: 'words_learned', value: 50, icon: '💬' },
  { slug: 'words_200', titleEs: '200 palabras', type: 'words_learned', value: 200, icon: '💬' },
  { slug: 'words_500', titleEs: '500 palabras', type: 'words_learned', value: 500, icon: '🗣️' },

  // Stories
  { slug: 'stories_1', titleEs: 'Primera historia', type: 'stories_completed', value: 1, icon: '📕' },
  { slug: 'stories_10', titleEs: '10 historias', type: 'stories_completed', value: 10, icon: '📗' },
];
