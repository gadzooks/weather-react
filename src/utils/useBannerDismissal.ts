import { useState, useEffect } from 'react';

const DISMISSAL_KEY_PREFIX = 'offlineBannerDismissed_';

/**
 * Custom hook to manage banner dismissal with localStorage persistence
 * Dismissal is tied to cache timestamp - when new data arrives (different timestamp),
 * dismissal automatically resets
 *
 * @param cacheTimestamp - Current cache timestamp (undefined if no cache)
 * @returns Object with isDismissed state and dismissBanner callback
 */
export function useBannerDismissal(cacheTimestamp?: number) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Generate unique key based on cache timestamp
  const dismissalKey = cacheTimestamp
    ? `${DISMISSAL_KEY_PREFIX}${cacheTimestamp}`
    : null;

  // Load dismissal state from localStorage on mount or when timestamp changes
  useEffect(() => {
    if (!dismissalKey) {
      setIsDismissed(false);
      return;
    }

    try {
      const stored = localStorage.getItem(dismissalKey);
      const wasDismissed = stored === 'true';
      setIsDismissed(wasDismissed);

      if (wasDismissed) {
        console.log(
          `[useBannerDismissal] Banner was dismissed for cache timestamp ${cacheTimestamp}`,
        );
      }
    } catch (error) {
      console.error('[useBannerDismissal] Failed to load dismissal state:', error);
      setIsDismissed(false);
    }

    // Cleanup old dismissal keys (keep only current one)
    cleanupOldDismissalKeys(dismissalKey);
  }, [dismissalKey, cacheTimestamp]);

  /**
   * Dismiss the banner and persist to localStorage
   */
  const dismissBanner = () => {
    if (!dismissalKey) return;

    try {
      localStorage.setItem(dismissalKey, 'true');
      setIsDismissed(true);
      console.log(
        `[useBannerDismissal] Banner dismissed for cache timestamp ${cacheTimestamp}`,
      );
    } catch (error) {
      console.error('[useBannerDismissal] Failed to save dismissal state:', error);
    }
  };

  /**
   * Clear dismissal state (useful for testing or manual reset)
   */
  const clearDismissal = () => {
    if (!dismissalKey) return;

    try {
      localStorage.removeItem(dismissalKey);
      setIsDismissed(false);
      console.log('[useBannerDismissal] Dismissal state cleared');
    } catch (error) {
      console.error('[useBannerDismissal] Failed to clear dismissal state:', error);
    }
  };

  return { isDismissed, dismissBanner, clearDismissal };
}

/**
 * Cleanup old dismissal keys from localStorage
 * Keeps only the current key and removes others to prevent accumulation
 */
function cleanupOldDismissalKeys(currentKey: string | null) {
  try {
    const keysToRemove: string[] = [];

    // Find all dismissal keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DISMISSAL_KEY_PREFIX)) {
        // Keep current key, remove others
        if (key !== currentKey) {
          keysToRemove.push(key);
        }
      }
    }

    // Remove old keys
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    if (keysToRemove.length > 0) {
      console.log(
        `[useBannerDismissal] Cleaned up ${keysToRemove.length} old dismissal keys`,
      );
    }
  } catch (error) {
    console.error('[useBannerDismissal] Failed to cleanup old keys:', error);
  }
}

export default useBannerDismissal;
