import React from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { format } from 'fecha';
import '../../../css/weather-icons.css';
import './LocationDetail.scss';
import convertToSentence from '../../../utils/string';
import { deserializeLocationData, LocationDetailData } from '../../../interfaces/LocationInterface';
import WtaLink from './WtaLink';
import WeatherIcon from '../main_page/WeatherIcon';
import { ForecastResponseStatus } from '../../../interfaces/ForecastResponseInterface';

export interface LocationDetailProps {
  appState: ForecastResponseStatus;
  forecastDetailsForLocation: string | undefined;
  setForecastDetailsForLocation: any;
}

function LocationDetail(props: LocationDetailProps) {
  const { forecastDetailsForLocation } = props;
  if (!forecastDetailsForLocation) return null;

  const location:LocationDetailData = deserializeLocationData(forecastDetailsForLocation);
  const { appState } = props;
  const { setForecastDetailsForLocation } = props;

  const { description } = location;
  const forecastsByLocation = appState.forecast?.forecasts.byId || {};
  const forecast = forecastsByLocation[location.name];
  const { forecastDates } = appState;
  const { weekends } = forecastDates;
  const { parsedDates } = forecastDates;

  if (!forecast) return null;
  return (
    <div id={location.name}>
      <Table className='location-details'>
        <TableHead>
          <TableRow className='heading'>
            <TableCell colSpan={8} className='heading'>
              {`${description.toUpperCase()}  `}
              <WtaLink
                wtaRegion={location.wtaRegionKey}
                wtaSubRegion={location.sub_region}
              />
              <Button onClick={() => setForecastDetailsForLocation(null)}>BACK</Button>
            </TableCell>
          </TableRow>
          <TableRow className='secondary-heading'>
            <TableCell colSpan={2} className='center border-right'>
              DATE
            </TableCell>
            <TableCell colSpan={2} className='center border-right'>
              DETAILS
            </TableCell>
            <TableCell className='border-right'>LOW / HIGH</TableCell>
            <TableCell colSpan={2} className='center border-right'>
              PRECIP
            </TableCell>
            <TableCell>CLOUD COV</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forecast.map((row, id) => {
            const d = parsedDates[id];
            if (d) {
              const weekendClassName = weekends[id] ? ' weekend ' : ' ';
              return (
                <TableRow className={weekendClassName} key={row.datetime}>
                  <TableCell>{format(d, 'ddd').toUpperCase()}</TableCell>
                  <TableCell className='border-right'>
                    {format(d, 'MMM Do').toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <WeatherIcon {...row} key={row.datetime} />
                  </TableCell>
                  <TableCell className='border-right'>
                    {convertToSentence(row.icon)}
                  </TableCell>
                  <TableCell className='border-right'>
                    {`${Math.round(
                      row.tempmin,
                    )}° / ${Math.round(row.tempmax)}°`}

                  </TableCell>
                  <TableCell className='align-right'>
                    {`${Math.round(
                      row.precipprob,
                    )}%`}

                  </TableCell>
                  <TableCell className='align-right border-right'>
                    {`${Math.round(
                      row.precip,
                    )}"`}

                  </TableCell>
                  <TableCell className='align-right'>{`${row.cloudcover}%       `}</TableCell>
                </TableRow>
              );
            }
            return null;
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default LocationDetail;

// forecasts: {
//     byId: {
//       renton: [
//         {
//           time: "2021-04-17T07:00:00.000+00:00",
//           summary: "Clear conditions throughout the day.",
//           icon: "day-hail",
//           precipProbability: 0.0,
//           temperature: 60.9,
//           apparentTemperature: 60.9,
//           dewPoint: 40.1,
//           visibility: 120,
//           cloudCover: 1,
//           temperatureHigh: 74.9,
//           temperatureLow: 47.3,
//           sunsetTime: 1618714951,
//           sunriseTime: 1618665359,
//           precipAmount: 0.0,
//         },
