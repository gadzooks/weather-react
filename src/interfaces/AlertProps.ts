import { AlertsById } from "./ForecastResponseInterface";

interface AlertProps {
  allAlerts: string[] | null;
  alertsById: AlertsById | null;
  foundAlerts: boolean;
}

export default AlertProps;
