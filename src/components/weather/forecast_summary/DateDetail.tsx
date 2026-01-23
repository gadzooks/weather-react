// DateDetail.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import type { RegionInterface } from '../../../interfaces/RegionInterface';
import type { LocationInterface } from '../../../interfaces/LocationInterface';
import type { AlertProps } from '../../../interfaces/AlertProps';
import alertsFound from '../../../utils/count';
import DateNavigation from './DateNavigation';
import AlertDetail from '../alerts/AlertDetail';
import { toSlug } from '../../../utils/slug';
import { getAlertIconFromAlerts } from '../../../model/alert';
import {
  WindIndicator,
  HikeScore,
  MiniDayPreview,
  TempRange,
  UVBadge,
  VisibilityDisplay,
  getWeatherIconClass,
} from './DetailedWeatherComponents';
import './DateDetail.scss';

function DateDetail() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const appState = useAppSelector((state) => state.forecast);

  const forecastResponse = appState.forecast;

  if (!forecastResponse || !date) {
    return (
      <div className='date-detail-error'>
        <p>No forecast data available</p>
        <button onClick={() => navigate('/')}>Back to Summary</button>
      </div>
    );
  }

  const allDates = forecastResponse.dates || [];
  const selectedDateIndex = allDates.indexOf(date);

  // Check if date is valid
  if (selectedDateIndex === -1) {
    return (
      <div className='date-detail-error'>
        <p>Invalid date: {date}</p>
        <p>Available dates: {allDates[0]} to {allDates[allDates.length - 1]}</p>
        <button onClick={() => navigate('/')}>Back to Summary</button>
      </div>
    );
  }

  const regions = forecastResponse.regions?.allIds.map(
    (id) => forecastResponse.regions.byId[id]
  ) || [];

  const foundAlerts = alertsFound(forecastResponse.alertsById);
  const alertProps: AlertProps = {
    alertsById: forecastResponse.alertsById || null,
    allAlerts: forecastResponse.allAlertIds || null,
    foundAlerts,
  };

  const handleDateChange = (newDate: string) => {
    navigate(`/${newDate}`);
  };

  const handleClearDate = () => {
    navigate('/');
  };

  return (
    <>
      <DateNavigation
        selectedDate={date}
        allDates={allDates}
        onDateChange={handleDateChange}
        onClearDate={handleClearDate}
      />

      <table className='table styled-table detailed-mode' data-has-alerts={foundAlerts || undefined}>
        <thead className='table-heading'>
          <tr>
            {foundAlerts && (
              <td className='alerts-header'>
                <i className='wi wi-lightning' title='Weather Alerts' />
              </td>
            )}
            <td className='location-header'>Location</td>
            <td className='detail-header day-header'>Yesterday</td>
            <td className='detail-header day-header day-header--today'>Today</td>
            <td className='detail-header day-header'>Tomorrow</td>
            <td className='detail-header temp-header'>Hi/Lo</td>
            <td className='detail-header precip-header'>Precip</td>
            <td className='detail-header wind-header'>Wind</td>
            <td className='detail-header uv-header'>UV</td>
            <td className='detail-header vis-header'>Vis</td>
            <td className='detail-header hike-header'>Hike</td>
          </tr>
        </thead>

        {regions.map((region: RegionInterface) => {
          const locations = region.locations || [];

          return (
            <tbody key={region.name}>
              <tr className='region-details'>
                {foundAlerts && <td className='region-alerts-cell' />}
                <td className='region-name-cell' colSpan={10}>
                  {region.description}
                </td>
              </tr>

              {locations.map((location: LocationInterface) => (
                <DateDetailRow
                  key={location.name}
                  location={location}
                  date={date}
                  allDates={allDates}
                  selectedDateIndex={selectedDateIndex}
                  forecastsById={forecastResponse.forecasts}
                  alertProps={alertProps}
                  navigate={navigate}
                />
              ))}
            </tbody>
          );
        })}
      </table>

      <div className='all-alerts'>
        <AlertDetail
          allAlertIds={forecastResponse.allAlertIds}
          alertsById={forecastResponse.alertsById}
        />
      </div>
    </>
  );
}

interface DateDetailRowProps {
  location: LocationInterface;
  date: string;
  allDates: string[];
  selectedDateIndex: number;
  forecastsById: { byId: Record<string, any[]> };
  alertProps: AlertProps;
  navigate: (path: string) => void;
}

function DateDetailRow({
  location,
  date,
  allDates,
  selectedDateIndex,
  forecastsById,
  alertProps,
  navigate,
}: DateDetailRowProps) {
  const forecasts = forecastsById.byId[location.name] || [];
  const alertIds = location.alertIds;
  const locationHasAlerts = alertIds && alertIds.length > 0;

  // Find the selected day's forecast
  const dayForecast = forecasts.find((d) => d.datetime === date);

  if (!dayForecast) {
    return null;
  }

  // Get prev/next day forecasts for context
  const prevDayForecast =
    selectedDateIndex > 0
      ? forecasts.find((d) => d.datetime === allDates[selectedDateIndex - 1])
      : null;
  const nextDayForecast =
    selectedDateIndex < allDates.length - 1
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
          onClick={() => navigate(`/location/${toSlug(location.description)}`)}
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
            <span className='no-data'>-</span>
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
            <span className='no-data'>-</span>
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
            : '-'}
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

// Helper to format day label for context previews
function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

export default DateDetail;
