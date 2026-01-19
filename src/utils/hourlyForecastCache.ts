import type { HourlyForecastResponse } from '../interfaces/HourlyForecastInterface';

const CACHE_VERSION = '1.0';
const LS_HOURLY_CACHE_KEY = 'weatherHourlyCache';

interface CachedHourlyData {
  // Key: `${locationName}_${date}` e.g., "mt_baker_2024-01-15"
  [key: string]: {
    data: HourlyForecastResponse;
    timestamp: number;
  };
}

interface HourlyCacheStore {
  version: string;
  entries: CachedHourlyData;
}

/**
 * Generate cache key for hourly forecast
 */
function getCacheKey(locationName: string, date: string): string {
  return `${locationName}_${date}`;
}

/**
 * Load the entire hourly cache store from localStorage
 */
function loadCacheStore(): HourlyCacheStore | null {
  try {
    const cached = localStorage.getItem(LS_HOURLY_CACHE_KEY);
    if (!cached) return null;

    const parsed: HourlyCacheStore = JSON.parse(cached);

    // Version check
    if (parsed.version !== CACHE_VERSION) {
      console.log('[HourlyCache] Version mismatch, clearing cache');
      localStorage.removeItem(LS_HOURLY_CACHE_KEY);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('[HourlyCache] Failed to load cache store:', error);
    return null;
  }
}

/**
 * Save the entire hourly cache store to localStorage
 */
function saveCacheStore(store: HourlyCacheStore): boolean {
  try {
    const jsonString = JSON.stringify(store);
    localStorage.setItem(LS_HOURLY_CACHE_KEY, jsonString);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('[HourlyCache] localStorage quota exceeded, clearing old entries');
      // Try to clear old entries and retry
      clearOldHourlyEntries();
      return false;
    }
    console.error('[HourlyCache] Failed to save cache store:', error);
    return false;
  }
}

/**
 * Save hourly forecast data to cache
 */
export function saveHourlyToCache(
  locationName: string,
  date: string,
  data: HourlyForecastResponse,
): boolean {
  try {
    const store = loadCacheStore() || { version: CACHE_VERSION, entries: {} };
    const key = getCacheKey(locationName, date);

    store.entries[key] = {
      data,
      timestamp: Date.now(),
    };

    const success = saveCacheStore(store);
    if (success) {
      console.log(`[HourlyCache] Saved hourly data for ${key}`);
    }
    return success;
  } catch (error) {
    console.error('[HourlyCache] Failed to save hourly data:', error);
    return false;
  }
}

/**
 * Load hourly forecast data from cache
 */
export function loadHourlyFromCache(
  locationName: string,
  date: string,
): HourlyForecastResponse | null {
  try {
    const store = loadCacheStore();
    if (!store) {
      console.log('[HourlyCache] No cache store found');
      return null;
    }

    const key = getCacheKey(locationName, date);
    const entry = store.entries[key];

    if (!entry) {
      console.log(`[HourlyCache] No cached data for ${key}`);
      return null;
    }

    const ageMs = Date.now() - entry.timestamp;
    const ageHours = ageMs / (1000 * 60 * 60);
    console.log(`[HourlyCache] Found cached data for ${key}, age: ${ageHours.toFixed(1)} hours`);

    return entry.data;
  } catch (error) {
    console.error('[HourlyCache] Failed to load hourly data:', error);
    return null;
  }
}

/**
 * Clear old hourly cache entries (older than 7 days)
 */
export function clearOldHourlyEntries(): void {
  try {
    const store = loadCacheStore();
    if (!store) return;

    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const now = Date.now();
    let cleared = 0;

    Object.keys(store.entries).forEach((key) => {
      if (now - store.entries[key].timestamp > maxAge) {
        delete store.entries[key];
        cleared++;
      }
    });

    if (cleared > 0) {
      saveCacheStore(store);
      console.log(`[HourlyCache] Cleared ${cleared} old entries`);
    }
  } catch (error) {
    console.error('[HourlyCache] Failed to clear old entries:', error);
  }
}

/**
 * Clear all hourly cache
 */
export function clearHourlyCache(): void {
  try {
    localStorage.removeItem(LS_HOURLY_CACHE_KEY);
    console.log('[HourlyCache] Cache cleared');
  } catch (error) {
    console.error('[HourlyCache] Failed to clear cache:', error);
  }
}
