import { useState, useCallback } from 'react';

interface SwipeNavigationConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
  minSwipeDistance?: number;
  swipeVelocityThreshold?: number;
}

interface SwipeNavigationHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  isSwipping: boolean;
  swipeDirection: 'left' | 'right' | null;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export function useSwipeNavigation(
  config: SwipeNavigationConfig,
): SwipeNavigationHandlers {
  const {
    onSwipeLeft,
    onSwipeRight,
    disabled = false,
    minSwipeDistance = 75,
    swipeVelocityThreshold = 0.3,
  } = config;

  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [currentTouch, setCurrentTouch] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isSwipping, setIsSwipping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null,
  );

  const resetState = useCallback(() => {
    setTouchStart(null);
    setCurrentTouch(null);
    setIsSwipping(false);
    setSwipeDirection(null);
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      // Check if touch is on a scrollable element or interactive element
      const target = e.target as HTMLElement;

      // Skip if touching scrollable areas
      if (target.closest('.hourly-timeline, .location-details-div')) {
        return;
      }

      // Don't interfere with button/link touches
      if (target.closest('button, a, input, select, textarea')) {
        return;
      }

      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      });
      setCurrentTouch({ x: touch.clientX, y: touch.clientY });
    },
    [disabled],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart || disabled) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;

      // Determine if this is a horizontal swipe
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
      const significantMove = Math.abs(deltaX) > 10; // 10px threshold

      if (isHorizontal && significantMove) {
        setIsSwipping(true);
        setSwipeDirection(deltaX > 0 ? 'right' : 'left');
        // Prevent default to stop scrolling during swipe
        e.preventDefault();
      }

      setCurrentTouch({ x: touch.clientX, y: touch.clientY });
    },
    [touchStart, disabled],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart || !currentTouch || disabled) {
        resetState();
        return;
      }

      const deltaX = currentTouch.x - touchStart.x;
      const deltaY = currentTouch.y - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;
      const velocity = Math.abs(deltaX) / deltaTime;

      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
      const meetsDistance = Math.abs(deltaX) >= minSwipeDistance;
      const meetsVelocity = velocity >= swipeVelocityThreshold;

      if (isHorizontal && (meetsDistance || meetsVelocity)) {
        // Execute swipe action
        if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        }
      }

      // Reset after brief animation delay
      setTimeout(resetState, 300);
    },
    [
      touchStart,
      currentTouch,
      disabled,
      minSwipeDistance,
      swipeVelocityThreshold,
      onSwipeLeft,
      onSwipeRight,
      resetState,
    ],
  );

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwipping,
    swipeDirection,
  };
}

export default useSwipeNavigation;
