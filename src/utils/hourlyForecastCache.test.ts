import {
  saveHourlyToCache,
  loadHourlyFromCache,
  clearOldHourlyEntries,
  clearHourlyCache,
} from './hourlyForecastCache';
import type { HourlyForecastResponse } from '../interfaces/HourlyForecastInterface';

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

const LS_HOURLY_CACHE_KEY = 'weatherHourlyCache';

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
    _getStore: () => store,
    _setStore: (newStore: Record<string, string>) => {
      store = newStore;
    },
  };
};

const mockHourlyData: HourlyForecastResponse = {
  location: 'mt_baker',
  locationDescription: 'Mt. Baker',
  date: '2024-01-15',
  sunrise: '07:30:00',
  sunset: '17:00:00',
  hours: [
    {
      datetime: '08:00:00',
      datetimeEpoch: 1705363200,
      temp: 35,
      feelslike: 30,
      humidity: 80,
      dew: 30,
      precip: 0,
      precipprob: 10,
      preciptype: null,
      snow: 0,
      snowdepth: null,
      windgust: 20,
      windspeed: 10,
      winddir: 270,
      pressure: 1020,
      visibility: 10,
      cloudcover: 50,
      solarradiation: 150,
      solarenergy: 0.5,
      uvindex: 2,
      severerisk: 0,
      conditions: 'Partly Cloudy',
      icon: 'partly-cloudy-day',
    },
  ],
};

describe('hourlyForecastCache', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;
  const fixedTimestamp = 1705363200000;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.spyOn(Date, 'now').mockReturnValue(fixedTimestamp);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('saveHourlyToCache', () => {
    it('should save hourly data with composite key (location_date)', () => {
      const result = saveHourlyToCache('mt_baker', '2024-01-15', mockHourlyData);

      expect(result).toBe(true);

      const savedData = JSON.parse(
        localStorageMock._getStore()[LS_HOURLY_CACHE_KEY],
      );
      expect(savedData.entries['mt_baker_2024-01-15']).toBeDefined();
      expect(savedData.entries['mt_baker_2024-01-15'].data).toEqual(
        mockHourlyData,
      );
    });

    it('should create new store if none exists', () => {
      saveHourlyToCache('mt_baker', '2024-01-15', mockHourlyData);

      const savedData = JSON.parse(
        localStorageMock._getStore()[LS_HOURLY_CACHE_KEY],
      );
      expect(savedData.version).toBe('1.0');
      expect(savedData.entries).toBeDefined();
    });

    it('should append to existing store', () => {
      // Save first entry
      saveHourlyToCache('mt_baker', '2024-01-15', mockHourlyData);

      // Save second entry
      const secondData = { ...mockHourlyData, date: '2024-01-16' };
      saveHourlyToCache('mt_baker', '2024-01-16', secondData);

      const savedData = JSON.parse(
        localStorageMock._getStore()[LS_HOURLY_CACHE_KEY],
      );
      expect(Object.keys(savedData.entries)).toHaveLength(2);
      expect(savedData.entries['mt_baker_2024-01-15']).toBeDefined();
      expect(savedData.entries['mt_baker_2024-01-16']).toBeDefined();
    });

    it('should handle QuotaExceededError', () => {
      // First call sets up store, second call throws
      localStorageMock.setItem
        .mockImplementationOnce((key, value) => {
          localStorageMock._getStore()[key] = value;
        })
        .mockImplementationOnce(() => {
          throw new DOMException('Quota exceeded', 'QuotaExceededError');
        });

      saveHourlyToCache('mt_baker', '2024-01-15', mockHourlyData);
      const result = saveHourlyToCache('mt_baker', '2024-01-16', mockHourlyData);

      expect(result).toBe(false);
    });

    it('should return true on success, false on failure', () => {
      const successResult = saveHourlyToCache(
        'mt_baker',
        '2024-01-15',
        mockHourlyData,
      );
      expect(successResult).toBe(true);

      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Unknown error');
      });

      const failResult = saveHourlyToCache(
        'mt_baker',
        '2024-01-16',
        mockHourlyData,
      );
      expect(failResult).toBe(false);
    });
  });

  describe('loadHourlyFromCache', () => {
    it('should return null when no cache store exists', () => {
      const result = loadHourlyFromCache('mt_baker', '2024-01-15');

      expect(result).toBeNull();
    });

    it('should return null when no entry for key exists', () => {
      // Create store with different key
      const store = {
        version: '1.0',
        entries: {
          'other_location_2024-01-15': {
            data: mockHourlyData,
            timestamp: fixedTimestamp,
          },
        },
      };
      localStorageMock._setStore({
        [LS_HOURLY_CACHE_KEY]: JSON.stringify(store),
      });

      const result = loadHourlyFromCache('mt_baker', '2024-01-15');

      expect(result).toBeNull();
    });

    it('should return data when valid entry exists', () => {
      const store = {
        version: '1.0',
        entries: {
          'mt_baker_2024-01-15': {
            data: mockHourlyData,
            timestamp: fixedTimestamp,
          },
        },
      };
      localStorageMock._setStore({
        [LS_HOURLY_CACHE_KEY]: JSON.stringify(store),
      });

      const result = loadHourlyFromCache('mt_baker', '2024-01-15');

      expect(result).toEqual(mockHourlyData);
    });

    it('should handle version mismatch', () => {
      const store = {
        version: '0.9', // Old version
        entries: {
          'mt_baker_2024-01-15': {
            data: mockHourlyData,
            timestamp: fixedTimestamp,
          },
        },
      };
      localStorageMock._setStore({
        [LS_HOURLY_CACHE_KEY]: JSON.stringify(store),
      });

      const result = loadHourlyFromCache('mt_baker', '2024-01-15');

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        LS_HOURLY_CACHE_KEY,
      );
    });
  });

  describe('clearOldHourlyEntries', () => {
    it('should remove entries older than 7 days', () => {
      const sevenDaysAgo = fixedTimestamp - 8 * 24 * 60 * 60 * 1000; // 8 days ago
      const store = {
        version: '1.0',
        entries: {
          old_entry: {
            data: mockHourlyData,
            timestamp: sevenDaysAgo,
          },
          new_entry: {
            data: mockHourlyData,
            timestamp: fixedTimestamp,
          },
        },
      };
      localStorageMock._setStore({
        [LS_HOURLY_CACHE_KEY]: JSON.stringify(store),
      });

      clearOldHourlyEntries();

      const savedData = JSON.parse(
        localStorageMock._getStore()[LS_HOURLY_CACHE_KEY],
      );
      expect(savedData.entries.old_entry).toBeUndefined();
      expect(savedData.entries.new_entry).toBeDefined();
    });

    it('should keep entries newer than 7 days', () => {
      const sixDaysAgo = fixedTimestamp - 6 * 24 * 60 * 60 * 1000;
      const store = {
        version: '1.0',
        entries: {
          recent_entry: {
            data: mockHourlyData,
            timestamp: sixDaysAgo,
          },
        },
      };
      localStorageMock._setStore({
        [LS_HOURLY_CACHE_KEY]: JSON.stringify(store),
      });

      clearOldHourlyEntries();

      const savedData = JSON.parse(
        localStorageMock._getStore()[LS_HOURLY_CACHE_KEY],
      );
      expect(savedData.entries.recent_entry).toBeDefined();
    });

    it('should do nothing if store is empty', () => {
      clearOldHourlyEntries();

      // Should not throw and should not create a store
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('clearHourlyCache', () => {
    it('should remove entire hourly cache from localStorage', () => {
      clearHourlyCache();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        LS_HOURLY_CACHE_KEY,
      );
    });

    it('should handle errors gracefully', () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Remove failed');
      });

      // Should not throw
      expect(() => clearHourlyCache()).not.toThrow();
    });
  });
});
