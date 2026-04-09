interface PerformanceWindow {
  recentResults: boolean[];
  averageTimeMs: number;
  currentDifficulty: number;
}

export function calculateAdaptiveDifficulty(performance: PerformanceWindow): number {
  if (performance.recentResults.length === 0) return performance.currentDifficulty;

  const accuracy =
    performance.recentResults.filter(Boolean).length / performance.recentResults.length;

  let newDifficulty = performance.currentDifficulty;

  if (accuracy >= 0.9 && performance.averageTimeMs < 8000) {
    newDifficulty = Math.min(5, newDifficulty + 1);
  } else if (accuracy < 0.5) {
    newDifficulty = Math.max(1, newDifficulty - 1);
  }

  return newDifficulty;
}
