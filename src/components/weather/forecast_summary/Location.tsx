import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Location.scss';
import React from 'react';
import { Link } from '@mui/material';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import WeatherIcon from '../main_page/WeatherIcon';
import { DailyForecastFilter, matchesSelecteDateString } from '../../../interfaces/DailyForecastFilter';

interface LocationProps {
  isWeekend: boolean[];
  location: LocationInterface;
  forecastsById: ForecastsById;
  dailyForecastFilter: DailyForecastFilter;
  atleastOneDateMatches: boolean;
}

function Location(props: LocationProps) {
  const { location } = props;
  const { isWeekend } = props;
  const { forecastsById } = props;
  const { dailyForecastFilter } = props;
  const { atleastOneDateMatches } = props;
  const forecasts = forecastsById.byId[location.name] || [];
  return (
    <TableRow className='weather-cell'>
      <TableCell className='weather-cell'>N/A</TableCell>
      <TableCell className='weather-cell'>
        <Link href={`#${location.name}`}>{location.description.toLocaleUpperCase()}</Link>
      </TableCell>
      {forecasts.map((d, index) => {
        if (
          atleastOneDateMatches
          && !matchesSelecteDateString(d.datetime, dailyForecastFilter.date)
        ) { return null; }
        const weekendClassName = isWeekend[index] ? ' weekend ' : ' ';
        return (
          <TableCell key={d.datetime} className={`weather-cell center ${weekendClassName}`}>
            <WeatherIcon {...d} />
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export default Location;
