import React, { useEffect, useState } from 'react';
import getForecast from '../../../api/weatherForecast';
import { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';
import { ForecastResponseStatus, DefaultForecastResponseStatus } from '../../../interfaces/ForecastResponseInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import findMatchedAreas from '../../../utils/filterMatchedAreas';
import useLocalStorage from '../../../utils/localstorage';
import { LS_DAILY_FORECAST_FILTER_KEY } from '../Constants';
import LocationDetail, { LocationDetailProps } from '../location_details/LocationDetail';
import SummaryTable, { SummaryTableProps } from './SummaryTable';
import weatherLoadingError from '../../../images/little-rain-tornado-rainstorm.gif';
import weatherLoading from '../../../images/weather-loading.gif';

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function SummaryTableLoader() {
  const [appState, setAppState] = useState<ForecastResponseStatus>(
    DefaultForecastResponseStatus,
  );

  const dataSource = isProduction() ? 'real' : 'mock';
  // let interval: any = 1;

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

  let matchedAreas: MatchedAreas = { totalMatchedLocations: 0 };
  if (appState.isLoaded && appState.forecast) {
    matchedAreas = findMatchedAreas(null, appState.forecast.regions);
  }

  const locationDetailArgs: LocationDetailProps = {
    appState,
    forecastDetailsForLocation,
    setForecastDetailsForLocation,
  };

  const summaryTableArgs: SummaryTableProps = {
    matchedAreas,
    dailyForecastFilter,
    setDailyForecastFilter,
    setForecastDetailsForLocation,
    forecastDates: appState.forecastDates,
    forecastResponse: appState.forecast,
  };

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
        <div>
          {!forecastDetailsForLocation
            && matchedAreas.totalMatchedLocations > 0 && (
              <SummaryTable {...summaryTableArgs} />
          )}
        </div>
        <div>
          {forecastDetailsForLocation && (
            <LocationDetail {...locationDetailArgs} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryTableLoader;
