import { parse } from 'fecha';
import React from 'react';
import renderer from 'react-test-renderer';
import mockWeatherForecastNormalized from '../../../api/mockData';
import {
  ForecastDates,
  ForecastResponse,
  ForecastResponseStatus,
} from '../../../interfaces/ForecastResponseInterface';
import { calculateWeekends } from '../../../utils/date';
import LocationDetail, { LocationDetailProps } from './LocationDetail';

const { ResizeObserver } = window;

// from https://github.com/maslianok/react-resize-detector/issues/145#issuecomment-953569721
beforeEach(() => {
  // @ts-ignore
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

it('renders a snapshot', () => {
  const forecast = mockWeatherForecastNormalized()
    .data as unknown as ForecastResponse;
  const parsedDates = forecast.dates.map((d: string) => parse(d, 'YYYY-MM-DD'));
  const weekends = calculateWeekends(parsedDates);

  const forecastDates: ForecastDates = {
    dates: forecast.dates,
    parsedDates,
    weekends,
  };

  const appState: ForecastResponseStatus = {
    isLoaded: true,
    error: null,
    forecast,
  };

  const locDetailProps: LocationDetailProps = {
    appState,
    forecastDetailsForLocation:
      '{"name":"seattle","description":"Cle Elum Area1","latitude":47.196943,"longitude":-120.939134,"sub_region":"767d751df8b6495999e96486d4d32d49","region":"snowqualmie_region","wtaRegionKey":"04d37e830680c65b61df474e7e655d64"}',
    setForecastDetailsForLocation: () => {},
    forecastDates,
  };

  const tree = renderer
    .create(<LocationDetail {...locDetailProps} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
