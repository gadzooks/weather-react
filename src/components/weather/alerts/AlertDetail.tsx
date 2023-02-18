/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { AlertsById } from '../../../interfaces/ForecastResponseInterface';
import convertToSentence from '../../../utils/string';

export interface AlertDetailProps {
  alertsById: AlertsById | undefined;
  allAlertIds: string[] | undefined;
}

function AlertDetail(props: AlertDetailProps) {
  if (props === undefined) {
    return null;
  }
  const { alertsById } = props;
  const { allAlertIds } = props;
  if (alertsById === undefined || allAlertIds === undefined || allAlertIds.length === 0) {
    return null;
  }
  return (
    <div className='alert-details alert-warning'>
      <table className='table styled-table'>
        <thead className='table-heading'>
          <tr>
            <td>{ }</td>
            <td>Event</td>
            <td>Link</td>
            <td>Details</td>
            <td>Ends at</td>
          </tr>
        </thead>
        <tbody>
          {allAlertIds.map((id, index) => {
            const alert = alertsById[id];
            const lines = (alert.description || '').toLocaleLowerCase().split('\n');
            const sentences = lines.map((line) => convertToSentence(line));
            return (
              <tr id={alert.id} key={alert.id}>
                <td>{index}</td>
                <td>{alert.event}</td>
                <td><a href={alert.link} target='_blank' rel='noreferrer'>Details</a></td>
                <td>{sentences.join('.')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AlertDetail;
// "alerts": [
//     {
//       "event": "Avalanche Warning",
//       "headline": "Avalanche Warning issued April 17 at 11:39AM PDT  by NWS Seattle",
//       "description": "...THE NORTHWEST AVALANCHE CENTER HAS ISSUED A SPECIAL AVALANCHE\nBULLETIN...\n* WHAT..UNIQUELY DANGEROUS AVALANCHE CONDITIONS ARE EXPECTED DUE TO\nPROLONGED HOT AND SUNNY WEATHER. LARGE AND DESTRUCTIVE WET\nAVALANCHES COULD OCCUR.\n* WHERE...THE OLYMPIC MOUNTAINS AND WASHINGTON CASCADES FROM THE\nCOLUMBIA RIVER TO THE CANADIAN BORDER.\n* WHEN...IN EFFECT THROUGH SUN 1830 PDT.\n* IMPACTS...MULTIPLE DAYS OF ABOVE FREEZING TEMPERATURES AND\nCONTINUED FORECASTED HOT AND SUNNY WEATHER MAY PRODUCE A NATURAL\nSPRING AVALANCHE CYCLE. THIS COULD INCLUDE WET, HEAVY, AND\nPOTENTIALLY DESTRUCTIVE SLIDES THAT CROSS COMMON ROUTES.\nADDITIONALLY, TRAVELERS MAY EASILY TRIGGER AVALANCHES ON ANY STEEP\nOPEN SLOPES.\n* PRECAUTIONARY/PREPAREDNESS ACTIONS...PAY ATTENTION TO THE SLOPES\nABOVE YOU. LIMIT ANY TIME YOU SPEND NEAR AND UNDERNEATH STEEP AND\nHANGING SNOW, ESPECIALLY DURING THE HEAT OF THE DAY.\nCONSULT WWW.NWAC.US OR WWW.AVALANCHE.ORG FOR FURTHER INFORMATION.\nADDITIONAL INFORMATION... THIS BULLETIN DOES NOT APPLY TO SKI\nAREAS WHERE AVALANCHE MITIGATION MEASURES ARE PERFORMED.\nSIMILAR AVALANCHE DANGER MAY EXIST AT LOCATIONS OUTSIDE THE\nCOVERAGE AREA OF THIS OR ANY AVALANCHE CENTER.",
//       "ends": "2021-04-18T18:30:00",
//       "endsEpoch": 1618795800,
//       "id": "NOAA-NWS-ALERTS-WA12619ABCAC9C.AvalancheWarning.12619AD89588WA.SEWSABSEW.48f14a084d383b4e2e16869bf8a0f678",
//       "language": "en",
//       "link": "https://alerts.weather.gov/cap/wwacapget.php?x=NOAA-NWS-ALERTS-WA12619ABCAC9C.AvalancheWarning.12619AD89588WA.SEWSABSEW.48f14a084d383b4e2e16869bf8a0f678"
//     }
//   ],
