import React from 'react';
import { createPortal } from 'react-dom';
import './FloatingActionButton.scss';

interface FloatingActionButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  isOpen,
  onClick,
}) => {
  // Use portal to render directly to body, bypassing any parent
  // transform/filter that would break position: fixed
  return createPortal(
    <button
      className={`fab ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      type='button'
    >
      <div className='hamburger-icon'>
        <span />
        <span />
        <span />
      </div>
    </button>,
    document.body
  );
};
