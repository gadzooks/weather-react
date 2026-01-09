// LocationDetailChart.tsx

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Area,
} from 'recharts';

import type { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import type { ForecastDates } from '../../../interfaces/ForecastResponseInterface';
import { nth } from '../../../utils/date';
import './LocationDetailChart.scss';

function getDataFromForecast(
  forecast: DailyForecastInterface[],
  forecastDates: ForecastDates,
) {
  const forecastData: any[] = [];
  const { parsedDates } = forecastDates;

  forecast.forEach((f, index) => {
    const d = parsedDates[index];
    const day = d?.getDate() || 0;
    const h1 = {
      name: `${day}${nth(day)}`,
      ...f,
    };
    forecastData.push(h1);
  });

  return forecastData;
}

export interface LocationDetailChartProps {
  forecast: DailyForecastInterface[];
  forecastDates: ForecastDates;
}

function precipitation(d: DailyForecastInterface): number | null {
  if (d.precip === undefined) {
    return null;
  }
  const round = Math.round(d.precip);
  return round === 0 ? null : d.precip;
}

function normalizedCloudCover(d: DailyForecastInterface): number | null {
  if (d.cloudcover === undefined || d.cloudcover < 10) {
    return null;
  }
  return d.cloudcover / 100.0;
}

function precipLabel(d: any): string | null {
  const precip = d?.precip;
  if (precip === null || precip === undefined) {
    return null;
  }
  return precip <= 0.5 ? null : `${precip}"`;
}

function LocationDetailChart(props: LocationDetailChartProps) {
  const { forecast, forecastDates } = props;
  const data: any = getDataFromForecast(forecast, forecastDates);
  // console.log(data);
  return (
    <div className='weather-weekly-chart'>
      <ResponsiveContainer>
        <ComposedChart className='weather-chart' data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='name'
            name='day'
            label={{ value: 'Days', position: 'insideBottomRight', offset: 0 }}
            style={{ fontSize: '0.5rem' }}
          />
          {/* <XAxis dataKey='name' tick={<WeatherIcon {...data} />} /> */}
          <defs>
            <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#6d9ed9' stopOpacity={0.4} />
              <stop offset='95%' stopColor='#6d9ed9' stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            name='Cloud Cover'
            type='monotone'
            dataKey={(d) => normalizedCloudCover(d)}
            yAxisId='right'
            stroke='#6d9ed9'
            fillOpacity={1}
            fill='url(#colorUv)'
          />
          <YAxis
            name='Temp'
            yAxisId='left'
            label={{ value: 'Temp °F', angle: -90, position: 'insideLeft' }}
            domain={[0, (dataMax: number) => Math.max(dataMax, 100)]}
            style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
          />
          <YAxis
            name='Precip'
            yAxisId='right'
            orientation='right'
            domain={[0, (p: number) => p + 0.2]}
            label={{
              value: 'Precip" / Cloud',
              angle: -90,
              position: 'insideRight',
            }}
            style={{ fontSize: '0.7rem', fontFamily: 'Arial' }}
          />
          <Tooltip />
          {/* <Tooltip content={<CustomTooltip />} trigger='click' /> */}
          <Legend />
          <Bar
            name='Precipitation'
            dataKey={(d) => precipitation(d)}
            fill='#7ba9d6'
            yAxisId='right'
            strokeWidth={1}
            barSize={8}
          >
            <LabelList
              dataKey={(d) => precipLabel(d)}
              position='top'
              style={{
                fontSize: '0.7rem',
                fontFamily: 'Arial',
                fontWeight: '1.3em',
              }}
            />
          </Bar>
          <Line
            name='Max Temp'
            type='monotone'
            dataKey='tempmax'
            stroke='#d4b87a'
            yAxisId='left'
          />
          <Line
            name='Min Temp'
            type='monotone'
            dataKey='tempmin'
            stroke='#7ba9d6'
            yAxisId='left'
            activeDot={{ r: 4 }}
          />
          <ReferenceLine
            y={95}
            yAxisId='left'
            label='95 °F'
            stroke='#d97869'
            strokeDasharray='3 3'
          />
          <ReferenceLine
            y={32}
            yAxisId='left'
            label='32 °F'
            stroke='#7ba9d6'
            strokeDasharray='3 3'
          />
          <ReferenceLine
            y={1}
            yAxisId='right'
            label='100% cloud cover'
            stroke='#9ba4ba'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LocationDetailChart;
