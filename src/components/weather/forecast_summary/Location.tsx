import './Location.scss';
import React from 'react';
import { LocationInterface, serializeLocationData } from '../../../interfaces/LocationInterface';
import { AlertsById, ForecastsById } from '../../../interfaces/ForecastResponseInterface';
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
  alertsById: AlertsById | null;
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
    <tr className='weather-cell'>
      {/* <td className='weather-cell'>N/A</td> */}
      <td className='location-name'>
        <button
          type='button'
          className='forecast-button'
          onClick={() => setForecastDetailsForLocation(
            serializeLocationData(location, wtaRegionKey),
          )}
        >
          {location.description.toLocaleUpperCase()}
        </button>
      </td>
      {forecasts.map((d, index) => {
        if (
          atleastOneDateMatches
          && !matchesSelecteDateString(d.datetime, dailyForecastFilter.date)
        ) {
          return null;
        }
        const weekendClassName = isWeekend[index] ? ' weekend ' : ' ';
        return (
          <td
            key={d.datetime}
            className={`weather-cell center ${weekendClassName}`}
          >
            <WeatherIcon {...d} />
          </td>
        );
      })}
    </tr>
  );
}

export default Location;
