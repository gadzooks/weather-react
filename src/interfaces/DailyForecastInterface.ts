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
    moonphase: number;
    conditions: string;
    description: string;
    icon: string;
    [key: string]: string | number | undefined;
}

export function forecastProperty(
  forecast: DailyForecastInterface,
  prop: string,
): (string|number|undefined) {
  return forecast[prop];
}
