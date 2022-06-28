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
import { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';

export interface RegionProps {
  isWeekend: boolean[],
  region: RegionInterface,
  forecastsById: ForecastsById,
  locations: LocationInterface[],
  dailyForecastFilter: DailyForecastFilter,
}

function Region(props: RegionProps) {
  const { region } = props;
  const { description } = region;
  const { searchKey } = region;
  const { locations } = props;
  const { dailyForecastFilter } = props;
  const colSpan = dailyForecastFilter.date ? 3 : 17;
  return (
    <TableBody>
      <TableRow className="region-details">
        <TableCell colSpan={colSpan} align="center">
          {description}
          <WtaLink wtaRegion={searchKey} />
        </TableCell>
      </TableRow>
      {locations.map((loc) => (
        <Location location={loc} {...props} key={loc.name} />
      ))}
    </TableBody>
  );
}

export default Region;
