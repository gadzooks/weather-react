import { useAppSelector } from '../../../app/hooks';
import { getCacheAge } from '../../../utils/forecastCache';
import './RefreshErrorBanner.scss';

interface RefreshErrorBannerProps {
  onRetry: () => void;
  onDismiss: () => void;
}

/**
 * Banner shown when forecast refresh fails but cached data is available
 * Displays above the forecast table, allows retry and dismiss
 */
export function RefreshErrorBanner({
  onRetry,
  onDismiss,
}: RefreshErrorBannerProps) {
  const refreshError = useAppSelector((state) => state.forecast.refreshError);
  const cacheTimestamp = useAppSelector(
    (state) => state.forecast.cacheTimestamp,
  );

  if (!refreshError) return null;

  const cacheAge = cacheTimestamp ? getCacheAge(cacheTimestamp) : 'unknown';

  return (
    <div className='refresh-error-banner' role='alert'>
      <div className='refresh-error-banner__content'>
        <div className='refresh-error-banner__icon' aria-hidden='true'>
          ⚠️
        </div>
        <div className='refresh-error-banner__text'>
          <strong>Failed to update forecast</strong>
          <span>Last updated {cacheAge}</span>
        </div>
        <button
          className='refresh-error-banner__retry'
          onClick={onRetry}
          aria-label='Retry fetching forecast'
        >
          🔄 Retry
        </button>
        <button
          className='refresh-error-banner__close'
          onClick={onDismiss}
          aria-label='Dismiss error banner'
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default RefreshErrorBanner;
