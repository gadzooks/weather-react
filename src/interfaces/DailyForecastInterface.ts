// DailyForecastInterface.ts

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
  pm2p5: number;
  aqius: number;
  icon: string;
  hours?: HourlyForecastInterface[]; // Hourly forecast data from API
}

export function forecastProperty(
  forecast: DailyForecastInterface,
  prop: keyof DailyForecastInterface,
): string | number | undefined | HourlyForecastInterface[] {
  return forecast[prop];
}
