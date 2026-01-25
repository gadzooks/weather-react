// DateNavigation.tsx
import { format, parse } from 'fecha';
import type { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import './DateNavigation.scss';

interface DateNavigationProps {
  selectedDate: string | null;
  allDates: string[];
  onDateChange: (date: string) => void;
  onClearDate: () => void; // Kept for backward compatibility
  dayForecast?: DailyForecastInterface;
}

function DateNavigation({
  selectedDate,
  allDates,
  onDateChange,
  dayForecast,
}: DateNavigationProps) {
  if (!selectedDate) return null;

  const selectedIndex = allDates.indexOf(selectedDate);
  if (selectedIndex === -1) return null;

  const prevDate = selectedIndex > 0 ? allDates[selectedIndex - 1] : null;
  const nextDate =
    selectedIndex < allDates.length - 1 ? allDates[selectedIndex + 1] : null;

  const parsedDate = parse(selectedDate, 'YYYY-MM-DD');
  const displayDate = parsedDate
    ? format(parsedDate, 'dddd, MMMM D, YYYY')
    : selectedDate;

  const isWeekend = (dateStr: string): boolean => {
    const date = parse(dateStr, 'YYYY-MM-DD');
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const weekend = isWeekend(selectedDate);

  // Format sunrise and sunset times
  const formatTime = (timeStr: string | undefined): string => {
    if (!timeStr) return '-';
    // Time format is like "07:30:00" - extract HH:MM
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hour = parseInt(parts[0], 10);
      const minute = parts[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute} ${ampm}`;
    }
    return timeStr;
  };

  // Get moon phase icon and description
  const getMoonPhase = (phase: number | undefined): { icon: string; name: string } => {
    if (phase === undefined) return { icon: 'wi-moon-alt', name: 'Unknown' };

    if (phase === 0 || phase === 1) return { icon: 'wi-moon-new', name: 'New' };
    if (phase < 0.25) return { icon: 'wi-moon-waxing-crescent-3', name: 'Waxing Crescent' };
    if (phase === 0.25) return { icon: 'wi-moon-first-quarter', name: 'First Quarter' };
    if (phase < 0.5) return { icon: 'wi-moon-waxing-gibbous-3', name: 'Waxing Gibbous' };
    if (phase === 0.5) return { icon: 'wi-moon-full', name: 'Full' };
    if (phase < 0.75) return { icon: 'wi-moon-waning-gibbous-3', name: 'Waning Gibbous' };
    if (phase === 0.75) return { icon: 'wi-moon-third-quarter', name: 'Last Quarter' };
    return { icon: 'wi-moon-waning-crescent-3', name: 'Waning Crescent' };
  };

  const moonPhase = getMoonPhase(dayForecast?.moonphase);

  return (
    <div className={`date-navigation ${weekend ? 'weekend' : ''}`}>
      <button
        type='button'
        className='date-nav-btn date-nav-prev'
        onClick={() => prevDate && onDateChange(prevDate)}
        disabled={!prevDate}
        aria-label='Previous day'
      >
        <i className='wi wi-direction-left' />
        <span className='date-nav-label'>Previous</span>
      </button>

      <div className='date-nav-current'>
        <div className='date-nav-date'>{displayDate}</div>
        {dayForecast && (
          <div className='date-nav-details'>
            <div className='date-nav-sun'>
              <span className='sun-item'>
                <i className='wi wi-sunrise' />
                <span className='sun-time'>{formatTime(dayForecast.sunrise)}</span>
              </span>
              <span className='sun-item'>
                <i className='wi wi-sunset' />
                <span className='sun-time'>{formatTime(dayForecast.sunset)}</span>
              </span>
            </div>
            <div className='date-nav-moon'>
              <i className={`wi ${moonPhase.icon}`} />
              <span className='moon-phase'>{moonPhase.name}</span>
            </div>
          </div>
        )}
      </div>

      <button
        type='button'
        className='date-nav-btn date-nav-next'
        onClick={() => nextDate && onDateChange(nextDate)}
        disabled={!nextDate}
        aria-label='Next day'
      >
        <span className='date-nav-label'>Next</span>
        <i className='wi wi-direction-right' />
      </button>
    </div>
  );
}

export default DateNavigation;
