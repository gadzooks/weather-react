// LocationDetail.tsx

import { useState } from 'react';
import { format } from 'fecha';
import '../../../css/weather-icons.css';
import './LocationDetail.scss';
import convertToSentence from '../../../utils/string';
import {
  deserializeLocationData,
  type LocationDetailData,
} from '../../../interfaces/LocationInterface';
import WtaLink from './WtaLink';
import WeatherIcon from '../main_page/WeatherIcon';
import type {
  AlertsById,
  ForecastDates,
  ForecastResponseStatus,
} from '../../../interfaces/ForecastResponseInterface';
import LocationDetailChart, {
  type LocationDetailChartProps,
} from './LocationDetailChart';
import TripReports from './TripReports';
import AlertDetail from '../alerts/AlertDetail';
import { getAlertIconFromAllAlerts } from '../../../model/alert';
import { dateDifferenceInDays } from '../../../utils/date';
import {
  moonPhaseIcon,
  trailScore,
  trailScoreColor,
} from '../../../utils/icon';

type TabType = 'forecast' | 'tripreports';

export interface LocationDetailProps {
  appState: ForecastResponseStatus;
  forecastDetailsForLocation: string | undefined;
  setForecastDetailsForLocation: any;
  forecastDates: ForecastDates;
  alertsById: AlertsById | undefined;
  allAlertIds: string[] | undefined;
}

function maxAlertDays(
  alertsById: AlertsById | undefined,
  locationAlerts: string[] | undefined,
): number {
  if (alertsById === undefined || locationAlerts === undefined) return -1;

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

interface TrailScoreCardProps {
  forecast: import('../../../interfaces/DailyForecastInterface').DailyForecastInterface[];
  parsedDates: (Date | null)[];
}

// function TrailScoreCard({ forecast, parsedDates }: TrailScoreCardProps) {
//   // Calculate scores for all days and find the best one
//   const scores = forecast.map((day) =>
//     trailScore(day.tempmax, day.tempmin, day.precipprob),
//   );
//   const maxScore = Math.max(...scores);
//   const bestDayIndex = scores.indexOf(maxScore);
//   const bestDay = parsedDates[bestDayIndex] ?? null;
//   const bestDayLabel = bestDay ? format(bestDay, 'ddd Do') : '';

//   // Average score for overall assessment
//   const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

//   return (
//     <div className={`trail-score-card ${trailScoreColor(avgScore)}`}>
//       <div className='score-header'>
//         <span className='score-label'>TRAIL SCORE</span>
//         {bestDayLabel && (
//           <span className='best-day-badge'>
//             <i className='wi wi-day-sunny' /> Best: {bestDayLabel}
//           </span>
//         )}
//       </div>
//       <div className='score-display'>
//         <div className='score-bar'>
//           <div
//             className='score-fill'
//             style={{ width: `${avgScore}%` }}
//           />
//         </div>
//         <span className='score-value'>{avgScore}</span>
//       </div>
//       <div className='score-details'>
//         <span className='detail-item'>
//           <i className='wi wi-thermometer' /> 45-70°F ideal
//         </span>
//         <span className='detail-item'>
//           <i className='wi wi-raindrop' /> Low precip = better
//         </span>
//       </div>
//     </div>
//   );
// }

function LocationDetail(props: LocationDetailProps) {
  const { forecastDetailsForLocation } = props;
  const [activeTab, setActiveTab] = useState<TabType>('forecast');

  if (!forecastDetailsForLocation) return null;

  const location: LocationDetailData = deserializeLocationData(
    forecastDetailsForLocation,
  );
  const {
    appState,
    setForecastDetailsForLocation,
    forecastDates,
    alertsById,
  } = props;

  const { description, alertIds } = location;
  const forecastsByLocation = appState.forecast?.forecasts.byId || {};
  const forecast = forecastsByLocation[location.name];
  const { weekends } = forecastDates;
  const { parsedDates } = forecastDates;

  // Calculate which dates have active alerts for this location
  const locationHasAlerts = alertIds && alertIds.length > 0;
  const maxDaysWithAlerts = maxAlertDays(alertsById, alertIds);

  // Filter alerts to only show those relevant to this location
  const locationAlertIds = locationHasAlerts ? alertIds : [];

  if (!forecast) return null;
  const locProps: LocationDetailChartProps = {
    forecast,
    forecastDates,
  };

  return (
    <div className='location-details-page'>
      <div className='heading'>
        <button
          className='back-button'
          type='button'
          onClick={() => setForecastDetailsForLocation(null)}
          aria-label='Back to forecast summary'
        >
          <span className='back-arrow'>←</span>
          <span className='back-text'>Back</span>
        </button>
        <h1 className='location-name'>{description}</h1>
        <div className='wta-link'>
          <WtaLink
            wtaRegion={location.wtaRegionKey}
            wtaSubRegion={location.sub_region}
          />
        </div>
      </div>

      <div className='tabs'>
        <button
          type='button'
          className={`tab ${activeTab === 'forecast' ? 'active' : ''}`}
          onClick={() => setActiveTab('forecast')}
        >
          Forecast
        </button>
        <button
          type='button'
          className={`tab ${activeTab === 'tripreports' ? 'active' : ''}`}
          onClick={() => setActiveTab('tripreports')}
        >
          Trip Reports
        </button>
      </div>

      {activeTab === 'forecast' && (
        <>
          {/* <TrailScoreCard forecast={forecast} parsedDates={parsedDates} /> */}
          <LocationDetailChart {...locProps} />
          <div id={location.name} className='location-details-div'>
            <table className='location-details table'>
              <thead className='table-heading'>
                <tr className='secondary-heading'>
                  {locationHasAlerts && (
                    <td className='center border-right alerts-col'>
                      <i className='wi wi-lightning' title='Weather Alerts' />
                    </td>
                  )}
                  <td className='center border-right date-col'>DATE</td>
                  <td className='center border-right details-col'>DETAILS</td>
                  <td className='center border-right hl-col'>H/L</td>
                  <td colSpan={2} className='center border-right precip-col'>
                    PRECIP
                  </td>
                  <td className='center cloud-col'>
                    <i className='wi wi-cloudy' title='Cloud Cover' />
                  </td>
                  <td className='center border-right score-col' title='Trail Score'>
                    <i className='wi wi-stars' />
                  </td>
                  <td className='center border-right moon-col'>
                    <i className='wi wi-moon-full' title='Moon Phase' />
                  </td>
                </tr>
              </thead>
              <tbody>
                {forecast.map((row, id) => {
                  const d = parsedDates[id];
                  if (d) {
                    const weekendClassName = weekends[id] ? 'weekend' : '';
                    const hasAlertForDate =
                      locationHasAlerts && id <= maxDaysWithAlerts;
                    const alertClassName = hasAlertForDate
                      ? 'alert-for-this-day'
                      : '';
                    const dayScore = trailScore(
                      row.tempmax,
                      row.tempmin,
                      row.precipprob,
                    );
                    const isBestDay =
                      dayScore ===
                      Math.max(
                        ...forecast.map((f) =>
                          trailScore(f.tempmax, f.tempmin, f.precipprob),
                        ),
                      );
                    return (
                      <tr
                        key={row.datetime}
                        className={isBestDay ? 'best-day-row' : ''}
                      >
                        {locationHasAlerts && (
                          <td
                            className={`alerts-cell border-right ${weekendClassName} ${alertClassName}`}
                          >
                            {hasAlertForDate &&
                              locationAlertIds.map((alertId) => (
                                <a
                                  href={`#${alertId}`}
                                  className='alert-icon'
                                  key={alertId}
                                >
                                  {getAlertIconFromAllAlerts(
                                    locationAlertIds,
                                    alertId,
                                  )}
                                </a>
                              ))}
                          </td>
                        )}
                        <td
                          className={`date-cell border-right ${weekendClassName} ${alertClassName}`}
                        >
                          {format(d, 'ddd').toUpperCase()}
                          {' '}
                          {format(d, 'Do').toUpperCase()}
                        </td>
                        <td
                          className={`details-cell border-right ${weekendClassName} ${alertClassName}`}
                        >
                          <WeatherIcon {...row} key={row.datetime} />
                          <span className='details-text'>
                            {convertToSentence(row.icon).replace('day', '').trim()}
                          </span>
                        </td>
                        <td
                          className={`hl-cell border-right ${weekendClassName} ${alertClassName}`}
                        >
                          {Math.round(row.tempmax)}/{Math.round(row.tempmin)}
                        </td>
                        <td
                          className={`precip-pct-cell ${weekendClassName} ${alertClassName}`}
                        >
                          {Math.round(row.precipprob)}%
                        </td>
                        <td
                          className={`precip-amt-cell border-right ${weekendClassName} ${alertClassName}`}
                        >
                          {row.precip.toFixed(2)}"
                        </td>
                        <td
                          className={`cloud-cell center ${weekendClassName} ${alertClassName}`}
                        >
                          {/* <i
                            className='wi wi-cloudy cloud-icon'
                            style={{ opacity: 0.3 + (row.cloudcover / 100) * 0.7 }}
                          /> */}
                          <span className='cloud-pct'>{Math.round(row.cloudcover)}%</span>
                        </td>
                        <td
                          className={`score-cell border-right ${weekendClassName} ${alertClassName}`}
                          title={`Trail Score: ${dayScore}`}
                        >
                          <span className={`score-dot ${trailScoreColor(dayScore)}`}>
                            {dayScore}
                          </span>
                        </td>
                        <td
                          className={`moon-cell border-right ${weekendClassName} ${alertClassName}`}
                          title={`Moon phase: ${Math.round(row.moonphase * 100)}%`}
                        >
                          <i className={moonPhaseIcon(row.moonphase)} />
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
          {locationHasAlerts && (
            <AlertDetail
              alertsById={alertsById}
              allAlertIds={locationAlertIds}
            />
          )}
        </>
      )}

      {activeTab === 'tripreports' && (
        <TripReports
          wtaRegion={location.wtaRegionKey}
          wtaSubRegion={location.sub_region}
          isActive={activeTab === 'tripreports'}
        />
      )}
    </div>
  );
}

export default LocationDetail;

// forecasts: {
//     byId: {
//       renton: [
//         {
//           time: '2021-04-17T07:00:00.000+00:00',
//           summary: 'Clear conditions throughout the day.',
//           icon: 'day-hail',
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
