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
  // NEW: Props for detailed mode
  isDetailedMode?: boolean;
  selectedDateIndex?: number;
  allDates?: string[];
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
    // NEW: Destructure new props
    isDetailedMode = false,
    selectedDateIndex = -1,
    allDates = [],
  } = props;
  
  // Calculate colspan for region header
  // In detailed mode: 3 day columns (Yesterday/Today/Tomorrow) + 6 detail columns = 9 columns after location
  // In normal mode: number of date columns
  const numDateCols = dateSelectedIsWithinForecastRange
    ? 0
    : isWeekend.length - 1;

  // In detailed mode, we need more colspan to cover all the detail columns
  const regionNameColSpan = isDetailedMode ? 10 : 2;
  
  return (
    <tbody>
      <tr className='region-details'>
        {alertProps.foundAlerts && <td className='region-alerts-cell' />}
        <td className='region-name-cell' colSpan={regionNameColSpan}>
          <WtaLink wtaRegion={searchKey} className='wta-link' />
          {description}
        </td>
        {!isDetailedMode && Array.from({ length: numDateCols }).map((_, i) => (
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
          // NEW: Pass detailed mode props
          isDetailedMode={isDetailedMode}
          selectedDateIndex={selectedDateIndex}
          allDates={allDates}
          {...props}
        />
      ))}
    </tbody>
  );
}

export default Region;