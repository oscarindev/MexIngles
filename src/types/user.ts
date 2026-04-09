export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  nativeLanguage: string;
  targetLanguage: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyGoal: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  notificationEnabled: boolean;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserGamification {
  userId: string;
  totalXp: number;
  weeklyXp: number;
  monthlyXp: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezeCount: number;
  lastActivityDate: string | null;
  hearts: number;
  heartsLastRefill: string;
  gems: number;
  currentLeague: string;
}

export interface UserLessonProgress {
  userId: string;
  lessonId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  stars: number;
  bestScore: number;
  attempts: number;
  xpEarned: number;
  completedAt: string | null;
  lastAttemptAt: string | null;
}

export interface UserUnitProgress {
  userId: string;
  unitId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  lessonsCompleted: number;
  crownLevel: number;
}

export interface UserReviewCard {
  id: string;
  userId: string;
  vocabularyId: string;
  easinessFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: string;
  lastReviewAt: string | null;
  totalReviews: number;
  correctReviews: number;
}

export interface UserDailyXp {
  userId: string;
  activityDate: string;
  xpEarned: number;
  lessonsCompleted: number;
  timeSpentMinutes: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  xpEarned: number;
  rank: number;
  league: string;
}
