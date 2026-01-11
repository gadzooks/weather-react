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
          <LocationDetailChart {...locProps} />
          <div id={location.name} className='location-details-div'>
            <table className='location-details table'>
              <thead className='table-heading'>
                <tr className='secondary-heading'>
                  {locationHasAlerts && (
                    <td className='center border-right'>ALERTS</td>
                  )}
                  <td colSpan={1} className='center border-right'>
                    DATE
                  </td>
                  <td colSpan={1} className='center border-right'>
                    DETAILS
                  </td>
                  <td className='border-right'>H/L</td>
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
                    const weekendClassName = weekends[id] ? 'weekend' : '';
                    const hasAlertForDate =
                      locationHasAlerts && id <= maxDaysWithAlerts;
                    const alertClassName = hasAlertForDate
                      ? 'alert-for-this-day'
                      : '';
                    return (
                      <tr key={row.datetime}>
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
                          className={`border-right ${weekendClassName} ${alertClassName}`}
                        >
                          {format(d, 'ddd').toUpperCase()}
                          {'  '}
                          {format(d, 'Do').toUpperCase()}
                        </td>
                        <td
                          className={`border-right ${weekendClassName} ${alertClassName}`}
                        >
                          <WeatherIcon {...row} key={row.datetime} />
                          {` ${convertToSentence(row.icon).replace('day', '')}`}
                        </td>
                        <td
                          className={`border-right ${weekendClassName} ${alertClassName}`}
                        >
                          {`${Math.round(row.tempmax)} ${Math.round(row.tempmin)}`}
                        </td>
                        <td
                          className={`align-right ${weekendClassName} ${alertClassName}`}
                        >
                          {`${Math.round(row.precipprob)}%`}
                        </td>
                        <td
                          className={`align-right border-right ${weekendClassName} ${alertClassName}`}
                        >
                          {`${row.precip.toFixed(2)}"`}
                        </td>
                        <td
                          className={`align-left ${weekendClassName} ${alertClassName}`}
                        >{`${Math.round(row.cloudcover).toString().padStart(3, '\u00A0')}%`}</td>
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
