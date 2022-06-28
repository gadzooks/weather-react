import './SummaryTable.scss';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Table } from '@mui/material';
import { format } from 'fecha';
import React from 'react';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import Region from './Region';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import { DailyForecastFilter, matchesSelecteDate } from '../../../interfaces/DailyForecastFilter';

export function matchedOne(needle: RegExp | null, haystack: LocationInterface[]) :boolean {
  if (!needle) return true;
  const names = haystack.map((l) => l.description);
  return !!names.find((element) => element.match(needle));
}

// eslint-disable-next-line max-len
export function matchedLocations(needle: RegExp | null, region: RegionInterface) :LocationInterface[] {
  if (!needle) return region.locations;
  return region.locations.filter((l) => l.description.match(needle));
}

interface SummaryTableProps extends ForecastResponse {
  isWeekend: boolean[],
  parsedDates: (Date|null)[],
  matchedAreas: MatchedAreas,
  dailyForecastFilter: DailyForecastFilter,
}

function SummaryTable(props: SummaryTableProps) {
  const { isWeekend } = props;
  const { parsedDates } = props;
  const { matchedAreas } = props;
  const { regions } = matchedAreas;
  const { locationsByRegion } = matchedAreas;
  const { dailyForecastFilter } = props;

  return (
    <Table className="table table-sm weather-forecast-summary">
      <TableHead className="table-heading">
        <TableRow>
          <TableCell>Weather Alerts</TableCell>
          <TableCell>Location</TableCell>
          {parsedDates.map((date) => {
            const txt = date === null ? '' : format(date, 'ddd MMM DD').toUpperCase();
            return (
              matchesSelecteDate(date, dailyForecastFilter.date) && (
                <TableCell key={txt}>{txt}</TableCell>
              )
            );
          })}
        </TableRow>
      </TableHead>
      {regions.map((region: RegionInterface) => {
        const locations = locationsByRegion[region.name];
        const { forecasts } = props;
        return (
          <Region
            key={region.name}
            isWeekend={isWeekend}
            region={region}
            forecastsById={forecasts}
            locations={locations}
            dailyForecastFilter={dailyForecastFilter}
          />
        );
      })}
    </Table>
  );
}

export default SummaryTable;
