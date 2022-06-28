import { format } from 'fecha';

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
