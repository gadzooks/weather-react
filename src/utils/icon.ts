const iconMapping: { [key: string]: string } = {
  'clear-day': 'day-sunny',
  'clear-night': 'night-clear',
  rain: 'rain',
  snow: 'snow',
  sleet: 'sleet',
  wind: 'strong-wind',
  fog: 'fog',
  cloudy: 'cloudy',
  'partly-cloudy-day': 'cloudy',
  'partly-cloudy-night': 'night-partly-cloudy',
  hail: 'hail',
  thunderstorm: 'thunderstorm',
  tornado: 'tornado',
};

export default function iconClass(
  icon: string,
  precip: number,
  cloudCover: number,
  maxTemp: number,
): string {
  let mapping = iconMapping[icon] || 'na';
  let additionalClass = '';

  if (mapping === 'cloudy') {
    if (precip) {
      if (precip < 30) {
        additionalClass = 'sunshine-10';
      } else if (precip < 60) {
        additionalClass = 'sunshine-50';
      } else {
        additionalClass = 'sunshine-100';
      }
    }

    // OVERRIDE sunshine color to greyish if cloud cover is high
    if (cloudCover > 60) additionalClass = 'sunshine-50';

    // show a bit of sun peeking out if there is less than 50% cloud cover
    if (cloudCover <= 50) mapping = 'day-cloudy';
  } else if (mapping === 'day-sunny' && maxTemp >= 80) {
    mapping = 'hot';
  }

  if (maxTemp >= 90) {
    additionalClass += ' high-temp-wi-hotter';
  } else if (maxTemp >= 80) {
    additionalClass += ' high-temp-wi-hot';
  }

  return `wi weather-icon wi-${mapping} ${mapping} ${additionalClass}`;
}

export function precipitation(precip: number): string {
  if (!precip) return '';

  let computedPrecip = precip * 100;
  if (computedPrecip > 100) computedPrecip /= 100;
  return `${Math.round(computedPrecip)}%`;
}

export function precipitationAmount(p: number): string {
  if (p) {
    if (p === 0 || Math.round(p) === 0) return '-';
    return `${Math.round(p)}"`;
  }
  return '-';
}

/**
 * Maps moonphase value (0-1) to Weather Icons moon class
 * 0 = new moon, 0.5 = full moon, 1 = next new moon
 */
export function moonPhaseIcon(phase: number): string {
  // Normalize phase to 0-1 range
  const p = Math.abs(phase % 1);

  if (p < 0.0625) return 'wi wi-moon-new';
  if (p < 0.125) return 'wi wi-moon-waxing-crescent-3';
  if (p < 0.1875) return 'wi wi-moon-waxing-crescent-6';
  if (p < 0.25) return 'wi wi-moon-first-quarter';
  if (p < 0.3125) return 'wi wi-moon-waxing-gibbous-2';
  if (p < 0.375) return 'wi wi-moon-waxing-gibbous-4';
  if (p < 0.4375) return 'wi wi-moon-waxing-gibbous-6';
  if (p < 0.5625) return 'wi wi-moon-full';
  if (p < 0.625) return 'wi wi-moon-waning-gibbous-2';
  if (p < 0.6875) return 'wi wi-moon-waning-gibbous-4';
  if (p < 0.75) return 'wi wi-moon-waning-gibbous-6';
  if (p < 0.8125) return 'wi wi-moon-third-quarter';
  if (p < 0.875) return 'wi wi-moon-waning-crescent-2';
  if (p < 0.9375) return 'wi wi-moon-waning-crescent-5';
  return 'wi wi-moon-new';
}

/**
 * Calculate trail score (0-100) based on temperature and precipitation
 * Ideal temp range: 45-70°F
 */
export function trailScore(
  tempMax: number,
  tempMin: number,
  precipProb: number,
): number {
  // Temperature score (0-50 points)
  // Use average of max and min for scoring
  const avgTemp = (tempMax + tempMin) / 2;
  let tempScore: number;

  if (avgTemp >= 45 && avgTemp <= 70) {
    // Perfect range: full points
    tempScore = 50;
  } else if (avgTemp >= 35 && avgTemp < 45) {
    // Cool but acceptable: scale from 25 to 50
    tempScore = 25 + ((avgTemp - 35) / 10) * 25;
  } else if (avgTemp > 70 && avgTemp <= 80) {
    // Warm but acceptable: scale from 50 down to 25
    tempScore = 50 - ((avgTemp - 70) / 10) * 25;
  } else if (avgTemp < 35) {
    // Too cold: scale from 0 to 25
    tempScore = Math.max(0, (avgTemp / 35) * 25);
  } else {
    // Too hot (>80): scale from 25 down to 0
    tempScore = Math.max(0, 25 - ((avgTemp - 80) / 20) * 25);
  }

  // Precipitation score (0-50 points)
  // Linear scale: 0% precip = 50 pts, 100% precip = 0 pts
  const precipScore = 50 * (1 - precipProb / 100);

  return Math.round(tempScore + precipScore);
}

/**
 * Get score color class based on trail score value
 */
export function trailScoreColor(score: number): string {
  if (score >= 80) return 'score-excellent';
  if (score >= 50) return 'score-good';
  if (score >= 25) return 'score-fair';
  return 'score-poor';
}
