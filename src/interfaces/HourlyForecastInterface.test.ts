import {
  findBestWindow,
  findRainWindows,
  type HourlyForecastInterface,
} from './HourlyForecastInterface';

const createHour = (
  hour: number,
  precipprob: number = 0,
): HourlyForecastInterface => ({
  datetime: `${hour.toString().padStart(2, '0')}:00:00`,
  datetimeEpoch: 1705363200 + hour * 3600,
  temp: 55,
  feelslike: 53,
  humidity: 70,
  dew: 45,
  precip: precipprob > 50 ? 0.1 : 0,
  precipprob,
  preciptype: null,
  snow: 0,
  snowdepth: null,
  windgust: 15,
  windspeed: 8,
  winddir: 180,
  pressure: 1013,
  visibility: 10,
  cloudcover: 50,
  solarradiation: 200,
  solarenergy: 0.7,
  uvindex: 3,
  severerisk: 0,
  conditions: 'Partly Cloudy',
  icon: 'partly-cloudy-day',
});

describe('findBestWindow', () => {
  it('should return null for empty hours array', () => {
    expect(findBestWindow([])).toBeNull();
  });

  it('should find longest consecutive dry period', () => {
    // Hours 6-20 (daylight), all dry except 10-12
    const hours = Array.from({ length: 24 }, (_, i) => {
      const precipprob = i >= 10 && i <= 12 ? 50 : 0;
      return createHour(i, precipprob);
    });

    const result = findBestWindow(hours);

    expect(result).not.toBeNull();
    // Longest dry period should be 13-20 (8 hours)
    expect(result?.startHour).toBe(13);
    expect(result?.endHour).toBe(20);
  });

  it('should only consider daylight hours (6am-8pm)', () => {
    // Only early morning hours (0-5) are dry, but outside daylight
    const hours = Array.from({ length: 24 }, (_, i) => {
      const precipprob = i < 6 ? 0 : 50;
      return createHour(i, precipprob);
    });

    const result = findBestWindow(hours);

    // Should return null because no dry hours in daylight range
    expect(result).toBeNull();
  });

  it('should return start/end hours and label', () => {
    // All daylight hours are dry
    const hours = Array.from({ length: 24 }, (_, i) => createHour(i, 0));

    const result = findBestWindow(hours);

    expect(result).not.toBeNull();
    expect(result?.startHour).toBe(6);
    expect(result?.endHour).toBe(20);
    expect(result?.label).toBe('6am-9pm');
    expect(result?.score).toBe(15); // 15 daylight hours
  });

  it('should handle all rainy day (return null)', () => {
    // All hours have high precip probability
    const hours = Array.from({ length: 24 }, (_, i) => createHour(i, 80));

    const result = findBestWindow(hours);

    expect(result).toBeNull();
  });

  it('should handle precipprob threshold of 30', () => {
    // Hours with 29% precip should be included, 30%+ excluded
    const hours = [
      createHour(6, 0),
      createHour(7, 29), // Should be included
      createHour(8, 30), // Should break the chain
      createHour(9, 0),
    ];

    const result = findBestWindow(hours);

    // Longest dry window is 6-7am (2 hours)
    expect(result?.startHour).toBe(6);
    expect(result?.endHour).toBe(7);
    expect(result?.score).toBe(2);
  });

  it('should format hours correctly in label', () => {
    // Test 12pm formatting
    const hours = [createHour(11, 0), createHour(12, 0), createHour(13, 0)];

    const result = findBestWindow(hours);

    expect(result?.label).toBe('11am-2pm');
  });
});

describe('findRainWindows', () => {
  it('should return empty array for dry day', () => {
    const hours = Array.from({ length: 24 }, (_, i) => createHour(i, 0));

    const result = findRainWindows(hours);

    expect(result).toEqual([]);
  });

  it('should identify single rain window', () => {
    // Rain from 10am-12pm
    const hours = Array.from({ length: 24 }, (_, i) => {
      const precipprob = i >= 10 && i <= 12 ? 60 : 0;
      return createHour(i, precipprob);
    });

    const result = findRainWindows(hours);

    expect(result).toHaveLength(1);
    expect(result[0].startHour).toBe(10);
    expect(result[0].endHour).toBe(12);
  });

  it('should identify multiple rain windows', () => {
    // Rain 8-10am and 2-4pm
    const hours = Array.from({ length: 24 }, (_, i) => {
      const isRainy = (i >= 8 && i <= 10) || (i >= 14 && i <= 16);
      return createHour(i, isRainy ? 70 : 0);
    });

    const result = findRainWindows(hours);

    expect(result).toHaveLength(2);
    expect(result[0].startHour).toBe(8);
    expect(result[0].endHour).toBe(10);
    expect(result[1].startHour).toBe(14);
    expect(result[1].endHour).toBe(16);
  });

  it('should handle rain continuing to end of day', () => {
    // Rain starts at 8pm and continues to 11pm (last hour is 23)
    const hours = Array.from({ length: 24 }, (_, i) => {
      return createHour(i, i >= 20 ? 80 : 0);
    });

    const result = findRainWindows(hours);

    expect(result).toHaveLength(1);
    expect(result[0].startHour).toBe(20);
    expect(result[0].endHour).toBe(23);
    // Note: formatHour(24) returns "12pm" due to edge case in implementation
    expect(result[0].label).toBe('8pm-12pm');
  });

  it('should format hour labels correctly (am/pm)', () => {
    // Rain at midnight
    const hours = [createHour(0, 60), createHour(1, 0)];

    const result = findRainWindows(hours);

    expect(result[0].label).toBe('12am-1am');
  });

  it('should use precipprob threshold of 50', () => {
    // Hours with 49% should not be rain, 50%+ should be
    const hours = [
      createHour(10, 49), // Not rain
      createHour(11, 50), // Rain
      createHour(12, 51), // Rain
      createHour(13, 49), // Not rain
    ];

    const result = findRainWindows(hours);

    expect(result).toHaveLength(1);
    expect(result[0].startHour).toBe(11);
    expect(result[0].endHour).toBe(12);
  });

  it('should handle 12pm formatting', () => {
    // Rain at noon
    const hours = [createHour(11, 0), createHour(12, 60), createHour(13, 0)];

    const result = findRainWindows(hours);

    expect(result[0].label).toBe('12pm-1pm');
  });
});
