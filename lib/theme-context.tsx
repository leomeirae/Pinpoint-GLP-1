import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShotsyTheme, AccentColor, SHOTSY_THEMES, ACCENT_COLORS, SHOTSY_COLORS } from '@/constants/ShotsyThemes';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  effectiveMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => Promise<void>;

  // Shotsy specific
  selectedTheme: ShotsyTheme;
  setSelectedTheme: (theme: ShotsyTheme) => Promise<void>;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => Promise<void>;

  // Helper to get current colors
  colors: typeof SHOTSY_COLORS;
  themeGradient: {
    start: string;
    middle1: string;
    middle2: string;
    end: string;
  };
  themeColors: string[];
  currentAccent: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_KEY = '@mounjaro_tracker:theme_mode';
const SELECTED_THEME_KEY = '@mounjaro_tracker:selected_theme';
const ACCENT_COLOR_KEY = '@mounjaro_tracker:accent_color';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [selectedTheme, setSelectedThemeState] = useState<ShotsyTheme>('sunset');
  const [accentColor, setAccentColorState] = useState<AccentColor>('blue');

  const effectiveMode: 'light' | 'dark' =
    mode === 'system'
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : mode;

  useEffect(() => {
    loadSavedSettings();
  }, []);

  async function loadSavedSettings() {
    try {
      const [savedMode, savedTheme, savedAccent] = await Promise.all([
        AsyncStorage.getItem(THEME_MODE_KEY),
        AsyncStorage.getItem(SELECTED_THEME_KEY),
        AsyncStorage.getItem(ACCENT_COLOR_KEY),
      ]);

      if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
        setModeState(savedMode);
      }

      if (savedTheme && savedTheme in SHOTSY_THEMES) {
        setSelectedThemeState(savedTheme as ShotsyTheme);
      }

      if (savedAccent && savedAccent in ACCENT_COLORS) {
        setAccentColorState(savedAccent as AccentColor);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de tema:', error);
    }
  }

  async function setMode(newMode: ThemeMode) {
    try {
      setModeState(newMode);
      await AsyncStorage.setItem(THEME_MODE_KEY, newMode);
    } catch (error) {
      console.error('Erro ao salvar modo de tema:', error);
    }
  }

  async function setSelectedTheme(theme: ShotsyTheme) {
    try {
      setSelectedThemeState(theme);
      await AsyncStorage.setItem(SELECTED_THEME_KEY, theme);
    } catch (error) {
      console.error('Erro ao salvar tema selecionado:', error);
    }
  }

  async function setAccentColor(color: AccentColor) {
    try {
      setAccentColorState(color);
      await AsyncStorage.setItem(ACCENT_COLOR_KEY, color);
    } catch (error) {
      console.error('Erro ao salvar cor de destaque:', error);
    }
  }

  const themeData = SHOTSY_THEMES[selectedTheme];

  return (
    <ThemeContext.Provider value={{
      mode,
      effectiveMode,
      setMode,
      selectedTheme,
      setSelectedTheme,
      accentColor,
      setAccentColor,
      colors: SHOTSY_COLORS,
      themeGradient: themeData.gradient,
      themeColors: themeData.colors,
      currentAccent: ACCENT_COLORS[accentColor],
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
