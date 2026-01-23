// SummaryTable.tsx

import './SummaryTable.scss';
import { format, parse } from 'fecha';
import type { LocationInterface } from '../../../interfaces/LocationInterface';
import type { ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import Region from './Region';
import type { RegionInterface } from '../../../interfaces/RegionInterface';
import type { MatchedAreas } from '../../../interfaces/MatchedAreas';
import {
  type DailyForecastFilter,
  dateSelectedMatchesForecastDates,
} from '../../../interfaces/DailyForecastFilter';
import alertsFound from '../../../utils/count';
import AlertDetail from '../alerts/AlertDetail';
import type { AlertProps } from '../../../interfaces/AlertProps';
import { calculateWeekends } from '../../../utils/date';
import DateNavigation from './DateNavigation';

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
}

function SummaryTable(props: SummaryTableProps) {
  const {
    matchedAreas,
    dailyForecastFilter,
    forecastResponse,
    setDailyForecastFilter,
  } = props;
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

  const dateSelectedIsWithinForecastRange = dateSelectedMatchesForecastDates(
    forecastResponse?.dates || [],
    dailyForecastFilter.date,
  );

  // Find index of selected date for context (prev/next day)
  const selectedDateIndex = (forecastResponse?.dates || []).findIndex(
    (d) => d === dailyForecastFilter.date
  );

  const selectDate = (date: string) => {
    const dFF = { ...dailyForecastFilter } as DailyForecastFilter;
    if (date === dFF.date) {
      dFF.date = '';
    } else {
      dFF.date = date;
    }
    setDailyForecastFilter(dFF);
  };

  const clearDate = () => {
    const dFF = { ...dailyForecastFilter } as DailyForecastFilter;
    dFF.date = '';
    setDailyForecastFilter(dFF);
  };

  // Determine if we're in detailed single-day mode
  const isDetailedMode = dateSelectedIsWithinForecastRange;

  return (
    <>
      {/* Date Navigation Bar - shown in detailed mode */}
      {isDetailedMode && (
        <DateNavigation
          selectedDate={dailyForecastFilter.date || null}
          allDates={forecastResponse?.dates || []}
          onDateChange={selectDate}
          onClearDate={clearDate}
        />
      )}

      <table
        className={`table styled-table ${isDetailedMode ? 'detailed-mode' : ''}`}
        data-has-alerts={foundAlerts || undefined}
        data-detailed-mode={isDetailedMode || undefined}
      >
        <thead className='table-heading'>
          <tr>
            {foundAlerts && (
              <td className='alerts-header'>
                <i className='wi wi-lightning' title='Weather Alerts' />
              </td>
            )}
            <td className='location-header'>Location</td>
            
            {/* DETAILED MODE: Show additional column headers */}
            {isDetailedMode && (
              <>
                <td className='detail-header day-header'>Yesterday</td>
                <td className='detail-header day-header day-header--today'>Today</td>
                <td className='detail-header day-header'>Tomorrow</td>
                <td className='detail-header temp-header'>Hi/Lo</td>
                <td className='detail-header precip-header'>Precip</td>
                <td className='detail-header wind-header'>Wind</td>
                <td className='detail-header uv-header'>UV</td>
                <td className='detail-header vis-header'>Vis</td>
                <td className='detail-header hike-header'>Hike</td>
              </>
            )}
            
            {/* Date column(s) - Only shown in normal (non-detailed) mode */}
            {!isDetailedMode && parsedDates.map((date, index) => {
              const isWeekendDate = weekends[index];
              const weekendClass = isWeekendDate ? 'weekend-header' : '';
              const txt = date === null ? '' : format(date, 'DD').toUpperCase();
              const dayOfWeekText =
                date === null ? '' : format(date, 'ddd').toUpperCase();
              const dateKey =
                date === null ? '' : format(date, 'YYYY-MM-DD').toUpperCase();

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
                dateSelectedIsWithinForecastRange={dateSelectedIsWithinForecastRange}
                alertProps={alertProps}
                // NEW: Pass these props for detailed mode
                isDetailedMode={isDetailedMode}
                selectedDateIndex={selectedDateIndex}
                allDates={forecastResponse?.dates || []}
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