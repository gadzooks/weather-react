// forecastSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  DefaultForecastResponseStatus,
  type ForecastResponseStatus,
} from '../../interfaces/ForecastResponseInterface';

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
  },
});

export const { mergeForecast } = forecastSlice.actions;
export default forecastSlice.reducer;
