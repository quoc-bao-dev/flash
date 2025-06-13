export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: number;
  type: BadgeType;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export type BadgeType = 'words-learned' | 'quiz-streak' | 'daily-streak' | 'accuracy' | 'time-spent';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  type: AchievementType;
  isCompleted: boolean;
  completedAt?: Date;
  progress: number;
  maxProgress: number;
}

export type AchievementType = 'learning' | 'quiz' | 'streak' | 'social';

export interface GamificationStore {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  badges: Badge[];
  achievements: Achievement[];
  dailyGoalStreak: number;
  
  // Actions
  addExperience: (amount: number) => void;
  addPoints: (amount: number) => void;
  checkBadges: () => void;
  checkAchievements: () => void;
  unlockBadge: (badgeId: string) => void;
  completeAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  calculateLevel: (experience: number) => number;
  getExperienceForLevel: (level: number) => number;
}