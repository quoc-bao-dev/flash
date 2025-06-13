import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Users, BookOpen } from 'lucide-react';
import { Achievement } from '../types/gamificationTypes';
import { useThemeStore } from '../../ui/store/themeStore';

interface AchievementDisplayProps {
  achievements: Achievement[];
}

export const AchievementDisplay: React.FC<AchievementDisplayProps> = ({ achievements }) => {
  const { settings } = useThemeStore();

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'learning': return BookOpen;
      case 'quiz': return Target;
      case 'streak': return Trophy;
      case 'social': return Users;
      default: return Trophy;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'learning': return '#3B82F6';
      case 'quiz': return '#10B981';
      case 'streak': return '#F59E0B';
      case 'social': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Achievements</h3>
      
      <div className="space-y-3">
        {achievements.map((achievement, index) => {
          const IconComponent = getAchievementIcon(achievement.type);
          const color = getAchievementColor(achievement.type);
          const progress = (achievement.progress / achievement.maxProgress) * 100;
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-xl border transition-all duration-200
                ${achievement.isCompleted
                  ? settings.mode === 'dark'
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-green-50 border-green-200'
                  : settings.mode === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: color + '20', color }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary-500">
                        +{achievement.points} XP
                      </span>
                      {achievement.isCompleted && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {achievement.description}
                  </p>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Progress: {achievement.progress} / {achievement.maxProgress}
                      </span>
                      <span className="font-medium">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Completion Date */}
                  {achievement.isCompleted && achievement.completedAt && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      Completed on {new Date(achievement.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};