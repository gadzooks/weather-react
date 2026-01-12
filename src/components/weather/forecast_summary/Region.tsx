import './Region.scss';
import React from 'react';
import type { RegionInterface } from '../../../interfaces/RegionInterface';
import type { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import Location from './Location';
import WtaLink from '../location_details/WtaLink';
import type { LocationInterface } from '../../../interfaces/LocationInterface';
import type { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';
import type { AlertProps } from '../../../interfaces/AlertProps';

export interface RegionProps {
  isWeekend: boolean[];
  region: RegionInterface;
  forecastsById: ForecastsById;
  locations: LocationInterface[];
  dailyForecastFilter: DailyForecastFilter;
  dateSelectedIsWithinForecastRange: boolean;
  alertProps: AlertProps;
}

function Region(props: RegionProps) {
  const { region } = props;
  const { description } = region;
  const { search_key: searchKey } = region;
  const { locations } = props;
  const { alertProps, isWeekend, dateSelectedIsWithinForecastRange } = props;
  const numDateCols = dateSelectedIsWithinForecastRange ? 1 : isWeekend.length;
  return (
    <tbody>
      <tr className='region-details'>
        {alertProps.foundAlerts && <td className='region-alerts-cell' />}
        <td className='region-name-cell'>
          <WtaLink wtaRegion={searchKey} className='wta-link' />
          {description}
        </td>
        {Array.from({ length: numDateCols }).map((_, i) => (
          <td
            key={`region-cell-${region.name}-${i}`}
            className='region-date-cell'
          />
        ))}
      </tr>
      {locations.map((loc) => (
        <Location
          wtaRegionKey={region.search_key}
          location={loc}
          key={loc.name}
          atleastOneDateMatches={dateSelectedIsWithinForecastRange}
          alertIds={loc.alertIds}
          {...props}
        />
      ))}
    </tbody>
  );
}

export default Region;
