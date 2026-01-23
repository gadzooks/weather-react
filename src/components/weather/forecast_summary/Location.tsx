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
  Sparkline,
  PrecipBars,
  WindIndicator,
  HikeScore,
  MiniDayPreview,
  TempRange,
  UVBadge,
  VisibilityDisplay,
  getWeatherIconClass,
  extractHourlyTemps,
  extractHourlyPrecip,
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

    // Extract hourly data for sparklines
    const hourlyTemps = extractHourlyTemps(dayForecast.hours);
    const hourlyPrecip = extractHourlyPrecip(dayForecast.hours);

    // Check if this day has an alert
    const dayIndex = allDates.indexOf(dayForecast.datetime);
    const hasAlertToday = dayIndex <= maxDaysWithAlerts && maxDaysWithAlerts >= 0;

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
            onClick={() => navigate(`/location/${toSlug(location.description)}`)}
          >
            {location.description.toLocaleUpperCase()}
          </button>
        </td>

        {/* Day context (prev/next) */}
        <td className='detail-cell context-cell'>
          <div className='day-context'>
            {prevDayForecast ? (
              <MiniDayPreview
                icon={prevDayForecast.icon}
                high={prevDayForecast.tempmax}
                label={formatDayLabel(allDates[selectedDateIndex - 1])}
              />
            ) : (
              <div className='mini-day-preview mini-day-preview--empty' />
            )}
            {nextDayForecast ? (
              <MiniDayPreview
                icon={nextDayForecast.icon}
                high={nextDayForecast.tempmax}
                label={formatDayLabel(allDates[selectedDateIndex + 1])}
              />
            ) : (
              <div className='mini-day-preview mini-day-preview--empty' />
            )}
          </div>
        </td>

        {/* Today's weather icon */}
        <td className='detail-cell icon-cell'>
          <i className={`wi wi-${getWeatherIconClass(dayForecast.icon)} weather-icon-large`} />
        </td>

        {/* High/Low temps */}
        <td className='detail-cell temp-cell'>
          <TempRange high={dayForecast.tempmax} low={dayForecast.tempmin} />
        </td>

        {/* Temperature sparkline */}
        <td className='detail-cell sparkline-cell'>
          {hourlyTemps.length > 0 ? (
            <Sparkline
              data={hourlyTemps}
              color='#fbbf24'
              height={22}
              width={70}
              showArea={true}
            />
          ) : (
            <span className='no-data'>—</span>
          )}
        </td>

        {/* Precipitation */}
        <td className='detail-cell precip-cell'>
          <div className='precip-content'>
            <span className='precip-value'>
              {dayForecast.precipprob > 0 ? `${Math.round(dayForecast.precipprob)}%` : '—'}
            </span>
            {hourlyPrecip.length > 0 && (
              <PrecipBars data={hourlyPrecip} height={18} width={45} />
            )}
          </div>
        </td>

        {/* Wind */}
        <td className='detail-cell wind-cell'>
          <WindIndicator
            speed={dayForecast.windspeed}
            direction={dayForecast.winddir}
          />
        </td>

        {/* UV Index */}
        <td className='detail-cell uv-cell'>
          <UVBadge uv={dayForecast.uvindex} />
        </td>

        {/* Visibility */}
        <td className='detail-cell vis-cell'>
          <VisibilityDisplay miles={dayForecast.visibility} />
        </td>

        {/* Hike Score */}
        <td className='detail-cell hike-cell'>
          <HikeScore
            precip={dayForecast.precipprob}
            wind={dayForecast.windspeed}
            visibility={dayForecast.visibility}
            uv={dayForecast.uvindex}
          />
        </td>

        {/* Date navigation cell (empty, nav is in header) */}
        <td
          className={`weather-cell center ${isWeekend[selectedDateIndex] ? 'weekend' : ''} ${hasAlertToday ? 'alert-for-this-day' : ''}`}
          onClick={() =>
            navigate(
              `/location/${toSlug(location.description)}/${dayForecast.datetime}`,
            )
          }
          style={{ cursor: 'pointer' }}
        >
          <WeatherIcon {...dayForecast} />
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