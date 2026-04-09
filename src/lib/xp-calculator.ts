import { XP_VALUES } from '../constants/gamification';

export function calculateLessonXP(
  baseXP: number,
  accuracy: number,
  streakDays: number,
  isPerfect: boolean
): number {
  let xp = baseXP;

  if (isPerfect) {
    xp += XP_VALUES.LESSON_PERFECT;
  }

  // Streak bonus: 2 XP per day, capped at 20
  const streakBonus = Math.min(
    streakDays * XP_VALUES.STREAK_BONUS,
    XP_VALUES.STREAK_BONUS_CAP
  );
  xp += streakBonus;

  return Math.round(xp);
}

export function calculateReviewXP(correctAnswers: number, totalCards: number): number {
  if (totalCards === 0) return 0;
  const accuracy = correctAnswers / totalCards;
  return Math.round(XP_VALUES.REVIEW_COMPLETE * accuracy);
}

export function getStarsFromAccuracy(accuracy: number): number {
  if (accuracy >= 100) return 3;
  if (accuracy >= 80) return 2;
  if (accuracy >= 50) return 1;
  return 0;
}
