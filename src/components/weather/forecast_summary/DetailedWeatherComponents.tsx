// DetailedWeatherComponents.tsx

import type { HourlyForecastInterface } from '../../../interfaces/HourlyForecastInterface';


// ============================================
// Sparkline Component
// ============================================

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
  width?: number;
  showArea?: boolean;
}

export function Sparkline({ 
  data, 
  color, 
  height = 20, 
  width = 70, 
  showArea = false 
}: SparklineProps) {
  if (!data || data.length === 0) return <span className='no-data'>—</span>;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 4) - 2
  }));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  
  const minIdx = data.indexOf(Math.min(...data));
  const maxIdx = data.indexOf(Math.max(...data));
  
  return (
    <svg width={width} height={height} className='sparkline'>
      {showArea && <path d={areaD} fill={color} fillOpacity='0.15' />}
      <path d={pathD} fill='none' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <circle cx={points[minIdx].x} cy={points[minIdx].y} r='2' fill={color} />
      <circle cx={points[maxIdx].x} cy={points[maxIdx].y} r='2' fill={color} />
    </svg>
  );
}

// ============================================
// Precipitation Bars (Mini Histogram)
// ============================================

interface PrecipBarsProps {
  data: number[];
  height?: number;
  width?: number;
}

export function PrecipBars({ data, height = 18, width = 50 }: PrecipBarsProps) {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data, 30);
  const barWidth = width / data.length - 1;
  
  return (
    <svg width={width} height={height} className='precip-bars'>
      {data.map((v, i) => (
        <rect
          key={i}
          x={i * (barWidth + 1)}
          y={height - (v / max) * height}
          width={barWidth}
          height={(v / max) * height}
          fill={v > 50 ? '#60a5fa' : v > 20 ? '#93c5fd' : '#bfdbfe'}
          opacity={v > 0 ? 0.8 : 0.2}
          rx='1'
        />
      ))}
    </svg>
  );
}

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
  if (precip > 50) score -= 35;
  else if (precip > 30) score -= 25;
  else if (precip > 10) score -= 10;
  if (wind > 25) score -= 30;
  else if (wind > 15) score -= 15;
  else if (wind > 10) score -= 5;
  if (visibility < 3) score -= 25;
  else if (visibility < 6) score -= 10;
  if (uv > 10) score -= 15;
  else if (uv > 7) score -= 5;
  
  const rating = score >= 75 ? 'great' : score >= 50 ? 'fair' : 'poor';
  const label = rating.charAt(0).toUpperCase() + rating.slice(1);
  
  return (
    <div className={`hike-score hike-score--${rating}`}>
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

export function MiniDayPreview({ icon, high, label }: MiniDayPreviewProps) {
  return (
    <div className='mini-day-preview'>
      <span className='mini-day-preview__label'>{label}</span>
      <i className={`wi wi-${getWeatherIconClass(icon)}`} />
      <span className='mini-day-preview__temp'>{Math.round(high)}°</span>
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