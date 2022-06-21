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

function matchedOne(needle: RegExp | null, haystack: LocationInterface[]) :boolean {
  if(!needle) return true;
  const names = haystack.map((l) => {return l.description});
  return !!names.find((element) => element.match(needle));
}

interface SummaryTableProps extends SearchableTableHookProps {
  searchText: string,
}

function SummaryTable(props: SummaryTableProps) {
  const isWeekend = props.isWeekend;
  const parsedDates = props.parsedDates;
  const regionIds = props.regions.allIds;
  const regions = props.regions;
  const re = props.searchText === "" ? null: new RegExp(props.searchText, "i");

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
          if (matchedOne(re, region.locations)) {
            return (
              <Region
                key={id}
                searchRegExp={re}
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