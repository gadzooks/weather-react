import { ForecastResponseStatus, DefaultForecastResponseStatus } from '../interfaces/ForecastResponseInterface';
import fetchWithRetries, { fetchWithTimeout } from './retry';

export interface GetForecastProps {
  dataSource: string,
  setAppState: any,
}

const dataSource = import.meta.env.PROD ? 'real' : 'mock';
const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;
const url = `${WEATHER_API}/forecasts/${dataSource}`;

export async function getForecast2(): Promise<any> {
  console.log(`calling ${url}`);
  const results = await fetchWithRetries(`${url}`, {
    mode: 'cors',
    headers: new Headers({
      Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
    }),
  });

  const forecast = results.json();
  console.log(`forecast is ${JSON.stringify(results.json())}`);
  // const response: ForecastResponseStatus = {
  //   isLoaded: true,
  //   forecast,
  //   error: null,
  // };
  return forecast;
}

const getForecast = async (): Promise<ForecastResponseStatus> => {
  // eslint-disable-next-line no-promise-executor-return
  // await new Promise((r) => setTimeout(r, 300000));
  console.log(`calling ${url}`);
  await fetch(`${url}`, {
    mode: 'cors',
    headers: new Headers({
      Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
    }),
  })
    .then((res:any) => {
      if (!res.ok) {
        throw new Error('bad response from server ');
      }
      return res.json();
    })
    .then(
      (result) => {
        const newAppState: ForecastResponseStatus = {
          isLoaded: true,
          forecast: result.forecast,
          error: null,
        };
        return newAppState;
      },
      (error) => {
        throw new Error(error);
      },
    )
    .catch((err) => {
      console.log(`catching error : ${err}`);
      const errorAppState: ForecastResponseStatus = {
        isLoaded: false,
        error: err,
        forecast: null,
      };
      return errorAppState;
    });

  console.log('------------------------');
  return DefaultForecastResponseStatus;
};

export default getForecast;
