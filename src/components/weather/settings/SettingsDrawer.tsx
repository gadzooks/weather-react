import React, { useEffect } from 'react';
import {
  THEME_DARK,
  THEME_LIGHT,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
} from '../Constants';
import { getCacheAge } from '../../../utils/forecastCache';
import './SettingsDrawer.scss';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  showAqi: boolean;
  onShowAqiChange: (show: boolean) => void;
  cacheTimestamp?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  showAqi,
  onShowAqiChange,
  cacheTimestamp,
  onRefresh,
  isRefreshing = false,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFontSizeChange(Number(e.target.value));
  };

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`settings-backdrop ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div className='settings-drawer' role='dialog' aria-label='Settings'>
        <div className='settings-header'>
          <h2>Settings</h2>
          <button
            className='close-button'
            onClick={onClose}
            aria-label='Close settings'
            type='button'
          >
            ✕
          </button>
        </div>

        <div className='settings-content'>
          {/* Forecast update info */}
          <div className='setting-group'>
            <span className='setting-label'>Forecast Data</span>
            <div className='forecast-info'>
              <div className='forecast-timestamp'>
                <span className='timestamp-label'>Last updated:</span>
                <span className='timestamp-value'>
                  {cacheTimestamp ? getCacheAge(cacheTimestamp) : 'Never'}
                </span>
              </div>
              {onRefresh && (
                <button
                  className='refresh-button'
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  type='button'
                  aria-label='Refresh forecast data'
                >
                  {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Now'}
                </button>
              )}
            </div>
          </div>

          <div className='setting-group'>
            <label className='setting-label' htmlFor='font-size-slider'>
              Font Size
            </label>
            <div className='slider-container'>
              <input
                id='font-size-slider'
                type='range'
                min={FONT_SIZE_MIN}
                max={FONT_SIZE_MAX}
                value={fontSize}
                onChange={handleSliderChange}
                className='font-size-slider'
              />
              <span className='font-size-value'>{fontSize}px</span>
            </div>
            <div className='slider-labels'>
              <span>{FONT_SIZE_MIN}px</span>
              <span>{FONT_SIZE_MAX}px</span>
            </div>
          </div>

          <div className='setting-group'>
            <span className='setting-label'>Theme</span>
            <div className='theme-options'>
              <button
                className={`theme-option ${theme === THEME_DARK ? 'active' : ''}`}
                onClick={() => onThemeChange(THEME_DARK)}
                type='button'
              >
                🌙 Dark
              </button>
              <button
                className={`theme-option ${theme === THEME_LIGHT ? 'active' : ''}`}
                onClick={() => onThemeChange(THEME_LIGHT)}
                type='button'
              >
                ☀️ Light
              </button>
            </div>
          </div>

          <div className='setting-group'>
            <label className='setting-label checkbox-label' htmlFor='show-aqi-checkbox'>
              <input
                id='show-aqi-checkbox'
                type='checkbox'
                checked={showAqi}
                onChange={(e) => {
                  console.log('[SettingsDrawer] AQI checkbox changed to:', e.target.checked);
                  onShowAqiChange(e.target.checked);
                }}
                className='aqi-checkbox'
              />
              <span>Show Air Quality Index (AQI)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
