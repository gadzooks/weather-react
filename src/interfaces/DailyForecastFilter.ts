import { format } from 'fecha';
import { DailyForecastInterface } from './DailyForecastInterface';
import { ForecastsById } from './ForecastResponseInterface';
import { RegionInterface } from './RegionInterface';

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
  regions: RegionInterface[],
  forecastsById: ForecastsById,
  dateToMatch?: string,
): boolean {
  if (!dateToMatch) return false;

  const sampleRegion = regions[0];
  const sampleLocation = sampleRegion.locations[0];
  const sampleForecast = forecastsById.byId[sampleLocation.name];
  return matchedOneDate(sampleForecast, dateToMatch);
}

export function forecastColSpan(validForecastDateSelected: boolean) :number {
  return validForecastDateSelected ? 3 : 17;
}
