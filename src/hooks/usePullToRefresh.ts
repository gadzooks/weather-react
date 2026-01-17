import { useState, useEffect, useCallback, useRef } from 'react';

interface PullToRefreshOptions {
  /**
   * Callback function to execute when refresh is triggered
   */
  onRefresh: () => Promise<void>;

  /**
   * Minimum pull distance to trigger refresh (px)
   * @default 80
   */
  pullDownThreshold?: number;

  /**
   * Maximum pull distance (px)
   * @default 120
   */
  maxPullDistance?: number;

  /**
   * Enable or disable pull-to-refresh
   * @default true
   */
  enabled?: boolean;
}

interface PullToRefreshState {
  /**
   * Current pull distance in pixels
   */
  pullDistance: number;

  /**
   * Whether refresh is currently in progress
   */
  isRefreshing: boolean;

  /**
   * Whether user is currently pulling
   */
  isPulling: boolean;
}

/**
 * Custom hook for implementing pull-to-refresh functionality
 * Optimized for mobile touch interactions
 *
 * @example
 * ```tsx
 * const { pullDistance, isRefreshing, isPulling } = usePullToRefresh({
 *   onRefresh: async () => {
 *     await fetchData();
 *   }
 * });
 *
 * <div style={{ transform: `translateY(${pullDistance}px)` }}>
 *   {isPulling && <div>Pull to refresh...</div>}
 *   {isRefreshing && <div>Refreshing...</div>}
 *   <YourContent />
 * </div>
 * ```
 */
export function usePullToRefresh({
  onRefresh,
  pullDownThreshold = 80,
  maxPullDistance = 120,
  enabled = true,
}: PullToRefreshOptions): PullToRefreshState {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || isRefreshing) return;

      // Only trigger if at top of page
      if (window.scrollY > 0) return;

      const touch = e.touches[0];
      startY.current = touch.clientY;
      setIsPulling(true);
    },
    [enabled, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || isRefreshing || !isPulling) return;

      // Only trigger if at top of page
      if (window.scrollY > 0) {
        setIsPulling(false);
        setPullDistance(0);
        return;
      }

      const touch = e.touches[0];
      currentY.current = touch.clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0) {
        // Apply resistance curve for more natural feel
        const resistance = 0.5;
        const adjustedDistance = Math.min(
          distance * resistance,
          maxPullDistance
        );

        setPullDistance(adjustedDistance);

        // Prevent default scroll only when pulling down
        if (adjustedDistance > 10) {
          e.preventDefault();
        }
      }
    },
    [enabled, isRefreshing, isPulling, maxPullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || isRefreshing) return;

    setIsPulling(false);

    // Trigger refresh if threshold met
    if (pullDistance >= pullDownThreshold) {
      setIsRefreshing(true);
      setPullDistance(pullDownThreshold); // Hold at threshold during refresh

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull-to-refresh error:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Animate back to 0 if threshold not met
      setPullDistance(0);
    }
  }, [enabled, isRefreshing, pullDistance, pullDownThreshold, onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    pullDistance,
    isRefreshing,
    isPulling,
  };
}

export default usePullToRefresh;
