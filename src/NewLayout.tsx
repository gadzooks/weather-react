import React, { useEffect, useState } from 'react';
import { SelectChangeEvent, debounce, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Menu from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ForecastFilter, {
  ForecastFilterContainerProps,
} from './components/weather/Filters/ForecastFilter';
import getForecast from './api/weatherForecast';
import {
  DefaultForecastResponseStatus,
  ForecastResponseStatus,
} from './interfaces/ForecastResponseInterface';
import {
  LS_SEARCH_KEY,
  LS_DAILY_FORECAST_FILTER_KEY,
} from './components/weather/Constants';
import { DailyForecastFilter } from './interfaces/DailyForecastFilter';
import { MatchedAreas } from './interfaces/MatchedAreas';
import findMatchedAreas from './utils/filterMatchedAreas';
import useLocalStorage from './utils/localstorage';
import WeatherPage, {
  WeatherPageArgs,
} from './components/weather/main_page/WeatherPage';
import LocationDetail, { LocationDetailProps } from './components/weather/location_details/LocationDetail';

interface SidebarNavProps extends ForecastFilterContainerProps {
  showSidebar: boolean;
}

export function WeatherLayout() {
  const [appState, setAppState] = useState<ForecastResponseStatus>(DefaultForecastResponseStatus);

  const dataSource = process.env.NODE_ENV === 'production' ? 'real' : 'mock';

  const [sidebar, setSidebar] = useState(false);
  const [forecastDetailsForLocation, setForecastDetailsForLocation] = useState<string>();
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
  let matchedAreas: MatchedAreas = { totalMatchedLocations: 0 };
  if (appState.isLoaded && appState.forecast) {
    matchedAreas = findMatchedAreas(re, appState.forecast.regions);
  }

  const { forecastDates } = appState;
  const headerArgs: SidebarNavProps = {
    showSidebar: sidebar,
    isLoaded: appState.isLoaded || false,
    searchText,
    setSearchText: handleChangeForLocationName,
    totalMatchedRegions: matchedAreas.totalMatchedLocations,
    handleChangeForDay,
    dates: forecastDates.dates,
    dailyForecastFilter,
    setDailyForecastFilter,
  };

  const weatherPageArgs: WeatherPageArgs = {
    matchedAreas,
    dailyForecastFilter,
    appState,
    setDailyForecastFilter,
    setForecastDetailsForLocation,
  };

  const locationDetailArgs: LocationDetailProps = {
    appState,
    forecastDetailsForLocation,
    setForecastDetailsForLocation,
  };

  const darkTheme = createTheme({});

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container>
        <Grid item xs={12}>
          <Button onClick={() => setSidebar(!sidebar)}>
            {sidebar && <FilterAltIcon />}
            {!sidebar && <Menu />}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {sidebar && <ForecastFilter {...headerArgs} />}
          {!sidebar && !forecastDetailsForLocation && <WeatherPage {...weatherPageArgs} />}
        </Grid>
        <Grid item xs={12}>
          {!sidebar && forecastDetailsForLocation && <LocationDetail {...locationDetailArgs} />}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default {
  title: 'Controls/Nav/Sidebar',
};
