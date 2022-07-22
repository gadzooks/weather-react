import React, { useEffect, useState } from 'react';
import {
  SelectChangeEvent, debounce, Button, Typography, useMediaQuery,
} from '@mui/material';
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
import LocationDetail, { LocationDetailProps } from './components/weather/location_details/LocationDetail';
import SummaryTable, { SummaryTableProps } from './components/weather/forecast_summary/SummaryTable';
import weatherLoading from './images/weather-loading.gif';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface SidebarNavProps extends ForecastFilterContainerProps {
  showSidebar: boolean;
}

function isProduction() :boolean {
  return process.env.NODE_ENV === 'production';
}

export function App() {
  const [appState, setAppState] = useState<ForecastResponseStatus>(DefaultForecastResponseStatus);

  const dataSource = isProduction() ? 'real' : 'mock';

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

  const locationDetailArgs: LocationDetailProps = {
    appState,
    forecastDetailsForLocation,
    setForecastDetailsForLocation,
  };

  const [w, setW] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setW(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const theme = createTheme({});
  const smartPhone = useMediaQuery(theme.breakpoints.down('sm'));

  const summaryTableArgs: SummaryTableProps = {
    matchedAreas,
    dailyForecastFilter,
    setDailyForecastFilter,
    setForecastDetailsForLocation,
    forecastDates: appState.forecastDates,
    forecastResponse: appState.forecast,
  };

  return (
    <ThemeProvider theme={theme}>
      {!isProduction() && <Typography>{`${w} px`}</Typography>}
      {!isProduction() && <Typography>{`${smartPhone}`}</Typography>}
      <Grid container>
        {!appState.isLoaded && (
          <Typography variant='h5'>Weather loading...</Typography>
        )}
        {!appState.isLoaded && <img src={weatherLoading} alt='Loading...' />}
        {appState?.error && (
          <div>
            Error:
            {appState.error?.message}
          </div>
        )}

        {smartPhone && appState.isLoaded && (
          <Grid item xs={12}>
            <Button onClick={() => setSidebar(!sidebar)}>
              {sidebar && <FilterAltIcon />}
              {!sidebar && <Menu />}
            </Button>
          </Grid>
        )}
        {smartPhone
          && sidebar
          && !forecastDetailsForLocation
          && matchedAreas.totalMatchedLocations > 0 && (
            <Grid item xs={12}>
              <ForecastFilter {...headerArgs} />
            </Grid>
        )}
        <Grid item xs={12}>
          {!smartPhone && <ForecastFilter {...headerArgs} />}
          {(!smartPhone || (smartPhone && !sidebar))
            && !forecastDetailsForLocation
            && matchedAreas.totalMatchedLocations > 0 && (
              <SummaryTable {...summaryTableArgs} />
          )}
        </Grid>
        <Grid item xs={12}>
          {!sidebar && forecastDetailsForLocation && (
            <LocationDetail {...locationDetailArgs} />
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default {
  title: 'Controls/Nav/Sidebar',
};
