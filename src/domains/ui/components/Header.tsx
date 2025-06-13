import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Settings, BookOpen } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const Header: React.FC = () => {
  const { settings, toggleTheme } = useThemeStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`
        sticky top-0 z-50 h-16 border-b transition-colors duration-300
        ${settings.mode === 'dark'
          ? 'bg-gray-800/95 border-gray-700 backdrop-blur-md'
          : 'bg-white/95 border-gray-200 backdrop-blur-md'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              LearnEng
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Master Vocabulary
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${settings.mode === 'dark'
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {settings.mode === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${settings.mode === 'dark'
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};