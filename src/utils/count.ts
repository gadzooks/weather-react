import { AlertsById } from '../interfaces/ForecastResponseInterface';

export default function alertsFound(alertsById: AlertsById | undefined): boolean {
  if (alertsById === undefined || alertsById === null) {
    return false;
  }
  return JSON.stringify(alertsById) !== '{}';
}
