import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeStore, ThemeSettings } from '../types/themeTypes';

const defaultSettings: ThemeSettings = {
  mode: 'light',
  fontSize: 'medium',
  highContrast: false,
  reduceMotion: false,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      setThemeMode: (mode) => {
        set((state) => ({
          settings: { ...state.settings, mode },
        }));
        
        // Update DOM
        if (mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleTheme: () => {
        const { settings } = get();
        const newMode = settings.mode === 'light' ? 'dark' : 'light';
        get().setThemeMode(newMode);
      },

      setFontSize: (size) => {
        set((state) => ({
          settings: { ...state.settings, fontSize: size },
        }));
      },

      setHighContrast: (enabled) => {
        set((state) => ({
          settings: { ...state.settings, highContrast: enabled },
        }));
      },

      setReduceMotion: (enabled) => {
        set((state) => ({
          settings: { ...state.settings, reduceMotion: enabled },
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.settings.mode === 'dark') {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);