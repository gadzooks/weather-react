import { SelectChangeEvent, debounce } from '@mui/material';
import { parse } from 'fecha';
import { Grommet } from 'grommet';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Routes, Route, useParams,
} from 'react-router-dom';
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
  ForeacastDates,
  ForecastResponseStatus,
  RegionsById,
} from './interfaces/ForecastResponseInterface';
import { MatchedAreas } from './interfaces/MatchedAreas';
import { calculateWeekends } from './utils/date';
import useLocalStorage from './utils/localstorage';

// TODO move this to utils and add tests for it.
export function findMatchedAreas(
  needle: RegExp | null,
  regionsById: RegionsById,
): MatchedAreas {
  // console.log(`matchedLocations called with ${needle}`);
  const matchedAreas: MatchedAreas = {
    totalMatchedRegions: 0,
  };

  regionsById.allIds.forEach((regionName) => {
    const region = regionsById.byId[regionName];
    if (needle) {
      const locations = region.locations.filter((l) => l.description.match(needle));
      if (locations.length > 0) {
        matchedAreas.regions ||= [];
        matchedAreas.locationsByRegion ||= {};
        matchedAreas.regions.push(region);
        matchedAreas.locationsByRegion[region.name] = locations;
      }
    } else {
      matchedAreas.regions ||= [];
      matchedAreas.regions.push(region);
      matchedAreas.locationsByRegion ||= {};
      matchedAreas.locationsByRegion[region.name] = region.locations;
    }
  });
  matchedAreas.totalMatchedRegions = matchedAreas.regions?.length || 0;
  return matchedAreas;
}

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
  const dataSource = params.dataSource || 'mock';

  // TODO move this to a separate file
  useEffect(() => {
    const WEATHER_API = process.env.REACT_APP_WEATHER_API;

    const url = `${WEATHER_API}/forecasts/${dataSource}`;
    console.log(`getting weather from ${url}`);
    fetch(`${url}`, { mode: 'cors' })
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
