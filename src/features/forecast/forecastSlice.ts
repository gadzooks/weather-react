// forecastSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  DefaultForecastResponseStatus,
  type ForecastResponseStatus,
  type ForecastResponse,
} from '../../interfaces/ForecastResponseInterface';
import type { DailyForecastInterface } from '../../interfaces/DailyForecastInterface';

const initialState: ForecastResponseStatus = DefaultForecastResponseStatus;

export const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    mergeForecast(state, action: PayloadAction<ForecastResponseStatus>) {
      return {
        ...state,
        forecast: action.payload.forecast,
        error: action.payload.error,
        isLoaded: action.payload.isLoaded,
        isFromCache: action.payload.isFromCache,
        cacheTimestamp: action.payload.cacheTimestamp,
        dataSource: action.payload.dataSource,
      };
    },
    loadCachedForecast(
      state,
      action: PayloadAction<{
        forecast: ForecastResponse;
        cacheTimestamp: number;
        dataSource: string;
      }>,
    ) {
      return {
        ...state,
        forecast: action.payload.forecast,
        error: null,
        isLoaded: true,
        isFromCache: true,
        cacheTimestamp: action.payload.cacheTimestamp,
        dataSource: action.payload.dataSource,
      };
    },
    updateLocationForecast(
      state,
      action: PayloadAction<{
        locationName: string;
        forecast: DailyForecastInterface[];
      }>,
    ) {
      // Only update if forecast exists
      if (state.forecast?.forecasts?.byId) {
        state.forecast.forecasts.byId[action.payload.locationName] =
          action.payload.forecast;
      }
    },
  },
});

export const { mergeForecast, loadCachedForecast, updateLocationForecast } =
  forecastSlice.actions;
export default forecastSlice.reducer;
