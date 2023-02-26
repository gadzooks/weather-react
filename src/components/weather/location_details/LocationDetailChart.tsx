/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  // eslint-disable-next-line max-len
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, LabelList, ReferenceLine, Label, TooltipProps, ResponsiveContainer,
} from 'recharts';
// eslint-disable-next-line import/no-unresolved
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

import { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import { ForeacastDates } from '../../../interfaces/ForecastResponseInterface';
import { nth } from '../../../utils/date';
import WeatherIcon from '../main_page/WeatherIcon';
import './LocationDetailChart.scss';

// function CustomTooltip({
//   active,
//   payload,
//   label,
// }: TooltipProps<ValueType, NameType>) {
//   if (active && payload) {
//     const forecast = payload[0].payload as DailyForecastInterface;
//     // console.log(forecast.datetime);
//     return (
//       <div className='custom-tooltip'>
//         <div className='icon'>
//           <WeatherIcon {...forecast} />
//           {/* <span>{forecast.datetime}</span> */}
//         </div>
//         <p className='label'>{`${label} : ${payload?.[0].value}`}</p>
//         <p className='desc'>Anything you want can be displayed here.</p>
//       </div>
//     );
//   }

//   return null;
// }

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
  // console.log(forecastDates);
  const data:any = getDataFromForecast(forecast, forecastDates);
  return (
    <div className='weather-weekly-chart'>
      <ResponsiveContainer width={600} height={300}>
        <ComposedChart
          className='weather-chart'
          data={data}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='name'
            name='day'
            label={{ value: 'Days', position: 'insideBottomRight', offset: 0 }}
            style={{ fontSize: '0.5rem' }}
          />
          {/* <XAxis dataKey='name' tick={<WeatherIcon {...data} />} /> */}
          <YAxis
            name='Temp'
            yAxisId='left'
            label={{ value: 'Temp °F', angle: -90, position: 'insideLeft' }}
            domain={[0, (dataMax:number) => (Math.max(dataMax, 100))]}
            style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
          />
          <YAxis
            name='Precip'
            yAxisId='right'
            orientation='right'
            domain={[0, (p:number) => (p + 0.2)]}
            label={{ value: 'Precipitation', angle: -90, position: 'outsideRight' }}
            style={{ fontSize: '0.8rem', fontFamily: 'Arial' }}
          />
          <Tooltip />
          {/* <Tooltip content={<CustomTooltip />} trigger='click' /> */}
          <Legend />
          <Bar dataKey={(d) => precipitation(d)} fill='rgb(135 201 249)' yAxisId='right' strokeWidth={1} barSize={8}>
            <LabelList
              dataKey={(d) => precipLabel(d)}
              position='top'
              style={{ fontSize: '0.7rem', fontFamily: 'Arial', fontWeight: '1.3em' }}
            />
          </Bar>
          <Line type='monotone' dataKey='tempmax' stroke='#ffb412' yAxisId='left' label='max temp' />
          <Line type='monotone' dataKey='tempmin' stroke='#8884d8' yAxisId='left' activeDot={{ r: 4 }} />
          <ReferenceLine y={95} yAxisId='left' label='95 °F' stroke='red' strokeDasharray='3 3' />
          <ReferenceLine y={32} yAxisId='left' label='32 °F' stroke='blue' strokeDasharray='3 3' />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LocationDetailChart;
