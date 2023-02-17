import './SummaryTable.scss';
import { format } from 'fecha';
import React from 'react';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { ForeacastDates, ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import Region from './Region';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import { DailyForecastFilter, dateSelectedMatchesForecastDates, matchesSelecteDate } from '../../../interfaces/DailyForecastFilter';
import alertsFound from '../../../utils/count';

// eslint-disable-next-line max-len
export function matchedLocations(needle: RegExp | null, region: RegionInterface) :LocationInterface[] {
  if (!needle) return region.locations;
  return region.locations.filter((l) => l.description.match(needle));
}

export interface SummaryTableProps {
  forecastResponse: ForecastResponse | null;
  forecastDates: ForeacastDates;
  matchedAreas: MatchedAreas;
  dailyForecastFilter: DailyForecastFilter;
  setDailyForecastFilter: any;
  setForecastDetailsForLocation: any;
}

function prevDateWithinRange(
  date: Date | null,
  index: number,
  dates: (Date | null)[],
): string | null {
  if (date === null) return null;
  if (index === 0) return null;
  const prevParsedDate = dates[index - 1];
  if (!prevParsedDate) return null;
  return format(prevParsedDate, 'YYYY-MM-DD');
}

function nextDateWithinRange(
  date: Date | null,
  index: number,
  dates: (Date | null)[],
): string | null {
  if (date === null) return null;
  if (index === (dates.length - 1)) return null;
  const nextParsedDate = dates[index + 1];
  if (!nextParsedDate) return null;
  return format(nextParsedDate, 'YYYY-MM-DD');
}

function SummaryTable(props: SummaryTableProps) {
  const { forecastDates } = props;
  const { weekends } = forecastDates;
  const { parsedDates } = forecastDates;
  const { matchedAreas } = props;
  const regions = matchedAreas.regions || [];
  const locationsByRegion = matchedAreas.locationsByRegion || {};
  const { dailyForecastFilter } = props;
  const { forecastResponse } = props;
  const { setDailyForecastFilter } = props;
  const { setForecastDetailsForLocation } = props;
  const alertsById = forecastResponse?.alertsById || null;

  const dateSelectedIsWithinForecastRange = dateSelectedMatchesForecastDates(
    forecastDates.dates,
    dailyForecastFilter.date,
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

  // console.log(JSON.stringify(alertsById));

  return (
    <table className='table styled-table'>
      <thead className='table-heading'>
        {/* <tr>
          <td rowSpan={2}>Location</td>
          {parsedDates.map((date) => {
            const txt = date === null ? '' : format(date, 'ddd').toUpperCase();
            const dateMatches = matchesSelecteDate(
              date,
              dailyForecastFilter.date,
            );

            return (
              (!dateSelectedIsWithinForecastRange || dateMatches) && (
              <td key={txt} align='center'>
                {txt}
              </td>
              )
            );
          })}
        </tr> */}

        <tr>
          {alertsFound(alertsById) && <td>Alerts</td> }
          <td>Location</td>
          {parsedDates.map((date, index) => {
            const txt = date === null ? '' : format(date, 'DD').toUpperCase();
            const dateKey = date === null ? '' : format(date, 'YYYY-MM-DD').toUpperCase();
            const dateMatches = matchesSelecteDate(
              date,
              dailyForecastFilter.date,
            );
            const prevDateKey = prevDateWithinRange(date, index, parsedDates);
            const nextDateKey = nextDateWithinRange(date, index, parsedDates);
            return (
              (!dateSelectedIsWithinForecastRange || dateMatches) && (
              <td key={txt} align='center'>
                {dateSelectedIsWithinForecastRange && (
                <>
                  <button
                    className='button-2 left-arrow'
                    type='button'
                    onClick={() => selectDate(prevDateKey || '')}
                  >
                    &larr;
                  </button>
                  <button
                    type='button'
                    className='button-2 forecast-date'
                    onClick={() => selectDate(dateKey)}
                  >
                    {txt}
                  </button>
                  <button
                    className='button-2 right-arrow'
                    type='button'
                    onClick={() => selectDate(nextDateKey || '')}
                  >
                    &rarr;
                  </button>
                </>
                )}
                {!dateSelectedIsWithinForecastRange && (
                <button
                  type='button'
                  className='button-2'
                  onClick={() => selectDate(dateKey)}
                >
                  {txt}
                </button>
                )}
              </td>
              )
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
              dateSelectedIsWithinForecastRange={
                  dateSelectedIsWithinForecastRange
                }
              setForecastDetailsForLocation={setForecastDetailsForLocation}
              alertsById={alertsById}
            />
          );
        }
        return null;
      })}
    </table>
  );
}

export default SummaryTable;
