import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import { ForeacastDates } from '../../../interfaces/ForecastResponseInterface';
import { nth } from '../../../utils/date';

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
  weekends: boolean[];
  forecastDates: ForeacastDates;
}

function LocationDetailChart(props: LocationDetailChartProps) {
  const { forecast, weekends, forecastDates } = props;
  console.log(weekends);
  console.log(forecastDates);
  const data1:any = getDataFromForecast(forecast, forecastDates);
  console.log('--------------');
  console.log(data1);
  console.log('--------------');
  // {
  //   name: 'Page A',
  //   tempMax: 4000,
  //   tempMin: 2400,
  //   amt: 2400,
  // },
  return (
    <LineChart
      width={800}
      height={300}
      data={data1}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type='monotone' dataKey='tempmax' stroke='#ffb412' />
      <Line type='monotone' dataKey='tempmin' stroke='#8884d8' activeDot={{ r: 4 }} />
    </LineChart>
  );
}

export default LocationDetailChart;
