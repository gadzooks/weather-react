import { format } from 'fecha';

export function formatDate(str: string) {
  return new Date(str).toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateWeekends(dates: (Date | null)[]): boolean[] {
  const weekends: boolean[] = [];
  if (!dates) {
    return weekends;
  }

  dates.forEach((d) => {
    if (d) {
      const dayOfWeek = format(d, 'ddd').toUpperCase();
      weekends.push(dayOfWeek === 'SUN' || dayOfWeek === 'SAT');
    } else {
      weekends.push(false);
    }
  });

  return weekends;
}

export function dateDifferenceInDays(epochSeconds: number) {
  if (epochSeconds === undefined) {
    return null;
  }

  const date = new Date(epochSeconds * 1_000);
  const today = new Date();

  const diff = (date.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return Math.floor(diff);
}

export function nth(d: number) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
