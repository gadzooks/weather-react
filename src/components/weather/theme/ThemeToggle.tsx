// ThemeToggle.tsx

import React from 'react';
import { THEME_DARK } from '../Constants';
import './ThemeToggle.scss';

interface ThemeToggleProps {
  theme: string;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
}) => {
  const isDark = theme === THEME_DARK;

  return (
    <button
      className='theme-toggle button-2'
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      type='button'
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};
