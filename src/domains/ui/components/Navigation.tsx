import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Brain,
  BarChart3,
  Trophy,
  Folder,
  Menu,
  X,
  Home,
  List,
  Settings,
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { AppPage } from '../types/appTypes';

interface NavigationProps {
  currentView?: string;
  onViewChange?: (pageId: AppPage) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'topics', label: 'Topics', icon: Folder },
  { id: 'flashcards', label: 'Study Cards', icon: BookOpen },
  { id: 'library', label: 'Library', icon: List },
  { id: 'learning', label: 'Quiz Mode', icon: Brain },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentView = 'dashboard',
  onViewChange = () => {},
}) => {
  const { settings } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItemClass = (isActive: boolean) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
    ${
      isActive
        ? settings.mode === 'dark'
          ? 'bg-primary-600 text-white shadow-lg'
          : 'bg-primary-500 text-white shadow-lg'
        : settings.mode === 'dark'
        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }
  `;

  const sidebarClass = `
    w-64 h-full border-r transition-colors duration-300 p-4
    ${
      settings.mode === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }
  `;

  const NavContent = () => (
    <nav className="space-y-2 h-[calc(100vh-98px)]">
      {navigationItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;

        return (
          <motion.button
            key={item.id}
            onClick={() => {
              onViewChange(item.id as AppPage);
              setIsMobileMenuOpen(false);
            }}
            className={navItemClass(isActive)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-tutorial={item.id}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`
            p-2 rounded-lg shadow-lg transition-colors duration-200
            ${
              settings.mode === 'dark'
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block sticky top-[63px] ${sidebarClass}`}>
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`lg:hidden fixed left-0 top-0 z-50 ${sidebarClass} pt-16`}
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
