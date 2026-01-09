// AlertSummary.tsx

import type { AlertInterface } from '../../../interfaces/AlertInterface';

export const allAlertsLink = '#all-alerts';

export function AlertSummary(alerts: AlertInterface[]) {
  const total = alerts.length;
  if (total === 0) {
    return null;
  }
  const text = total === 1 ? '1 Alert' : `${total} Alerts`;
  return <a href={allAlertsLink}>${text}</a>;
}
