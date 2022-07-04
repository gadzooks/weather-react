import { SelectChangeEvent, debounce } from '@mui/material';
import { Grommet } from 'grommet';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Routes, Route, useParams,
} from 'react-router-dom';
import getForecast from './api/weatherForecast';
// import App from './App';
import { Layout, LayoutProps } from './components/Layout';
import {
  LS_DAILY_FORECAST_FILTER_KEY,
  LS_SEARCH_KEY,
} from './components/weather/Constants';
import WeatherPage, { WeatherPageArgs } from './components/weather/main_page/WeatherPage';
import { DailyForecastFilter } from './interfaces/DailyForecastFilter';
import {
  DefaultForecastResponseStatus,
  ForecastResponseStatus,
} from './interfaces/ForecastResponseInterface';
import { MatchedAreas } from './interfaces/MatchedAreas';
import findMatchedAreas from './utils/filterMatchedAreas';
import useLocalStorage from './utils/localstorage';

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
  const dataSource = params.dataSource || (process.env.NODE_ENV === 'production' ? 'real' : 'mock');

  // TODO move this to a separate file
  useEffect(() => {
    getForecast({ dataSource, setAppState });
  }, []);

  const [searchText, setSearchText] = useLocalStorage(LS_SEARCH_KEY, '');
  const defaultDailyForecastFilter: DailyForecastFilter = {
    date: undefined,
    tempmax: undefined,
    tempmin: undefined,
    precip: undefined,
    precipprob: undefined,
  };
  const [dailyForecastFilter, setDailyForecastFilter] = useLocalStorage(
    LS_DAILY_FORECAST_FILTER_KEY,
    defaultDailyForecastFilter,
  );

  const handleChangeForDay = (event: SelectChangeEvent) => {
    const dFF = { ...dailyForecastFilter } as DailyForecastFilter;
    dFF.date = event.target.value;
    setDailyForecastFilter(dFF);
  };

  const handleChangeForLocationName = debounce(setSearchText, 200);
  const trimmedSearch = searchText.trim();
  const re = trimmedSearch === '' ? null : new RegExp(trimmedSearch, 'i');
  let matchedAreas:MatchedAreas = { totalMatchedRegions: 0 };
  if (appState.isLoaded && appState.forecast) {
    matchedAreas = findMatchedAreas(re, appState.forecast.regions);
  }

  const { forecastDates } = appState;
  const layoutArgs: LayoutProps = {
    isLoaded: appState.isLoaded,
    searchText,
    handleChangeForLocationName,
    totalMatchedRegions: matchedAreas.totalMatchedRegions,
    handleChangeForDay,
    dates: forecastDates.dates,
    dailyForecastFilter,
    setDailyForecastFilter,
  };

  const weatherPageArgs: WeatherPageArgs = {
    matchedAreas,
    dailyForecastFilter,
    appState,
  };

  return (
    <Grommet theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout {...layoutArgs} />}>
            <Route
              path='/forecasts/:dataSource'
              element={<WeatherPage {...weatherPageArgs} />}
            />
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
