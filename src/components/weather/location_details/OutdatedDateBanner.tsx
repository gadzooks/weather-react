// OutdatedDateBanner.tsx
// Banner shown when user is redirected from an outdated date

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'fecha';
import './OutdatedDateBanner.scss';

function OutdatedDateBanner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const outdatedDate = searchParams.get('outdated_date');

  useEffect(() => {
    if (outdatedDate) {
      // Show banner
      setIsVisible(true);

      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Remove query param after animation completes
        setTimeout(() => {
          searchParams.delete('outdated_date');
          setSearchParams(searchParams, { replace: true });
        }, 300); // Wait for fade-out animation
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [outdatedDate, searchParams, setSearchParams]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remove query param after animation completes
    setTimeout(() => {
      searchParams.delete('outdated_date');
      setSearchParams(searchParams, { replace: true });
    }, 300);
  };

  if (!outdatedDate) return null;

  // Format the date nicely if possible
  let formattedDate = outdatedDate;
  try {
    const parsed = new Date(`${outdatedDate}T12:00:00`);
    if (!isNaN(parsed.getTime())) {
      formattedDate = format(parsed, 'MMMM Do, YYYY');
    }
  } catch {
    // Use raw date if parsing fails
  }

  return (
    <div className={`outdated-date-banner ${isVisible ? 'visible' : ''}`}>
      <div className='banner-content'>
        <div className='banner-icon'>ℹ️</div>
        <div className='banner-message'>
          <strong>Forecast date no longer available</strong>
          <p>
            The forecast for <strong>{formattedDate}</strong> is no longer available.
            Showing the latest forecast instead.
          </p>
        </div>
        <button
          type='button'
          className='banner-dismiss'
          onClick={handleDismiss}
          aria-label='Dismiss notification'
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default OutdatedDateBanner;
