import React from 'react';
import renderer from 'react-test-renderer';
import mockWeatherForecastNormalized from '../../../api/mockData';
import { ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import findMatchedAreas from '../../../utils/filterMatchedAreas';
import SummaryTable, { SummaryTableProps } from './SummaryTable';

it('renders a snapshot', () => {
  const forecast = mockWeatherForecastNormalized()
    .data as unknown as ForecastResponse;

  const matchedAreas:MatchedAreas = findMatchedAreas(null, forecast.regions);
  const weatherPageArgs: SummaryTableProps = {
    dailyForecastFilter: {},
    matchedAreas,
    forecastResponse: forecast,
    setDailyForecastFilter: () => {},
    setForecastDetailsForLocation: () => {},
  };
  const tree = renderer
    .create(<SummaryTable {...weatherPageArgs} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
