// DateNavigation.tsx
import { format, parse } from 'fecha';
import './DateNavigation.scss';

interface DateNavigationProps {
  selectedDate: string | null;
  allDates: string[];
  onDateChange: (date: string) => void;
  onClearDate: () => void; // Kept for backward compatibility
}

function DateNavigation({
  selectedDate,
  allDates,
  onDateChange,
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
