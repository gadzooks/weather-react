// forecastSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  DefaultForecastResponseStatus,
  type ForecastResponseStatus,
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

export const { mergeForecast, updateLocationForecast } = forecastSlice.actions;
export default forecastSlice.reducer;
