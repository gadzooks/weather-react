// Hourly forecast API

import fetchWithRetries from './retry';
import type {
  HourlyForecastInterface,
  HourlyForecastResponse,
  HourlyForecastApiResponse,
} from '../interfaces/HourlyForecastInterface';
import { extractHourlyFromMainCache } from '../utils/extractHourlyFromCache';

const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;

/**
 * Fetch hourly forecast data for a specific location and date
 *
 * IMPORTANT: Hourly data is already included in the main forecast cache.
 * This function first checks the main cache, then only makes an API call if:
 * 1. Data is not in cache (user hasn't refreshed main forecast yet)
 * 2. User explicitly needs fresh data
 *
 * This eliminates the duplicate hourly cache that was causing quota exceeded errors.
 *
 * NOTE: If the requested date is not available (e.g., it's in the past and no longer
 * in the forecast), this function will throw an error. The calling component should
 * handle this by redirecting the user to the location page without a date.
 *
 * @param locationName - The location name (e.g., "san juan islands")
 * @param date - The date in YYYY-MM-DD format to get hours for
 * @returns Promise with hourly forecast response
 * @throws Error if date is not available in cache or from API
 */
export const fetchHourlyForecast = async (
  locationName: string,
  date: string,
): Promise<HourlyForecastResponse> => {
  console.log('[fetchHourlyForecast] Requesting hourly data for:', { locationName, date });

  // STEP 1: Check main forecast cache first (eliminates need for separate hourly cache)
  const cachedData = extractHourlyFromMainCache(locationName, date);
  if (cachedData && cachedData.hours.length > 0) {
    console.log('[fetchHourlyForecast] Found hourly data in main cache, no API call needed');
    return cachedData;
  }

  // STEP 2: Data not in cache - try API call as fallback
  console.log('[fetchHourlyForecast] Hourly data not in main cache, attempting API call...');

  const params = new URLSearchParams({ location: locationName });
  const url = `${WEATHER_API}/forecasts/hourly/real?${params.toString()}`;

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

    console.log('[fetchHourlyForecast] Successfully fetched hourly data from API');
    return result;
  } catch (error) {
    console.error('[fetchHourlyForecast] API fetch failed:', error);

    // Final fallback: check main cache again in case it was just populated
    const fallbackData = extractHourlyFromMainCache(locationName, date);
    if (fallbackData) {
      console.log('[fetchHourlyForecast] Using main cache as fallback for offline use');
      return fallbackData;
    }

    // No data available anywhere
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
