import React from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area,
} from 'recharts';

import { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import { ForeacastDates } from '../../../interfaces/ForecastResponseInterface';
import { nth } from '../../../utils/date';
import './LocationDetailChart.scss';

function getDataFromForecast(forecast: DailyForecastInterface[], forecastDates: ForeacastDates) {
  const forecastData:any[] = [];
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
  forecastDates: ForeacastDates;
}

function LocationDetailChart(props: LocationDetailChartProps) {
  const { forecast, forecastDates } = props;
  console.log(forecastDates);
  const data:any = getDataFromForecast(forecast, forecastDates);
  console.log('--------------');
  console.log(data);
  console.log('--------------');
  // {
  //   name: 'Page A',
  //   tempMax: 4000,
  //   tempMin: 2400,
  //   amt: 2400,
  // },
  return (
    <div className='weather-weekly-chart'>
      <ComposedChart
        width={800}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' name='day' label={{ value: 'Pages', position: 'insideBottomRight', offset: 0 }} />
        <YAxis name='Temp' yAxisId='left' label={{ value: 'Temp', angle: -90, position: 'insideLeft' }} />
        <YAxis name='Precip' yAxisId='right' orientation='right' />
        <Tooltip />
        <Legend />
        <Area dataKey='precip' fill='rgb(135 201 249)' yAxisId='right' />
        <Line type='monotone' dataKey='tempmax' stroke='#ffb412' yAxisId='left' />
        <Line type='monotone' dataKey='tempmin' stroke='#8884d8' yAxisId='left' activeDot={{ r: 4 }} />
      </ComposedChart>
    </div>
  );
}

export default LocationDetailChart;
