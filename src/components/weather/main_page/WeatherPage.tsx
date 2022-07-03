/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { ForecastResponse, ForecastResponseStatus } from '../../../interfaces/ForecastResponseInterface';
import SearchableTableHook from '../forecast_summary/SearchableTableHook';

export function Page(props: ForecastResponse) {
  return (
    <>
      <div id='top' />
      <SearchableTableHook {...props} />
    </>
  );
}

function WeatherPage(appState: ForecastResponseStatus) {
  return (
    <>
      { appState?.error && (
      <div>
        Error:
        {appState.error?.message}
      </div>
      ) }
      { !appState.isLoaded && <div>Loading...</div> }
      { appState.forecast && <Page {...appState.forecast} /> }
    </>
  );
}

export default WeatherPage;
