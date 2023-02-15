import { parse } from 'fecha';
import { ForeacastDates } from '../interfaces/ForecastResponseInterface';
import { calculateWeekends } from '../utils/date';

const getForecast = async (props: any) => {
  const { dataSource } = props;
  const { setAppState } = props;
  const WEATHER_API = process.env.REACT_APP_WEATHER_API;
  const WEATHER_JWT_TOKEN = process.env.REACT_APP_WEATHER_JWT_TOKEN;

  const url = `${WEATHER_API}/forecasts/${dataSource}`;
  await fetch(`${url}`, {
    mode: 'cors',
    headers: new Headers({
      Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
    }),
  })
    .then((res) => res.json())
    .then(
      (result) => {
        const forecast = result.data;
        const parsedDates = forecast.dates.map((d: string) => parse(d, 'YYYY-MM-DD'));
        const weekends = calculateWeekends(parsedDates);

        const forecastDates: ForeacastDates = {
          dates: forecast.dates,
          parsedDates,
          weekends,
        };
        setAppState({
          isLoaded: true,
          forecast: result.data,
          error: null,
          forecastDates,
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        const forecastDates: ForeacastDates = {
          dates: [],
          parsedDates: [],
          weekends: [],
        };
        setAppState({
          isLoaded: true,
          error,
          forecast: null,
          forecastDates,
        });
      },
    );
};

export default getForecast;
