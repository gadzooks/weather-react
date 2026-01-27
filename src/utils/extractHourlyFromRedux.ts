/**
 * Extract hourly forecast data from Redux state
 * This is the primary way to get hourly data - NO API calls should be needed
 */

import type { HourlyForecastInterface, HourlyForecastResponse } from '../interfaces/HourlyForecastInterface';
import type { DailyForecastInterface } from '../interfaces/DailyForecastInterface';
import type { ForecastResponse } from '../interfaces/ForecastResponseInterface';

/**
 * Extended daily forecast interface that includes hours array
 * The API returns hours but it's not in the base interface definition
 */
interface DailyForecastWithHours extends DailyForecastInterface {
  hours?: HourlyForecastInterface[];
}

/**
 * Extract hourly data for a specific location and date from Redux forecast state
 * @param forecast - The forecast data from Redux store
 * @param locationName - Location name (e.g., "seattle", "mt_baker")
 * @param date - Date in YYYY-MM-DD format
 * @returns HourlyForecastResponse with hours array, or null if not found
 */
export function extractHourlyFromRedux(
  forecast: ForecastResponse | null,
  locationName: string,
  date: string,
): HourlyForecastResponse | null {
  try {
    console.log('[extractHourlyFromRedux] Looking for hourly data:', { locationName, date });

    if (!forecast) {
      console.log('[extractHourlyFromRedux] No forecast data in Redux');
      return null;
    }

    // Get location info for description
    const location = forecast.locations.byId[locationName];
    if (!location) {
      console.log('[extractHourlyFromRedux] Location not found in Redux:', locationName);
      return null;
    }

    // Get daily forecasts for this location
    const dailyForecasts = forecast.forecasts.byId[locationName] as DailyForecastWithHours[];
    if (!dailyForecasts || dailyForecasts.length === 0) {
      console.log('[extractHourlyFromRedux] No forecasts found for location:', locationName);
      return null;
    }

    // Find the specific day
    const dayForecast = dailyForecasts.find((day) => day.datetime === date);
    if (!dayForecast) {
      console.warn('[extractHourlyFromRedux] Date not found in forecasts:', date);
      console.log('[extractHourlyFromRedux] Available dates:', dailyForecasts.map((d) => d.datetime));
      console.log('[extractHourlyFromRedux] This may be an outdated/past date.');
      return null;
    }

    // Extract hours array
    const hours = dayForecast.hours || [];
    if (hours.length === 0) {
      console.warn('[extractHourlyFromRedux] No hourly data found for', locationName, date);
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

    console.log(`[extractHourlyFromRedux] Found ${hours.length} hours for ${locationName} on ${date}`);
    return result;
  } catch (error) {
    console.error('[extractHourlyFromRedux] Error extracting hourly data:', error);
    return null;
  }
}

/**
 * Check if hourly data exists in Redux for a location and date
 */
export function hasHourlyInRedux(
  forecast: ForecastResponse | null,
  locationName: string,
  date: string,
): boolean {
  const data = extractHourlyFromRedux(forecast, locationName, date);
  return data !== null && data.hours.length > 0;
}
