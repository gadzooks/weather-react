/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';
import {
  ForecastResponseStatus,
} from '../../../interfaces/ForecastResponseInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import SummaryTable, { SummaryTableProps } from '../forecast_summary/SummaryTable';
// import LocationDetails from '../location_details/LocationDetails';

export function WeatherForecastSubPage(props: SummaryTableProps) {
  // const { forecastResponse } = props;

  return (
    <>
      <div id='top' />
      <SummaryTable {...props} />

      {/* {forecastResponse && (
        <LocationDetails
          matchedAreas={props.matchedAreas}
          forecastsByName={forecastResponse.forecasts.byId}
          isWeekend={props.forecastDates.weekends}
          dates={props.forecastDates.parsedDates}
        />
      )} */}
    </>
  );
}

export interface WeatherPageArgs {
  appState: ForecastResponseStatus,
  matchedAreas: MatchedAreas,
  dailyForecastFilter: DailyForecastFilter,
}

function WeatherPage(props: WeatherPageArgs) {
  const { appState } = props;
  const args:SummaryTableProps = {
    ...props,
    forecastDates: appState.forecastDates,
    forecastResponse: appState.forecast,
  };

  return (
    <>
      {appState?.error && (
        <div>
          Error:
          {appState.error?.message}
        </div>
      )}
      {!appState.isLoaded && <div>Loading...</div>}
      {appState.forecast && <WeatherForecastSubPage {...args} />}
    </>
  );
}

export default WeatherPage;
