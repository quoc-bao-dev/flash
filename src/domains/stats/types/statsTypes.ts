export interface DailyStats {
  date: string; // YYYY-MM-DD format
  wordsLearned: number;
  timeSpent: number; // in minutes
  quizzesTaken: number;
  accuracy: number; // percentage
}

export interface LearningStreak {
  current: number;
  longest: number;
  lastStudyDate: string;
}

export interface StatsStore {
  dailyStats: DailyStats[];
  totalWordsLearned: number;
  totalTimeSpent: number;
  totalQuizzesTaken: number;
  averageAccuracy: number;
  learningStreak: LearningStreak;
  weeklyGoal: number;
  monthlyGoal: number;
  
  // Actions
  updateDailyStats: (stats: Partial<DailyStats>) => void;
  addStudySession: (wordsLearned: number, timeSpent: number, accuracy: number) => void;
  addQuizResult: (accuracy: number, timeSpent: number) => void;
  setWeeklyGoal: (goal: number) => void;
  setMonthlyGoal: (goal: number) => void;
  getWeeklyProgress: () => number;
  getMonthlyProgress: () => number;
  getDailyStats: (date: string) => DailyStats | null;
  getWeeklyStats: () => DailyStats[];
  getMonthlyStats: () => DailyStats[];
  updateStreak: () => void;
}