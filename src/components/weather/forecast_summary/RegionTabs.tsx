// RegionTabs.tsx - Tab interface for regional views

import './RegionTabs.scss';

export type RegionTabType = 'forecast' | 'tripreports';

export interface RegionTabsProps {
  activeTab: RegionTabType;
  onTabChange: (tab: RegionTabType) => void;
}

function RegionTabs({ activeTab, onTabChange }: RegionTabsProps) {
  return (
    <div className='region-tabs'>
      <div className='tabs'>
        <button
          type='button'
          className={`tab ${activeTab === 'forecast' ? 'active' : ''}`}
          onClick={() => onTabChange('forecast')}
        >
          Forecast
        </button>
        <button
          type='button'
          className={`tab ${activeTab === 'tripreports' ? 'active' : ''}`}
          onClick={() => onTabChange('tripreports')}
        >
          Trip Reports
        </button>
      </div>
    </div>
  );
}

export default RegionTabs;
