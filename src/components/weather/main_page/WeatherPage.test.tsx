import { parse } from 'fecha';
import React from 'react';
import renderer from 'react-test-renderer';
import mockWeatherForecastNormalized from '../../../api/mockData';
import { findMatchedAreas } from '../../../App';
import { ForeacastDates, ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import { calculateWeekends } from '../../../utils/date';
import WeatherPage, { WeatherPageArgs } from './WeatherPage';

it('renders a snapshot', () => {
  const forecast = mockWeatherForecastNormalized()
    .data as unknown as ForecastResponse;
  const parsedDates = forecast.dates.map((d: string) => parse(d, 'YYYY-MM-DD'));
  const weekends = calculateWeekends(parsedDates);

  const forecastDates: ForeacastDates = {
    dates: forecast.dates,
    parsedDates,
    weekends,
  };

  const matchedAreas:MatchedAreas = findMatchedAreas(null, forecast.regions);
  const weatherPageArgs: WeatherPageArgs = {
    appState: {
      isLoaded: true,
      error: null,
      forecast,
      forecastDates,
    },
    dailyForecastFilter: {},
    matchedAreas,
  };
  const tree = renderer
    .create(<WeatherPage {...weatherPageArgs} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
