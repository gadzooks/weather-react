/* eslint-disable react/destructuring-assignment */
import { TableBody } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Region.scss';
import React from 'react';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import Location from './Location';
import WtaLink from '../location_details/WtaLink';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import {
  DailyForecastFilter,
  forecastColSpan,
} from '../../../interfaces/DailyForecastFilter';

export interface RegionProps {
  isWeekend: boolean[];
  region: RegionInterface;
  forecastsById: ForecastsById;
  locations: LocationInterface[];
  dailyForecastFilter: DailyForecastFilter;
  dateSelectedIsWithinForecastRange: boolean;
  setForecastDetailsForLocation: any;
}

function Region(props: RegionProps) {
  const { region } = props;
  const { description } = region;
  const { searchKey } = region;
  const { locations } = props;
  const colSpan = forecastColSpan(props.dateSelectedIsWithinForecastRange);
  return (
    <TableBody>
      <TableRow className='region-details'>
        <TableCell colSpan={colSpan} align='center'>
          {description}
          <WtaLink wtaRegion={searchKey} />
        </TableCell>
      </TableRow>
      {locations.map((loc) => (
        <Location
          wtaRegionKey={region.searchKey}
          location={loc}
          {...props}
          key={loc.name}
          atleastOneDateMatches={props.dateSelectedIsWithinForecastRange}
        />
      ))}
    </TableBody>
  );
}

export default Region;
