import { AlertsById } from '../interfaces/ForecastResponseInterface';

export default function alertsFound(alertsById: AlertsById | null): boolean {
  return JSON.stringify(alertsById) === '{}';
}
