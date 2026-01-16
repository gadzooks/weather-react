import { useState } from 'react';
import { getCacheAge, isCacheStale } from '../../../utils/forecastCache';
import './OfflineStatusBanner.scss';

interface OfflineStatusBannerProps {
  isFromCache: boolean;
  cacheTimestamp?: number;
  isOnline: boolean;
  onRefresh: () => void;
}

export function OfflineStatusBanner({
  isFromCache,
  cacheTimestamp,
  isOnline,
  onRefresh,
}: OfflineStatusBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if dismissed by user
  if (isDismissed) return null;

  // Show banner if offline or using cached data
  if (isOnline && !isFromCache) return null;

  const cacheAge = cacheTimestamp ? getCacheAge(cacheTimestamp) : 'unknown';
  const isStale = cacheTimestamp ? isCacheStale(cacheTimestamp) : false;
  const isOffline = !isOnline;

  const handleClose = () => {
    setIsDismissed(true);
  };

  // Determine banner style: offline (orange) > stale (orange) > cached (blue)
  const bannerClass = isOffline ? 'offline' : isStale ? 'stale' : 'cached';

  return (
    <div className={`offline-banner ${bannerClass}`}>
      <div className='offline-banner__content'>
        <div className='offline-banner__icon'>
          {isOffline ? '📡' : '💾'}
        </div>
        <div className='offline-banner__text'>
          {isOffline ? (
            <>
              <strong>Offline Mode</strong>
              <span>Data from {cacheAge}</span>
            </>
          ) : (
            <>
              <strong>Cached Data</strong>
              <span>Last updated {cacheAge}</span>
            </>
          )}
          {isStale && <span className='stale-warning'>Data may be outdated</span>}
        </div>
        <button
          className='offline-banner__refresh'
          onClick={onRefresh}
          aria-label='Refresh forecast data'
        >
          🔄 Refresh
        </button>
        <button
          className='offline-banner__close'
          onClick={handleClose}
          aria-label='Close banner'
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default OfflineStatusBanner;
