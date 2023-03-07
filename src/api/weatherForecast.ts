import { DefaultForecastResponseStatus, ForecastResponseStatus } from '../interfaces/ForecastResponseInterface';

export interface GetForecastProps {
  dataSource: string,
  setAppState: any,
}

const dataSource = process.env.NODE_ENV === 'production' ? 'real' : 'mock';
const WEATHER_API = process.env.REACT_APP_WEATHER_API;
const WEATHER_JWT_TOKEN = process.env.REACT_APP_WEATHER_JWT_TOKEN;
const url = `${WEATHER_API}/forecasts/${dataSource}`;

export async function getForecastAsync(): Promise<any> {
  const results = await fetch(`${url}`, {
    mode: 'cors',
    headers: new Headers({
      Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
    }),
  });

  const forecast = results.json();
  return forecast;
}

const getForecast = async () : Promise<ForecastResponseStatus> => {
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
        // const forecast = result.data;
        // const parsedDates = forecast.dates.map((d: string) => parse(d, 'YYYY-MM-DD'));
        // const weekends = calculateWeekends(parsedDates);

        const newAppState: ForecastResponseStatus = {
          isLoaded: true,
          forecast: result.data,
          error: null,
        };
        return newAppState;
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        throw new Error(error);
      },
    ).catch((err) => {
      console.log(`catching error : ${err}`);
      // const forecastDates: ForecastDates = {
      //   dates: [],
      //   parsedDates: [],
      //   weekends: [],
      // };
      const errorAppState: ForecastResponseStatus = {
        isLoaded: false,
        error: err,
        forecast: null,
      };
      return errorAppState;
    });

  return DefaultForecastResponseStatus;
};

export default getForecast;
