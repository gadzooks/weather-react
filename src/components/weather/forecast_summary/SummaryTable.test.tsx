import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import mockWeatherForecastNormalized from '../../../api/mockData';
import type { ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import type { MatchedAreas } from '../../../interfaces/MatchedAreas';
import findMatchedAreas from '../../../utils/filterMatchedAreas';
import SummaryTable, { type SummaryTableProps } from './SummaryTable';

it('renders a snapshot', () => {
  const forecast = mockWeatherForecastNormalized()
    .data as unknown as ForecastResponse;

  const matchedAreas: MatchedAreas = findMatchedAreas(null, forecast.regions);
  const weatherPageArgs: SummaryTableProps = {
    dailyForecastFilter: {},
    matchedAreas,
    forecastResponse: forecast,
    setDailyForecastFilter: () => {},
    showAqi: true,
  };
  const tree = renderer
    .create(
      <MemoryRouter>
        <SummaryTable {...weatherPageArgs} />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
