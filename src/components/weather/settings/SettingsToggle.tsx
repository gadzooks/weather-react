import React from 'react';
import './SettingsToggle.scss';

interface SettingsToggleProps {
  onClick: () => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({ onClick }) => (
  <button
    className='settings-toggle button-2'
    onClick={onClick}
    aria-label='Open settings'
    type='button'
  >
    ⚙️
  </button>
);
