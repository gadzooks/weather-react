import { TableBody } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Region.scss';
import { RegionInterface } from '../../interfaces/RegionInterface';
import React from 'react';
import { ForecastById, ForecastsById } from '../../interfaces/ForecastResponseInterface';
import Location from './Location';

export interface RegionProps {
  searchText: string,
  isWeekend: Boolean[],
  region: RegionInterface,
  forecastsById: ForecastsById,
}

function Region(props: RegionProps) {
    const colSpan = 17;
    // const locationIds = props.region.locations.map((l) => {return l.name; });
    return (
      <>
        <TableBody>
          <TableRow className='region-details'>
            <TableCell colSpan={colSpan} align="center">
              {props.region.description}
            </TableCell>
          </TableRow>
          {props.region.locations.map((loc, idx) => {
            if (loc.name.match(props.searchText)) {
              return <Location location={loc} key={idx} {...props} />;
            } else {
              return null;
            }
          })}
        </TableBody>
      </>
    );

}

export default Region;