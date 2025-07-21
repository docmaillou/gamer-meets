/**
 * Theme Context for pixel art gaming themes
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GameTheme = 'neon-blue' | 'neon-pink' | 'retro-green' | 'cyber-purple' | 'electric-orange';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  glow: string;
  shadow: string;
}

export const THEME_CONFIGS: Record<GameTheme, ThemeColors> = {
  'neon-blue': {
    primary: '#00BFFF',
    secondary: '#0080FF',
    accent: '#40E0D0',
    background: '#1A1A2E',
    surface: '#2A2A4E',
    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    border: '#00BFFF',
    error: '#FF1744',
    success: '#00FF41',
    warning: '#FFD700',
    glow: '#00BFFF80',
    shadow: '#00BFFF40',
  },
  'neon-pink': {
    primary: '#FF1493',
    secondary: '#FF69B4',
    accent: '#FF00FF',
    background: '#2E1A2E',
    surface: '#4E2A4E',
    text: '#FFFFFF',
    textSecondary: '#FFE0F0',
    border: '#FF1493',
    error: '#FF0040',
    success: '#00FF80',
    warning: '#FFD700',
    glow: '#FF149380',
    shadow: '#FF149340',
  },
  'retro-green': {
    primary: '#00FF41',
    secondary: '#32CD32',
    accent: '#ADFF2F',
    background: '#1A2E1A',
    surface: '#2A4E2A',
    text: '#FFFFFF',
    textSecondary: '#E0FFE0',
    border: '#00FF41',
    error: '#FF4444',
    success: '#00FF00',
    warning: '#FFFF00',
    glow: '#00FF4180',
    shadow: '#00FF4140',
  },
  'cyber-purple': {
    primary: '#8A2BE2',
    secondary: '#9932CC',
    accent: '#DA70D6',
    background: '#2E1A2E',
    surface: '#4E2A4E',
    text: '#FFFFFF',
    textSecondary: '#F0E0F0',
    border: '#8A2BE2',
    error: '#FF1744',
    success: '#00FF80',
    warning: '#FFD700',
    glow: '#8A2BE280',
    shadow: '#8A2BE240',
  },
  'electric-orange': {
    primary: '#FF4500',
    secondary: '#FF6347',
    accent: '#FFA500',
    background: '#2E1A0A',
    surface: '#4E2A1A',
    text: '#FFFFFF',
    textSecondary: '#FFE0D0',
    border: '#FF4500',
    error: '#FF0000',
    success: '#00FF00',
    warning: '#FFFF00',
    glow: '#FF450080',
    shadow: '#FF450040',
  },
};

export const THEME_NAMES: Record<GameTheme, string> = {
  'neon-blue': 'Cyber Bleu',
  'neon-pink': 'Neon Rose',
  'retro-green': 'Retro Vert',
  'cyber-purple': 'Cyber Violet',
  'electric-orange': 'Orange Électrique',
};

interface ThemeContextType {
  currentTheme: GameTheme;
  colors: ThemeColors;
  setTheme: (theme: GameTheme) => void;
  availableThemes: Array<{ key: GameTheme; name: string; colors: ThemeColors }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<GameTheme>('neon-blue');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('gamer-meets-theme');
      if (savedTheme && savedTheme in THEME_CONFIGS) {
        setCurrentTheme(savedTheme as GameTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (theme: GameTheme) => {
    try {
      await AsyncStorage.setItem('gamer-meets-theme', theme);
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const availableThemes = Object.entries(THEME_CONFIGS).map(([key, colors]) => ({
    key: key as GameTheme,
    name: THEME_NAMES[key as GameTheme],
    colors,
  }));

  const value: ThemeContextType = {
    currentTheme,
    colors: THEME_CONFIGS[currentTheme],
    setTheme,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};