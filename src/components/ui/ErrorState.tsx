import React from 'react';
import { Button } from './Button';
import './ErrorState.scss';

interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string;

  /**
   * Error message
   */
  message: string;

  /**
   * Optional retry callback
   */
  onRetry?: () => void;

  /**
   * Optional icon override (defaults to storm icon)
   */
  icon?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Standardized error state component
 * Displays clear error messages with optional retry functionality
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  icon,
  className = '',
}) => {
  return (
    <div className={`error-state ${className}`} role='alert'>
      <div className='error-icon'>
        {icon || <i className='wi wi-storm-showers' />}
      </div>
      <h3 className='error-title'>{title}</h3>
      <p className='error-message'>{message}</p>
      {onRetry && (
        <Button variant='primary' onClick={onRetry} icon={<i className='wi wi-refresh' />}>
          Try Again
        </Button>
      )}
    </div>
  );
};

/**
 * Network error state with specific messaging
 */
export const NetworkErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <ErrorState
      title='Network Error'
      message='Unable to load weather data. Please check your internet connection and try again.'
      onRetry={onRetry}
      icon={<i className='wi wi-cloud-down' />}
    />
  );
};

/**
 * No data available state
 */
export const NoDataState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = 'No forecast data available for this location.', onRetry }) => {
  return (
    <ErrorState
      title='No Data Available'
      message={message}
      onRetry={onRetry}
      icon={<i className='wi wi-na' />}
    />
  );
};

export default ErrorState;
