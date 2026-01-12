// App.tsx

import { Outlet } from 'react-router-dom';
import './reset.css';
import './App.scss';
import { useTheme } from './utils/useTheme';
import { ThemeToggle } from './components/weather/theme/ThemeToggle';
import './components/weather/forecast_summary/SummaryTableLoader.scss';

export function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='theme font-loader'>
      <div className='app-header'>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <div className='container'>
        <Outlet />
      </div>
    </div>
  );
}

export default {
  title: 'Controls/Nav/Sidebar',
};
