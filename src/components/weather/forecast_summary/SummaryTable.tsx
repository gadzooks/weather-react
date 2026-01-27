// SummaryTable.tsx

import './SummaryTable.scss';
import { format, parse } from 'fecha';
import { useNavigate } from 'react-router-dom';
import type { LocationInterface } from '../../../interfaces/LocationInterface';
import type { ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import Region from './Region';
import type { RegionInterface } from '../../../interfaces/RegionInterface';
import type { MatchedAreas } from '../../../interfaces/MatchedAreas';
import type { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';
import alertsFound from '../../../utils/count';
import AlertDetail from '../alerts/AlertDetail';
import type { AlertProps } from '../../../interfaces/AlertProps';
import { calculateWeekends } from '../../../utils/date';

export function matchedLocations(
  needle: RegExp | null,
  region: RegionInterface,
): LocationInterface[] {
  if (!needle) return region.locations;
  return region.locations.filter((l) => l.description.match(needle));
}

export interface SummaryTableProps {
  forecastResponse: ForecastResponse | null;
  matchedAreas: MatchedAreas;
  dailyForecastFilter: DailyForecastFilter;
  setDailyForecastFilter: any;
  showAqi: boolean;
}

function SummaryTable(props: SummaryTableProps) {
  const {
    matchedAreas,
    dailyForecastFilter,
    forecastResponse,
    showAqi,
  } = props;
  const navigate = useNavigate();
  const parsedDates = (forecastResponse?.dates || []).map((d: string) =>
    parse(d, 'YYYY-MM-DD'),
  );
  const weekends = calculateWeekends(parsedDates);
  const regions = matchedAreas.regions || [];
  const locationsByRegion = matchedAreas.locationsByRegion || {};
  const foundAlerts = alertsFound(forecastResponse?.alertsById);
  const alertProps: AlertProps = {
    alertsById: forecastResponse?.alertsById || null,
    allAlerts: forecastResponse?.allAlertIds || null,
    foundAlerts,
  };

  // Navigate to date detail page when a date is clicked
  const selectDate = (date: string) => {
    navigate(`/${date.toLowerCase()}`);
  };

  return (
    <>
      <table
        className='table styled-table'
        data-has-alerts={foundAlerts || undefined}
      >
        <thead className='table-heading'>
          <tr>
            {foundAlerts && (
              <td className='alerts-header'>
                <i className='wi wi-lightning' title='Weather Alerts' />
              </td>
            )}
            <td className='location-header'>Location</td>

            {/* Date columns */}
            {parsedDates.map((date, index) => {
              const isWeekendDate = weekends[index];
              const weekendClass = isWeekendDate ? 'weekend-header' : '';
              const txt = date === null ? '' : format(date, 'DD').toUpperCase();
              const dayOfWeekText =
                date === null ? '' : format(date, 'ddd').toUpperCase();
              const dateKey =
                date === null ? '' : format(date, 'YYYY-MM-DD');

              return (
                <td key={txt} align='center' className={weekendClass}>
                  <div className='day-of-week'>{dayOfWeekText}</div>
                  <button
                    type='button'
                    className={`button-2${isWeekendDate ? ' weekend' : ''}`}
                    onClick={() => selectDate(dateKey)}
                  >
                    {txt}
                  </button>
                </td>
              );
            })}
          </tr>
        </thead>
        {regions.map((region: RegionInterface) => {
          const locations = locationsByRegion[region.name];
          if (forecastResponse?.forecasts) {
            return (
              <Region
                key={region.name}
                isWeekend={weekends}
                region={region}
                forecastsById={forecastResponse?.forecasts}
                locations={locations}
                dailyForecastFilter={dailyForecastFilter}
                dateSelectedIsWithinForecastRange={false}
                alertProps={alertProps}
                showAqi={showAqi}
              />
            );
          }
          return null;
        })}
      </table>
      <div className='all-alerts'>
        <AlertDetail
          allAlertIds={forecastResponse?.allAlertIds}
          alertsById={forecastResponse?.alertsById}
        />
      </div>
    </>
  );
}

export default SummaryTable;