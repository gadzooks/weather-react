// Hourly forecast API

import fetchWithRetries from './retry';
import type {
  HourlyForecastInterface,
  HourlyForecastResponse,
  HourlyForecastApiResponse,
} from '../interfaces/HourlyForecastInterface';
import {
  saveHourlyToCache,
  loadHourlyFromCache,
} from '../utils/hourlyForecastCache';

const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;

/**
 * Fetch hourly forecast data for a specific location and date
 * Uses cache for offline support - fetches from API first, falls back to cache on error
 * @param locationName - The location name (e.g., "san juan islands")
 * @param date - The date in YYYY-MM-DD format to get hours for
 * @returns Promise with hourly forecast response
 */
export const fetchHourlyForecast = async (
  locationName: string,
  date: string,
): Promise<HourlyForecastResponse> => {
  // API endpoint: /forecasts/hourly/real?location=san+juan+islands
  const params = new URLSearchParams({ location: locationName });
  const url = `${WEATHER_API}/forecasts/hourly/real?${params.toString()}`;

  console.log('[fetchHourlyForecast] Fetching hourly data:', {
    url,
    locationName,
    date,
    WEATHER_API,
  });

  try {
    const response = await fetchWithRetries(url, {
      timeout: 10000,
      maxRetries: 6,
      headers: {
        Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch hourly forecast`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response, got ${contentType}`);
    }

    const json = await response.json();
    const apiResponse = json.data as HourlyForecastApiResponse;

    // Find the day matching the requested date
    const dayData = apiResponse.days.find((day) => day.datetime === date);

    const result: HourlyForecastResponse = {
      location: apiResponse.location.name,
      locationDescription: apiResponse.location.description,
      date,
      sunrise: dayData?.sunrise,
      sunriseEpoch: dayData?.sunriseEpoch,
      sunset: dayData?.sunset,
      sunsetEpoch: dayData?.sunsetEpoch,
      hours: dayData?.hours || [],
    };

    // Save to cache on success
    saveHourlyToCache(locationName, date, result);
    console.log('[fetchHourlyForecast] Successfully fetched and cached hourly data');

    return result;
  } catch (error) {
    console.error('[fetchHourlyForecast] Fetch failed:', error);

    // Try to load from cache
    const cached = loadHourlyFromCache(locationName, date);
    if (cached) {
      console.log('[fetchHourlyForecast] Returning cached data for offline use');
      return cached;
    }

    // No cache available, re-throw the error
    throw error;
  }
};

/**
 * Extract hourly data from the response
 */
export const getHoursFromResponse = (
  response: HourlyForecastResponse,
): HourlyForecastInterface[] => response.hours || [];

export default fetchHourlyForecast;
