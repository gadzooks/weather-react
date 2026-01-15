import React from 'react';
import './Button.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual style variant
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';

  /**
   * Button size - all meet 44px minimum touch target
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Make button full width of container
   */
  fullWidth?: boolean;

  /**
   * Optional icon element (rendered before text)
   */
  icon?: React.ReactNode;

  /**
   * Loading state - shows spinner and disables interaction
   */
  loading?: boolean;

  /**
   * Icon-only button (circular)
   */
  iconOnly?: boolean;
}

/**
 * Reusable Button component with WCAG-compliant styling
 * All sizes meet 44px minimum touch target for accessibility
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  iconOnly = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    iconOnly && 'btn-icon-only',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className='btn-spinner' aria-hidden='true' />}
      {!loading && icon && <span className='btn-icon' aria-hidden='true'>{icon}</span>}
      {!iconOnly && <span className='btn-text'>{children}</span>}
      {iconOnly && !loading && children}
    </button>
  );
};

export default Button;
