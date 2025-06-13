import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Clock, Target, Flame, Trophy, BookOpen } from 'lucide-react';
import { useStatsStore } from '../store/statsStore';
import { useGamificationStore } from '../../gamification/store/gamificationStore';
import { useThemeStore } from '../../ui/store/themeStore';

export const StatsOverview: React.FC = () => {
  const { settings } = useThemeStore();
  const {
    totalWordsLearned,
    totalTimeSpent,
    averageAccuracy,
    learningStreak,
    getWeeklyProgress,
    getMonthlyProgress,
  } = useStatsStore();
  
  const { level, experience, experienceToNext } = useGamificationStore();

  const stats = [
    {
      label: 'Words Learned',
      value: totalWordsLearned,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Study Time',
      value: `${Math.floor(totalTimeSpent / 60)}h ${totalTimeSpent % 60}m`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Accuracy',
      value: `${Math.round(averageAccuracy)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      label: 'Current Streak',
      value: `${learningStreak.current} days`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  return (
    <div className="space-y-6" data-tutorial="stats">
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          p-6 rounded-2xl
          ${settings.mode === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
          }
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Level Progress</h3>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-xl">Level {level}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{experience} XP</span>
            <span>{experienceToNext} XP to next level</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(experience / (experience + experienceToNext)) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-xl text-center
                ${settings.mode === 'dark'
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
                }
              `}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Goals Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`
            p-6 rounded-2xl
            ${settings.mode === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
            }
          `}
        >
          <h3 className="text-lg font-semibold mb-4">Weekly Goal</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getWeeklyProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(getWeeklyProgress(), 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`
            p-6 rounded-2xl
            ${settings.mode === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
            }
          `}
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Goal</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getMonthlyProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(getMonthlyProgress(), 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};