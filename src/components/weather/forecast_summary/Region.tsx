// Region.tsx
import './Region.scss';
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
  showAqi: boolean;
}

function Region(props: RegionProps) {
  const { region } = props;
  const { description } = region;
  const { search_key: searchKey } = region;
  const { locations } = props;
  const {
    alertProps,
    isWeekend,
    dateSelectedIsWithinForecastRange,
  } = props;

  // Calculate colspan for region header
  const numDateCols = dateSelectedIsWithinForecastRange
    ? 0
    : isWeekend.length - 1;

  return (
    <tbody>
      <tr className='region-details'>
        {alertProps.foundAlerts && <td className='region-alerts-cell' />}
        <td className='region-name-cell' colSpan={2}>
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