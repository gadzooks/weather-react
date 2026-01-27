// HourlyStrip.tsx
// Horizontal scrollable hourly forecast timeline

import { useEffect, useState } from 'react';
import './HourlyStrip.scss';
import type {
  HourlyForecastInterface,
  ActivityWindow,
  RainWindow,
} from '../../../interfaces/HourlyForecastInterface';
import {
  findBestWindow,
  findRainWindows,
} from '../../../interfaces/HourlyForecastInterface';
import iconClass from '../../../utils/icon';
import { useAppSelector } from '../../../app/hooks';
import { extractHourlyFromRedux } from '../../../utils/extractHourlyFromRedux';

interface HourlyStripProps {
  locationName: string;
  date: string;
  onClose: () => void;
}

function formatHour(datetime: string): string {
  const hour = parseInt(datetime.split(':')[0], 10);
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

function HourlyStrip({ locationName, date, onClose }: HourlyStripProps) {
  const [hours, setHours] = useState<HourlyForecastInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bestWindow, setBestWindow] = useState<ActivityWindow | null>(null);
  const [rainWindows, setRainWindows] = useState<RainWindow[]>([]);
  const appState = useAppSelector((state) => state.forecast);

  useEffect(() => {
    const loadHourlyData = () => {
      setLoading(true);
      setError(null);
      try {
        // Extract hourly data directly from Redux - no API calls needed
        const response = extractHourlyFromRedux(appState.forecast, locationName, date);

        if (!response) {
          throw new Error('Hourly data not found in Redux. Please refresh the main forecast.');
        }

        const hourlyData = response.hours || [];
        setHours(hourlyData);
        setBestWindow(findBestWindow(hourlyData));
        setRainWindows(findRainWindows(hourlyData));
      } catch (err) {
        console.error('[HourlyStrip] Failed to load hourly data from Redux:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load hourly data',
        );
      } finally {
        setLoading(false);
      }
    };

    loadHourlyData();
  }, [locationName, date, appState.forecast]);

  if (loading) {
    return (
      <div className='hourly-strip loading'>
        <div className='loading-spinner'>Loading hourly forecast...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='hourly-strip error'>
        <div className='error-message'>{error}</div>
        <button type='button' className='close-button' onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  if (hours.length === 0) {
    return (
      <div className='hourly-strip empty'>
        <div className='empty-message'>No hourly data available</div>
        <button type='button' className='close-button' onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className='hourly-strip'>
      <div className='hourly-header'>
        <span className='hourly-title'>Hourly Forecast</span>
        <button
          type='button'
          className='close-button'
          onClick={onClose}
          aria-label='Close hourly view'
        >
          ×
        </button>
      </div>

      <div className='hourly-scroll-container'>
        <div className='hourly-cells'>
          {hours.map((hour) => {
            const isRainy = hour.precipprob >= 50;
            return (
              <div
                key={hour.datetime}
                className={`hourly-cell ${isRainy ? 'rainy' : ''}`}
              >
                <div className='hour-time'>{formatHour(hour.datetime)}</div>
                <div className='hour-icon'>
                  <i
                    className={iconClass(
                      hour.icon,
                      hour.precip,
                      hour.cloudcover,
                      hour.temp,
                    )}
                    title={hour.conditions}
                  />
                </div>
                <div className='hour-temp'>{Math.round(hour.temp)}°</div>
                <div
                  className={`hour-precip ${hour.precipprob >= 50 ? 'high' : ''}`}
                >
                  {Math.round(hour.precipprob)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='hourly-summary'>
        {rainWindows.length > 0 && (
          <span className='rain-window'>
            <i className='wi wi-rain' /> Rain:{' '}
            {rainWindows.map((w) => w.label).join(', ')}
          </span>
        )}
        {bestWindow && (
          <span className='best-window'>
            <i className='wi wi-day-sunny' /> Best: {bestWindow.label}
          </span>
        )}
        {rainWindows.length === 0 && !bestWindow && (
          <span className='no-rain'>No significant rain expected</span>
        )}
      </div>
    </div>
  );
}

export default HourlyStrip;
