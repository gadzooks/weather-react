import { useState, useEffect } from 'react';

/**
 * Custom hook to track online/offline status
 * Listens to browser online/offline events and returns current status
 *
 * @returns boolean - true if online, false if offline
 */
export function useOfflineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      console.log('[useOfflineStatus] Network status: ONLINE');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[useOfflineStatus] Network status: OFFLINE');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Log initial status
    console.log(
      '[useOfflineStatus] Initial network status:',
      navigator.onLine ? 'ONLINE' : 'OFFLINE',
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default useOfflineStatus;
