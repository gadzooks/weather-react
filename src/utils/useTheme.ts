import { useEffect } from 'react';
import useLocalStorage from './localstorage';
import {
  LS_THEME_KEY,
  THEME_DARK,
  THEME_LIGHT,
} from '../components/weather/Constants';

// Detect system theme preference
const getSystemTheme = (): string => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_DARK
      : THEME_LIGHT;
  }
  return THEME_DARK; // Default to dark if window is not available
};

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage(LS_THEME_KEY, getSystemTheme());

  // Apply theme to document element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === THEME_DARK ? THEME_LIGHT : THEME_DARK);
  };

  return { theme, setTheme, toggleTheme };
};
