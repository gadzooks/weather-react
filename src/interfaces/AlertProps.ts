// AlertProps.ts

import type { AlertsById } from './ForecastResponseInterface';

export interface AlertProps {
  allAlerts: string[] | null;
  alertsById: AlertsById | null;
  foundAlerts: boolean;
}
