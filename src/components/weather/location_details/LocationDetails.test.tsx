// LocationDetails.test.tsx

import { parse } from 'fecha';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import mockWeatherForecastNormalized from '../../../api/mockData';
import type {
  ForecastDates,
  ForecastResponse,
  ForecastResponseStatus,
} from '../../../interfaces/ForecastResponseInterface';
import { calculateWeekends } from '../../../utils/date';
import LocationDetail, { type LocationDetailProps } from './LocationDetail';

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
    alertsById: undefined,
    allAlertIds: undefined,
    locationSlug: 'cle-elum-area1',
  };

  const tree = renderer
    .create(
      <MemoryRouter>
        <LocationDetail {...locDetailProps} />
      </MemoryRouter>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
