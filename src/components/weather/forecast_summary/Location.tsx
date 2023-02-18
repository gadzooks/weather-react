import './Location.scss';
import React from 'react';
import { LocationInterface, serializeLocationData } from '../../../interfaces/LocationInterface';
import { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import WeatherIcon from '../main_page/WeatherIcon';
import { DailyForecastFilter, matchesSelecteDateString } from '../../../interfaces/DailyForecastFilter';
import AlertProps from '../../../interfaces/AlertProps';
import { getAlertIconFromAlerts } from '../../../model/alert';

interface LocationProps {
  isWeekend: boolean[];
  location: LocationInterface;
  forecastsById: ForecastsById;
  dailyForecastFilter: DailyForecastFilter;
  atleastOneDateMatches: boolean;
  setForecastDetailsForLocation: any;
  // eslint-disable-next-line react/require-default-props
  wtaRegionKey?: string;
  alertProps: AlertProps;
  // eslint-disable-next-line react/require-default-props
  alertIds?: string[];
}

function Location(props: LocationProps) {
  const {
    location,
    isWeekend,
    forecastsById,
    dailyForecastFilter,
    atleastOneDateMatches,
    setForecastDetailsForLocation,
    wtaRegionKey,
    alertProps,
    alertIds,
  } = props;
  const forecasts = forecastsById.byId[location.name] || [];
  const locationHasAlerts = alertIds && (alertIds?.length > 0);
  return (
    <tr className='weather-cell'>
      {alertProps.foundAlerts && (
        <td>
          {locationHasAlerts && alertIds.map((alert) => <span className='alert-icon' key={alert}>{getAlertIconFromAlerts(alertProps, alert)}</span>)}
        </td>
      )}
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
