import { format } from 'fecha';

export function formatDate(str: string) {
  return new Date(str)
    .toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
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
