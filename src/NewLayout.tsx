import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import {
  Box, Button, Grid, Grommet, grommet,
} from 'grommet';
import { SelectChangeEvent, debounce } from '@mui/material';
import ForecastHeader, { ForecastHeaderProps } from './components/HeaderTab';
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

interface SidebarNavProps extends ForecastHeaderProps {
  showSidebar: boolean;
}

function SidebarNav(props: SidebarNavProps) {
  const { showSidebar } = props;
  return (
    <Box gridArea='main'>{showSidebar && <ForecastHeader {...props} />}</Box>
  );
}

export function WeatherLayout() {
  const [appState, setAppState] = useState(
    DefaultForecastResponseStatus as ForecastResponseStatus,
  );

  const dataSource = process.env.NODE_ENV === 'production' ? 'real' : 'mock';

  const [sidebar, setSidebar] = useState(false);
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
  let matchedAreas: MatchedAreas = { totalMatchedRegions: 0 };
  if (appState.isLoaded && appState.forecast) {
    matchedAreas = findMatchedAreas(re, appState.forecast.regions);
  }

  const { forecastDates } = appState;
  const headerArgs: SidebarNavProps = {
    showSidebar: sidebar,
    isLoaded: appState.isLoaded || false,
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
    <Grommet theme={grommet}>
      <Grid
        rows={['xxsmall', 'xlarge']}
        columns={['xsmall', 'small']}
        gap='small'
        areas={[
          { name: 'nav', start: [0, 0], end: [1, 0] },
          { name: 'sidebar', start: [1, 0], end: [1, 1] },
          { name: 'main', start: [1, 1], end: [1, 1] },
        ]}
      >
        <Box
          gridArea='nav'
          direction='row'
          align='center'
          justify='between'
          pad={{ horizontal: 'medium', vertical: 'small' }}
        >
          <Button onClick={() => setSidebar(!sidebar)}>
            <MenuIcon />
          </Button>
        </Box>
        <Box
          gridArea='sidebar'
          fill
          direction='row'
          // animation={[
          //   { type: 'fadeIn', duration: 300 },
          //   { type: 'slideRight', size: 'xlarge', duration: 150 },
          // ]}
        />
        <SidebarNav {...headerArgs} />
        <Box>
          { !sidebar && <WeatherPage {...weatherPageArgs} /> }
        </Box>
      </Grid>
    </Grommet>
  );
}

export default {
  title: 'Controls/Nav/Sidebar',
};
