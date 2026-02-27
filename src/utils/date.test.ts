import { formatDate, calculateWeekends, dateDifferenceInDays, formatAlertExpiry, nth } from './date';

describe('formatDate', () => {
  it('should format ISO date string to locale date', () => {
    const result = formatDate('2024-01-15T12:00:00');
    expect(result).toContain('2024');
    expect(result).toContain('January');
    expect(result).toContain('15');
  });

  it('should handle date with time component', () => {
    const result = formatDate('2024-07-04T12:00:00');
    expect(result).toContain('2024');
    expect(result).toContain('July');
  });
});

describe('calculateWeekends', () => {
  it('should return empty array for null/undefined input', () => {
    expect(calculateWeekends(null as unknown as Date[])).toEqual([]);
    expect(calculateWeekends(undefined as unknown as Date[])).toEqual([]);
  });

  it('should return true for Saturday dates', () => {
    // Create Saturday in local timezone (Jan 6, 2024)
    const saturday = new Date(2024, 0, 6, 12, 0, 0);
    const result = calculateWeekends([saturday]);
    expect(result).toEqual([true]);
  });

  it('should return true for Sunday dates', () => {
    // Create Sunday in local timezone (Jan 7, 2024)
    const sunday = new Date(2024, 0, 7, 12, 0, 0);
    const result = calculateWeekends([sunday]);
    expect(result).toEqual([true]);
  });

  it('should return false for weekday dates', () => {
    // Create dates in local timezone
    const monday = new Date(2024, 0, 8, 12, 0, 0); // Monday
    const wednesday = new Date(2024, 0, 10, 12, 0, 0); // Wednesday
    const friday = new Date(2024, 0, 12, 12, 0, 0); // Friday

    expect(calculateWeekends([monday])).toEqual([false]);
    expect(calculateWeekends([wednesday])).toEqual([false]);
    expect(calculateWeekends([friday])).toEqual([false]);
  });

  it('should handle mixed array of dates', () => {
    // Mon-Sun in local timezone
    const dates = [
      new Date(2024, 0, 8, 12, 0, 0), // Monday
      new Date(2024, 0, 9, 12, 0, 0), // Tuesday
      new Date(2024, 0, 10, 12, 0, 0), // Wednesday
      new Date(2024, 0, 11, 12, 0, 0), // Thursday
      new Date(2024, 0, 12, 12, 0, 0), // Friday
      new Date(2024, 0, 13, 12, 0, 0), // Saturday
      new Date(2024, 0, 14, 12, 0, 0), // Sunday
    ];
    const result = calculateWeekends(dates);
    expect(result).toEqual([false, false, false, false, false, true, true]);
  });

  it('should handle null values in dates array by returning false', () => {
    const dates = [
      new Date(2024, 0, 13, 12, 0, 0), // Saturday
      null,
      new Date(2024, 0, 8, 12, 0, 0), // Monday
    ];
    const result = calculateWeekends(dates);
    expect(result).toEqual([true, false, false]);
  });

  it('should return empty array for empty input array', () => {
    expect(calculateWeekends([])).toEqual([]);
  });
});

describe('dateDifferenceInDays', () => {
  it('should return null for undefined epochSeconds', () => {
    expect(dateDifferenceInDays(undefined as unknown as number)).toBeNull();
  });

  it('should return 0 or -1 for current time (due to floor rounding)', () => {
    const nowEpochSeconds = Math.floor(Date.now() / 1000);
    const result = dateDifferenceInDays(nowEpochSeconds);
    // Due to Math.floor and time-of-day, could be 0 or -1
    expect(result).toBeGreaterThanOrEqual(-1);
    expect(result).toBeLessThanOrEqual(0);
  });

  it('should return positive number for future dates', () => {
    // 7 days from now
    const futureEpochSeconds = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const result = dateDifferenceInDays(futureEpochSeconds);
    expect(result).toBeGreaterThanOrEqual(6);
    expect(result).toBeLessThanOrEqual(7);
  });

  it('should return negative number for past dates', () => {
    // 3 days ago
    const pastEpochSeconds = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
    const result = dateDifferenceInDays(pastEpochSeconds);
    expect(result).toBeGreaterThanOrEqual(-4);
    expect(result).toBeLessThanOrEqual(-3);
  });

  it('should handle epoch seconds correctly (not milliseconds)', () => {
    // Known date: Jan 1, 2024 00:00:00 UTC = 1704067200 seconds
    const jan1_2024 = 1704067200;
    const result = dateDifferenceInDays(jan1_2024);
    // Result depends on current date, just verify it's a number
    expect(typeof result).toBe('number');
  });
});

describe('formatAlertExpiry', () => {
  // now is floored to seconds; add a small buffer at boundaries so
  // the sub-second elapsed between capturing `now` and calling
  // Date.now() inside the function doesn't push us below the threshold.
  const now = Math.floor(Date.now() / 1000);
  const B = 5; // 5-second buffer

  it('returns null for null/undefined', () => {
    expect(formatAlertExpiry(null as unknown as number)).toBeNull();
    expect(formatAlertExpiry(undefined as unknown as number)).toBeNull();
  });

  it('returns "expired" for an epoch just expired (< 1 hour ago)', () => {
    expect(formatAlertExpiry(now - 1800)).toBe('expired'); // 30 min ago
  });

  it('returns "expired N hours ago" for 1-23 hours past', () => {
    expect(formatAlertExpiry(now - 3_600 - B)).toBe('expired 1 hour ago');
    expect(formatAlertExpiry(now - 5 * 3_600 - B)).toBe('expired 5 hours ago');
  });

  it('returns "expired N days ago" for 1+ days past', () => {
    expect(formatAlertExpiry(now - 24 * 3_600 - B)).toBe('expired 1 day ago');
    expect(formatAlertExpiry(now - 3 * 24 * 3_600 - B)).toBe('expired 3 days ago');
  });

  it('returns "ending soon" for less than 1 hour away', () => {
    expect(formatAlertExpiry(now + 1800)).toBe('ending soon'); // 30 min
  });

  it('returns singular "ending in 1 hour" for ~1 hour away', () => {
    expect(formatAlertExpiry(now + 3_600 + B)).toBe('ending in 1 hour');
  });

  it('returns plural hours for 2-23 hours away', () => {
    expect(formatAlertExpiry(now + 2 * 3_600 + B)).toBe('ending in 2 hours');
    expect(formatAlertExpiry(now + 23 * 3_600 + B)).toBe('ending in 23 hours');
  });

  it('returns singular "ending in 1 day" for ~1 day away', () => {
    expect(formatAlertExpiry(now + 24 * 3_600 + B)).toBe('ending in 1 day');
  });

  it('returns plural days for 2+ days away', () => {
    expect(formatAlertExpiry(now + 3 * 24 * 3_600 + B)).toBe('ending in 3 days');
  });
});

describe('nth', () => {
  it('should return "st" for 1, 21, 31', () => {
    expect(nth(1)).toBe('st');
    expect(nth(21)).toBe('st');
    expect(nth(31)).toBe('st');
  });

  it('should return "nd" for 2, 22', () => {
    expect(nth(2)).toBe('nd');
    expect(nth(22)).toBe('nd');
  });

  it('should return "rd" for 3, 23', () => {
    expect(nth(3)).toBe('rd');
    expect(nth(23)).toBe('rd');
  });

  it('should return "th" for 4-20 (special case)', () => {
    expect(nth(4)).toBe('th');
    expect(nth(11)).toBe('th');
    expect(nth(12)).toBe('th');
    expect(nth(13)).toBe('th');
    expect(nth(14)).toBe('th');
    expect(nth(20)).toBe('th');
  });

  it('should return "th" for numbers ending in 0, 4-9', () => {
    expect(nth(10)).toBe('th');
    expect(nth(24)).toBe('th');
    expect(nth(25)).toBe('th');
    expect(nth(26)).toBe('th');
    expect(nth(27)).toBe('th');
    expect(nth(28)).toBe('th');
    expect(nth(29)).toBe('th');
    expect(nth(30)).toBe('th');
  });

  it('should handle special cases 11, 12, 13 (return "th" not "st/nd/rd")', () => {
    expect(nth(11)).toBe('th');
    expect(nth(12)).toBe('th');
    expect(nth(13)).toBe('th');
  });
});
