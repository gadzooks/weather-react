// DetailedWeatherComponents.tsx

import type { HourlyForecastInterface } from '../../../interfaces/HourlyForecastInterface';

// ============================================
// Wind Direction Indicator
// ============================================

interface WindIndicatorProps {
  speed: number;
  direction: number;
}

export function WindIndicator({ speed, direction }: WindIndicatorProps) {
  const intensity = speed > 20 ? 'high' : speed > 10 ? 'med' : 'low';
  const color = intensity === 'high' ? '#f59e0b' : intensity === 'med' ? '#fbbf24' : '#9ca3af';

  return (
    <div className='wind-indicator'>
      <svg width='14' height='14' style={{ transform: `rotate(${direction}deg)` }}>
        <path d='M7 1 L10 8 L7 6 L4 8 Z' fill={color} />
      </svg>
      <span className={`wind-speed wind-${intensity}`}>{Math.round(speed)}</span>
    </div>
  );
}

// ============================================
// Hiking Quality Score
// ============================================

interface HikeScoreProps {
  precip: number;
  wind: number;
  visibility: number;
  uv: number;
}

export function HikeScore({ precip, wind, visibility, uv }: HikeScoreProps) {
  let score = 100;
  const penalties: string[] = [];

  // Calculate penalties and build explanation
  if (precip > 50) {
    score -= 35;
    penalties.push(`High precipitation (${Math.round(precip)}%): -35 pts`);
  } else if (precip > 30) {
    score -= 25;
    penalties.push(`Moderate precipitation (${Math.round(precip)}%): -25 pts`);
  } else if (precip > 10) {
    score -= 10;
    penalties.push(`Light precipitation (${Math.round(precip)}%): -10 pts`);
  }

  if (wind > 25) {
    score -= 30;
    penalties.push(`Strong winds (${Math.round(wind)} mph): -30 pts`);
  } else if (wind > 15) {
    score -= 15;
    penalties.push(`Moderate winds (${Math.round(wind)} mph): -15 pts`);
  } else if (wind > 10) {
    score -= 5;
    penalties.push(`Breezy (${Math.round(wind)} mph): -5 pts`);
  }

  if (visibility < 3) {
    score -= 25;
    penalties.push(`Poor visibility (${visibility} mi): -25 pts`);
  } else if (visibility < 6) {
    score -= 10;
    penalties.push(`Reduced visibility (${visibility} mi): -10 pts`);
  }

  if (uv > 10) {
    score -= 15;
    penalties.push(`Extreme UV index (${Math.round(uv)}): -15 pts`);
  } else if (uv > 7) {
    score -= 5;
    penalties.push(`High UV index (${Math.round(uv)}): -5 pts`);
  }

  const rating = score >= 75 ? 'great' : score >= 50 ? 'fair' : 'poor';
  const label = rating.charAt(0).toUpperCase() + rating.slice(1);

  // Build tooltip text
  const tooltipLines = [
    `Hiking Conditions: ${label} (Score: ${score}/100)`,
    '',
    penalties.length > 0 ? 'Factors affecting score:' : 'Perfect conditions - no penalties!',
    ...penalties,
  ];

  const tooltip = tooltipLines.join('\n');

  return (
    <div
      className={`hike-score hike-score--${rating}`}
      title={tooltip}
    >
      <div className='hike-score__dot' />
      <span className='hike-score__label'>{label}</span>
    </div>
  );
}

// ============================================
// Mini Day Preview (Context)
// ============================================

interface MiniDayPreviewProps {
  icon: string;
  high: number;
  label: string;
}

export function MiniDayPreview({ icon, high }: MiniDayPreviewProps) {
  return (
    <div className='mini-day-preview'>
      <div className='mini-day-preview__content'>
        <i className={`wi wi-${getWeatherIconClass(icon)}`} />
        <span className='mini-day-preview__temp'>{Math.round(high)}°</span>
      </div>
    </div>
  );
}

// ============================================
// Temperature Range
// ============================================

interface TempRangeProps {
  high: number;
  low: number;
}

export function TempRange({ high, low }: TempRangeProps) {
  return (
    <div className='temp-range'>
      <span className='temp-range__high'>{Math.round(high)}°</span>
      <span className='temp-range__separator'>/</span>
      <span className='temp-range__low'>{Math.round(low)}°</span>
    </div>
  );
}

// ============================================
// UV Index Badge
// ============================================

export function UVBadge({ uv }: { uv: number }) {
  const level = uv >= 8 ? 'extreme' : uv >= 6 ? 'high' : uv >= 3 ? 'moderate' : 'low';
  return <span className={`uv-badge uv-badge--${level}`}>{Math.round(uv)}</span>;
}

// ============================================
// AQI Badge
// ============================================

export function AQIBadge({ aqi }: { aqi: number | undefined }) {
  if (!aqi || aqi <= 0) return <span className='aqi-badge aqi-badge--none'>-</span>;

  const level = aqi <= 50 ? 'good' : aqi <= 100 ? 'moderate' : aqi <= 150 ? 'sensitive' : 'unhealthy';
  const color = aqi <= 50 ? '#4ade80' : aqi <= 100 ? '#facc15' : aqi <= 150 ? '#fb923c' : '#ef4444';

  return (
    <span
      className={`aqi-badge aqi-badge--${level}`}
      style={{ backgroundColor: color, color: aqi <= 50 ? '#000' : '#fff' }}
      title={`Air Quality Index: ${aqi}`}
    >
      {aqi}
    </span>
  );
}

// ============================================
// Visibility Display
// ============================================

export function VisibilityDisplay({ miles }: { miles: number }) {
  return <span className='visibility-display'>{miles.toFixed(0)}mi</span>;
}

// ============================================
// Helper: Map icon names to weather-icons classes
// ============================================

export function getWeatherIconClass(icon: string): string {
  const iconMap: Record<string, string> = {
    'clear-day': 'day-sunny',
    'clear-night': 'night-clear',
    'partly-cloudy-day': 'day-cloudy',
    'partly-cloudy-night': 'night-alt-cloudy',
    'cloudy': 'cloudy',
    'rain': 'rain',
    'showers-day': 'day-showers',
    'showers-night': 'night-alt-showers',
    'snow': 'snow',
    'snow-showers-day': 'day-snow',
    'snow-showers-night': 'night-alt-snow',
    'thunder-rain': 'thunderstorm',
    'thunder-showers-day': 'day-thunderstorm',
    'thunder-showers-night': 'night-alt-thunderstorm',
    'fog': 'fog',
    'wind': 'strong-wind',
    'hail': 'hail',
    'sleet': 'sleet',
  };
  return iconMap[icon] || 'day-sunny';
}

// ============================================
// Helper: Extract hourly temps for sparklines
// ============================================

export function extractHourlyTemps(hours: HourlyForecastInterface[] | undefined): number[] {
  if (!hours || hours.length === 0) return [];
  return hours.filter((_, i) => i % 3 === 0).map(h => h.temp);
}

// ============================================
// Helper: Extract hourly precip for bars
// ============================================

export function extractHourlyPrecip(hours: HourlyForecastInterface[] | undefined): number[] {
  if (!hours || hours.length === 0) return [];
  return hours.filter((_, i) => i % 3 === 0).map(h => h.precipprob || 0);
}