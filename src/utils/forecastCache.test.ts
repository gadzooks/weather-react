// forecastCache.test.ts

import {
  saveForecastToCache,
  loadForecastFromCache,
  clearForecastCache,
  getCacheAge,
  isCacheStale,
  LS_FORECAST_CACHE_KEY,
} from './forecastCache';
import type { ForecastResponse } from '../interfaces/ForecastResponseInterface';

// Mock console methods to suppress logs during tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
});
afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// localStorage mock
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    // For testing
    _getStore: () => store,
    _setStore: (newStore: Record<string, string>) => {
      store = newStore;
    },
  };
};

const mockForecast: ForecastResponse = {
  dates: ['2024-01-15', '2024-01-16'],
  regions: {
    byId: {
      region1: {
        name: 'region1',
        description: 'Test Region',
        locations: [],
      },
    },
    allIds: ['region1'],
  },
  locations: {
    byId: {
      loc1: {
        name: 'loc1',
        description: 'Test Location',
        region: 'region1',
        latitude: 47.0,
        longitude: -122.0,
      },
    },
    allIds: ['loc1'],
  },
  forecasts: {
    byId: {},
  },
  alertsById: {},
  allAlertIds: [],
};

describe('forecastCache', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.spyOn(Date, 'now').mockReturnValue(1705363200000); // Fixed timestamp
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('saveForecastToCache', () => {
    it('should save forecast to localStorage with timestamp and version', () => {
      const result = saveForecastToCache(mockForecast, 'real');

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LS_FORECAST_CACHE_KEY,
        expect.any(String),
      );

      const savedData = JSON.parse(
        localStorageMock._getStore()[LS_FORECAST_CACHE_KEY],
      );
      expect(savedData.forecast).toEqual(mockForecast);
      expect(savedData.timestamp).toBe(1705363200000);
      expect(savedData.dataSource).toBe('real');
      expect(savedData.version).toBe('1.0');
    });

    it('should return true on successful save', () => {
      const result = saveForecastToCache(mockForecast, 'mock');
      expect(result).toBe(true);
    });

    it('should verify save by reading back', () => {
      saveForecastToCache(mockForecast, 'real');

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        LS_FORECAST_CACHE_KEY,
      );
    });

    it('should handle QuotaExceededError and clear cache', () => {
      const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw quotaError;
      });

      const result = saveForecastToCache(mockForecast, 'real');

      expect(result).toBe(false);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        LS_FORECAST_CACHE_KEY,
      );
    });

    it('should return false on general error', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Unknown error');
      });

      const result = saveForecastToCache(mockForecast, 'real');

      expect(result).toBe(false);
    });

    it('should return false if verification fails', () => {
      // setItem succeeds but getItem returns null
      localStorageMock.getItem.mockReturnValueOnce(null);

      const result = saveForecastToCache(mockForecast, 'real');

      expect(result).toBe(false);
    });
  });

  describe('loadForecastFromCache', () => {
    it('should return null when no cached data exists', () => {
      const result = loadForecastFromCache();

      expect(result).toBeNull();
    });

    it('should return parsed data when valid cache exists', () => {
      const cachedData = {
        forecast: mockForecast,
        timestamp: 1705363200000,
        dataSource: 'real',
        version: '1.0',
      };
      localStorageMock._setStore({
        [LS_FORECAST_CACHE_KEY]: JSON.stringify(cachedData),
      });

      const result = loadForecastFromCache();

      expect(result).toEqual(cachedData);
    });

    it('should return null and clear on version mismatch', () => {
      const cachedData = {
        forecast: mockForecast,
        timestamp: 1705363200000,
        dataSource: 'real',
        version: '0.9', // Old version
      };
      localStorageMock._setStore({
        [LS_FORECAST_CACHE_KEY]: JSON.stringify(cachedData),
      });

      const result = loadForecastFromCache();

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        LS_FORECAST_CACHE_KEY,
      );
    });

    it('should return null and clear on invalid structure (no forecast)', () => {
      const cachedData = {
        timestamp: 1705363200000,
        dataSource: 'real',
        version: '1.0',
      };
      localStorageMock._setStore({
        [LS_FORECAST_CACHE_KEY]: JSON.stringify(cachedData),
      });

      const result = loadForecastFromCache();

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });

    it('should return null and clear on invalid structure (no timestamp)', () => {
      const cachedData = {
        forecast: mockForecast,
        dataSource: 'real',
        version: '1.0',
      };
      localStorageMock._setStore({
        [LS_FORECAST_CACHE_KEY]: JSON.stringify(cachedData),
      });

      const result = loadForecastFromCache();

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });

    it('should handle JSON parse errors and clear cache', () => {
      localStorageMock._setStore({
        [LS_FORECAST_CACHE_KEY]: 'invalid json {{{',
      });

      const result = loadForecastFromCache();

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });
  });

  describe('clearForecastCache', () => {
    it('should remove forecast cache from localStorage', () => {
      clearForecastCache();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        LS_FORECAST_CACHE_KEY,
      );
    });

    it('should handle errors gracefully', () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Remove failed');
      });

      // Should not throw
      expect(() => clearForecastCache()).not.toThrow();
    });
  });

  describe('getCacheAge', () => {
    it('should return "just now" for timestamps less than a minute old', () => {
      const timestamp = Date.now() - 30000; // 30 seconds ago

      expect(getCacheAge(timestamp)).toBe('less than a minute ago');
    });

    it('should return "X minute(s) ago" for minute-old cache', () => {
      const oneMinuteAgo = Date.now() - 60000;
      const fiveMinutesAgo = Date.now() - 5 * 60000;

      expect(getCacheAge(oneMinuteAgo)).toBe('1 min ago');
      expect(getCacheAge(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should return "X hour(s) ago" for hour-old cache', () => {
      const oneHourAgo = Date.now() - 60 * 60000;
      const threeHoursAgo = Date.now() - 3 * 60 * 60000;

      expect(getCacheAge(oneHourAgo)).toBe('1 hour ago');
      expect(getCacheAge(threeHoursAgo)).toBe('3 hours ago');
    });

    it('should return "X day(s) ago" for day-old cache', () => {
      const oneDayAgo = Date.now() - 24 * 60 * 60000;
      const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60000;

      expect(getCacheAge(oneDayAgo)).toBe('1 day ago');
      expect(getCacheAge(twoDaysAgo)).toBe('2 days ago');
    });

    it('should handle plural correctly (1 day vs 2 days)', () => {
      const oneDayAgo = Date.now() - 24 * 60 * 60000;
      const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60000;

      expect(getCacheAge(oneDayAgo)).not.toContain('days');
      expect(getCacheAge(twoDaysAgo)).toContain('days');
    });
  });

  describe('isCacheStale', () => {
    it('should return false for fresh cache', () => {
      const freshTimestamp = Date.now() - 2 * 60 * 1000; // 2 minutes ago

      expect(isCacheStale(freshTimestamp)).toBe(false);
    });

    it('should return true for stale cache (older than threshold)', () => {
      const staleTimestamp = Date.now() - 10 * 60 * 1000; // 10 minutes ago

      expect(isCacheStale(staleTimestamp)).toBe(true);
    });

    it('should use default 5 minute threshold', () => {
      const exactlyFiveMinutes = Date.now() - 5 * 60 * 1000;
      const justOverFiveMinutes = Date.now() - 5 * 60 * 1000 - 1;

      // Exactly at threshold should not be stale
      expect(isCacheStale(exactlyFiveMinutes)).toBe(false);
      // Just over threshold should be stale
      expect(isCacheStale(justOverFiveMinutes)).toBe(true);
    });

    it('should respect custom threshold parameter', () => {
      const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
      const oneMinuteThreshold = 1 * 60 * 1000;

      expect(isCacheStale(twoMinutesAgo, oneMinuteThreshold)).toBe(true);
    });
  });
});
