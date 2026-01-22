// e2e/fixtures/mock-data/forecast-response.ts
// Mock forecast data for E2E tests

import type { ForecastResponse } from '../../../src/interfaces/ForecastResponseInterface';
import type { LocationInterface } from '../../../src/interfaces/LocationInterface';
import type { DailyForecastInterface } from '../../../src/interfaces/DailyForecastInterface';

// Location objects
const mtBakerLocation: LocationInterface = {
  name: 'mt_baker',
  description: 'Mt. Baker',
  region: 'cascades',
  latitude: 48.7767,
  longitude: -121.8144,
};

const stevensPassLocation: LocationInterface = {
  name: 'stevens_pass',
  description: 'Stevens Pass',
  region: 'cascades',
  latitude: 47.7448,
  longitude: -121.0890,
};

const hurricaneRidgeLocation: LocationInterface = {
  name: 'hurricane_ridge',
  description: 'Hurricane Ridge',
  region: 'olympics',
  latitude: 47.9692,
  longitude: -123.4979,
};

// Daily forecast helper
const createDailyForecast = (datetime: string, overrides: Partial<DailyForecastInterface> = {}): DailyForecastInterface => ({
  datetime,
  tempmax: 35,
  tempmin: 28,
  precip: 0.5,
  precipprob: 60,
  precipcover: 40,
  cloudcover: 80,
  sunrise: '07:30:00',
  sunset: '17:00:00',
  moonphase: 0.5,
  conditions: 'Snow',
  description: 'Snow expected throughout the day',
  icon: 'snow',
  ...overrides,
});

export const mockForecastResponse: ForecastResponse = {
  dates: ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19'],
  regions: {
    byId: {
      cascades: {
        name: 'cascades',
        description: 'Cascade Mountains',
        locations: [mtBakerLocation, stevensPassLocation],
      },
      olympics: {
        name: 'olympics',
        description: 'Olympic Peninsula',
        locations: [hurricaneRidgeLocation],
      },
    },
    allIds: ['cascades', 'olympics'],
  },
  locations: {
    byId: {
      mt_baker: mtBakerLocation,
      stevens_pass: stevensPassLocation,
      hurricane_ridge: hurricaneRidgeLocation,
    },
    allIds: ['mt_baker', 'stevens_pass', 'hurricane_ridge'],
  },
  forecasts: {
    byId: {
      mt_baker: [
        createDailyForecast('2024-01-15'),
        createDailyForecast('2024-01-16'),
        createDailyForecast('2024-01-17'),
        createDailyForecast('2024-01-18'),
        createDailyForecast('2024-01-19'),
      ],
      stevens_pass: [
        createDailyForecast('2024-01-15', { tempmax: 32, tempmin: 25, conditions: 'Partly Cloudy', icon: 'partly-cloudy-day' }),
        createDailyForecast('2024-01-16', { tempmax: 32, tempmin: 25, conditions: 'Partly Cloudy', icon: 'partly-cloudy-day' }),
        createDailyForecast('2024-01-17', { tempmax: 32, tempmin: 25, conditions: 'Partly Cloudy', icon: 'partly-cloudy-day' }),
        createDailyForecast('2024-01-18', { tempmax: 32, tempmin: 25, conditions: 'Partly Cloudy', icon: 'partly-cloudy-day' }),
        createDailyForecast('2024-01-19', { tempmax: 32, tempmin: 25, conditions: 'Partly Cloudy', icon: 'partly-cloudy-day' }),
      ],
      hurricane_ridge: [
        createDailyForecast('2024-01-15', { tempmax: 38, tempmin: 30, conditions: 'Cloudy', icon: 'cloudy' }),
        createDailyForecast('2024-01-16', { tempmax: 38, tempmin: 30, conditions: 'Cloudy', icon: 'cloudy' }),
        createDailyForecast('2024-01-17', { tempmax: 38, tempmin: 30, conditions: 'Cloudy', icon: 'cloudy' }),
        createDailyForecast('2024-01-18', { tempmax: 38, tempmin: 30, conditions: 'Cloudy', icon: 'cloudy' }),
        createDailyForecast('2024-01-19', { tempmax: 38, tempmin: 30, conditions: 'Cloudy', icon: 'cloudy' }),
      ],
    },
  },
  alertsById: {},
  allAlertIds: [],
};

// API response wrapper (how the backend returns it)
export const mockApiResponse = {
  success: true,
  data: mockForecastResponse,
};

// Create a cache entry structure
export function createCacheEntry(
  forecast: ForecastResponse = mockForecastResponse,
  options: {
    timestamp?: number;
    dataSource?: string;
    version?: string;
  } = {},
) {
  return {
    forecast,
    timestamp: options.timestamp ?? Date.now(),
    dataSource: options.dataSource ?? 'real',
    version: options.version ?? '1.0',
  };
}

// Create stale cache (older than 5 minutes)
export function createStaleCacheEntry(ageMinutes: number = 10) {
  const staleTimestamp = Date.now() - ageMinutes * 60 * 1000;
  return createCacheEntry(mockForecastResponse, { timestamp: staleTimestamp });
}

// Create fresh cache (less than 5 minutes old)
export function createFreshCacheEntry(ageMinutes: number = 2) {
  const freshTimestamp = Date.now() - ageMinutes * 60 * 1000;
  return createCacheEntry(mockForecastResponse, { timestamp: freshTimestamp });
}
