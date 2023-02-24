import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import { DailyForecastInterface, forecastProperty } from '../../../interfaces/DailyForecastInterface';
import { ForeacastDates } from '../../../interfaces/ForecastResponseInterface';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function getDataFromForecast(forecast: DailyForecastInterface[]) {
  const tmpMax:any[] = [];
  const tmpMin:any[] = [];

  forecast.forEach((f) => {
    const d = new Date(f.datetime);
    const y = forecastProperty(f, 'tempmax');
    const h1 = {
      name: d.getDate(),
      x: d.getDate(),
      y,
      value: y,
    };
    tmpMax.push(h1);

    const h2 = {
      name: d.getDate(),
      x: d.getDate(),
      y,
      value: y,
    };
    tmpMin.push(h2);
    // return null;
  });

  return {
    tmpmax: tmpMax,
    tmpmin: tmpMin,
  };
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
  const data1:any = getDataFromForecast(forecast);
  console.log('--------------');
  console.log(data1.tmpmax);
  console.log('--------------');
  // {
  //   name: 'Page A',
  //   uv: 4000,
  //   pv: 2400,
  //   amt: 2400,
  // },
  return (
    <LineChart
      width={500}
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
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type='monotone' dataKey='pv' stroke='#8884d8' activeDot={{ r: 8 }} />
      <Line type='monotone' dataKey='uv' stroke='#82ca9d' />
    </LineChart>
  );
}

export default LocationDetailChart;
