// Hourly forecast data interface
// Matches Visual Crossing API hourly data structure

export interface HourlyForecastInterface {
  datetime: string; // "00:00:00", "01:00:00", etc.
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  dew: number;
  precip: number;
  precipprob: number;
  preciptype: string[] | null;
  snow: number;
  snowdepth: number | null;
  windgust: number;
  windspeed: number;
  winddir: number;
  pressure: number;
  visibility: number;
  cloudcover: number;
  solarradiation: number;
  solarenergy: number;
  uvindex: number;
  severerisk: number;
  conditions: string;
  icon: string;
  stations?: string[] | null;
  source?: string;
}

export interface DayWithHours {
  datetime: string;
  sunrise?: string;
  sunriseEpoch?: number;
  sunset?: string;
  sunsetEpoch?: number;
  hours: HourlyForecastInterface[];
}

export interface HourlyForecastApiResponse {
  location: {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
  };
  days: DayWithHours[];
}

export interface HourlyForecastResponse {
  location: string;
  locationDescription: string;
  date: string;
  sunrise?: string;
  sunriseEpoch?: number;
  sunset?: string;
  sunsetEpoch?: number;
  hours: HourlyForecastInterface[];
}

/**
 * Calculate the best activity window from hourly data
 * Returns the range with lowest precipitation and moderate temps
 */
export interface ActivityWindow {
  startHour: number;
  endHour: number;
  label: string; // "12pm-3pm"
  score: number;
}

export const findBestWindow = (
  hours: HourlyForecastInterface[],
): ActivityWindow | null => {
  if (hours.length === 0) return null;

  // Filter to daylight hours (6am-8pm for outdoor activities)
  const daylightHours = hours.filter((h) => {
    const hour = parseInt(h.datetime.split(':')[0], 10);
    return hour >= 6 && hour <= 20;
  });

  if (daylightHours.length === 0) return null;

  // Find consecutive hours with low precip probability
  let bestStart = 0;
  let bestLength = 0;
  let currentStart = 0;
  let currentLength = 0;

  for (let i = 0; i < daylightHours.length; i += 1) {
    if (daylightHours[i].precipprob < 30) {
      if (currentLength === 0) currentStart = i;
      currentLength += 1;
      if (currentLength > bestLength) {
        bestLength = currentLength;
        bestStart = currentStart;
      }
    } else {
      currentLength = 0;
    }
  }

  if (bestLength === 0) return null;

  const startHour = parseInt(
    daylightHours[bestStart].datetime.split(':')[0],
    10,
  );
  const endHour = parseInt(
    daylightHours[bestStart + bestLength - 1].datetime.split(':')[0],
    10,
  );

  const formatHour = (h: number): string => {
    if (h === 0) return '12am';
    if (h === 12) return '12pm';
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  return {
    startHour,
    endHour,
    label: `${formatHour(startHour)}-${formatHour(endHour + 1)}`,
    score: bestLength,
  };
};

/**
 * Find rain windows in hourly data
 */
export interface RainWindow {
  startHour: number;
  endHour: number;
  label: string;
}

export const findRainWindows = (
  hours: HourlyForecastInterface[],
): RainWindow[] => {
  const windows: RainWindow[] = [];
  let currentStart: number | null = null;

  const formatHour = (h: number): string => {
    if (h === 0) return '12am';
    if (h === 12) return '12pm';
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  for (let i = 0; i < hours.length; i += 1) {
    const hour = parseInt(hours[i].datetime.split(':')[0], 10);
    const isRainy = hours[i].precipprob >= 50;

    if (isRainy && currentStart === null) {
      currentStart = hour;
    } else if (!isRainy && currentStart !== null) {
      windows.push({
        startHour: currentStart,
        endHour: hour - 1,
        label: `${formatHour(currentStart)}-${formatHour(hour)}`,
      });
      currentStart = null;
    }
  }

  // Handle case where rain continues to end of day
  if (currentStart !== null) {
    const lastHour = parseInt(hours[hours.length - 1].datetime.split(':')[0], 10);
    windows.push({
      startHour: currentStart,
      endHour: lastHour,
      label: `${formatHour(currentStart)}-${formatHour(lastHour + 1)}`,
    });
  }

  return windows;
};
