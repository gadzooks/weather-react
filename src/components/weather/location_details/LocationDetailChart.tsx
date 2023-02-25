/* eslint-disable no-unused-vars */
import React from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, LabelList, ReferenceLine,
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

function precipitation(d:DailyForecastInterface):(number | null) {
  if (d.precip === undefined) {
    return null;
  }
  const round = Math.round(d.precip);
  return round === 0 ? null : d.precip;
}

function precipLabel(d:any):(string | null) {
  const precip = d?.precip;
  if (precip === null || precip === undefined) {
    return null;
  }
  return precip <= 0.5 ? null : `${precip}"`;
}

function LocationDetailChart(props: LocationDetailChartProps) {
  const { forecast, forecastDates } = props;
  console.log(forecastDates);
  const data:any = getDataFromForecast(forecast, forecastDates);
  // console.log(data);
  // {
  //   name: 'Page A',
  //   tempMax: 4000,
  //   tempMin: 2400,
  //   amt: 2400,
  // },
  return (
    <div className='weather-weekly-chart'>
      <ComposedChart
        width={900}
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
        <XAxis dataKey='name' name='day' label={{ value: 'Days', position: 'insideBottomRight', offset: 0 }} />
        <YAxis name='Temp' yAxisId='left' label={{ value: 'Temp', angle: -90, position: 'insideLeft' }} domain={[0, (dataMax:number) => (Math.max(dataMax, 100))]} />
        <YAxis name='Precip' yAxisId='right' orientation='right' label={{ value: 'Precipitation', angle: -90, position: 'outsideRight' }} style={{ fontSize: '0.8rem', fontFamily: 'Arial' }} />
        <ReferenceLine y={95} yAxisId='left' label='95' stroke='red' strokeDasharray='3 3' />
        <Tooltip />
        <Legend />
        <Bar dataKey={(d) => precipitation(d)} fill='rgb(135 201 249)' yAxisId='right' strokeWidth={1}>
          <LabelList dataKey={(d) => precipLabel(d)} position='outside' />
        </Bar>
        <Line type='monotone' dataKey='tempmax' stroke='#ffb412' yAxisId='left' />
        <Line type='monotone' dataKey='tempmin' stroke='#8884d8' yAxisId='left' activeDot={{ r: 4 }} />
      </ComposedChart>
    </div>
  );
}

export default LocationDetailChart;
