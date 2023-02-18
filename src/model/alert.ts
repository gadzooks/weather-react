import AlertProps from '../interfaces/AlertProps';

export default function getAlertIndex(alertProps: AlertProps, alertId: string) :(number) {
  const { allAlerts, foundAlerts } = alertProps;

  if (!foundAlerts || allAlerts == null) { return -1; }

  const matcher = (element: string) => element === alertId;
  return allAlerts.findIndex(matcher);
}

export function getAlertIcon(index: number): string | null {
  if (index < 0 || index > 25) return null;
  return String.fromCharCode(65 + index);
}

export function getAlertIconFromAlerts(alertProps: AlertProps, alertId: string) :(string|null) {
  return getAlertIcon(getAlertIndex(alertProps, alertId));
}
