import { AlertsById } from '../interfaces/ForecastResponseInterface';

export default function alertsFound(alertsById: AlertsById | null): boolean {
  if (alertsById === null) {
    return false;
  }
  return JSON.stringify(alertsById) !== '{}';
}
