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

export function formatAlertExpiry(epochSeconds: number): string | null {
  if (epochSeconds == null) return null;

  const diffMs = epochSeconds * 1_000 - Date.now();

  if (diffMs < 0) {
    const agoMs = Math.abs(diffMs);
    const agoHours = Math.floor(agoMs / (1_000 * 3_600));
    if (agoHours < 1) return 'expired';
    if (agoHours < 24) return `expired ${agoHours} hour${agoHours === 1 ? '' : 's'} ago`;
    const agoDays = Math.floor(agoMs / (1_000 * 3_600 * 24));
    return `expired ${agoDays} day${agoDays === 1 ? '' : 's'} ago`;
  }

  const diffHours = Math.floor(diffMs / (1_000 * 3_600));
  if (diffHours < 1) return 'ending soon';
  if (diffHours < 24) {
    return `ending in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
  }

  const diffDays = Math.floor(diffMs / (1_000 * 3_600 * 24));
  return `ending in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
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
