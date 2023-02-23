import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, { useEffect, useState } from 'react';
import getForecast from './api/weatherForecast';
import './App.scss';
import {
  // LS_SEARCH_KEY,
  LS_DAILY_FORECAST_FILTER_KEY,
} from './components/weather/Constants';
import SummaryTable, {
  SummaryTableProps,
} from './components/weather/forecast_summary/SummaryTable';
import LocationDetail, {
  LocationDetailProps,
} from './components/weather/location_details/LocationDetail';
import weatherLoadingError from './images/little-rain-tornado-rainstorm.gif';
import weatherLoading from './images/weather-loading.gif';
import { DailyForecastFilter } from './interfaces/DailyForecastFilter';
import {
  DefaultForecastResponseStatus,
  ForecastResponseStatus,
} from './interfaces/ForecastResponseInterface';
import { MatchedAreas } from './interfaces/MatchedAreas';
import './reset.css';
import findMatchedAreas from './utils/filterMatchedAreas';
import useLocalStorage from './utils/localstorage';

// interface SidebarNavProps extends ForecastFilterContainerProps {
//   showSidebar: boolean;
// }

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function App() {
  const [appState, setAppState] = useState<ForecastResponseStatus>(
    DefaultForecastResponseStatus,
  );

  const dataSource = isProduction() ? 'real' : 'mock';
  // let interval: any = 1;

  // const [sidebar, setSidebar] = useState(false);
  const [forecastDetailsForLocation, setForecastDetailsForLocation] = useState<string>();
  useEffect(() => {
    getForecast({ dataSource, setAppState });

    // TODO: auto refresh page. Need to make sure that page
    // is ONLY refreshed if latest request did not fail, so that
    // we can show the latest valid data at all times on the page
    // interval = setInterval(() => {
    //   getForecast({ dataSource, setAppState });
    // }, 10_000);

    // // we call this when we unmount
    // return () => clearInterval(interval);
  }, []);

  // const [searchText, setSearchText] = useLocalStorage(LS_SEARCH_KEY, '');
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

  // const handleChangeForDay = (event: any) => {
  //   const dFF = { ...dailyForecastFilter } as DailyForecastFilter;
  //   dFF.date = event.target.value;
  //   setDailyForecastFilter(dFF);
  // };

  // const handleChangeForLocationName = debounce(setSearchText, 200);
  // const trimmedSearch = searchText.trim();
  // const re = trimmedSearch === '' ? null : new RegExp(trimmedSearch, 'i');
  let matchedAreas: MatchedAreas = { totalMatchedLocations: 0 };
  if (appState.isLoaded && appState.forecast) {
    matchedAreas = findMatchedAreas(null, appState.forecast.regions);
  }

  // const { forecastDates } = appState;
  // const headerArgs: SidebarNavProps = {
  //   showSidebar: sidebar,
  //   isLoaded: appState.isLoaded || false,
  //   searchText,
  //   setSearchText: handleChangeForLocationName,
  //   totalMatchedRegions: matchedAreas.totalMatchedLocations,
  //   handleChangeForDay,
  //   dates: forecastDates.dates,
  //   dailyForecastFilter,
  //   setDailyForecastFilter,
  // };

  const locationDetailArgs: LocationDetailProps = {
    appState,
    forecastDetailsForLocation,
    setForecastDetailsForLocation,
  };

  // const [w, setW] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setW(window.innerWidth);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  const summaryTableArgs: SummaryTableProps = {
    matchedAreas,
    dailyForecastFilter,
    setDailyForecastFilter,
    setForecastDetailsForLocation,
    forecastDates: appState.forecastDates,
    forecastResponse: appState.forecast,
  };

  const [sidebar] = useState(false);

  return (
    <div className='theme'>
      <div className='container'>
        {!appState.isLoaded && !appState.error && (
          <>
            <div className='loading'>
              <h2>Weather loading...</h2>
            </div>
            <div className='loading'>
              <img src={weatherLoading} alt='Loading...' />
            </div>
          </>
        )}
        {appState?.error && (
          <div className='error'>
            <h2>{appState.error?.message}</h2>
            <div className='error-image'>
              <img src={weatherLoadingError} alt='Error loading weather...' />
            </div>
          </div>
        )}

        {/* {appState.isLoaded && (
          <div className='filters'>
            <button type='button' onClick={() => setSidebar(!sidebar)}>
              {sidebar && <FilterAltIcon />}
            </button>
          </div>
        )}
        { sidebar
          && !forecastDetailsForLocation
          && matchedAreas.totalMatchedLocations > 0 && (
            <div className='filters'>
              <ForecastFilter {...headerArgs} />
            </div>
        )}
         */}
        <div>
          {/* {!smartPhone && <ForecastFilter {...headerArgs} />} */}
          {!sidebar
            && !forecastDetailsForLocation
            && matchedAreas.totalMatchedLocations > 0 && (
              <SummaryTable {...summaryTableArgs} />
          )}
        </div>
        <div>
          {!sidebar && forecastDetailsForLocation && (
            <LocationDetail {...locationDetailArgs} />
          )}
        </div>
      </div>
    </div>
  );
}

export default {
  title: 'Controls/Nav/Sidebar',
};
