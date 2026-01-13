// App.tsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './reset.css';
import './App.scss';
import { useTheme } from './utils/useTheme';
import { useFontSize } from './utils/useFontSize';
import { FloatingActionButton } from './components/weather/fab/FloatingActionButton';
import { SettingsDrawer } from './components/weather/settings/SettingsDrawer';
import './components/weather/forecast_summary/SummaryTableLoader.scss';

export function App() {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className='theme font-loader'>
      <div className='container'>
        <Outlet />
      </div>
      <FloatingActionButton
        isOpen={isSettingsOpen}
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
      />
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </div>
  );
}

export default {
  title: 'Controls/Nav/Sidebar',
};
