import React from 'react';
import renderer from 'react-test-renderer';
import { mockWeatherForecastNormalized } from '../../api/mockData';
import { ForecastResponse } from '../../interfaces/ForecastResponseInterface';
import { Page } from './WeatherPage';

it('renders a snapshot', () => {
    const mockData = mockWeatherForecastNormalized().data as unknown as ForecastResponse;
    // const parsedDates = mockData.dates.map((d) => parse(d, 'YYYY-MM-DD'));
    // const weekends = isWeekend(parsedDates);
    // const seattle = mockData.regions.locations[0];
    const tree = renderer.create(
        <Page {...mockData} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});