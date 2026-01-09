import type { DailyForecastInterface } from './DailyForecastInterface';

interface ForecastInterface {
  latitude: number;
  longitude: number;
  description: string;
  days: DailyForecastInterface[];
}

export type { ForecastInterface as default };
