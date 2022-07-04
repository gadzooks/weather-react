import './SummaryTable.scss';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Table } from '@mui/material';
import { format } from 'fecha';
import React from 'react';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { ForeacastDates, ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import Region from './Region';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import { DailyForecastFilter, dateSelectedMatchesForecastDates, matchesSelecteDate } from '../../../interfaces/DailyForecastFilter';

// eslint-disable-next-line max-len
export function matchedLocations(needle: RegExp | null, region: RegionInterface) :LocationInterface[] {
  if (!needle) return region.locations;
  return region.locations.filter((l) => l.description.match(needle));
}

export interface SummaryTableProps {
  forecastResponse: ForecastResponse|null,
  forecastDates: ForeacastDates,
  matchedAreas: MatchedAreas,
  dailyForecastFilter: DailyForecastFilter,
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

  const dateSelectedIsWithinForecastRange = dateSelectedMatchesForecastDates(
    forecastDates.dates,
    dailyForecastFilter.date,
  );

  return (
    <Table className='table table-sm weather-forecast-summary'>
      <TableHead className='table-heading'>
        <TableRow>
          <TableCell>Weather Alerts</TableCell>
          <TableCell>Location</TableCell>
          {parsedDates.map((date) => {
            const txt = date === null ? '' : format(date, 'ddd MMM DD').toUpperCase();
            return (
              (!dateSelectedIsWithinForecastRange
                || matchesSelecteDate(date, dailyForecastFilter.date)) && (
                <TableCell key={txt}>{txt}</TableCell>
              )
            );
          })}
        </TableRow>
      </TableHead>
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
            />
          );
        }
        return null;
      })}
    </Table>
  );
}

export default SummaryTable;
