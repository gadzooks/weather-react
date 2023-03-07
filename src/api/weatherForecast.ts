import { parse } from 'fecha';
import { ForecastDates, ForecastResponseStatus } from '../interfaces/ForecastResponseInterface';
import { calculateWeekends } from '../utils/date';

export interface GetForecastProps {
  dataSource: string,
  setAppState: any,
}

const getForecast = async (props: GetForecastProps) => {
  const {
    dataSource,
    setAppState,
  } = props;
  const WEATHER_API = process.env.REACT_APP_WEATHER_API;
  const WEATHER_JWT_TOKEN = process.env.REACT_APP_WEATHER_JWT_TOKEN;

  const url = `${WEATHER_API}/forecasts/${dataSource}`;
  // eslint-disable-next-line no-promise-executor-return
  // await new Promise((r) => setTimeout(r, 300000));
  await fetch(`${url}`, {
    mode: 'cors',
    headers: new Headers({
      Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('bad response from server ');
      }
      return res.json();
    })
    .then(
      (result) => {
        const forecast = result.data;
        const parsedDates = forecast.dates.map((d: string) => parse(d, 'YYYY-MM-DD'));
        const weekends = calculateWeekends(parsedDates);

        const forecastDates: ForecastDates = {
          dates: forecast.dates,
          parsedDates,
          weekends,
        };
        const newAppState: ForecastResponseStatus = {
          isLoaded: true,
          forecast: result.data,
          error: null,
          forecastDates,
        };
        setAppState(newAppState);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        throw new Error(error);
      },
    ).catch((err) => {
      console.log(`catching error : ${err}`);
      const forecastDates: ForecastDates = {
        dates: [],
        parsedDates: [],
        weekends: [],
      };
      const errorAppState: ForecastResponseStatus = {
        isLoaded: false,
        error: err,
        forecast: null,
        forecastDates,
      };
      setAppState(errorAppState);
    });
};

export default getForecast;
