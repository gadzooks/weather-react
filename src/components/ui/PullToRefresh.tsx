import React from 'react';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import './PullToRefresh.scss';

interface PullToRefreshProps {
  /**
   * Async function to call when refresh is triggered
   */
  onRefresh: () => Promise<void>;

  /**
   * Child components to render
   */
  children: React.ReactNode;

  /**
   * Enable or disable pull-to-refresh
   * @default true
   */
  enabled?: boolean;
}

/**
 * Pull-to-refresh container component
 * Wraps content and provides native-feeling refresh gesture
 *
 * @example
 * ```tsx
 * <PullToRefresh onRefresh={fetchData}>
 *   <YourContent />
 * </PullToRefresh>
 * ```
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  enabled = true,
}) => {
  const { pullDistance, isRefreshing, isPulling } = usePullToRefresh({
    onRefresh,
    enabled,
  });

  const pullPercentage = Math.min((pullDistance / 80) * 100, 100);

  return (
    <div className='pull-to-refresh-container'>
      {/* Pull indicator */}
      <div
        className={`pull-indicator ${isPulling || isRefreshing ? 'visible' : ''}`}
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 40)}px)`,
          opacity: pullPercentage / 100,
        }}
      >
        <div
          className={`pull-icon ${isRefreshing ? 'refreshing' : ''}`}
          style={{
            transform: `rotate(${pullPercentage * 3.6}deg)`,
          }}
        >
          <i className='wi wi-refresh' />
        </div>
        <div className='pull-text'>
          {isRefreshing
            ? 'Refreshing...'
            : pullPercentage >= 100
            ? 'Release to refresh'
            : 'Pull to refresh'}
        </div>
      </div>

      {/* Content */}
      <div
        className='pull-to-refresh-content'
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
