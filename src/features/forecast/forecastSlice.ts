import { createSlice } from '@reduxjs/toolkit';
import { DefaultForecastResponseStatus, ForecastResponseStatus } from '../../interfaces/ForecastResponseInterface';

const initialState: ForecastResponseStatus = DefaultForecastResponseStatus;

export const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {},
});

export default forecastSlice.reducer;
