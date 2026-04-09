export interface Achievement {
  id: string;
  slug: string;
  titleEs: string;
  descriptionEs: string;
  icon: string;
  category: 'streak' | 'lessons' | 'xp' | 'social' | 'special';
  requirementType: string;
  requirementValue: number;
  xpReward: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement: Achievement;
}
