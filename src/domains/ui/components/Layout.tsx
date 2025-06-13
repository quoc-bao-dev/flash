import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { useAppStore } from '../store/appStore';

import './style.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { settings } = useThemeStore();
  const page = useAppStore((s) => s.state.currPage);
  const setPage = useAppStore((s) => s.setPage);

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[settings.fontSize];

  const containerClass = `
    min-h-screen transition-colors duration-300
    ${
      settings.mode === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-gray-50 text-gray-900'
    }
    ${
      settings.highContrast
        ? settings.mode === 'dark'
          ? 'bg-black text-white'
          : 'bg-white text-black'
        : ''
    }
    ${fontSizeClass}
  `;

  return (
    <div className={containerClass}>
      <Header />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        <Navigation currentView={page} onViewChange={setPage} />
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: settings.reduceMotion ? 0.1 : 0.3,
              ease: 'easeOut',
            }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
