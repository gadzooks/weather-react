import type { ForecastResponse } from '../interfaces/ForecastResponseInterface';

const CACHE_VERSION = '1.0';
export const LS_FORECAST_CACHE_KEY = 'weatherForecastCache';

export interface CachedForecast {
  forecast: ForecastResponse;
  timestamp: number;
  dataSource: string;
  version: string;
}

/**
 * Save forecast to localStorage cache with timestamp and version
 */
export function saveForecastToCache(
  forecast: ForecastResponse,
  dataSource: string,
): boolean {
  try {
    const cached: CachedForecast = {
      forecast,
      timestamp: Date.now(),
      dataSource,
      version: CACHE_VERSION,
    };
    localStorage.setItem(LS_FORECAST_CACHE_KEY, JSON.stringify(cached));
    console.log('[ForecastCache] Successfully cached forecast data');
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('[ForecastCache] localStorage quota exceeded');
      clearForecastCache();
      return false;
    }
    console.error('[ForecastCache] Failed to save to cache:', error);
    return false;
  }
}

/**
 * Load forecast from localStorage cache with validation
 */
export function loadForecastFromCache(): CachedForecast | null {
  try {
    const cached = localStorage.getItem(LS_FORECAST_CACHE_KEY);
    if (!cached) {
      console.log('[ForecastCache] No cached data found');
      return null;
    }

    const parsed: CachedForecast = JSON.parse(cached);

    // Version check for future migrations
    if (parsed.version !== CACHE_VERSION) {
      console.warn(
        '[ForecastCache] Cache version mismatch, clearing cache',
        `cached=${parsed.version}, current=${CACHE_VERSION}`,
      );
      clearForecastCache();
      return null;
    }

    // Validate structure
    if (!parsed.forecast || !parsed.timestamp) {
      console.warn('[ForecastCache] Invalid cache structure, clearing');
      clearForecastCache();
      return null;
    }

    console.log(
      '[ForecastCache] Loaded cached data from',
      new Date(parsed.timestamp),
    );
    return parsed;
  } catch (error) {
    console.error('[ForecastCache] Failed to parse cached data:', error);
    clearForecastCache();
    return null;
  }
}

/**
 * Clear forecast cache from localStorage
 */
export function clearForecastCache(): void {
  try {
    localStorage.removeItem(LS_FORECAST_CACHE_KEY);
    console.log('[ForecastCache] Cache cleared');
  } catch (error) {
    console.error('[ForecastCache] Failed to clear cache:', error);
  }
}

/**
 * Calculate cache age for display (e.g., "2 hours ago")
 */
export function getCacheAge(timestamp: number): string {
  const ageMs = Date.now() - timestamp;
  const ageMinutes = Math.floor(ageMs / 60000);
  const ageHours = Math.floor(ageMinutes / 60);
  const ageDays = Math.floor(ageHours / 24);

  if (ageDays > 0) return `${ageDays} day${ageDays > 1 ? 's' : ''} ago`;
  if (ageHours > 0) return `${ageHours} hour${ageHours > 1 ? 's' : ''} ago`;
  if (ageMinutes > 0)
    return `${ageMinutes} minute${ageMinutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Check if cache is stale (older than threshold)
 * @param timestamp Cache timestamp
 * @param staleThresholdMs Threshold in milliseconds (default: 24 hours)
 */
export function isCacheStale(
  timestamp: number,
  staleThresholdMs: number = 24 * 60 * 60 * 1000,
): boolean {
  return Date.now() - timestamp > staleThresholdMs;
}
