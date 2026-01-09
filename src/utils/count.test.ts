import type { AlertInterface } from '../interfaces/AlertInterface';
import type { AlertsById } from '../interfaces/ForecastResponseInterface';
import alertsFound from './count';

describe('alertsFound', () => {
  it('should return false for null', () => {
    expect(alertsFound(undefined)).toBeFalsy();
  });

  it('should return false for {}', () => {
    expect(alertsFound({})).toBeFalsy();
  });

  it('should return true for non empty input', () => {
    const alerts: AlertsById = {};
    const alert: AlertInterface = {
      event: 'event',
      headline: 'headline',
      description: 'description',
      id: 'id',
      link: 'link',
      endsEpoch: 124,
      ends: 'now',
    };
    alerts.foo = alert;
    expect(alertsFound(alerts)).toBeTruthy();
  });
});
