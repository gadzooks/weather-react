import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import { ForeacastDates } from '../../../interfaces/ForecastResponseInterface';

const data = [
  {
    name: 'Page A',
    tempMax: 4000,
    tempMin: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    tempMax: 3000,
    tempMin: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    tempMax: 2000,
    tempMin: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    tempMax: 2780,
    tempMin: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    tempMax: 1890,
    tempMin: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    tempMax: 2390,
    tempMin: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    tempMax: 3490,
    tempMin: 4300,
    amt: 2100,
  },
];

function getDataFromForecast(forecast: DailyForecastInterface[], forecastDates: ForeacastDates) {
  const tmpMax:any[] = [];
  const { parsedDates } = forecastDates;

  forecast.forEach((f, index) => {
    const d = parsedDates[index];
    // const tempMax = forecastProperty(f, 'tempmax');
    // const tempMin = forecastProperty(f, 'tempmin');
    const h1 = {
      name: d?.getDate().toString(),
      // tempMax,
      // tempMin,
      ...f,
    };
    tmpMax.push(h1);
  });

  return {
    tmpmax: tmpMax,
  };
}

export interface LocationDetailChartProps {
  forecast: DailyForecastInterface[];
  weekends: boolean[];
  forecastDates: ForeacastDates;
}

function LocationDetailChart(props: LocationDetailChartProps) {
  const { forecast, weekends, forecastDates } = props;
  console.log(data);
  console.log(weekends);
  console.log(forecastDates);
  const data1:any = getDataFromForecast(forecast, forecastDates);
  console.log('--------------');
  console.log(data1.tmpmax);
  console.log('--------------');
  // {
  //   name: 'Page A',
  //   tempMax: 4000,
  //   tempMin: 2400,
  //   amt: 2400,
  // },
  return (
    <LineChart
      width={500}
      height={300}
      data={data1.tmpmax}
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
      <Line type='monotone' dataKey='tempmin' stroke='#8884d8' activeDot={{ r: 4 }} />
      <Line type='monotone' dataKey='tempmax' stroke='#ffb412' />
    </LineChart>
  );
}

export default LocationDetailChart;
