import forecastReducer, {
  mergeForecast,
  loadCachedForecast,
  updateLocationForecast,
} from './forecastSlice';
import type {
  ForecastResponseStatus,
  ForecastResponse,
} from '../../interfaces/ForecastResponseInterface';
import type { DailyForecastInterface } from '../../interfaces/DailyForecastInterface';

const createMockForecast = (): ForecastResponse => ({
  dates: ['2024-01-15', '2024-01-16'],
  regions: {
    byId: {
      region1: {
        id: 'region1',
        description: 'Test Region',
        regionId: 'region1',
        locations: ['loc1'],
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
    byId: {
      loc1: [
        {
          time: '2024-01-15',
          summary: 'Clear',
          icon: 'clear-day',
          precipProbability: 0,
          temperature: 55,
          apparentTemperature: 55,
          dewPoint: 40,
          visibility: 10,
          cloudCover: 0,
          temperatureHigh: 60,
          temperatureLow: 45,
          sunsetTime: 1705363200,
          sunriseTime: 1705334400,
          precipAmount: 0,
        } as DailyForecastInterface,
      ],
    },
  },
  alertsById: {},
  allAlertIds: [],
});

describe('forecastSlice', () => {
  describe('initial state', () => {
    it('should have correct default state', () => {
      const state = forecastReducer(undefined, { type: 'unknown' });
      expect(state.isLoaded).toBe(false);
      expect(state.error).toBeNull();
      expect(state.forecast).toBeNull();
    });
  });

  describe('mergeForecast', () => {
    it('should update all forecast state properties', () => {
      const mockForecast = createMockForecast();
      const payload: ForecastResponseStatus = {
        forecast: mockForecast,
        error: null,
        isLoaded: true,
        isFromCache: false,
        cacheTimestamp: 1705363200000,
        dataSource: 'real',
      };

      const state = forecastReducer(undefined, mergeForecast(payload));

      expect(state.forecast).toEqual(mockForecast);
      expect(state.error).toBeNull();
      expect(state.isLoaded).toBe(true);
      expect(state.isFromCache).toBe(false);
      expect(state.cacheTimestamp).toBe(1705363200000);
      expect(state.dataSource).toBe('real');
    });

    it('should handle isFromCache flag', () => {
      const mockForecast = createMockForecast();
      const payload: ForecastResponseStatus = {
        forecast: mockForecast,
        error: null,
        isLoaded: true,
        isFromCache: true,
        cacheTimestamp: 1705363200000,
        dataSource: 'mock',
      };

      const state = forecastReducer(undefined, mergeForecast(payload));

      expect(state.isFromCache).toBe(true);
    });

    it('should handle error state', () => {
      const error = new Error('Network error');
      const payload: ForecastResponseStatus = {
        forecast: null,
        error,
        isLoaded: true,
        isFromCache: false,
      };

      const state = forecastReducer(undefined, mergeForecast(payload));

      expect(state.forecast).toBeNull();
      expect(state.error).toBe(error);
      expect(state.isLoaded).toBe(true);
    });
  });

  describe('loadCachedForecast', () => {
    it('should set forecast from cached data', () => {
      const mockForecast = createMockForecast();
      const payload = {
        forecast: mockForecast,
        cacheTimestamp: 1705363200000,
        dataSource: 'real',
      };

      const state = forecastReducer(undefined, loadCachedForecast(payload));

      expect(state.forecast).toEqual(mockForecast);
    });

    it('should set isLoaded to true', () => {
      const mockForecast = createMockForecast();
      const payload = {
        forecast: mockForecast,
        cacheTimestamp: 1705363200000,
        dataSource: 'mock',
      };

      const state = forecastReducer(undefined, loadCachedForecast(payload));

      expect(state.isLoaded).toBe(true);
    });

    it('should set isFromCache to true', () => {
      const mockForecast = createMockForecast();
      const payload = {
        forecast: mockForecast,
        cacheTimestamp: 1705363200000,
        dataSource: 'mock',
      };

      const state = forecastReducer(undefined, loadCachedForecast(payload));

      expect(state.isFromCache).toBe(true);
    });

    it('should set error to null', () => {
      const initialState: ForecastResponseStatus = {
        isLoaded: false,
        error: new Error('Previous error'),
        forecast: null,
      };
      const mockForecast = createMockForecast();
      const payload = {
        forecast: mockForecast,
        cacheTimestamp: 1705363200000,
        dataSource: 'mock',
      };

      const state = forecastReducer(initialState, loadCachedForecast(payload));

      expect(state.error).toBeNull();
    });

    it('should set cacheTimestamp correctly', () => {
      const mockForecast = createMockForecast();
      const timestamp = 1705400000000;
      const payload = {
        forecast: mockForecast,
        cacheTimestamp: timestamp,
        dataSource: 'mock',
      };

      const state = forecastReducer(undefined, loadCachedForecast(payload));

      expect(state.cacheTimestamp).toBe(timestamp);
    });

    it('should set dataSource correctly', () => {
      const mockForecast = createMockForecast();
      const payload = {
        forecast: mockForecast,
        cacheTimestamp: 1705363200000,
        dataSource: 'real',
      };

      const state = forecastReducer(undefined, loadCachedForecast(payload));

      expect(state.dataSource).toBe('real');
    });
  });

  describe('updateLocationForecast', () => {
    it('should update forecast for specific location', () => {
      const mockForecast = createMockForecast();
      const initialState: ForecastResponseStatus = {
        isLoaded: true,
        error: null,
        forecast: mockForecast,
      };

      const newForecastData: DailyForecastInterface[] = [
        {
          time: '2024-01-15',
          summary: 'Rainy',
          icon: 'rain',
          precipProbability: 80,
          temperature: 50,
          apparentTemperature: 48,
          dewPoint: 45,
          visibility: 5,
          cloudCover: 90,
          temperatureHigh: 52,
          temperatureLow: 42,
          sunsetTime: 1705363200,
          sunriseTime: 1705334400,
          precipAmount: 0.5,
        } as DailyForecastInterface,
      ];

      const state = forecastReducer(
        initialState,
        updateLocationForecast({
          locationName: 'loc1',
          forecast: newForecastData,
        }),
      );

      expect(state.forecast?.forecasts.byId.loc1).toEqual(newForecastData);
    });

    it('should not mutate if forecast is null', () => {
      const initialState: ForecastResponseStatus = {
        isLoaded: false,
        error: null,
        forecast: null,
      };

      const state = forecastReducer(
        initialState,
        updateLocationForecast({
          locationName: 'loc1',
          forecast: [],
        }),
      );

      expect(state.forecast).toBeNull();
    });

    it('should preserve other location forecasts', () => {
      const mockForecast = createMockForecast();
      // Add another location
      mockForecast.forecasts.byId.loc2 = [
        {
          time: '2024-01-15',
          summary: 'Cloudy',
          icon: 'cloudy',
        } as DailyForecastInterface,
      ];

      const initialState: ForecastResponseStatus = {
        isLoaded: true,
        error: null,
        forecast: mockForecast,
      };

      const newForecastData: DailyForecastInterface[] = [
        {
          time: '2024-01-15',
          summary: 'Updated',
          icon: 'clear-day',
        } as DailyForecastInterface,
      ];

      const state = forecastReducer(
        initialState,
        updateLocationForecast({
          locationName: 'loc1',
          forecast: newForecastData,
        }),
      );

      // loc1 should be updated
      expect(state.forecast?.forecasts.byId.loc1[0].summary).toBe('Updated');
      // loc2 should be preserved
      expect(state.forecast?.forecasts.byId.loc2[0].summary).toBe('Cloudy');
    });
  });
});
