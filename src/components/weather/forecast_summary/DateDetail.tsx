// DateDetail.tsx

import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { format, parse } from 'fecha';
import { useAppSelector } from '../../../app/hooks';
import type { RegionInterface } from '../../../interfaces/RegionInterface';
import type { LocationInterface } from '../../../interfaces/LocationInterface';
import type { AlertProps } from '../../../interfaces/AlertProps';
import type { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import alertsFound from '../../../utils/count';
import DateNavigation from './DateNavigation';
import AlertDetail from '../alerts/AlertDetail';
import Breadcrumbs from '../common/Breadcrumbs';
import { toSlug } from '../../../utils/slug';
import { getAlertIconFromAlerts } from '../../../model/alert';
import {
  WindIndicator,
  HikeScore,
  TempRange,
  UVBadge,
  AQIBadge,
  VisibilityDisplay,
  getWeatherIconClass,
} from './DetailedWeatherComponents';
import './DateDetail.scss';
import './Region.scss'; // For region-name-button styles

function DateDetail() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { showAqi } = useOutletContext<{ showAqi: boolean }>();
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

  // Format date for breadcrumb display
  const parsedDate = parse(date, 'YYYY-MM-DD');
  const formattedDate = parsedDate
    ? format(parsedDate, 'MMMM D, YYYY')
    : date;

  // Get forecast data for the selected date (from first location for constant data)
  // Try multiple locations to find one with forecast data
  let selectedDayForecast: DailyForecastInterface | undefined = undefined;

  for (const region of regions) {
    if (!region.locations || region.locations.length === 0) continue;

    for (const location of region.locations) {
      const locationForecasts = forecastResponse.forecasts?.byId[location.name] || [];
      const dayForecast = locationForecasts.find((f) => f.datetime === date);

      if (dayForecast) {
        selectedDayForecast = dayForecast;
        break;
      }
    }

    if (selectedDayForecast) break;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: formattedDate },
        ]}
      />

      <DateNavigation
        selectedDate={date}
        allDates={allDates}
        onDateChange={handleDateChange}
        onClearDate={handleClearDate}
        dayForecast={selectedDayForecast}
      />

      {/* Dense table layout for all viewports */}
      <table className='table styled-table detailed-mode date-detail-table' data-has-alerts={foundAlerts || undefined}>
        <thead className='table-heading'>
          <tr>
            {foundAlerts && (
              <td className='alerts-header'>
                <i className='wi wi-lightning' title='Weather Alerts' />
              </td>
            )}
            <td className='location-header'>Location</td>
            <td className='detail-header day-header day-header--today'>
              {formatDayLabel(date)}
            </td>
            <td className='detail-header precip-cloud-header'>Precip/Cloud</td>
            <td className='detail-header wind-header'>Wind</td>
            <td className='detail-header uv-header'>UV</td>
            {showAqi && <td className='detail-header aqi-header'>AQI</td>}
            <td className='detail-header vis-header'>Vis</td>
            <td className='detail-header hike-header'>Hike</td>
          </tr>
        </thead>

        {regions.map((region: RegionInterface) => {
          const locations = region.locations || [];
          const regionSlug = region.name.toLowerCase().replace(/\s+/g, '-');

          return (
            <tbody key={region.name}>
              <tr className='region-details'>
                {foundAlerts && <td className='region-alerts-cell' />}
                <td className='region-name-cell' colSpan={showAqi ? 8 : 7}>
                  <button
                    type='button'
                    className='region-name-button'
                    onClick={() => navigate(`/?region=${regionSlug}`)}
                    title={`Show only ${region.description}`}
                  >
                    {region.description}
                  </button>
                </td>
              </tr>

              {locations.map((location: LocationInterface) => (
                <DateDetailRow
                  key={location.name}
                  location={location}
                  date={date}
                  forecastsById={forecastResponse.forecasts}
                  alertProps={alertProps}
                  navigate={navigate}
                  showAqi={showAqi}
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
  forecastsById: { byId: Record<string, any[]> };
  alertProps: AlertProps;
  navigate: (path: string) => void;
  showAqi: boolean;
}

function DateDetailRow({
  location,
  date,
  forecastsById,
  alertProps,
  navigate,
  showAqi,
}: DateDetailRowProps) {
  const forecasts = forecastsById.byId[location.name] || [];
  const alertIds = location.alertIds;
  const locationHasAlerts = alertIds && alertIds.length > 0;

  // Find the selected day's forecast
  const dayForecast = forecasts.find((d) => d.datetime === date);

  if (!dayForecast) {
    return null;
  }

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

      {/* Today - Weather icon and temp range */}
      <td className='detail-cell day-cell day-cell--today'>
        <div className='today-preview'>
          <i
            className={`wi wi-${getWeatherIconClass(dayForecast.icon)} weather-icon-large`}
          />
          <TempRange high={dayForecast.tempmax} low={dayForecast.tempmin} />
        </div>
      </td>

      {/* Precipitation & Cloud Cover */}
      <td className='detail-cell precip-cloud-cell'>
        <div className='precip-cloud-container'>
          <span className='precip-value'>
            {dayForecast.precipprob > 0
              ? `${Math.round(dayForecast.precipprob)}%`
              : '-'}
          </span>
          <span className='precip-cloud-separator'>/</span>
          <span className='cloud-value'>
            {dayForecast.cloudcover !== undefined
              ? `${Math.round(dayForecast.cloudcover)}%`
              : '-'}
          </span>
        </div>
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

      {/* AQI */}
      {showAqi && (
        <td className='detail-cell aqi-cell'>
          <AQIBadge aqi={dayForecast.aqius} />
        </td>
      )}

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

// Helper to format day label for context previews (MM/DD format)
function formatDayLabel(dateStr: string): string {
  const d = parse(dateStr, 'YYYY-MM-DD');
  return d ? format(d, 'MM/DD') : dateStr;
}

export default DateDetail;
