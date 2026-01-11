// SummaryTableLoader.tsx

import React, { useEffect, useState } from 'react';
import { parse } from 'fecha';
import type { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';
import type { MatchedAreas } from '../../../interfaces/MatchedAreas';
import findMatchedAreas from '../../../utils/filterMatchedAreas';
import useLocalStorage from '../../../utils/localstorage';
import { LS_DAILY_FORECAST_FILTER_KEY } from '../Constants';
import LocationDetail, {
  type LocationDetailProps,
} from '../location_details/LocationDetail';
import SummaryTable, { type SummaryTableProps } from './SummaryTable';
import weatherLoadingError from '../../../images/little-rain-tornado-rainstorm.gif';
import weatherLoading from '../../../images/weather-loading.gif';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { mergeForecast } from '../../../features/forecast/forecastSlice';
import type {
  ForecastDates,
  ForecastResponseStatus,
} from '../../../interfaces/ForecastResponseInterface';
import { calculateWeekends } from '../../../utils/date';
import fetchWithRetries from '../../../api/retry';
import { useTheme } from '../../../utils/useTheme';
import { ThemeToggle } from '../theme/ThemeToggle';
import './SummaryTableLoader.scss';

// Allow override via env var, otherwise use 'real' by default
const dataSource = import.meta.env.VITE_DATA_SOURCE || 'real';
const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;
const url = `${WEATHER_API}/forecasts/${dataSource}`;

console.log(`[SummaryTableLoader] Data source: ${dataSource}`);

export function SummaryTableLoader() {
  const [forecastDetailsForLocation, setForecastDetailsForLocation] =
    useState<string>();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      // console.log(`[SummaryTableLoader] Fetching from: ${url}`);
      // console.log(`[SummaryTableLoader] Using JWT token: ${WEATHER_JWT_TOKEN ? 'Yes' : 'No'}`);

      // get the data from the api with JWT authentication
      const response = await fetchWithRetries(`${url}`, {
        headers: {
          Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      // console.log(`[SummaryTableLoader] Response status: ${response.status}`,
      //   `${response.statusText}`);
      console.log('[SummaryTableLoader] Response headers:', {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
      });

      // Check if response is ok
      if (!response.ok) {
        const text = await response.text();
        console.error(
          '[SummaryTableLoader] Error response body (first 500 chars):',
          text.substring(0, 500),
        );
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. Body: ${text.substring(0, 200)}`,
        );
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error(
          `[SummaryTableLoader] Unexpected content-type: ${contentType}`,
        );
        console.error(
          '[SummaryTableLoader] Response body (first 500 chars):',
          text.substring(0, 500),
        );
        throw new Error(
          `Expected JSON but got ${contentType}. Body: ${text.substring(0, 200)}`,
        );
      }

      // convert the data to json
      const json = await response.json();

      // set state with the result
      const newAppState: ForecastResponseStatus = {
        isLoaded: true,
        forecast: json.data,
        error: null,
      };
      dispatch(mergeForecast(newAppState));
    };

    fetchData().catch((err) => {
      console.error('[SummaryTableLoader] Caught error:', err);
      console.error('[SummaryTableLoader] Error stack:', err.stack);
      const errorAppState: ForecastResponseStatus = {
        isLoaded: false,
        error: err,
        forecast: null,
      };
      dispatch(mergeForecast(errorAppState));
    });
  }, []);

  const appState = useAppSelector((state) => state.forecast);

  // const [searchText, setSearchText] = useLocalStorage(LS_SEARCH_KEY, '');
  const defaultDailyForecastFilter: DailyForecastFilter = {
    date: undefined,
    tempmax: undefined,
    tempmin: undefined,
    precip: undefined,
    precipprob: undefined,
  };
  const [dailyForecastFilter, setDailyForecastFilter] = useLocalStorage(
    LS_DAILY_FORECAST_FILTER_KEY,
    defaultDailyForecastFilter,
  );

  let matchedAreas: MatchedAreas = { totalMatchedLocations: 0 };
  if (appState.isLoaded && appState.forecast) {
    matchedAreas = findMatchedAreas(null, appState.forecast.regions);
  }

  const parsedDates = (appState.forecast?.dates || []).map((d: string) =>
    parse(d, 'YYYY-MM-DD'),
  );
  const weekends = calculateWeekends(parsedDates);

  const forecastDates: ForecastDates = {
    dates: appState.forecast?.dates || [],
    parsedDates,
    weekends,
  };

  const locationDetailArgs: LocationDetailProps = {
    appState,
    forecastDetailsForLocation,
    setForecastDetailsForLocation,
    forecastDates,
    alertsById: appState.forecast?.alertsById,
    allAlertIds: appState.forecast?.allAlertIds,
  };

  const summaryTableArgs: SummaryTableProps = {
    matchedAreas,
    dailyForecastFilter,
    setDailyForecastFilter,
    setForecastDetailsForLocation,
    forecastResponse: appState.forecast,
  };

  return (
    <div className='theme font-loader'>
      <div className='app-header'>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <div className='container'>
        {!appState.isLoaded && !appState.error && (
          <>
            <div className='loading'>
              <h2>Weather loading...</h2>
            </div>
            <div className='loading'>
              <img src={weatherLoading} alt='Loading...' />
            </div>
          </>
        )}
        {appState?.error && (
          <div className='error'>
            <h2>{appState.error?.message}</h2>
            <div className='error-image'>
              <img src={weatherLoadingError} alt='Error loading weather...' />
            </div>
          </div>
        )}
        {!forecastDetailsForLocation &&
          matchedAreas.totalMatchedLocations > 0 && (
            <div className='table-wrapper'>
              <SummaryTable {...summaryTableArgs} />
            </div>
          )}
        <div>
          {forecastDetailsForLocation && (
            <LocationDetail {...locationDetailArgs} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryTableLoader;
