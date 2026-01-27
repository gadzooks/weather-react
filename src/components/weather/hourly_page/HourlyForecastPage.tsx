// HourlyForecastPage.tsx
// Standalone hourly forecast page with detailed metrics and charts
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'fecha';
import './HourlyForecastPage.scss';
import Breadcrumbs from '../common/Breadcrumbs';
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
import HourlyMetricCharts from './HourlyMetricCharts';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { fromSlugById } from '../../../utils/slug';
import { mergeForecast } from '../../../features/forecast/forecastSlice';
import fetchWithRetries from '../../../api/retry';
import type { ForecastResponseStatus } from '../../../interfaces/ForecastResponseInterface';
import { useSwipeNavigation } from '../../../utils/useSwipeNavigation';
import { extractHourlyFromRedux } from '../../../utils/extractHourlyFromRedux';

const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;
const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'real';

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

interface SunTimes {
  sunrise: string | null;
  sunset: string | null;
  sunriseIndex: number;
  sunsetIndex: number;
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

function extractSunTimes(
  hours: HourlyForecastInterface[],
  sunriseTime: string | null,
  sunsetTime: string | null,
): SunTimes {
  // Find sunrise and sunset times from the day-level data
  let sunriseIndex = -1;
  let sunsetIndex = -1;

  // Find the hour index closest to sunrise and sunset
  if (sunriseTime) {
    const sunriseHour = parseInt(sunriseTime.split(':')[0], 10);
    sunriseIndex = hours.findIndex((h) => {
      const hourNum = parseInt(h.datetime.split(':')[0], 10);
      return hourNum === sunriseHour;
    });
  }

  if (sunsetTime) {
    const sunsetHour = parseInt(sunsetTime.split(':')[0], 10);
    sunsetIndex = hours.findIndex((h) => {
      const hourNum = parseInt(h.datetime.split(':')[0], 10);
      return hourNum === sunsetHour;
    });
  }

  return {
    sunrise: sunriseTime,
    sunset: sunsetTime,
    sunriseIndex,
    sunsetIndex,
  };
}

function getFilteredHours(
  hours: HourlyForecastInterface[],
  sunriseIndex: number,
  sunsetIndex: number,
  showAll: boolean,
): HourlyForecastInterface[] {
  if (showAll) {
    return hours;
  }

  // If we don't have both sunrise and sunset, show all hours
  if (sunriseIndex === -1 || sunsetIndex === -1) {
    return hours;
  }

  // Show 2 hours before sunrise to 2 hours after sunset
  const startIndex = Math.max(0, sunriseIndex - 2);
  const endIndex = Math.min(hours.length, sunsetIndex + 3); // +3 because slice is exclusive

  return hours.slice(startIndex, endIndex);
}

function formatHourShort(datetime: string): string {
  const hour = parseInt(datetime.split(':')[0], 10);
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

function formatTime(timeString: string): string {
  if (!timeString) return '';
  const [hourStr, minute] = timeString.split(':');
  const hour = parseInt(hourStr, 10);
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${displayHour}:${minute} ${period}`;
}

function getUvLabel(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

function getUvColor(uvIndex: number): string {
  if (uvIndex <= 2) return '#4caf50';
  if (uvIndex <= 5) return '#ffeb3b';
  if (uvIndex <= 7) return '#ff9800';
  if (uvIndex <= 10) return '#f44336';
  return '#9c27b0';
}

function getUvRecommendation(uvIndex: number): string {
  if (uvIndex <= 2) return 'Basic sun protection (SPF 15+)';
  if (uvIndex <= 5) return 'Wear hat & shade • SPF 30+';
  if (uvIndex <= 7) return 'SPF 30+ & cover up • Seek shade';
  if (uvIndex <= 10) return 'SPF 50+ & protective clothing';
  return 'Minimize exposure • SPF 50+';
}

// Weather icon mapping to emoji (for header only)
const iconEmoji: Record<string, string> = {
  rain: '🌧️',
  cloudy: '☁️',
  'partly-cloudy-day': '⛅',
  'partly-cloudy-night': '🌙',
  'clear-day': '☀️',
  'clear-night': '🌙',
  snow: '❄️',
  fog: '🌫️',
  wind: '💨',
};

/**
 * Get the index of current date in the dates array
 */
function getCurrentDateIndex(dates: string[], currentDate: string): number {
  return dates.findIndex((d) => d === currentDate);
}

/**
 * Get previous/next date from dates array
 */
function getAdjacentDate(
  dates: string[],
  currentDate: string,
  direction: 'prev' | 'next',
): string | null {
  const currentIndex = getCurrentDateIndex(dates, currentDate);
  if (currentIndex === -1) return null;

  const targetIndex =
    direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= dates.length) return null;

  return dates[targetIndex];
}

function HourlyForecastPage() {
  const { locationSlug, date } = useParams<{
    locationSlug: string;
    date: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const appState = useAppSelector((state) => state.forecast);

  const [hours, setHours] = useState<HourlyForecastInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullForecast, setShowFullForecast] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [locationName, setLocationName] = useState<string>('');
  const [locationDescription, setLocationDescription] = useState<string>('');
  const [sunrise, setSunrise] = useState<string | null>(null);
  const [sunset, setSunset] = useState<string | null>(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  // Look up the location from Redux store using the slug
  const location =
    locationSlug && appState.forecast?.locations.byId
      ? fromSlugById(locationSlug, appState.forecast.locations.byId)
      : undefined;

  // Date navigation state and swipe handlers
  const forecastDates = appState.forecast?.dates || [];
  const currentDateIndex = getCurrentDateIndex(forecastDates, date || '');
  const prevDate = getAdjacentDate(forecastDates, date || '', 'prev');
  const nextDate = getAdjacentDate(forecastDates, date || '', 'next');
  const isFirstDay = currentDateIndex === 0;

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => {
      // Swipe left = next day (forward in time, like turning a page)
      if (nextDate && locationSlug) {
        navigate(`/location/${locationSlug}/${nextDate}`);
      }
      // If last day (no nextDate), do nothing
    },
    onSwipeRight: () => {
      // Swipe right = previous day (back in time)
      if (isFirstDay && locationSlug) {
        // On first day, go back to location detail
        navigate(`/location/${locationSlug}`);
      } else if (prevDate && locationSlug) {
        navigate(`/location/${locationSlug}/${prevDate}`);
      }
    },
    disabled: refreshing || loading || isLoadingForecast,
    minSwipeDistance: 75,
  });

  // Memoize computed values
  const dayStats = useMemo(() => calculateDayStats(hours), [hours]);
  const sunTimes = useMemo(() => {
    const times = extractSunTimes(hours, sunrise, sunset);
    return times;
  }, [hours, sunrise, sunset]);

  const bestWindow = useMemo<ActivityWindow | null>(
    () => findBestWindow(hours),
    [hours],
  );

  const rainWindows = useMemo<RainWindow[]>(
    () => findRainWindows(hours),
    [hours],
  );

  // Filter hours based on sunrise to sunset window
  const displayedHours = useMemo(
    () =>
      getFilteredHours(
        hours,
        sunTimes.sunriseIndex,
        sunTimes.sunsetIndex,
        showFullForecast,
      ),
    [hours, sunTimes.sunriseIndex, sunTimes.sunsetIndex, showFullForecast],
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

  console.log('[HourlyForecastPage] Date parsing:', {
    date,
    parsedDate,
    isValidDate: parsedDate && !isNaN(parsedDate.getTime()),
    locationSlug,
  });

  const formattedDate =
    parsedDate && !isNaN(parsedDate.getTime())
      ? format(parsedDate, 'dddd, MMMM Do')
      : date || '';

  // Fetch full forecast data if Redux store is empty (e.g., on direct navigation)
  useEffect(() => {
    const fetchFullForecast = async () => {
      setIsLoadingForecast(true);

      try {
        const url = `${WEATHER_API}/forecasts/${DATA_SOURCE}`;
        console.log('[HourlyForecastPage] Fetching forecast data:', {
          url,
          WEATHER_API,
          DATA_SOURCE,
          locationSlug,
        });

        const response = await fetchWithRetries(url, {
          headers: {
            Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: Failed to fetch forecast data`,
          );
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response, got ${contentType}`);
        }

        const json = await response.json();
        console.log('[HourlyForecastPage] Forecast data received:', {
          hasData: !!json.data,
          datesCount: json.data?.dates?.length,
          locationsCount: json.data?.locations?.allIds?.length,
        });

        const newAppState: ForecastResponseStatus = {
          isLoaded: true,
          forecast: json.data,
          error: null,
        };
        dispatch(mergeForecast(newAppState));
      } catch (err) {
        console.error('[HourlyForecastPage] Failed to fetch forecast:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load forecast data',
        );
        dispatch(
          mergeForecast({
            isLoaded: true,
            forecast: null,
            error:
              err instanceof Error ? err : new Error('Failed to load forecast'),
          }),
        );
      } finally {
        setIsLoadingForecast(false);
      }
    };

    // Only fetch if Redux store doesn't have data
    if (!appState.isLoaded || !appState.forecast) {
      fetchFullForecast();
    }
  }, [appState.isLoaded, appState.forecast, dispatch, locationSlug]);

  useEffect(() => {
    const loadHourlyData = async () => {
      if (!location || !date) return;

      // Check if the requested date is in the available forecast dates
      // This handles cases where the user navigates to an old/expired date
      if (appState.forecast?.dates && appState.forecast.dates.length > 0) {
        if (!appState.forecast.dates.includes(date)) {
          console.warn(
            `[HourlyForecastPage] Date ${date} not in available forecast dates, redirecting to location page`,
          );
          console.log('[HourlyForecastPage] Available dates:', appState.forecast.dates);

          // Redirect to location detail page with query param to show notification
          navigate(`/location/${locationSlug}?outdated_date=${date}`);
          return;
        }
      }

      setLoading(true);
      setError(null);

      // Extract hourly data directly from Redux - no API calls needed
      try {
        const response = extractHourlyFromRedux(appState.forecast, location.name, date);

        if (!response) {
          throw new Error('Hourly data not found in Redux. Please refresh the main forecast.');
        }

        setHours(response.hours || []);
        setLocationName(response.location);
        setLocationDescription(response.locationDescription);
        setSunrise(response.sunrise || null);
        setSunset(response.sunset || null);
        console.log('[HourlyForecastPage] Loaded hourly data from Redux');
      } catch (err) {
        console.error('[HourlyForecastPage] Failed to load hourly data:', err);

        // If we failed to load hourly data and date is invalid, redirect to location page
        if (appState.forecast?.dates && !appState.forecast.dates.includes(date)) {
          console.log('[HourlyForecastPage] Date not available, redirecting to location page');
          navigate(`/location/${locationSlug}?outdated_date=${date}`);
          return;
        }

        setError(
          err instanceof Error ? err.message : 'Failed to load hourly data',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadHourlyData();
  }, [location, date, appState.forecast, locationSlug, navigate]);

  const handleRefresh = async () => {
    if (!location || !date) return;

    // Check if the date is still valid before refreshing
    if (appState.forecast?.dates && appState.forecast.dates.length > 0) {
      if (!appState.forecast.dates.includes(date)) {
        console.warn(
          `[HourlyForecastPage] Refresh requested for outdated date ${date}, redirecting to location page`,
        );
        navigate(`/location/${locationSlug}?outdated_date=${date}`);
        return;
      }
    }

    setRefreshing(true);
    setError(null);

    try {
      const response = extractHourlyFromRedux(appState.forecast, location.name, date);

      if (!response) {
        throw new Error('Hourly data not found in Redux. Please refresh the main forecast.');
      }

      setHours(response.hours || []);
      setLocationName(response.location);
      setLocationDescription(response.locationDescription);
      setSunrise(response.sunrise || null);
      setSunset(response.sunset || null);
    } catch (err) {
      console.error('[HourlyForecastPage] Failed to refresh hourly data:', err);

      // If refresh fails and date is no longer available, redirect to location page
      if (appState.forecast?.dates && !appState.forecast.dates.includes(date)) {
        console.log('[HourlyForecastPage] Date not available after refresh, redirecting');
        navigate(`/location/${locationSlug}?outdated_date=${date}`);
        return;
      }

      // Don't show error if we already have data displayed - just keep showing it
      if (hours.length === 0) {
        setError(
          err instanceof Error ? err.message : 'Failed to load hourly data',
        );
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull-to-refresh when at the top of the page
    // and not interacting with buttons (which have their own touch handling)
    const target = e.target as HTMLElement;
    if (window.scrollY === 0 && !target.closest('button')) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === 0) return;

    const currentTouch = e.touches[0].clientY;
    const distance = currentTouch - touchStart;

    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      await handleRefresh();
    }
    // Only update state if values are non-zero to avoid unnecessary re-renders
    if (touchStart !== 0) setTouchStart(0);
    if (pullDistance !== 0) setPullDistance(0);
  };

  const handleBack = () => {
    if (locationSlug) {
      navigate(`/location/${locationSlug}`);
    } else {
      navigate('/');
    }
  };

  // Show loading while fetching forecast data
  if (isLoadingForecast || !appState.isLoaded || !appState.forecast) {
    return (
      <div className='hourly-forecast-page loading'>
        <div className='loading-spinner'>Loading forecast data...</div>
      </div>
    );
  }

  // If location not found, show error
  if (!location && appState.isLoaded) {
    return (
      <div className='hourly-forecast-page error'>
        <button type='button' className='back-button' onClick={handleBack}>
          <span className='back-arrow'>&larr;</span>
          <span className='back-text'>Back</span>
        </button>
        <div className='error-message'>Location not found: {locationSlug}</div>
      </div>
    );
  }

  if (loading && hours.length === 0) {
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
    <div
      className={`hourly-forecast-page ${swipeHandlers.isSwipping ? 'swiping' : ''} ${swipeHandlers.swipeDirection ? `swipe-${swipeHandlers.swipeDirection}` : ''}`}
      onTouchStart={(e) => {
        handleTouchStart(e);
        swipeHandlers.onTouchStart(e);
      }}
      onTouchMove={(e) => {
        handleTouchMove(e);
        swipeHandlers.onTouchMove(e);
      }}
      onTouchEnd={(e) => {
        handleTouchEnd();
        swipeHandlers.onTouchEnd(e);
      }}
    >
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div
          className='pull-refresh-indicator'
          style={{
            opacity: Math.min(pullDistance / 60, 1),
            transform: `translateY(${pullDistance}px)`,
          }}
        >
          {pullDistance > 60 ? '↻ Release to refresh' : '↓ Pull to refresh'}
        </div>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          {
            label: locationDescription || locationName || locationSlug || '',
            to: `/location/${locationSlug}`,
          },
          { label: formattedDate, to: `/${date}` },
        ]}
      />

      {/* Day Navigation */}
      {forecastDates.length > 1 && (
        <div className='day-navigation'>
          <button
            type='button'
            className='nav-button prev'
            onClick={() =>
              prevDate &&
              locationSlug &&
              navigate(`/location/${locationSlug}/${prevDate}`)
            }
            disabled={!prevDate}
            aria-label={
              prevDate
                ? `Previous day: ${format(new Date(`${prevDate}T12:00:00`), 'ddd MMM Do')}`
                : 'No previous day'
            }
          >
            {prevDate ? (
              <>
                <span className='nav-arrow'>←</span>
                <span className='nav-label'>
                  {format(new Date(`${prevDate}T12:00:00`), 'ddd MMM Do')}
                </span>
              </>
            ) : (
              <span className='nav-disabled'>←</span>
            )}
          </button>

          <button
            type='button'
            className='nav-button next'
            onClick={() =>
              nextDate &&
              locationSlug &&
              navigate(`/location/${locationSlug}/${nextDate}`)
            }
            disabled={!nextDate}
            aria-label={
              nextDate
                ? `Next day: ${format(new Date(`${nextDate}T12:00:00`), 'ddd MMM Do')}`
                : 'No next day'
            }
          >
            {nextDate ? (
              <>
                <span className='nav-label'>
                  {format(new Date(`${nextDate}T12:00:00`), 'ddd MMM Do')}
                </span>
                <span className='nav-arrow'>→</span>
              </>
            ) : (
              <span className='nav-disabled'>→</span>
            )}
          </button>
        </div>
      )}

      {/* Header - Compact layout */}
      <header className='header'>
        <div className='header-subrow'>
          {(sunTimes.sunrise || sunTimes.sunset) && (
            <span className='sun-compact'>
              {sunTimes.sunrise && (
                <span className='sun-item sunrise'>
                  <i className='wi wi-sunrise' />
                  {formatTime(sunTimes.sunrise)}
                </span>
              )}
              {sunTimes.sunset && (
                <span className='sun-item sunset'>
                  <i className='wi wi-sunset' />
                  {formatTime(sunTimes.sunset)}
                </span>
              )}
            </span>
          )}
          <span className='conditions-summary'>
            <span className='conditions-icon'>
              {iconEmoji[predominantCondition.icon] || '☁️'}
            </span>
            <span>{predominantCondition.conditions}</span>
          </span>
        </div>
      </header>



      {/* Day Statistics */}
      <div className='day-stats'>
        <div className='stat-card'>
          <div className='stat-label'>Temperature</div>
          <div className='stat-row'>
            <span className='stat-value'>
              {Math.round(dayStats.tempMin)}&deg;-{Math.round(dayStats.tempMax)}
              &deg;
            </span>
            <span className='stat-subvalue'>
              [avg {Math.round(dayStats.avgTemp)}&deg;]
            </span>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-label'>Precipitation</div>
          <div className='stat-row'>
            <span className='stat-value'>
              {dayStats.precipTotal.toFixed(2)}&quot;
            </span>
            <span className='stat-subvalue'>
              [{Math.round(dayStats.maxPrecipProb)}% max]
            </span>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-label'>Wind</div>
          <div className='stat-row'>
            <span className='stat-value'>
              {Math.round(dayStats.avgWindSpeed)} mph
            </span>
            <span className='stat-subvalue'>
              [gusts {Math.round(dayStats.maxWindGust)}]
            </span>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-label'>Visibility</div>
          <div className='stat-row'>
            <span className='stat-value'>
              {dayStats.avgVisibility.toFixed(1)} mi
            </span>
            <span className='stat-subvalue'>
              [{Math.round(dayStats.avgCloudCover)}% cloud cov]
            </span>
          </div>
        </div>

        <div
          className='stat-card uv-card'
          style={
            {
              '--uv-color': getUvColor(dayStats.maxUvIndex),
            } as React.CSSProperties
          }
        >
          <div className='stat-label'>UV Index</div>
          <div className='stat-row'>
            <span className='stat-value'>{dayStats.maxUvIndex}</span>
            <span className='stat-subvalue uv-level'>
              {getUvLabel(dayStats.maxUvIndex)}
            </span>
          </div>
          <div className='uv-recommendation'>
            {getUvRecommendation(dayStats.maxUvIndex)}
          </div>
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
        <div className='section-header'>
          <h2 className='section-title'>
            {showFullForecast
              ? '24-Hour Forecast'
              : 'Daylight Window (Sunrise-Sunset)'}
          </h2>
          <label className='forecast-toggle'>
            <input
              type='checkbox'
              checked={showFullForecast}
              onChange={(e) => setShowFullForecast(e.target.checked)}
            />
            <span className='toggle-label'>Show full forecast</span>
          </label>
        </div>

        <div className='hourly-timeline'>
          <div
            className='timeline-grid'
            style={{
              gridTemplateColumns: `repeat(${displayedHours.length}, 1fr)`,
            }}
          >
            {displayedHours.map((hour) => {
              const isRainy = hour.precipprob >= 40;
              const originalIndex = hours.indexOf(hour);
              const isSunrise = originalIndex === sunTimes.sunriseIndex;
              const isSunset = originalIndex === sunTimes.sunsetIndex;

              if (isSunrise || isSunset) {
                console.log('[DEBUG] Found sun marker:', {
                  hour: hour.datetime,
                  originalIndex,
                  isSunrise,
                  isSunset,
                  sunriseIndex: sunTimes.sunriseIndex,
                  sunsetIndex: sunTimes.sunsetIndex,
                });
              }

              return (
                <div
                  key={hour.datetime}
                  className={`hour-card ${isRainy ? 'rainy' : ''} ${isSunrise ? 'sunrise' : ''} ${isSunset ? 'sunset' : ''}`}
                >
                  {/* Sun marker */}
                  {(isSunrise || isSunset) && (
                    <div className='sun-marker'>
                      <i
                        className={`wi ${isSunrise ? 'wi-sunrise' : 'wi-sunset'}`}
                      />
                      <span>{isSunrise ? 'Sunrise' : 'Sunset'}</span>
                    </div>
                  )}

                  <div className='hour-time'>
                    {formatHourShort(hour.datetime)}
                  </div>

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

                  {/* Simplified metrics - only show the most important */}
                  <div className='hour-metrics'>
                    {hour.precipprob > 0 && (
                      <div className='metric precip'>
                        <i className='wi wi-raindrop' />
                        <span className='metric-value'>
                          {Math.round(hour.precipprob)}%
                        </span>
                      </div>
                    )}

                    {hour.windspeed > 10 && (
                      <div className='metric wind'>
                        <i className='wi wi-strong-wind' />
                        <span className='metric-value'>
                          {Math.round(hour.windspeed)} mph
                        </span>
                      </div>
                    )}

                    {hour.uvindex > 3 && (
                      <div className='metric uv'>
                        <i className='wi wi-day-sunny' />
                        <span className='metric-value'>UV {hour.uvindex}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Metric Charts */}
      <HourlyMetricCharts
        hours={hours}
        dayStats={dayStats}
        sunrise={sunrise}
        sunset={sunset}
      />
    </div>
  );
}

export default HourlyForecastPage;
