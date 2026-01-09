import { format } from 'fecha';
import type { DailyForecastInterface } from './DailyForecastInterface';

export interface DailyForecastFilter {
  date?: string;
  tempmax?: number;
  tempmin?: number;
  precip?: number;
  precipprob?: number;
}

export function matchesSelecteDate(
  date: Date | null,
  dateToMatch?: string,
): boolean {
  if (!dateToMatch || !date) return true;
  return format(date, 'YYYY-MM-DD') === dateToMatch;
}

export function matchesSelecteDateString(
  date: string | null,
  dateToMatch?: string,
): boolean {
  if (!dateToMatch || !date) return true;
  return date === dateToMatch;
}

export function matchedOneDate(
  dates: DailyForecastInterface[],
  dateToMatch?: string,
): boolean {
  if (!dateToMatch) return false;
  return !!dates.find((d) => d.datetime === dateToMatch);
}

export function dateSelectedMatchesForecastDates(
  dates: string[],
  dateToMatch?: string,
): boolean {
  if (!dateToMatch) return false;

  return !!dates.find((d) => d === dateToMatch);
}

export function forecastColSpan(
  validForecastDateSelected: boolean,
  alertsFound: boolean,
): number {
  const total = validForecastDateSelected ? 3 : 16;
  return alertsFound ? total + 1 : total;
}
