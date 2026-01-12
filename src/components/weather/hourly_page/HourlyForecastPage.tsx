// HourlyForecastPage.tsx
// Standalone hourly forecast page with detailed metrics and charts

import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'fecha';
import './HourlyForecastPage.scss';
import type {
  HourlyForecastInterface,
  ActivityWindow,
  RainWindow,
} from '../../../interfaces/HourlyForecastInterface';
import {
  findBestWindow,
  findRainWindows,
} from '../../../interfaces/HourlyForecastInterface';
import { fetchHourlyForecast } from '../../../api/hourlyForecast';
import iconClass from '../../../utils/icon';
import { useAppSelector } from '../../../app/hooks';
import { fromSlugById } from '../../../utils/slug';
import HourlyMetricCharts from './HourlyMetricCharts';

interface DayStats {
  tempMax: number;
  tempMin: number;
  avgTemp: number;
  precipTotal: number;
  maxPrecipProb: number;
  avgWindSpeed: number;
  maxWindGust: number;
  avgVisibility: number;
  minVisibility: number;
  avgCloudCover: number;
  maxUvIndex: number;
}

function calculateDayStats(hours: HourlyForecastInterface[]): DayStats {
  if (hours.length === 0) {
    return {
      tempMax: 0,
      tempMin: 0,
      avgTemp: 0,
      precipTotal: 0,
      maxPrecipProb: 0,
      avgWindSpeed: 0,
      maxWindGust: 0,
      avgVisibility: 0,
      minVisibility: 0,
      avgCloudCover: 0,
      maxUvIndex: 0,
    };
  }

  const temps = hours.map((h) => h.temp);
  const tempMax = Math.max(...temps);
  const tempMin = Math.min(...temps);
  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

  const precipTotal = hours.reduce((sum, h) => sum + h.precip, 0);
  const maxPrecipProb = Math.max(...hours.map((h) => h.precipprob));

  const avgWindSpeed =
    hours.reduce((sum, h) => sum + h.windspeed, 0) / hours.length;
  const maxWindGust = Math.max(...hours.map((h) => h.windgust));

  const visibilities = hours.map((h) => h.visibility);
  const avgVisibility = visibilities.reduce((a, b) => a + b, 0) / hours.length;
  const minVisibility = Math.min(...visibilities);

  const avgCloudCover =
    hours.reduce((sum, h) => sum + h.cloudcover, 0) / hours.length;
  const maxUvIndex = Math.max(...hours.map((h) => h.uvindex));

  return {
    tempMax,
    tempMin,
    avgTemp,
    precipTotal,
    maxPrecipProb,
    avgWindSpeed,
    maxWindGust,
    avgVisibility,
    minVisibility,
    avgCloudCover,
    maxUvIndex,
  };
}

function formatHourShort(datetime: string): string {
  const hour = parseInt(datetime.split(':')[0], 10);
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

function getUvLabel(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

function getWindWarningClass(speed: number, gust: number): string {
  if (gust > 30 || speed > 20) return 'danger';
  if (gust > 20 || speed > 15) return 'warning';
  return '';
}

// Weather icon mapping to emoji (for header only)
const iconEmoji: Record<string, string> = {
  rain: '\u{1F327}\u{FE0F}',
  cloudy: '\u{2601}\u{FE0F}',
  'partly-cloudy-day': '\u{26C5}',
  'partly-cloudy-night': '\u{1F319}',
  'clear-day': '\u{2600}\u{FE0F}',
  'clear-night': '\u{1F319}',
  snow: '\u{2744}\u{FE0F}',
  fog: '\u{1F32B}\u{FE0F}',
  wind: '\u{1F4A8}',
};

function HourlyForecastPage() {
  const { locationSlug, date } = useParams<{
    locationSlug: string;
    date: string;
  }>();
  const navigate = useNavigate();

  const [hours, setHours] = useState<HourlyForecastInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get location data from Redux
  const appState = useAppSelector((state) => state.forecast);
  const locationsById = appState.forecast?.locations.byId || {};

  // Resolve slug to location
  const location = locationSlug ? fromSlugById(locationSlug, locationsById) : undefined;

  // Memoize computed values
  const dayStats = useMemo(() => calculateDayStats(hours), [hours]);
  const bestWindow = useMemo<ActivityWindow | null>(
    () => findBestWindow(hours),
    [hours],
  );
  const rainWindows = useMemo<RainWindow[]>(
    () => findRainWindows(hours),
    [hours],
  );

  // Determine the most common condition for the day
  const predominantCondition = useMemo(() => {
    if (hours.length === 0) return { icon: 'cloudy', conditions: 'Loading...' };
    const iconCounts: Record<string, number> = {};
    hours.forEach((h) => {
      iconCounts[h.icon] = (iconCounts[h.icon] || 0) + 1;
    });
    const mostCommon = Object.entries(iconCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const mostCommonHour = hours.find((h) => h.icon === mostCommon[0]);
    return {
      icon: mostCommon[0],
      conditions: mostCommonHour?.conditions || '',
    };
  }, [hours]);

  // Parse date for display
  const parsedDate = date ? new Date(`${date}T12:00:00`) : null;
  const formattedDate = parsedDate
    ? format(parsedDate, 'dddd, MMMM Do')
    : date || '';

  useEffect(() => {
    const loadHourlyData = async () => {
      if (!location || !date) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetchHourlyForecast(location.name, date);
        setHours(response.hours || []);
      } catch (err) {
        console.error('[HourlyForecastPage] Failed to fetch hourly data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load hourly data',
        );
      } finally {
        setLoading(false);
      }
    };

    loadHourlyData();
  }, [location, date]);

  const handleBack = () => {
    if (locationSlug) {
      navigate(`/location/${locationSlug}`);
    } else {
      navigate('/');
    }
  };

  // Handle loading state for location resolution
  if (!appState.isLoaded) {
    return (
      <div className='hourly-forecast-page loading'>
        <div className='loading-spinner'>Loading forecast data...</div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className='hourly-forecast-page error'>
        <div className='error-message'>Location not found</div>
        <button type='button' className='back-button' onClick={handleBack}>
          <span className='back-arrow'>&larr;</span>
          <span className='back-text'>Back</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='hourly-forecast-page loading'>
        <div className='loading-spinner'>Loading hourly forecast...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='hourly-forecast-page error'>
        <button type='button' className='back-button' onClick={handleBack}>
          <span className='back-arrow'>&larr;</span>
          <span className='back-text'>Back</span>
        </button>
        <div className='error-message'>{error}</div>
      </div>
    );
  }

  if (hours.length === 0) {
    return (
      <div className='hourly-forecast-page empty'>
        <button type='button' className='back-button' onClick={handleBack}>
          <span className='back-arrow'>&larr;</span>
          <span className='back-text'>Back</span>
        </button>
        <div className='empty-message'>No hourly data available for {date}</div>
      </div>
    );
  }

  return (
    <div className='hourly-forecast-page'>
      {/* Header */}
      <header className='header'>
        <button type='button' className='back-button' onClick={handleBack}>
          <span className='back-arrow'>&larr;</span>
          <span className='back-text'>Back</span>
        </button>
        <div className='location'>{location.description}</div>
        <h1 className='date-title'>{formattedDate}</h1>
        <div className='conditions-summary'>
          <span className='conditions-icon'>
            {iconEmoji[predominantCondition.icon] || '\u{2601}\u{FE0F}'}
          </span>
          <span>{predominantCondition.conditions}</span>
        </div>
      </header>

      {/* Day Statistics */}
      <div className='day-stats'>
        <div className='stat-card'>
          <div className='stat-label'>Temperature</div>
          <div className='stat-value'>
            {Math.round(dayStats.tempMin)}&deg; - {Math.round(dayStats.tempMax)}
            &deg;
          </div>
          <div className='stat-subvalue'>Avg {Math.round(dayStats.avgTemp)}&deg;</div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>Precipitation</div>
          <div className='stat-value'>{dayStats.precipTotal.toFixed(2)}&quot;</div>
          <div className='stat-subvalue'>
            {Math.round(dayStats.maxPrecipProb)}% max chance
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>Wind</div>
          <div className='stat-value'>
            {Math.round(dayStats.avgWindSpeed)} mph
          </div>
          <div className='stat-subvalue'>
            Gusts to {Math.round(dayStats.maxWindGust)} mph
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>Visibility</div>
          <div className='stat-value'>
            {dayStats.avgVisibility.toFixed(1)} mi
          </div>
          <div className='stat-subvalue'>
            {Math.round(dayStats.avgCloudCover)}% clouds
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>UV Index</div>
          <div className='stat-value'>{dayStats.maxUvIndex}</div>
          <div className='stat-subvalue'>{getUvLabel(dayStats.maxUvIndex)}</div>
        </div>
      </div>

      {/* Optimal Hiking Window */}
      {bestWindow && (
        <div className='hiking-window'>
          <div className='hiking-window-content'>
            <div className='hiking-window-title'>
              <i className='wi wi-day-sunny' /> Optimal Hiking Window
            </div>
            <div className='hiking-window-time'>{bestWindow.label}</div>
            <div className='hiking-window-reason'>
              {rainWindows.length > 0
                ? `Lowest precipitation probability. Rain expected: ${rainWindows.map((w) => w.label).join(', ')}`
                : 'Lowest precipitation probability and best conditions for outdoor activities.'}
            </div>
          </div>
        </div>
      )}

      {/* Hourly Timeline */}
      <section className='timeline-section'>
        <h2 className='section-title'>24-Hour Detailed Forecast</h2>
        <div className='hourly-timeline'>
          <div className='timeline-grid'>
            {hours.map((hour) => {
              const windWarning = getWindWarningClass(
                hour.windspeed,
                hour.windgust,
              );
              const isRainy = hour.precipprob >= 50;

              return (
                <div
                  key={hour.datetime}
                  className={`hour-card ${isRainy ? 'rainy' : ''}`}
                >
                  <div className='hour-time'>{formatHourShort(hour.datetime)}</div>
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
                  <div className='hour-temp'>{Math.round(hour.temp)}&deg;</div>
                  <div className='hour-feels'>
                    Feels {Math.round(hour.feelslike)}&deg;
                  </div>
                  <div className='hour-metrics'>
                    <div className='metric'>
                      <span className='metric-label'>Wind</span>
                      <span className={`metric-value ${windWarning}`}>
                        {Math.round(hour.windspeed)} mph
                      </span>
                    </div>
                    <div className='metric'>
                      <span className='metric-label'>Gust</span>
                      <span className={`metric-value ${windWarning}`}>
                        {Math.round(hour.windgust)} mph
                      </span>
                    </div>
                    <div className='metric'>
                      <span className='metric-label'>Vis</span>
                      <span className='metric-value'>
                        {hour.visibility.toFixed(1)} mi
                      </span>
                    </div>
                    <div className='metric'>
                      <span className='metric-label'>Humid</span>
                      <span className='metric-value'>
                        {Math.round(hour.humidity)}%
                      </span>
                    </div>
                  </div>
                  {hour.precipprob > 0 && (
                    <div className='precip-indicator'>
                      {Math.round(hour.precipprob)}% &bull;{' '}
                      {hour.precip.toFixed(2)}&quot;
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Metric Charts */}
      <HourlyMetricCharts hours={hours} dayStats={dayStats} />
    </div>
  );
}

export default HourlyForecastPage;
