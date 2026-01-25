import { useAppSelector } from '../../../app/hooks';
import { getCacheAge } from '../../../utils/forecastCache';
import './StaleDataBanner.scss';

interface StaleDataBannerProps {
  onRefresh: () => void;
  onDismiss: () => void;
}

/**
 * Banner shown when forecast data is more than 3 hours old
 * Displays above the forecast table, allows manual refresh and dismiss
 */
export function StaleDataBanner({
  onRefresh,
  onDismiss,
}: StaleDataBannerProps) {
  const cacheTimestamp = useAppSelector(
    (state) => state.forecast.cacheTimestamp,
  );

  if (!cacheTimestamp) return null;

  const cacheAge = getCacheAge(cacheTimestamp);

  return (
    <div className='stale-data-banner' role='status'>
      <div className='stale-data-banner__content'>
        <div className='stale-data-banner__icon' aria-hidden='true'>
          ℹ️
        </div>
        <div className='stale-data-banner__text'>
          <strong>Forecast data may be outdated</strong>
          <span>Last updated {cacheAge}</span>
        </div>
        <button
          className='stale-data-banner__refresh'
          onClick={onRefresh}
          aria-label='Refresh forecast data'
        >
          🔄 Refresh
        </button>
        <button
          className='stale-data-banner__close'
          onClick={onDismiss}
          aria-label='Dismiss stale data banner'
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default StaleDataBanner;
