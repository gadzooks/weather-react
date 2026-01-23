/**
 * Extract hourly forecast data from the main forecast cache
 * This eliminates the need for a separate hourly cache that causes quota exceeded errors
 */

import type { HourlyForecastInterface, HourlyForecastResponse } from '../interfaces/HourlyForecastInterface';
import type { DailyForecastInterface } from '../interfaces/DailyForecastInterface';
import { loadForecastFromCache } from './forecastCache';

/**
 * Extended daily forecast interface that includes hours array
 * The API returns hours but it's not in the base interface definition
 */
interface DailyForecastWithHours extends DailyForecastInterface {
  hours?: HourlyForecastInterface[];
}

/**
 * Extract hourly data for a specific location and date from the main forecast cache
 * @param locationName - Location name (e.g., "seattle", "mt_baker")
 * @param date - Date in YYYY-MM-DD format
 * @returns HourlyForecastResponse with hours array, or null if not found
 */
export function extractHourlyFromMainCache(
  locationName: string,
  date: string,
): HourlyForecastResponse | null {
  try {
    console.log('[extractHourlyFromCache] Looking for hourly data:', { locationName, date });

    // Load the main forecast cache
    const cached = loadForecastFromCache();
    if (!cached || !cached.forecast) {
      console.log('[extractHourlyFromCache] No main forecast cache found');
      return null;
    }

    const { forecast } = cached;

    // Get location info for description
    const location = forecast.locations.byId[locationName];
    if (!location) {
      console.log('[extractHourlyFromCache] Location not found in cache:', locationName);
      return null;
    }

    // Get daily forecasts for this location
    const dailyForecasts = forecast.forecasts.byId[locationName] as DailyForecastWithHours[];
    if (!dailyForecasts || dailyForecasts.length === 0) {
      console.log('[extractHourlyFromCache] No forecasts found for location:', locationName);
      return null;
    }

    // Find the specific day
    const dayForecast = dailyForecasts.find((day) => day.datetime === date);
    if (!dayForecast) {
      console.warn('[extractHourlyFromCache] Date not found in forecasts:', date);
      console.log('[extractHourlyFromCache] Available dates:', dailyForecasts.map((d) => d.datetime));
      console.log('[extractHourlyFromCache] This may be an outdated/past date. User should be redirected to current forecast.');
      return null;
    }

    // Extract hours array
    const hours = dayForecast.hours || [];
    if (hours.length === 0) {
      console.warn('[extractHourlyFromCache] No hourly data found for', locationName, date);
    }

    const result: HourlyForecastResponse = {
      location: locationName,
      locationDescription: location.description,
      date,
      sunrise: dayForecast.sunrise,
      sunriseEpoch: dayForecast.sunriseEpoch,
      sunset: dayForecast.sunset,
      sunsetEpoch: dayForecast.sunsetEpoch,
      hours,
    };

    console.log(`[extractHourlyFromCache] Found ${hours.length} hours for ${locationName} on ${date}`);
    return result;
  } catch (error) {
    console.error('[extractHourlyFromCache] Error extracting hourly data:', error);
    return null;
  }
}

/**
 * Check if hourly data exists in the main cache for a location and date
 */
export function hasHourlyInMainCache(locationName: string, date: string): boolean {
  const data = extractHourlyFromMainCache(locationName, date);
  return data !== null && data.hours.length > 0;
}
