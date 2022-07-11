import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Location.scss';
import React from 'react';
import { Button } from '@mui/material';
import { LocationInterface, serializeLocationData } from '../../../interfaces/LocationInterface';
import { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import WeatherIcon from '../main_page/WeatherIcon';
import { DailyForecastFilter, matchesSelecteDateString } from '../../../interfaces/DailyForecastFilter';

interface LocationProps {
  isWeekend: boolean[];
  location: LocationInterface;
  forecastsById: ForecastsById;
  dailyForecastFilter: DailyForecastFilter;
  atleastOneDateMatches: boolean;
  setForecastDetailsForLocation: any;
  // eslint-disable-next-line react/require-default-props
  wtaRegionKey?: string;
}

function Location(props: LocationProps) {
  const { location } = props;
  const { isWeekend } = props;
  const { forecastsById } = props;
  const { dailyForecastFilter } = props;
  const { atleastOneDateMatches } = props;
  const { setForecastDetailsForLocation } = props;
  const { wtaRegionKey } = props;
  const forecasts = forecastsById.byId[location.name] || [];
  return (
    <TableRow className='weather-cell'>
      {/* <TableCell className='weather-cell'>N/A</TableCell> */}
      <TableCell className='weather-cell'>
        <Button
          onClick={() => setForecastDetailsForLocation(
            serializeLocationData(location, wtaRegionKey),
          )}
        >
          {location.description.toLocaleUpperCase()}
        </Button>
      </TableCell>
      {forecasts.map((d, index) => {
        if (
          atleastOneDateMatches
          && !matchesSelecteDateString(d.datetime, dailyForecastFilter.date)
        ) {
          return null;
        }
        const weekendClassName = isWeekend[index] ? ' weekend ' : ' ';
        return (
          <TableCell
            key={d.datetime}
            className={`weather-cell center ${weekendClassName}`}
          >
            <WeatherIcon {...d} />
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export default Location;
