// Location.tsx
import { useNavigate } from 'react-router-dom';
import './Location.scss';
import type { LocationInterface } from '../../../interfaces/LocationInterface';
import type { ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import WeatherIcon from '../main_page/WeatherIcon';
import {
  type DailyForecastFilter,
  matchesSelecteDateString,
} from '../../../interfaces/DailyForecastFilter';
import type { AlertProps } from '../../../interfaces/AlertProps';
import { getAlertIconFromAlerts } from '../../../model/alert';
import { dateDifferenceInDays } from '../../../utils/date';
import { toSlug } from '../../../utils/slug';

// NEW: Import detailed view components
import {
  WindIndicator,
  HikeScore,
  MiniDayPreview,
  TempRange,
  UVBadge,
  VisibilityDisplay,
  getWeatherIconClass,
} from './DetailedWeatherComponents';

interface LocationProps {
  isWeekend: boolean[];
  location: LocationInterface;
  forecastsById: ForecastsById;
  dailyForecastFilter: DailyForecastFilter;
  atleastOneDateMatches: boolean;
  wtaRegionKey: string | undefined;
  alertProps: AlertProps;
  alertIds: string[] | undefined;
  // NEW: Props for detailed mode
  isDetailedMode?: boolean;
  selectedDateIndex?: number;
  allDates?: string[];
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

// Helper to format day label for context previews
function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

function Location(props: LocationProps) {
  const {
    location,
    isWeekend,
    forecastsById,
    dailyForecastFilter,
    atleastOneDateMatches,
    alertProps,
    alertIds,
    // NEW: Destructure detailed mode props
    isDetailedMode = false,
    selectedDateIndex = -1,
    allDates = [],
  } = props;
  
  const navigate = useNavigate();
  const forecasts = forecastsById.byId[location.name] || [];
  const locationHasAlerts = alertIds && alertIds?.length > 0;
  const maxDaysWithAlerts = maxAlertDays(alertProps, alertIds);

  // ============================================
  // DETAILED MODE: Render detailed single-day row
  // ============================================
  if (isDetailedMode && dailyForecastFilter.date) {
    // Find the selected day's forecast
    const dayForecast = forecasts.find(
      (d) => d.datetime === dailyForecastFilter.date
    );
    
    if (!dayForecast) {
      return null;
    }

    // Get prev/next day forecasts for context
    const prevDayForecast = selectedDateIndex > 0
      ? forecasts.find((d) => d.datetime === allDates[selectedDateIndex - 1])
      : null;
    const nextDayForecast = selectedDateIndex < allDates.length - 1
      ? forecasts.find((d) => d.datetime === allDates[selectedDateIndex + 1])
      : null;

    return (
      <tr className='weather-cell detailed-row'>
        {/* Alert cell */}
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

        {/* Location name */}
        <td className='location-name'>
          <button
            type='button'
            className='forecast-button'
            onClick={() =>
              navigate(`/location/${toSlug(location.description)}`)
            }
          >
            {location.description.toLocaleUpperCase()}
          </button>
        </td>

        {/* Yesterday */}
        <td className='detail-cell day-cell day-cell--prev'>
          {prevDayForecast ? (
            <MiniDayPreview
              icon={prevDayForecast.icon}
              high={prevDayForecast.tempmax}
              label={formatDayLabel(allDates[selectedDateIndex - 1])}
            />
          ) : (
            <div className='mini-day-preview mini-day-preview--empty'>
              <span className='no-data'>—</span>
            </div>
          )}
        </td>

        {/* Today - More prominent */}
        <td className='detail-cell day-cell day-cell--today'>
          <div className='today-preview'>
            <i
              className={`wi wi-${getWeatherIconClass(dayForecast.icon)} weather-icon-large`}
            />
          </div>
        </td>

        {/* Tomorrow */}
        <td className='detail-cell day-cell day-cell--next'>
          {nextDayForecast ? (
            <MiniDayPreview
              icon={nextDayForecast.icon}
              high={nextDayForecast.tempmax}
              label={formatDayLabel(allDates[selectedDateIndex + 1])}
            />
          ) : (
            <div className='mini-day-preview mini-day-preview--empty'>
              <span className='no-data'>—</span>
            </div>
          )}
        </td>

        {/* High/Low temps */}
        <td className='detail-cell temp-cell'>
          <TempRange high={dayForecast.tempmax} low={dayForecast.tempmin} />
        </td>

        {/* Precipitation */}
        <td className='detail-cell precip-cell'>
          <span className='precip-value'>
            {dayForecast.precipprob > 0
              ? `${Math.round(dayForecast.precipprob)}%`
              : '—'}
          </span>
        </td>

        {/* Wind */}
        <td className='detail-cell wind-cell'>
          <WindIndicator
            speed={Number(dayForecast.windspeed) || 0}
            direction={Number(dayForecast.winddir) || 0}
          />
        </td>

        {/* UV Index */}
        <td className='detail-cell uv-cell'>
          <UVBadge uv={Number(dayForecast.uvindex) || 0} />
        </td>

        {/* Visibility */}
        <td className='detail-cell vis-cell'>
          <VisibilityDisplay miles={Number(dayForecast.visibility) || 10} />
        </td>

        {/* Hike Score */}
        <td className='detail-cell hike-cell'>
          <HikeScore
            precip={Number(dayForecast.precipprob) || 0}
            wind={Number(dayForecast.windspeed) || 0}
            visibility={Number(dayForecast.visibility) || 10}
            uv={Number(dayForecast.uvindex) || 0}
          />
        </td>
      </tr>
    );
  }

  // ============================================
  // NORMAL MODE: Existing row rendering
  // ============================================
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
          onClick={() => navigate(`/location/${toSlug(location.description)}`)}
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
            onClick={() =>
              navigate(
                `/location/${toSlug(location.description)}/${d.datetime}`,
              )
            }
            style={{ cursor: 'pointer' }}
          >
            <WeatherIcon {...d} />
          </td>
        );
      })}
    </tr>
  );
}

export default Location;