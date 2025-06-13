import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GamificationStore, Badge, Achievement } from '../types/gamificationTypes';

const defaultBadges: Badge[] = [
  {
    id: 'first-word',
    name: 'First Steps',
    description: 'Learn your first word',
    icon: 'Star',
    color: '#FFD700',
    requirement: 1,
    type: 'words-learned',
    isUnlocked: false,
  },
  {
    id: 'word-master-10',
    name: 'Word Apprentice',
    description: 'Learn 10 words',
    icon: 'BookOpen',
    color: '#4ECDC4',
    requirement: 10,
    type: 'words-learned',
    isUnlocked: false,
  },
  {
    id: 'word-master-50',
    name: 'Word Scholar',
    description: 'Learn 50 words',
    icon: 'GraduationCap',
    color: '#45B7D1',
    requirement: 50,
    type: 'words-learned',
    isUnlocked: false,
  },
  {
    id: 'quiz-streak-5',
    name: 'Quiz Champion',
    description: 'Complete 5 quizzes in a row',
    icon: 'Trophy',
    color: '#FF6B6B',
    requirement: 5,
    type: 'quiz-streak',
    isUnlocked: false,
  },
  {
    id: 'daily-streak-7',
    name: 'Weekly Warrior',
    description: 'Study for 7 days straight',
    icon: 'Calendar',
    color: '#96CEB4',
    requirement: 7,
    type: 'daily-streak',
    isUnlocked: false,
  },
  {
    id: 'accuracy-master',
    name: 'Accuracy Master',
    description: 'Achieve 90% accuracy in 10 quizzes',
    icon: 'Target',
    color: '#FECA57',
    requirement: 90,
    type: 'accuracy',
    isUnlocked: false,
  },
];

const defaultAchievements: Achievement[] = [
  {
    id: 'vocabulary-builder',
    title: 'Vocabulary Builder',
    description: 'Learn 100 new words',
    points: 500,
    type: 'learning',
    isCompleted: false,
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 50 quizzes',
    points: 300,
    type: 'quiz',
    isCompleted: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'consistency-king',
    title: 'Consistency King',
    description: 'Study for 30 consecutive days',
    points: 1000,
    type: 'streak',
    isCompleted: false,
    progress: 0,
    maxProgress: 30,
  },
];

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      level: 1,
      experience: 0,
      experienceToNext: 100,
      totalPoints: 0,
      badges: defaultBadges,
      achievements: defaultAchievements,
      dailyGoalStreak: 0,

      addExperience: (amount) => {
        set((state) => {
          const newExperience = state.experience + amount;
          const newLevel = get().calculateLevel(newExperience);
          const experienceForNextLevel = get().getExperienceForLevel(newLevel + 1);
          
          return {
            experience: newExperience,
            level: newLevel,
            experienceToNext: experienceForNextLevel - newExperience,
          };
        });
        
        get().checkBadges();
        get().checkAchievements();
      },

      addPoints: (amount) => {
        set((state) => ({
          totalPoints: state.totalPoints + amount,
        }));
      },

      checkBadges: () => {
        // Implementation would check current stats and unlock badges
        // This is a simplified version
        set((state) => {
          const updatedBadges = state.badges.map((badge) => {
            if (!badge.isUnlocked) {
              // Check if badge requirements are met
              // This would integrate with other stores to check actual progress
              return badge;
            }
            return badge;
          });
          
          return { badges: updatedBadges };
        });
      },

      checkAchievements: () => {
        // Implementation would check current progress and complete achievements
        set((state) => {
          const updatedAchievements = state.achievements.map((achievement) => {
            if (!achievement.isCompleted && achievement.progress >= achievement.maxProgress) {
              return {
                ...achievement,
                isCompleted: true,
                completedAt: new Date(),
              };
            }
            return achievement;
          });
          
          return { achievements: updatedAchievements };
        });
      },

      unlockBadge: (badgeId) => {
        set((state) => ({
          badges: state.badges.map((badge) =>
            badge.id === badgeId
              ? { ...badge, isUnlocked: true, unlockedAt: new Date() }
              : badge
          ),
        }));
      },

      completeAchievement: (achievementId) => {
        set((state) => {
          const achievement = state.achievements.find((a) => a.id === achievementId);
          if (achievement && !achievement.isCompleted) {
            get().addPoints(achievement.points);
            get().addExperience(achievement.points / 2);
          }
          
          return {
            achievements: state.achievements.map((a) =>
              a.id === achievementId
                ? { ...a, isCompleted: true, completedAt: new Date() }
                : a
            ),
          };
        });
      },

      updateAchievementProgress: (achievementId, progress) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === achievementId
              ? { ...achievement, progress: Math.min(progress, achievement.maxProgress) }
              : achievement
          ),
        }));
      },

      calculateLevel: (experience) => {
        return Math.floor(experience / 100) + 1;
      },

      getExperienceForLevel: (level) => {
        return (level - 1) * 100;
      },
    }),
    {
      name: 'gamification-storage',
    }
  )
);