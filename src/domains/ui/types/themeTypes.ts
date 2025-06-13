export type ThemeMode = 'light' | 'dark';

export interface ThemeSettings {
  mode: ThemeMode;
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface ThemeStore {
  settings: ThemeSettings;
  
  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setHighContrast: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
}