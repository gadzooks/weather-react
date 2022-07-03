import { Grommet } from 'grommet';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Routes, Route, useParams,
} from 'react-router-dom';
// import App from './App';
import { Layout } from './components/Layout';
import { DEFAULT_DATA_SOURCE } from './components/weather/Constansts';
import WeatherPage from './components/weather/main_page/WeatherPage';
import {
  DefaultForecastResponseStatus,
  ForecastResponseStatus,
} from './interfaces/ForecastResponseInterface';

export default function App() {
  const theme = {
    global: {
      colors: {
        'light-2': '#f5f5f5',
        text: {
          light: 'rgba(0, 0, 0, 0.87)',
        },
      },
      edgeSize: {
        small: '14px',
      },
      elevation: {
        light: {},
      },
      font: {
        family: 'Roboto',
        size: '14px',
        height: '20px',
      },
    },
    button: {
      border: {
        width: '1px',
        radius: '4px',
      },
      padding: {
        vertical: '8px',
        horizontal: '16px',
      },
    },
  };

  const [appState, setAppState] = useState(
    DefaultForecastResponseStatus as ForecastResponseStatus,
  );
  const params = useParams();
  const dataSource = params.dataSource || DEFAULT_DATA_SOURCE;

  useEffect(() => {
    const WEATHER_API = process.env.REACT_APP_WEATHER_API;

    const url = `${WEATHER_API}/forecasts/${dataSource}`;
    console.log(`getting weather from ${url}`);
    fetch(`${url}`, { mode: 'cors' })
      .then((res) => res.json())
      .then(
        (result) => {
          setAppState({
            isLoaded: true,
            forecast: result.data,
            error: null,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setAppState({
            isLoaded: true,
            error,
            forecast: null,
          });
        },
      );
  }, []);

  return (
    <Grommet theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/forecasts/:dataSource' element={<WeatherPage {...appState} />} />
            <Route
              path='*'
              element={(
                <main style={{ padding: '1rem' }}>
                  <p>There&apos;s nothing here</p>
                </main>
              )}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Grommet>
  );
}
