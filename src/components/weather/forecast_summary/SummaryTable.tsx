import './SummaryTable.scss';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Table } from '@mui/material';
import { format } from 'fecha';
import { LocationInterface } from '../../../interfaces/LocationInterface.js';
import {SearchableTableHookProps} from './SearchableTableHook';
import React from 'react';
import Region from './Region';

function matchedOne(needle: string, haystack: LocationInterface[]) {
  const names = haystack.map((l) => {return l.name});
  return names.find((element) => element.match(needle));
}

interface SummaryTableProps extends SearchableTableHookProps {
  searchText: string,
}

function SummaryTable(props: SummaryTableProps) {
  const isWeekend = props.isWeekend;
  const parsedDates = props.parsedDates;
  const regionIds = props.regions.allIds;
  const regions = props.regions;
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
        {regionIds.map((id) => {
          const region = regions.byId[id];
          if (matchedOne(props.searchText, region.locations)) {
            return (
              <Region
                key={id}
                searchText={props.searchText}
                isWeekend={isWeekend}
                region={region}
                forecastsById={props.forecasts}
              />
            );
          } else {
            return null;
          }
        })}
      </Table>
    </>
  );
}

export default SummaryTable;