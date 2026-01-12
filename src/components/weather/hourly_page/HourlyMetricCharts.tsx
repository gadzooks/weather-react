// HourlyMetricCharts.tsx
// Recharts-based metric visualizations for the hourly forecast page

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
}

function formatHour(datetime: string): string {
  const hour = parseInt(datetime.split(':')[0], 10);
  if (hour === 0) return '12a';
  if (hour === 6) return '6a';
  if (hour === 12) return '12p';
  if (hour === 18) return '6p';
  return '';
}

function formatHourFull(datetime: string): string {
  const hour = parseInt(datetime.split(':')[0], 10);
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

// Custom tooltip styles
const tooltipStyle = {
  backgroundColor: 'var(--color-bg-surface, #2a2f3a)',
  border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.1))',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '0.8rem',
  color: 'var(--color-text-primary, #d6d9e3)',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

function TempTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { payload: data } = payload[0];
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        {formatHourFull(`${data.hour.toString().padStart(2, '0')}:00:00`)}
      </div>
      <div>Temperature: {data.temp}&deg;F</div>
      <div>Feels like: {data.feelslike}&deg;F</div>
    </div>
  );
}

function WindTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { payload: data } = payload[0];
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        {formatHourFull(`${data.hour.toString().padStart(2, '0')}:00:00`)}
      </div>
      <div>Wind: {data.windspeed} mph</div>
      <div>Gusts: {data.windgust} mph</div>
    </div>
  );
}

function PrecipTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { payload: data } = payload[0];
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        {formatHourFull(`${data.hour.toString().padStart(2, '0')}:00:00`)}
      </div>
      <div>Probability: {data.precipprob}%</div>
      <div>Amount: {data.precip.toFixed(2)}&quot;</div>
    </div>
  );
}

function VisibilityTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { payload: data } = payload[0];
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        {formatHourFull(`${data.hour.toString().padStart(2, '0')}:00:00`)}
      </div>
      <div>Visibility: {data.visibility.toFixed(1)} mi</div>
      <div>Humidity: {data.humidity}%</div>
    </div>
  );
}

function HourlyMetricCharts({ hours, dayStats }: HourlyMetricChartsProps) {
  const chartData = prepareChartData(hours);

  const visibilities = hours.map((h) => h.visibility);
  const minVis = Math.min(...visibilities);
  const maxVis = Math.max(...visibilities);

  return (
    <div className='hourly-metric-charts'>
      {/* Temperature Chart */}
      <div className='metric-card'>
        <div className='metric-card-title'>Temperature Trend</div>
        <div className='metric-chart-container'>
          <ResponsiveContainer width='100%' height={120}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              <Tooltip content={<TempTooltip />} />
              <Area
                type='monotone'
                dataKey='temp'
                stroke='#d4b87a'
                strokeWidth={2}
                fill='url(#tempGradient)'
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
            </AreaChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width='100%' height={120}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              <Tooltip content={<WindTooltip />} />
              <Area
                type='monotone'
                dataKey='windgust'
                stroke='#ef5350'
                strokeWidth={1}
                fill='url(#gustGradient)'
                strokeDasharray='3 3'
              />
              <Area
                type='monotone'
                dataKey='windspeed'
                stroke='#81c784'
                strokeWidth={2}
                fill='url(#windGradient)'
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
            </AreaChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width='100%' height={120}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              <Tooltip content={<PrecipTooltip />} />
              <Bar dataKey='precipprob' fill='#64b5f6' radius={[2, 2, 0, 0]} />
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
            </BarChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width='100%' height={120}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              <Tooltip content={<VisibilityTooltip />} />
              <Area
                type='monotone'
                dataKey='visibility'
                stroke='#9fa5b8'
                strokeWidth={2}
                fill='url(#visGradient)'
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
            </AreaChart>
          </ResponsiveContainer>
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
