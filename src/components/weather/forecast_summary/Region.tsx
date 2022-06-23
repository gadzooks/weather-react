import { TableBody } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Region.scss';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import React from 'react';
import { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import Location from './Location';
import WtaLink from '../location_details/WtaLink';
import { LocationInterface } from '../../../interfaces/LocationInterface';

export interface RegionProps {
  isWeekend: boolean[],
  region: RegionInterface,
  forecastsById: ForecastsById,
  locations: LocationInterface[],
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
              <WtaLink wtaRegion={props.region.search_key} />
            </TableCell>
          </TableRow>
          {props.locations.map((loc, idx) => {
              return <Location location={loc} key={idx} {...props} />;
          })}
        </TableBody>
      </>
    );

}

export default Region;