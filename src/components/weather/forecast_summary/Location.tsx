import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Location.scss';
import WeatherIcon from '../main_page/WeatherIcon';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import React from 'react';
import { Link } from '@mui/material';

interface LocationProps {
  isWeekend: boolean[],
  location: LocationInterface,
  forecastsById: ForecastsById,
}

function Location(props: LocationProps) {
  const location = props.location;
  const forecasts = props.forecastsById.byId[location.name] || [];
  return (
    <TableRow className='weather-cell'>
      <TableCell className='weather-cell'>N/A</TableCell>
      <TableCell className='weather-cell'>
        <Link href={`#${location.name}`} >{location.description.toLocaleUpperCase()}</Link>
        </TableCell>
      {forecasts.map((d, index) => {
        const weekendClassName = props.isWeekend[index] ? ' weekend ' : ' ';
        return <TableCell key={index} className={`weather-cell center ${weekendClassName}`}>
          <WeatherIcon {...d} key={index} />
        </TableCell>
      })}
    </TableRow>
  );
}

export default Location;