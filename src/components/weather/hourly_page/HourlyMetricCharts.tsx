// HourlyMetricCharts.tsx
// Recharts-based metric visualizations for the hourly forecast page

import { useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { HourlyForecastInterface } from '../../../interfaces/HourlyForecastInterface';
import './HourlyMetricCharts.scss';

interface DayStats {
  tempMax: number;
  tempMin: number;
  avgTemp: number;
  precipTotal: number;
  maxPrecipProb: number;
  avgWindSpeed: number;
  maxWindGust: number;
  avgVisibility: number;
  minVisibility: number;
  avgCloudCover: number;
  maxUvIndex: number;
}

interface HourlyMetricChartsProps {
  hours: HourlyForecastInterface[];
  dayStats: DayStats;
  sunrise?: string | null;
  sunset?: string | null;
}

function formatHour(datetime: string): string {
  const hour = parseInt(datetime.split(':')[0], 10);
  if (hour === 0) return '12a';
  if (hour === 6) return '6a';
  if (hour === 12) return '12p';
  if (hour === 18) return '6p';
  return '';
}

function formatHourFull(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

interface ChartDataPoint {
  time: string;
  hour: number;
  temp: number;
  feelslike: number;
  windspeed: number;
  windgust: number;
  precipprob: number;
  precip: number;
  visibility: number;
  humidity: number;
}

function prepareChartData(hours: HourlyForecastInterface[]): ChartDataPoint[] {
  return hours.map((h) => ({
    time: formatHour(h.datetime),
    hour: parseInt(h.datetime.split(':')[0], 10),
    temp: Math.round(h.temp),
    feelslike: Math.round(h.feelslike),
    windspeed: Math.round(h.windspeed),
    windgust: Math.round(h.windgust),
    precipprob: Math.round(h.precipprob),
    precip: h.precip,
    visibility: h.visibility,
    humidity: Math.round(h.humidity),
  }));
}

// Custom tooltip that captures hover data - simpler approach without useEffect
interface HoverCaptureTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
  currentHour: number | null;
  onHover: (data: ChartDataPoint | null) => void;
}

function HoverCaptureTooltip({ active, payload, currentHour, onHover }: HoverCaptureTooltipProps) {
  const data = active && payload?.[0]?.payload ? payload[0].payload : null;
  const newHour = data?.hour ?? null;

  // Only update if the hour changed to prevent infinite loops
  if (newHour !== currentHour) {
    // Use setTimeout to avoid calling setState during render
    setTimeout(() => onHover(data), 0);
  }

  return null;
}

function HourlyMetricCharts({ hours, dayStats, sunrise, sunset }: HourlyMetricChartsProps) {
  const chartData = prepareChartData(hours);

  // State for tracking hovered data points for each chart
  const [tempHover, setTempHover] = useState<ChartDataPoint | null>(null);
  const [windHover, setWindHover] = useState<ChartDataPoint | null>(null);
  const [precipHover, setPrecipHover] = useState<ChartDataPoint | null>(null);
  const [visHover, setVisHover] = useState<ChartDataPoint | null>(null);

  // Memoize callbacks to prevent re-renders
  const handleTempHover = useCallback((data: ChartDataPoint | null) => setTempHover(data), []);
  const handleWindHover = useCallback((data: ChartDataPoint | null) => setWindHover(data), []);
  const handlePrecipHover = useCallback((data: ChartDataPoint | null) => setPrecipHover(data), []);
  const handleVisHover = useCallback((data: ChartDataPoint | null) => setVisHover(data), []);

  const visibilities = hours.map((h) => h.visibility);
  const minVis = Math.min(...visibilities);
  const maxVis = Math.max(...visibilities);

  // Extract sunrise/sunset hours for vertical reference lines
  const sunriseHour = sunrise ? parseInt(sunrise.split(':')[0], 10) : null;
  const sunsetHour = sunset ? parseInt(sunset.split(':')[0], 10) : null;

  return (
    <div className='hourly-metric-charts'>
      {/* Temperature Chart */}
      <div className='metric-card'>
        <div className='metric-card-title'>Temperature Trend</div>
        <div className='metric-chart-container'>
          <ResponsiveContainer width='100%' height={160}>
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id='tempGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#d4b87a' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#d4b87a' stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='rgba(255,255,255,0.08)'
              />
              <XAxis
                dataKey='time'
                tick={{ fontSize: 10, fill: '#9fa5b8' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9fa5b8' }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip
                content={
                  <HoverCaptureTooltip
                    currentHour={tempHover?.hour ?? null}
                    onHover={handleTempHover}
                  />
                }
                cursor={{ stroke: '#d4b87a', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area
                type='monotone'
                dataKey='temp'
                stroke='#d4b87a'
                strokeWidth={2}
                fill='url(#tempGradient)'
                activeDot={{ r: 6, stroke: '#d4b87a', strokeWidth: 2, fill: '#1a1f2c' }}
              />
              <ReferenceLine
                y={32}
                stroke='#7ba9d6'
                strokeDasharray='3 3'
                label={{
                  value: '32°F',
                  position: 'insideBottomLeft',
                  fill: '#7ba9d6',
                  fontSize: 10,
                }}
              />
              {sunriseHour !== null && (
                <ReferenceLine
                  x={sunriseHour}
                  stroke='#ffa726'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  label={{
                    value: '☀ Sunrise',
                    position: 'top',
                    fill: '#ffa726',
                    fontSize: 11,
                  }}
                />
              )}
              {sunsetHour !== null && (
                <ReferenceLine
                  x={sunsetHour}
                  stroke='#7e57c2'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  label={{
                    value: '🌙 Sunset',
                    position: 'top',
                    fill: '#7e57c2',
                    fontSize: 11,
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className='metric-hover-display'>
          {tempHover ? (
            <span>
              <strong>{formatHourFull(tempHover.hour)}</strong>: {tempHover.temp}°F (feels {tempHover.feelslike}°F)
            </span>
          ) : (
            <span className='hover-hint'>Hover over chart for details</span>
          )}
        </div>
        <div className='metric-summary'>
          <span className='metric-range'>
            Range: {Math.round(dayStats.tempMin)}&deg; -{' '}
            {Math.round(dayStats.tempMax)}&deg;
          </span>
          <span className='metric-average'>
            {Math.round(dayStats.avgTemp)}&deg;
          </span>
        </div>
      </div>

      {/* Wind Chart */}
      <div className='metric-card'>
        <div className='metric-card-title'>Wind Speed</div>
        <div className='metric-chart-container'>
          <ResponsiveContainer width='100%' height={160}>
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id='windGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#81c784' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#81c784' stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id='gustGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#ef5350' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#ef5350' stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='rgba(255,255,255,0.08)'
              />
              <XAxis
                dataKey='time'
                tick={{ fontSize: 10, fill: '#9fa5b8' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9fa5b8' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'dataMax + 10']}
              />
              <Tooltip
                content={
                  <HoverCaptureTooltip
                    currentHour={windHover?.hour ?? null}
                    onHover={handleWindHover}
                  />
                }
                cursor={{ stroke: '#81c784', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area
                type='monotone'
                dataKey='windgust'
                stroke='#ef5350'
                strokeWidth={1}
                fill='url(#gustGradient)'
                strokeDasharray='3 3'
                activeDot={{ r: 4, stroke: '#ef5350', strokeWidth: 2, fill: '#1a1f2c' }}
              />
              <Area
                type='monotone'
                dataKey='windspeed'
                stroke='#81c784'
                strokeWidth={2}
                fill='url(#windGradient)'
                activeDot={{ r: 6, stroke: '#81c784', strokeWidth: 2, fill: '#1a1f2c' }}
              />
              <ReferenceLine
                y={20}
                stroke='#ffca28'
                strokeDasharray='3 3'
                label={{
                  value: '20 mph',
                  position: 'insideTopRight',
                  fill: '#ffca28',
                  fontSize: 10,
                }}
              />
              {sunriseHour !== null && (
                <ReferenceLine
                  x={sunriseHour}
                  stroke='#ffa726'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  label={{
                    value: '☀ Sunrise',
                    position: 'top',
                    fill: '#ffa726',
                    fontSize: 11,
                  }}
                />
              )}
              {sunsetHour !== null && (
                <ReferenceLine
                  x={sunsetHour}
                  stroke='#7e57c2'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  label={{
                    value: '🌙 Sunset',
                    position: 'top',
                    fill: '#7e57c2',
                    fontSize: 11,
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className='metric-hover-display'>
          {windHover ? (
            <span>
              <strong>{formatHourFull(windHover.hour)}</strong>: {windHover.windspeed} mph (gusts {windHover.windgust} mph)
            </span>
          ) : (
            <span className='hover-hint'>Hover over chart for details</span>
          )}
        </div>
        <div className='metric-summary'>
          <span className='metric-range'>
            Max gust: {Math.round(dayStats.maxWindGust)} mph
          </span>
          <span className='metric-average'>
            {Math.round(dayStats.avgWindSpeed)} mph
          </span>
        </div>
      </div>

      {/* Precipitation Chart */}
      <div className='metric-card'>
        <div className='metric-card-title'>Precipitation Probability</div>
        <div className='metric-chart-container'>
          <ResponsiveContainer width='100%' height={160}>
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='rgba(255,255,255,0.08)'
              />
              <XAxis
                dataKey='time'
                tick={{ fontSize: 10, fill: '#9fa5b8' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9fa5b8' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                content={
                  <HoverCaptureTooltip
                    currentHour={precipHover?.hour ?? null}
                    onHover={handlePrecipHover}
                  />
                }
                cursor={{ fill: 'rgba(100, 181, 246, 0.2)' }}
              />
              <Bar
                dataKey='precipprob'
                fill='#64b5f6'
                radius={[2, 2, 0, 0]}
                activeBar={{ fill: '#90caf9', stroke: '#64b5f6', strokeWidth: 2 }}
              />
              <ReferenceLine
                y={50}
                stroke='#ffca28'
                strokeDasharray='3 3'
                label={{
                  value: '50%',
                  position: 'insideTopRight',
                  fill: '#ffca28',
                  fontSize: 10,
                }}
              />
              {sunriseHour !== null && (
                <ReferenceLine
                  x={sunriseHour}
                  stroke='#ffa726'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  label={{
                    value: '☀ Sunrise',
                    position: 'top',
                    fill: '#ffa726',
                    fontSize: 11,
                  }}
                />
              )}
              {sunsetHour !== null && (
                <ReferenceLine
                  x={sunsetHour}
                  stroke='#7e57c2'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  label={{
                    value: '🌙 Sunset',
                    position: 'top',
                    fill: '#7e57c2',
                    fontSize: 11,
                  }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='metric-hover-display'>
          {precipHover ? (
            <span>
              <strong>{formatHourFull(precipHover.hour)}</strong>: {precipHover.precipprob}% chance ({precipHover.precip.toFixed(2)}&quot;)
            </span>
          ) : (
            <span className='hover-hint'>Hover over chart for details</span>
          )}
        </div>
        <div className='metric-summary'>
          <span className='metric-range'>
            Total: {dayStats.precipTotal.toFixed(2)}&quot;
          </span>
          <span className='metric-average'>
            {Math.round(dayStats.maxPrecipProb)}% max
          </span>
        </div>
      </div>

      {/* Visibility Chart */}
      <div className='metric-card'>
        <div className='metric-card-title'>Visibility</div>
        <div className='metric-chart-container'>
          <ResponsiveContainer width='100%' height={160}>
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id='visGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#9fa5b8' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#9fa5b8' stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='rgba(255,255,255,0.08)'
              />
              <XAxis
                dataKey='time'
                tick={{ fontSize: 10, fill: '#9fa5b8' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9fa5b8' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'dataMax + 2']}
              />
              <Tooltip
                content={
                  <HoverCaptureTooltip
                    currentHour={visHover?.hour ?? null}
                    onHover={handleVisHover}
                  />
                }
                cursor={{ stroke: '#9fa5b8', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area
                type='monotone'
                dataKey='visibility'
                stroke='#9fa5b8'
                strokeWidth={2}
                fill='url(#visGradient)'
                activeDot={{ r: 6, stroke: '#9fa5b8', strokeWidth: 2, fill: '#1a1f2c' }}
              />
              <ReferenceLine
                y={5}
                stroke='#ef5350'
                strokeDasharray='3 3'
                label={{
                  value: '5 mi',
                  position: 'insideBottomLeft',
                  fill: '#ef5350',
                  fontSize: 10,
                }}
              />
              {sunriseHour !== null && (
                <ReferenceLine
                  x={sunriseHour}
                  stroke='#ffa726'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  label={{
                    value: '☀ Sunrise',
                    position: 'top',
                    fill: '#ffa726',
                    fontSize: 11,
                  }}
                />
              )}
              {sunsetHour !== null && (
                <ReferenceLine
                  x={sunsetHour}
                  stroke='#7e57c2'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  label={{
                    value: '🌙 Sunset',
                    position: 'top',
                    fill: '#7e57c2',
                    fontSize: 11,
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className='metric-hover-display'>
          {visHover ? (
            <span>
              <strong>{formatHourFull(visHover.hour)}</strong>: {visHover.visibility.toFixed(1)} mi ({visHover.humidity}% humidity)
            </span>
          ) : (
            <span className='hover-hint'>Hover over chart for details</span>
          )}
        </div>
        <div className='metric-summary'>
          <span className='metric-range'>
            Range: {minVis.toFixed(1)} - {maxVis.toFixed(1)} mi
          </span>
          <span className='metric-average'>
            {dayStats.avgVisibility.toFixed(1)} mi
          </span>
        </div>
      </div>
    </div>
  );
}

export default HourlyMetricCharts;
