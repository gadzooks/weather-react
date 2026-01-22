// SummaryTableLoader.tsx

import { useEffect, useState, useCallback } from 'react';
import type { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';
import type { MatchedAreas } from '../../../interfaces/MatchedAreas';
import findMatchedAreas from '../../../utils/filterMatchedAreas';
import useLocalStorage from '../../../utils/localstorage';
import { LS_DAILY_FORECAST_FILTER_KEY } from '../Constants';
import SummaryTable, { type SummaryTableProps } from './SummaryTable';
import weatherLoadingError from '../../../images/little-rain-tornado-rainstorm.gif';
import weatherLoading from '../../../images/weather-loading.gif';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  mergeForecast,
  loadCachedForecast,
  setRefreshing,
  setRefreshError,
} from '../../../features/forecast/forecastSlice';
import type { ForecastResponseStatus } from '../../../interfaces/ForecastResponseInterface';
import fetchWithRetries from '../../../api/retry';
import {
  loadForecastFromCache,
  saveForecastToCache,
} from '../../../utils/forecastCache';
import { RefreshErrorBanner } from './RefreshErrorBanner';
import './SummaryTableLoader.scss';

// Allow override via env var, otherwise use 'real' by default
const dataSource = import.meta.env.VITE_DATA_SOURCE || 'real';
const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;
const url = `${WEATHER_API}/forecasts/${dataSource}`;

console.log(`[SummaryTableLoader] Data source: ${dataSource}`);

export function SummaryTableLoader() {
  const dispatch = useAppDispatch();
  const [isRefreshErrorDismissed, setIsRefreshErrorDismissed] = useState(false);

  useEffect(() => {
    // STEP 1: Load cached data immediately for instant display
    console.log('[SummaryTableLoader] Checking for cached forecast data...');
    const cached = loadForecastFromCache();
    if (cached) {
      console.log(
        '[SummaryTableLoader] Found cached data!',
        'timestamp:', cached.timestamp,
        'age:', new Date(cached.timestamp).toISOString(),
      );
      dispatch(
        loadCachedForecast({
          forecast: cached.forecast,
          cacheTimestamp: cached.timestamp,
          dataSource: cached.dataSource,
        }),
      );
    } else {
      console.log('[SummaryTableLoader] No cached data found in localStorage');
    }

    // STEP 2: Attempt fresh data fetch
    const fetchData = async () => {
      // get the data from the api with JWT authentication
      const response = await fetchWithRetries(`${url}`, {
        headers: {
          Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

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

      // STEP 3: Save to cache on success and get the timestamp
      const cacheTimestamp = Date.now();
      const saveSuccess = saveForecastToCache(json.data, dataSource);
      console.log('[SummaryTableLoader] Cache save result:', saveSuccess ? 'SUCCESS' : 'FAILED');

      // STEP 4: Update state with fresh data (use same timestamp as cache)
      const newAppState: ForecastResponseStatus = {
        isLoaded: true,
        forecast: json.data,
        error: null,
        isFromCache: false,
        cacheTimestamp,
        dataSource,
      };
      dispatch(mergeForecast(newAppState));
    };

    fetchData().catch((err) => {
      console.error('[SummaryTableLoader] Caught error:', err);
      console.error('[SummaryTableLoader] Error stack:', err.stack);

      // STEP 5: On error, keep cached data if available
      if (cached) {
        console.log(
          '[SummaryTableLoader] Fetch failed, keeping cached data with offline indicator',
        );
        const offlineState: ForecastResponseStatus = {
          isLoaded: true,
          forecast: cached.forecast,
          error: err,
          isFromCache: true,
          cacheTimestamp: cached.timestamp,
          dataSource: cached.dataSource,
        };
        dispatch(mergeForecast(offlineState));
      } else {
        // No cache - show error
        console.log('[SummaryTableLoader] Fetch failed with no cached data');
        const errorAppState: ForecastResponseStatus = {
          isLoaded: false,
          error: err,
          forecast: null,
        };
        dispatch(mergeForecast(errorAppState));
      }
    });
  }, [dispatch]);

  const appState = useAppSelector((state) => state.forecast);

  const handleManualRefresh = useCallback(async () => {
    console.log('[SummaryTableLoader] Manual refresh initiated');

    // Prevent duplicate requests
    if (appState.isRefreshing) {
      console.log('[SummaryTableLoader] Refresh already in progress, ignoring');
      return;
    }

    // Store scroll position
    const scrollY = window.scrollY;

    // Set refreshing state
    dispatch(setRefreshing(true));

    try {
      // Fetch fresh data (same logic as useEffect)
      const response = await fetchWithRetries(`${url}`, {
        headers: {
          Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[SummaryTableLoader] Manual refresh response:', {
        contentType: response.headers.get('content-type'),
        status: response.status,
      });

      // Check if response is ok
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. Body: ${text.substring(0, 200)}`,
        );
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(
          `Expected JSON but got ${contentType}. Body: ${text.substring(0, 200)}`,
        );
      }

      // Parse response
      const json = await response.json();

      // Save to cache
      const cacheTimestamp = Date.now();
      saveForecastToCache(json.data, dataSource);

      // Update Redux state
      const newAppState: ForecastResponseStatus = {
        isLoaded: true,
        forecast: json.data,
        error: null,
        isFromCache: false,
        cacheTimestamp,
        dataSource,
        lastUpdateTime: cacheTimestamp,
      };
      dispatch(mergeForecast(newAppState));

      // Restore scroll position
      window.scrollTo(0, scrollY);

      // Reset error dismissal state
      setIsRefreshErrorDismissed(false);

      console.log('[SummaryTableLoader] Manual refresh successful');

      // Trigger success toast
      window.dispatchEvent(
        new CustomEvent('forecast-updated', {
          detail: { timestamp: cacheTimestamp },
        }),
      );
    } catch (err) {
      console.error('[SummaryTableLoader] Manual refresh failed:', err);

      // Set error state, keep old data visible
      dispatch(setRefreshError(err as Error));

      // Restore scroll position
      window.scrollTo(0, scrollY);
    }
  }, [dispatch, appState.isRefreshing, setIsRefreshErrorDismissed]);

  // Listen for manual refresh events from App or other components
  useEffect(() => {
    const handleManualRefreshRequest = () => {
      handleManualRefresh();
    };

    window.addEventListener(
      'manual-refresh-requested',
      handleManualRefreshRequest,
    );
    return () =>
      window.removeEventListener(
        'manual-refresh-requested',
        handleManualRefreshRequest,
      );
  }, [handleManualRefresh]);

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

  const summaryTableArgs: SummaryTableProps = {
    matchedAreas,
    dailyForecastFilter,
    setDailyForecastFilter,
    forecastResponse: appState.forecast,
  };

  return (
    <>
      {!isRefreshErrorDismissed && (
        <RefreshErrorBanner
          onRetry={handleManualRefresh}
          onDismiss={() => {
            setIsRefreshErrorDismissed(true);
          }}
        />
      )}
      {!appState.isLoaded && !appState.error && !appState.isFromCache && (
        <>
          <div className='loading'>
            <h2>Weather loading...</h2>
          </div>
          <div className='loading'>
            <img src={weatherLoading} alt='Loading...' />
          </div>
        </>
      )}
      {appState?.error && !appState.isFromCache && (
        <div className='error'>
          <h2>{appState.error?.message}</h2>
          <div className='error-image'>
            <img src={weatherLoadingError} alt='Error loading weather...' />
          </div>
          <button onClick={handleManualRefresh} className='error-retry-button'>
            Retry
          </button>
        </div>
      )}
      {matchedAreas.totalMatchedLocations > 0 && (
        <div className='table-wrapper'>
          <SummaryTable {...summaryTableArgs} />
        </div>
      )}
    </>
  );
}

export default SummaryTableLoader;
