// SummaryTableLoader.tsx

import { useEffect, useState, useCallback } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
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
import { StaleDataBanner } from './StaleDataBanner';
import Breadcrumbs from '../common/Breadcrumbs';
import RegionNavigation from './RegionNavigation';
import './SummaryTableLoader.scss';

// Allow override via env var, otherwise use 'real' by default
const dataSource = import.meta.env.VITE_DATA_SOURCE || 'real';
const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;
const url = `${WEATHER_API}/forecasts/${dataSource}`;

// 3 hours in milliseconds
const STALE_THRESHOLD_MS = 3 * 60 * 60 * 1000;

console.log(`[SummaryTableLoader] Data source: ${dataSource}`);

export function SummaryTableLoader() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showAqi } = useOutletContext<{ showAqi: boolean }>();
  const [searchParams] = useSearchParams();
  const regionFilter = searchParams.get('region');
  const [isRefreshErrorDismissed, setIsRefreshErrorDismissed] = useState(false);
  const [isStaleBannerDismissed, setIsStaleBannerDismissed] = useState(false);
  const appState = useAppSelector((state) => state.forecast);

  // Track whether we need to auto-fetch data on mount
  const [needsAutoFetch, setNeedsAutoFetch] = useState(false);

  useEffect(() => {
    // Skip if Redux already has forecast data loaded
    // This prevents unnecessary localStorage reads when navigating back to Home
    if (appState.forecast && appState.isLoaded) {
      console.log('[SummaryTableLoader] Redux already has forecast data, skipping localStorage read');
      return;
    }

    // Load cached data from localStorage only if Redux is empty
    console.log('[SummaryTableLoader] Redux empty, checking for cached forecast data...');
    const cached = loadForecastFromCache();
    if (cached) {
      console.log(
        '[SummaryTableLoader] Found cached data!',
        'timestamp:', cached.timestamp,
        'age:', new Date(cached.timestamp).toISOString(),
      );
      // Load cached data but mark as NOT from cache to avoid showing offline banner
      // The stale banner will handle showing warnings for old data
      const cachedState: ForecastResponseStatus = {
        isLoaded: true,
        forecast: cached.forecast,
        error: null,
        isFromCache: false, // Don't show offline banner for cached data
        cacheTimestamp: cached.timestamp,
        dataSource: cached.dataSource,
      };
      dispatch(mergeForecast(cachedState));
    } else {
      console.log('[SummaryTableLoader] No cached data found - will automatically fetch from API');
      // No cached data - trigger auto-fetch
      setNeedsAutoFetch(true);
    }
  }, [dispatch, appState.forecast, appState.isLoaded]);

  // Check if forecast data is stale (older than 3 hours)
  const isDataStale = appState.cacheTimestamp
    ? Date.now() - appState.cacheTimestamp > STALE_THRESHOLD_MS
    : false;

  // Debug logging for staleness check
  if (appState.cacheTimestamp) {
    const ageMs = Date.now() - appState.cacheTimestamp;
    const ageMinutes = Math.floor(ageMs / 1000 / 60);
    const ageHours = (ageMs / 1000 / 60 / 60).toFixed(2);
    console.log('[SummaryTableLoader] Staleness check:', {
      cacheTimestamp: appState.cacheTimestamp,
      currentTime: Date.now(),
      ageMs,
      ageMinutes: `${ageMinutes} mins`,
      ageHours: `${ageHours} hours`,
      thresholdMs: STALE_THRESHOLD_MS,
      thresholdHours: STALE_THRESHOLD_MS / 1000 / 60 / 60,
      isDataStale,
    });
  }

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

      // Reset error and stale banner dismissal states
      setIsRefreshErrorDismissed(false);
      setIsStaleBannerDismissed(false);

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
  }, [dispatch, appState.isRefreshing]);

  // Auto-fetch data on mount if no cached data exists
  useEffect(() => {
    if (needsAutoFetch && !appState.isRefreshing) {
      console.log('[SummaryTableLoader] Auto-fetching data on mount');
      handleManualRefresh();
      setNeedsAutoFetch(false);
    }
  }, [needsAutoFetch, appState.isRefreshing, handleManualRefresh]);

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
    matchedAreas = findMatchedAreas(null, appState.forecast.regions, {
      regionFilter,
    });
  }

  // Build list of all regions for navigation
  const allRegions = appState.forecast?.regions?.allIds.map((id) => {
    const region = appState.forecast!.regions.byId[id];
    return {
      name: region.name,
      slug: region.name.toLowerCase().replace(/\s+/g, '-'),
      description: region.description,
    };
  }) || [];

  // Get current region description for breadcrumbs
  const currentRegionDescription = regionFilter
    ? allRegions.find((r) => r.slug === regionFilter)?.description || regionFilter
    : null;

  const handleRegionChange = (regionSlug: string) => {
    navigate(`/?region=${regionSlug}`);
  };

  const summaryTableArgs: SummaryTableProps = {
    matchedAreas,
    dailyForecastFilter,
    setDailyForecastFilter,
    forecastResponse: appState.forecast,
    showAqi,
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
      {!isStaleBannerDismissed && isDataStale && appState.isLoaded && (
        <StaleDataBanner
          onRefresh={handleManualRefresh}
          onDismiss={() => {
            setIsStaleBannerDismissed(true);
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
      {regionFilter && matchedAreas.totalMatchedLocations > 0 && (
        <>
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: currentRegionDescription || regionFilter },
            ]}
          />
          <RegionNavigation
            currentRegion={regionFilter}
            allRegions={allRegions}
            onRegionChange={handleRegionChange}
          />
        </>
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
