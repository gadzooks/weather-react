// LocationDetailWrapper.tsx
// Route-aware wrapper that reads URL params and renders LocationDetail

import { useParams, useNavigate } from 'react-router-dom';
import { parse } from 'fecha';
import { useAppSelector } from '../../../app/hooks';
import { fromSlugById, toSlug } from '../../../utils/slug';
import { serializeLocationData } from '../../../interfaces/LocationInterface';
import type { ForecastDates } from '../../../interfaces/ForecastResponseInterface';
import { calculateWeekends } from '../../../utils/date';
import LocationDetail from './LocationDetail';
import weatherLoading from '../../../images/weather-loading.gif';

function LocationDetailWrapper() {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const navigate = useNavigate();

  const appState = useAppSelector((state) => state.forecast);

  // Loading state
  if (!appState.isLoaded || !appState.forecast) {
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
    navigate(`/location/${toSlug(location.description)}/${clickedDate}/hourly`);
  };

  return (
    <LocationDetail
      appState={appState}
      forecastDetailsForLocation={forecastDetailsForLocation}
      setForecastDetailsForLocation={setForecastDetailsForLocation}
      forecastDates={forecastDates}
      alertsById={appState.forecast.alertsById}
      allAlertIds={appState.forecast.allAlertIds}
      onDayClick={handleDayClick}
    />
  );
}

export default LocationDetailWrapper;
