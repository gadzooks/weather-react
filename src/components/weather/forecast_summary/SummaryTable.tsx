import './SummaryTable.scss';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Table } from '@mui/material';
import { format } from 'fecha';
import { LocationInterface } from '../../../interfaces/LocationInterface.js';
import React from 'react';
import { ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import Region from './Region';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import { MatchedAreas } from './SearchableTableHook';

export function matchedOne(needle: RegExp | null, haystack: LocationInterface[]) :boolean {
  if(!needle) return true;
  const names = haystack.map((l) => {return l.description});
  return !!names.find((element) => element.match(needle));
}

export function matchedLocations(needle: RegExp | null, region: RegionInterface) :LocationInterface[] {
  if(!needle) return region.locations;
  return region.locations.filter((l) => l.description.match(needle));
}

interface SummaryTableProps extends ForecastResponse {
  isWeekend: boolean[],
  parsedDates: (Date|null)[],
  matchedAreas: MatchedAreas,
}

function SummaryTable(props: SummaryTableProps) {
  const isWeekend = props.isWeekend;
  const parsedDates = props.parsedDates;
  const regions = props.matchedAreas.regions;
  const locationsByRegion = props.matchedAreas.locationsByRegion;

  return (
    <>
      <Table className='table table-sm weather-forecast-summary'>
        <TableHead className='table-heading'>
          <TableRow>
            <TableCell>Weather Alerts</TableCell>
            <TableCell>Location</TableCell>
            {parsedDates.map((date, idx) => {
              const txt = date === null ? '' : format(date, 'ddd MMM DD').toUpperCase();
              return <TableCell key={idx}>{txt}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        {regions.map((region, id) => {
          const locations = locationsByRegion[region.name];
            return (
              <Region
                key={id}
                isWeekend={isWeekend}
                region={region}
                forecastsById={props.forecasts}
                locations={locations}
              />
            );
          } 
        )}
      </Table>
    </>
  );
}

export default SummaryTable;