import React from 'react';
import './SkeletonLoader.scss';

interface SkeletonLoaderProps {
  /**
   * Type of skeleton to display
   */
  variant?: 'text' | 'icon' | 'table-row';

  /**
   * Width of skeleton (CSS value)
   */
  width?: string;

  /**
   * Height of skeleton (CSS value)
   */
  height?: string;

  /**
   * Number of items to repeat (for table-row variant)
   */
  count?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Skeleton loading component for better perceived performance
 * Shows placeholder content while data is loading
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}) => {
  if (variant === 'table-row') {
    return (
      <tbody className='skeleton-table-body'>
        {Array.from({ length: count }).map((_, rowIndex) => (
          <tr key={rowIndex} className='skeleton-row'>
            <td className='skeleton-cell skeleton-location'>
              <div className='skeleton skeleton-text' />
            </td>
            {Array.from({ length: 7 }).map((_, cellIndex) => (
              <td key={cellIndex} className='skeleton-cell'>
                <div className='skeleton skeleton-icon' />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
      aria-hidden='true'
      aria-busy='true'
      aria-live='polite'
    />
  );
};

/**
 * Skeleton loader specifically for the forecast table
 */
export const ForecastTableSkeleton: React.FC<{ rows?: number }> = ({
  rows = 5,
}) => {
  return (
    <div className='skeleton-forecast-container' aria-label='Loading forecast data'>
      <table className='table styled-table'>
        <thead>
          <tr>
            <td className='location-header'>
              <div className='skeleton skeleton-text' style={{ width: '100px' }} />
            </td>
            {Array.from({ length: 7 }).map((_, i) => (
              <td key={i}>
                <div className='skeleton skeleton-text' style={{ width: '60px' }} />
              </td>
            ))}
          </tr>
        </thead>
        <SkeletonLoader variant='table-row' count={rows} />
      </table>
    </div>
  );
};

/**
 * Skeleton loader for chart components
 */
export const ChartSkeleton: React.FC = () => {
  return (
    <div className='skeleton-chart' aria-label='Loading chart data'>
      <div className='skeleton-chart-bars'>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className='skeleton-chart-bar'
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
      <div className='skeleton-chart-axis' />
    </div>
  );
};

export default SkeletonLoader;
