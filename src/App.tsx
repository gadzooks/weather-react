// App.tsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './reset.css';
import './App.scss';
import { useTheme } from './utils/useTheme';
import { useFontSize } from './utils/useFontSize';
import { useOfflineStatus } from './utils/useOfflineStatus';
import { useAppSelector } from './app/hooks';
import { FloatingActionButton } from './components/weather/fab/FloatingActionButton';
import { SettingsDrawer } from './components/weather/settings/SettingsDrawer';
import { OfflineStatusBanner } from './components/weather/forecast_summary/OfflineStatusBanner';
import { RefreshSpinner } from './components/weather/forecast_summary/RefreshSpinner';
import { UpdateToast } from './components/weather/forecast_summary/UpdateToast';
import './components/weather/forecast_summary/SummaryTableLoader.scss';

export function App() {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Global online/offline status
  const isOnline = useOfflineStatus();

  // Access Redux forecast state for cache status
  const appState = useAppSelector((state) => state.forecast);

  return (
    <div className='theme font-loader'>
      <RefreshSpinner />
      <UpdateToast />
      <div className='container'>
        {/* Global offline/cached data banner - shows on all pages */}
        {(!isOnline || appState.isFromCache) && appState.forecast && (
          <OfflineStatusBanner
            isFromCache={appState.isFromCache || false}
            cacheTimestamp={appState.cacheTimestamp}
            isOnline={isOnline}
          />
        )}

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
