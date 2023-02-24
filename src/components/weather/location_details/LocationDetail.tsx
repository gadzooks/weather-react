import React from 'react';
import { format } from 'fecha';
import '../../../css/weather-icons.css';
import './LocationDetail.scss';
import convertToSentence from '../../../utils/string';
import { deserializeLocationData, LocationDetailData } from '../../../interfaces/LocationInterface';
import WtaLink from './WtaLink';
import WeatherIcon from '../main_page/WeatherIcon';
import { ForecastResponseStatus } from '../../../interfaces/ForecastResponseInterface';
import LocationDetailChart, { LocationDetailChartProps } from './LocationDetailChart';

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
  const locProps:LocationDetailChartProps = {
    forecast,
    forecastDates,
  };

  return (
    <>
      <LocationDetailChart {...locProps} />
      <div id={location.name}>
        <table className='location-details table styled-table'>
          <thead className='table-heading'>
            <tr className='heading'>
              <td colSpan={7} className='heading'>
                <WtaLink
                  wtaRegion={location.wtaRegionKey}
                  wtaSubRegion={location.sub_region}
                />
                <button
                  className='button-2'
                  type='button'
                  onClick={() => setForecastDetailsForLocation(null)}
                >
                  {`${description.toUpperCase()}  `}

                </button>
              </td>
            </tr>
            <tr className='secondary-heading'>
              <td colSpan={1} className='center border-right'>
                DATE
              </td>
              <td colSpan={2} className='center border-right'>
                DETAILS
              </td>
              <td className='border-right'>LOW / HIGH</td>
              <td colSpan={2} className='center border-right'>
                PRECIP
              </td>
              <td>CLOUD COV</td>
            </tr>
          </thead>
          <tbody>
            {forecast.map((row, id) => {
              const d = parsedDates[id];
              if (d) {
                const weekendClassName = weekends[id] ? ' weekend ' : ' ';
                return (
                  <tr className={weekendClassName} key={row.datetime}>
                    <td className='border-right'>
                      {format(d, 'ddd').toUpperCase()}
                      {'  '}
                      {format(d, 'Do').toUpperCase()}
                    </td>
                    <td>
                      <WeatherIcon {...row} key={row.datetime} />
                    </td>
                    <td className='border-right'>
                      {convertToSentence(row.icon)}
                    </td>
                    <td className='border-right'>
                      {`${Math.round(row.tempmin)}° / ${Math.round(
                        row.tempmax,
                      )}°`}
                    </td>
                    <td className='align-right'>
                      {`${Math.round(row.precipprob)}%`}
                    </td>
                    <td className='align-right border-right'>
                      {`${Math.round(row.precip)}"`}
                    </td>
                    <td className='align-right'>{`${row.cloudcover}%       `}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    </>
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
