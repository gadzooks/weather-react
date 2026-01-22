import { useState, useEffect } from 'react';
import './UpdateToast.scss';

const TOAST_DURATION = 4000;

/**
 * Toast notification shown after successful forecast update
 * Auto-dismisses after 4 seconds
 */
export function UpdateToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [updateTime, setUpdateTime] = useState<number | null>(null);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const timestamp = customEvent.detail?.timestamp;

      if (timestamp) {
        setUpdateTime(timestamp);
        setIsVisible(true);

        const timer = setTimeout(() => {
          setIsVisible(false);
        }, TOAST_DURATION);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('forecast-updated', handleUpdate);
    return () => window.removeEventListener('forecast-updated', handleUpdate);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !updateTime) return null;

  const timeString = new Date(updateTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className='update-toast' role='status' aria-live='polite'>
      <div className='update-toast__content'>
        <div className='update-toast__icon' aria-hidden='true'>
          ✓
        </div>
        <div className='update-toast__message'>
          <strong>Forecast updated</strong>
          <span>Last updated at {timeString}</span>
        </div>
        <button
          className='update-toast__close'
          onClick={handleDismiss}
          aria-label='Dismiss notification'
        >
          ✕
        </button>
      </div>
      <div className='update-toast__progress' />
    </div>
  );
}

export default UpdateToast;
