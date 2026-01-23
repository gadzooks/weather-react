// LocationDetailWrapper.tsx
// Route-aware wrapper that reads URL params and renders LocationDetail

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parse } from 'fecha';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { fromSlugById, toSlug } from '../../../utils/slug';
import { serializeLocationData } from '../../../interfaces/LocationInterface';
import type { ForecastDates } from '../../../interfaces/ForecastResponseInterface';
import { calculateWeekends } from '../../../utils/date';
import { mergeForecast } from '../../../features/forecast/forecastSlice';
import fetchWithRetries from '../../../api/retry';
import type { ForecastResponseStatus } from '../../../interfaces/ForecastResponseInterface';
import LocationDetail from './LocationDetail';
import OutdatedDateBanner from './OutdatedDateBanner';
import weatherLoading from '../../../images/weather-loading.gif';

const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;
const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'real';

function LocationDetailWrapper() {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const appState = useAppSelector((state) => state.forecast);

  // State for tracking data fetch
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Fetch full forecast data if Redux store is empty (e.g., on browser refresh)
  useEffect(() => {
    const fetchFullForecast = async () => {
      setIsLoadingLocation(true);

      try {
        const url = `${WEATHER_API}/forecasts/${DATA_SOURCE}`;
        console.log('[LocationDetailWrapper] Fetching forecast data:', {
          url,
          WEATHER_API,
          DATA_SOURCE,
          locationSlug,
        });

        const response = await fetchWithRetries(url, {
          headers: {
            Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: Failed to fetch forecast data`,
          );
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response, got ${contentType}`);
        }

        const json = await response.json();
        console.log('[LocationDetailWrapper] Forecast data received:', {
          hasData: !!json.data,
          datesCount: json.data?.dates?.length,
          locationsCount: json.data?.locations?.allIds?.length,
        });

        const newAppState: ForecastResponseStatus = {
          isLoaded: true,
          forecast: json.data,
          error: null,
        };
        dispatch(mergeForecast(newAppState));
      } catch (err) {
        console.error('[LocationDetailWrapper] Failed to fetch forecast:', err);
        dispatch(
          mergeForecast({
            isLoaded: true,
            forecast: null,
            error:
              err instanceof Error ? err : new Error('Failed to load forecast'),
          }),
        );
      } finally {
        setIsLoadingLocation(false);
      }
    };

    // Only fetch if Redux store doesn't have data
    if (!appState.isLoaded || !appState.forecast) {
      fetchFullForecast();
    }
  }, [appState.isLoaded, appState.forecast, dispatch]);

  // Loading state
  if (!appState.isLoaded || !appState.forecast || isLoadingLocation) {
    return (
      <div className='loading'>
        <img src={weatherLoading} alt='Loading...' />
      </div>
    );
  }

  const { locations, regions } = appState.forecast;

  // Find location by slug
  const location = locationSlug
    ? fromSlugById(locationSlug, locations.byId)
    : undefined;

  console.log('[LocationDetailWrapper] Location lookup:', {
    locationSlug,
    foundLocation: !!location,
    locationName: location?.name,
    locationDescription: location?.description,
  });

  if (!location) {
    return (
      <div className='error'>
        <h2>Location not found</h2>
        <p>Could not find location: {locationSlug}</p>
        <button type='button' onClick={() => navigate('/')}>
          Back to Summary
        </button>
      </div>
    );
  }

  // Find the region for this location to get wtaRegionKey
  const regionEntry = Object.entries(regions.byId).find(([, region]) =>
    region.locations?.some((loc) => loc.name === location.name),
  );
  const wtaRegionKey = regionEntry
    ? regions.byId[regionEntry[0]]?.search_key
    : undefined;

  // Serialize location data for LocationDetail (maintains compatibility)
  const forecastDetailsForLocation = serializeLocationData(
    location,
    wtaRegionKey,
  );

  // Calculate forecast dates
  const parsedDates = (appState.forecast.dates || []).map((d: string) =>
    parse(d, 'YYYY-MM-DD'),
  );
  const weekends = calculateWeekends(parsedDates);

  console.log('[LocationDetailWrapper] Forecast dates:', {
    rawDates: appState.forecast.dates,
    parsedDatesCount: parsedDates.length,
    firstParsedDate: parsedDates[0],
    hasNullDates: parsedDates.some((d) => d === null),
  });

  const forecastDates: ForecastDates = {
    dates: appState.forecast.dates || [],
    parsedDates,
    weekends,
  };

  // Navigation handler that updates URL instead of state
  const setForecastDetailsForLocation = (value: string | null) => {
    if (value === null) {
      // Back to summary
      navigate('/');
    }
    // Note: We don't need to handle setting a new location here
    // since navigation to other locations happens via Location.tsx
  };

  // Handler for navigating to hourly forecast page
  const handleDayClick = (clickedDate: string) => {
    navigate(`/location/${toSlug(location.description)}/${clickedDate}`);
  };

  return (
    <>
      <OutdatedDateBanner />
      <LocationDetail
        appState={appState}
        forecastDetailsForLocation={forecastDetailsForLocation}
        setForecastDetailsForLocation={setForecastDetailsForLocation}
        forecastDates={forecastDates}
        alertsById={appState.forecast.alertsById}
        allAlertIds={appState.forecast.allAlertIds}
        onDayClick={handleDayClick}
        locationSlug={locationSlug}
      />
    </>
  );
}

export default LocationDetailWrapper;
