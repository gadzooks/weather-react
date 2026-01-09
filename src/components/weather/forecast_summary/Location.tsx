// Location.tsx

import './Location.scss';
import {
  type LocationInterface,
  serializeLocationData,
} from '../../../interfaces/LocationInterface';
import type { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import WeatherIcon from '../main_page/WeatherIcon';
import {
  type DailyForecastFilter,
  matchesSelecteDateString,
} from '../../../interfaces/DailyForecastFilter';
import type { AlertProps } from '../../../interfaces/AlertProps';
import { getAlertIconFromAlerts } from '../../../model/alert';
import { dateDifferenceInDays } from '../../../utils/date';

interface LocationProps {
  isWeekend: boolean[];
  location: LocationInterface;
  forecastsById: ForecastsById;
  dailyForecastFilter: DailyForecastFilter;
  atleastOneDateMatches: boolean;
  setForecastDetailsForLocation: any;
  wtaRegionKey: string | undefined;
  alertProps: AlertProps;
  alertIds: string[] | undefined;
}

function maxAlertDays(
  alertProps: AlertProps,
  locationAlerts: string[] | undefined,
): number {
  const { alertsById } = alertProps;
  if (
    !alertProps.foundAlerts ||
    alertsById === null ||
    locationAlerts === undefined
  )
    return -1;

  return Math.max.apply(
    null,
    locationAlerts.map((alertId) => {
      const alert = alertsById[alertId];
      if (alert !== undefined) {
        return dateDifferenceInDays(alert.endsEpoch) || -1;
      }
      return -1;
    }),
  );
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
  const locationHasAlerts = alertIds && alertIds?.length > 0;
  const maxDaysWithAlerts = maxAlertDays(alertProps, alertIds);
  return (
    <tr className='weather-cell'>
      {alertProps.foundAlerts && (
        <td className='alerts-cell'>
          {locationHasAlerts &&
            alertIds.map((alert) => (
              <a href={`#${alert}`} className='alert-icon' key={alert}>
                {getAlertIconFromAlerts(alertProps, alert)}
              </a>
            ))}
        </td>
      )}
      <td className='location-name'>
        <button
          type='button'
          className='forecast-button'
          onClick={() =>
            setForecastDetailsForLocation(
              serializeLocationData(location, wtaRegionKey),
            )
          }
        >
          {location.description.toLocaleUpperCase()}
        </button>
      </td>
      {forecasts.map((d, index) => {
        if (
          atleastOneDateMatches &&
          !matchesSelecteDateString(d.datetime, dailyForecastFilter.date)
        ) {
          return null;
        }
        const weekendClassName = isWeekend[index] ? 'weekend' : '';
        const alertClassName =
          index <= maxDaysWithAlerts ? 'alert-for-this-day' : '';
        return (
          <td
            key={d.datetime}
            className={`weather-cell center ${weekendClassName} ${alertClassName}`}
          >
            <WeatherIcon {...d} />
          </td>
        );
      })}
    </tr>
  );
}

export default Location;
