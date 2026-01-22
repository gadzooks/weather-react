import { useAppSelector } from '../../../app/hooks';
import './RefreshSpinner.scss';

/**
 * Small spinner indicator shown during forecast refresh
 * Positioned in header area, non-intrusive
 */
export function RefreshSpinner() {
  const isRefreshing = useAppSelector((state) => state.forecast.isRefreshing);

  if (!isRefreshing) return null;

  return (
    <div className='refresh-spinner' role='status' aria-live='polite'>
      <div className='refresh-spinner__icon' aria-hidden='true'>
        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='3'
            fill='none'
            strokeLinecap='round'
            strokeDasharray='50 50'
            className='refresh-spinner__circle'
          />
        </svg>
      </div>
      <span className='refresh-spinner__text'>Updating...</span>
    </div>
  );
}

export default RefreshSpinner;
