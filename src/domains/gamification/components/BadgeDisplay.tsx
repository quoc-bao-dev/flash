import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Badge } from '../types/gamificationTypes';
import { useThemeStore } from '../../ui/store/themeStore';

interface BadgeDisplayProps {
  badges: Badge[];
  showAll?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges, showAll = false }) => {
  const { settings } = useThemeStore();
  
  const displayBadges = showAll ? badges : badges.filter(badge => badge.isUnlocked);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Badges</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayBadges.map((badge, index) => {
          const IconComponent = (Icons as any)[badge.icon] || Icons.Award;
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-4 rounded-xl text-center transition-all duration-200
                ${badge.isUnlocked
                  ? settings.mode === 'dark'
                    ? 'bg-gray-800 border border-gray-700 shadow-lg'
                    : 'bg-white border border-gray-200 shadow-lg'
                  : 'opacity-50 grayscale'
                }
              `}
            >
              {/* Badge Icon */}
              <div
                className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 shadow-md
                  ${badge.isUnlocked ? '' : 'bg-gray-300 dark:bg-gray-600'}
                `}
                style={badge.isUnlocked ? { backgroundColor: badge.color + '20', color: badge.color } : {}}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Badge Info */}
              <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {badge.description}
              </p>

              {/* Unlock Date */}
              {badge.isUnlocked && badge.unlockedAt && (
                <p className="text-xs text-primary-500 mt-2">
                  Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                </p>
              )}

              {/* Progress for locked badges */}
              {!badge.isUnlocked && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    0 / {badge.requirement}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                    <div className="bg-primary-500 h-1 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              )}

              {/* Unlock Animation */}
              {badge.isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Icons.Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!showAll && badges.filter(b => !b.isUnlocked).length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {badges.filter(b => !b.isUnlocked).length} more badges to unlock
          </p>
        </div>
      )}
    </div>
  );
};