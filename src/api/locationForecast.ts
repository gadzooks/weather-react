// Location forecast API

import fetchWithRetries from './retry';
import type { DailyForecastInterface } from '../interfaces/DailyForecastInterface';

const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;
const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'real';

/**
 * API response structure from the backend
 */
export interface LocationForecastApiResponse {
  location: {
    name: string;
    description: string;
  };
  forecast: DailyForecastInterface[];
}

/**
 * Normalized response structure for the application
 */
export interface LocationForecastResponse {
  locationName: string;
  locationDescription: string;
  forecast: DailyForecastInterface[];
}

/**
 * Fetch daily forecast data for a specific location
 * @param locationName - The location name (e.g., "mt_baker", "chelan")
 * @returns Promise with location forecast response
 */
export const fetchLocationForecast = async (
  locationName: string,
): Promise<LocationForecastResponse> => {
  // API endpoint: /forecasts/location/{locationName}/real or /mock
  const url = `${WEATHER_API}/forecasts/location/${locationName}/${DATA_SOURCE}`;

  console.log('[fetchLocationForecast] Fetching location data:', {
    url,
    locationName,
    WEATHER_API,
    DATA_SOURCE,
  });

  const response = await fetchWithRetries(url, {
    timeout: 10000,
    maxRetries: 6,
    headers: {
      Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: Failed to fetch location forecast`,
    );
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Expected JSON response, got ${contentType}`);
  }

  const json = await response.json();
  const apiResponse = json.data as LocationForecastApiResponse;

  return {
    locationName: apiResponse.location.name,
    locationDescription: apiResponse.location.description,
    forecast: apiResponse.forecast,
  };
};

export default fetchLocationForecast;
