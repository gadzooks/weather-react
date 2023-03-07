/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DefaultForecastResponseStatus, ForecastResponseStatus } from '../../interfaces/ForecastResponseInterface';

const initialState: ForecastResponseStatus = DefaultForecastResponseStatus;

export const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    mergeForecast(state, action: PayloadAction<ForecastResponseStatus>) {
      state.forecastDates = action.payload.forecastDates;
      state.forecast = action.payload.forecast;
      state.error = action.payload.error;
      state.isLoaded = action.payload.isLoaded;
    },
  },
});

export const { mergeForecast } = forecastSlice.actions;
export default forecastSlice.reducer;
