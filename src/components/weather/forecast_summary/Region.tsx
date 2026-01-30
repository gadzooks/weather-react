// Region.tsx
import './Region.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentRegionFilter = searchParams.get('region');

  // Create slug from region name for URL
  const regionSlug = region.name.toLowerCase().replace(/\s+/g, '-');
  const isFiltered = currentRegionFilter === regionSlug;

  // Span region name across location + 2 date columns for better fit
  const regionColSpan = 5;
  // Calculate remaining date columns after the region name span
  const numDateCols = dateSelectedIsWithinForecastRange
    ? 0
    : Math.max(0, isWeekend.length - (regionColSpan - 1));

  const handleRegionClick = () => {
    if (isFiltered) {
      // If already filtered by this region, clear the filter
      navigate('/');
    } else {
      // Filter by this region
      navigate(`/?region=${regionSlug}`);
    }
  };

  return (
    <tbody>
      <tr className='region-details'>
        {alertProps.foundAlerts && <td className='region-alerts-cell' />}
        <td className='region-name-cell' colSpan={regionColSpan}>
          <WtaLink wtaRegion={searchKey} className='wta-link' />
          <button
            type='button'
            className='region-name-button'
            onClick={handleRegionClick}
            title={isFiltered ? 'Show all regions' : `Show only ${description}`}
          >
            {description}
          </button>
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