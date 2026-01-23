import type { HourlyForecastInterface } from './HourlyForecastInterface';

export interface DailyForecastInterface {
  datetime: string;
  tempmax: number;
  tempmin: number;
  precip: number;
  precipprob: number;
  precipcover?: number;
  cloudcover: number;
  sunrise: string;
  sunset: string;
  sunriseEpoch?: number;
  sunsetEpoch?: number;
  moonphase: number;
  conditions: string;
  description: string;
  icon: string;
  hours?: HourlyForecastInterface[]; // Hourly forecast data from API
  [key: string]: string | number | undefined | HourlyForecastInterface[];
}

export function forecastProperty(
  forecast: DailyForecastInterface,
  prop: string,
): string | number | undefined {
  return forecast[prop];
}
