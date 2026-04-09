// SM-2 Spaced Repetition Algorithm
// Maps exercise performance to review intervals

export interface SM2Card {
  easinessFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: Date;
  lastReviewAt: Date | null;
}

export interface SM2Result {
  easinessFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: Date;
}

/**
 * SM-2 quality mapping for MexIngles:
 *   Incorrect, no partial match    -> quality 1
 *   Incorrect, close answer        -> quality 2
 *   Correct, took > 15 seconds     -> quality 3
 *   Correct, took 8-15 seconds     -> quality 4
 *   Correct, took < 8 seconds      -> quality 5
 */
export function calculateSM2(card: SM2Card, quality: number): SM2Result {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let { easinessFactor, intervalDays, repetitions } = card;

  // Update easiness factor
  const newEF = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  easinessFactor = Math.max(1.3, newEF);

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easinessFactor);
    }
  }

  intervalDays = Math.min(365, intervalDays);

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return { easinessFactor, intervalDays, repetitions, nextReviewAt };
}

export function exerciseResultToQuality(
  isCorrect: boolean,
  timeSpentMs: number,
  isCloseAnswer: boolean = false
): number {
  if (!isCorrect) return isCloseAnswer ? 2 : 1;
  if (timeSpentMs < 8000) return 5;
  if (timeSpentMs < 15000) return 4;
  return 3;
}

export function isDueForReview(card: SM2Card): boolean {
  return new Date() >= new Date(card.nextReviewAt);
}

export function createNewCard(): SM2Card {
  return {
    easinessFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReviewAt: new Date(),
    lastReviewAt: null,
  };
}
