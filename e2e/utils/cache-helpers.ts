// e2e/utils/cache-helpers.ts
// localStorage cache manipulation utilities for Playwright E2E tests

import { Page } from '@playwright/test';
import {
  mockForecastResponse,
  createCacheEntry,
  createStaleCacheEntry,
  createFreshCacheEntry,
} from '../fixtures/mock-data/forecast-response';

const LS_FORECAST_CACHE_KEY = 'weatherForecastCache';
const LS_BANNER_DISMISSED_PREFIX = 'offlineBannerDismissed_';

export interface SeedCacheOptions {
  timestamp?: number;
  dataSource?: string;
  version?: string;
  ageMinutes?: number;
}

/**
 * Seed localStorage with forecast cache data
 * Must be called BEFORE page.goto()
 */
export async function seedCache(
  page: Page,
  options: SeedCacheOptions = {},
): Promise<void> {
  const { ageMinutes } = options;

  let cacheEntry;
  if (ageMinutes !== undefined) {
    const timestamp = Date.now() - ageMinutes * 60 * 1000;
    cacheEntry = createCacheEntry(mockForecastResponse, { ...options, timestamp });
  } else {
    cacheEntry = createCacheEntry(mockForecastResponse, options);
  }

  await page.addInitScript((data) => {
    const { key, value } = data;
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: LS_FORECAST_CACHE_KEY, value: cacheEntry });
}

/**
 * Seed stale cache (older than 5 minutes)
 */
export async function seedStaleCache(
  page: Page,
  ageMinutes: number = 10,
): Promise<void> {
  const cacheEntry = createStaleCacheEntry(ageMinutes);

  await page.addInitScript((data) => {
    const { key, value } = data;
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: LS_FORECAST_CACHE_KEY, value: cacheEntry });
}

/**
 * Seed fresh cache (less than 5 minutes old)
 */
export async function seedFreshCache(
  page: Page,
  ageMinutes: number = 2,
): Promise<void> {
  const cacheEntry = createFreshCacheEntry(ageMinutes);

  await page.addInitScript((data) => {
    const { key, value } = data;
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: LS_FORECAST_CACHE_KEY, value: cacheEntry });
}

/**
 * Seed cache with invalid version for testing migration
 */
export async function seedCacheWithOldVersion(page: Page): Promise<void> {
  const cacheEntry = createCacheEntry(mockForecastResponse, { version: '0.9' });

  await page.addInitScript((data) => {
    const { key, value } = data;
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: LS_FORECAST_CACHE_KEY, value: cacheEntry });
}

/**
 * Seed cache with invalid structure
 */
export async function seedInvalidCache(page: Page): Promise<void> {
  await page.addInitScript((key) => {
    localStorage.setItem(key, '{ invalid json }}}');
  }, LS_FORECAST_CACHE_KEY);
}

/**
 * Clear forecast cache
 */
export async function clearCache(page: Page): Promise<void> {
  await page.evaluate((key) => {
    localStorage.removeItem(key);
  }, LS_FORECAST_CACHE_KEY);
}

/**
 * Get current cache from localStorage
 */
export async function getCache(page: Page): Promise<object | null> {
  return await page.evaluate((key) => {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  }, LS_FORECAST_CACHE_KEY);
}

/**
 * Check if cache exists
 */
export async function cacheExists(page: Page): Promise<boolean> {
  return await page.evaluate((key) => {
    return localStorage.getItem(key) !== null;
  }, LS_FORECAST_CACHE_KEY);
}

/**
 * Get cache timestamp
 */
export async function getCacheTimestamp(page: Page): Promise<number | null> {
  const cache = await getCache(page) as { timestamp?: number } | null;
  return cache?.timestamp ?? null;
}

/**
 * Seed banner dismissal state
 */
export async function seedBannerDismissed(
  page: Page,
  timestamp: number,
): Promise<void> {
  const key = `${LS_BANNER_DISMISSED_PREFIX}${timestamp}`;
  await page.addInitScript((data) => {
    const { key, value } = data;
    localStorage.setItem(key, value);
  }, { key, value: 'true' });
}

/**
 * Clear banner dismissal
 */
export async function clearBannerDismissed(page: Page): Promise<void> {
  await page.evaluate((prefix) => {
    // Remove all dismissal keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }, LS_BANNER_DISMISSED_PREFIX);
}

/**
 * Check if banner is dismissed (any dismissal key exists with 'true' value)
 */
export async function isBannerDismissed(page: Page): Promise<boolean> {
  return await page.evaluate((prefix) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        return localStorage.getItem(key) === 'true';
      }
    }
    return false;
  }, LS_BANNER_DISMISSED_PREFIX);
}

/**
 * Get all localStorage keys
 */
export async function getAllCacheKeys(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  });
}

/**
 * Clear all localStorage
 */
export async function clearAllStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}
