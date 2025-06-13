import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StatsStore, DailyStats, LearningStreak } from '../types/statsTypes';

const today = new Date().toISOString().split('T')[0];

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      dailyStats: [],
      totalWordsLearned: 0,
      totalTimeSpent: 0,
      totalQuizzesTaken: 0,
      averageAccuracy: 0,
      learningStreak: {
        current: 0,
        longest: 0,
        lastStudyDate: '',
      },
      weeklyGoal: 50, // words per week
      monthlyGoal: 200, // words per month

      updateDailyStats: (statsUpdate) => {
        set((state) => {
          const existingIndex = state.dailyStats.findIndex(
            (stat) => stat.date === statsUpdate.date || stat.date === today
          );
          
          let updatedStats: DailyStats[];
          if (existingIndex >= 0) {
            updatedStats = state.dailyStats.map((stat, index) =>
              index === existingIndex ? { ...stat, ...statsUpdate } : stat
            );
          } else {
            const newStat: DailyStats = {
              date: today,
              wordsLearned: 0,
              timeSpent: 0,
              quizzesTaken: 0,
              accuracy: 0,
              ...statsUpdate,
            };
            updatedStats = [...state.dailyStats, newStat];
          }
          
          return { dailyStats: updatedStats };
        });
      },

      addStudySession: (wordsLearned, timeSpent, accuracy) => {
        set((state) => {
          get().updateDailyStats({
            date: today,
            wordsLearned: (get().getDailyStats(today)?.wordsLearned || 0) + wordsLearned,
            timeSpent: (get().getDailyStats(today)?.timeSpent || 0) + timeSpent,
            accuracy: ((get().getDailyStats(today)?.accuracy || 0) + accuracy) / 2,
          });
          
          get().updateStreak();
          
          return {
            totalWordsLearned: state.totalWordsLearned + wordsLearned,
            totalTimeSpent: state.totalTimeSpent + timeSpent,
            averageAccuracy: (state.averageAccuracy + accuracy) / 2,
          };
        });
      },

      addQuizResult: (accuracy, timeSpent) => {
        set((state) => {
          get().updateDailyStats({
            date: today,
            quizzesTaken: (get().getDailyStats(today)?.quizzesTaken || 0) + 1,
            timeSpent: (get().getDailyStats(today)?.timeSpent || 0) + timeSpent,
            accuracy: ((get().getDailyStats(today)?.accuracy || 0) + accuracy) / 2,
          });
          
          return {
            totalQuizzesTaken: state.totalQuizzesTaken + 1,
            totalTimeSpent: state.totalTimeSpent + timeSpent,
            averageAccuracy: (state.averageAccuracy + accuracy) / 2,
          };
        });
      },

      setWeeklyGoal: (goal) => {
        set({ weeklyGoal: goal });
      },

      setMonthlyGoal: (goal) => {
        set({ monthlyGoal: goal });
      },

      getWeeklyProgress: () => {
        const weeklyStats = get().getWeeklyStats();
        const totalWords = weeklyStats.reduce((sum, stat) => sum + stat.wordsLearned, 0);
        return Math.min((totalWords / get().weeklyGoal) * 100, 100);
      },

      getMonthlyProgress: () => {
        const monthlyStats = get().getMonthlyStats();
        const totalWords = monthlyStats.reduce((sum, stat) => sum + stat.wordsLearned, 0);
        return Math.min((totalWords / get().monthlyGoal) * 100, 100);
      },

      getDailyStats: (date) => {
        return get().dailyStats.find((stat) => stat.date === date) || null;
      },

      getWeeklyStats: () => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return get().dailyStats.filter((stat) => {
          const statDate = new Date(stat.date);
          return statDate >= weekAgo && statDate <= now;
        });
      },

      getMonthlyStats: () => {
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return get().dailyStats.filter((stat) => {
          const statDate = new Date(stat.date);
          return statDate >= monthAgo && statDate <= now;
        });
      },

      updateStreak: () => {
        set((state) => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          let newStreak = { ...state.learningStreak };
          
          if (state.learningStreak.lastStudyDate === yesterdayStr || state.learningStreak.lastStudyDate === today) {
            // Continue streak
            if (state.learningStreak.lastStudyDate === yesterdayStr) {
              newStreak.current++;
            }
          } else {
            // Reset streak
            newStreak.current = 1;
          }
          
          newStreak.longest = Math.max(newStreak.longest, newStreak.current);
          newStreak.lastStudyDate = today;
          
          return { learningStreak: newStreak };
        });
      },
    }),
    {
      name: 'stats-storage',
    }
  )
);