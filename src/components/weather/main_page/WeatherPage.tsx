/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';
import {
  ForecastResponseStatus,
} from '../../../interfaces/ForecastResponseInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import SummaryTable, { SummaryTableProps } from '../forecast_summary/SummaryTable';

export interface WeatherPageArgs {
  appState: ForecastResponseStatus;
  matchedAreas: MatchedAreas;
  dailyForecastFilter: DailyForecastFilter;
  setDailyForecastFilter: any;
  setForecastDetailsForLocation: any;
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
      {appState.forecast && <SummaryTable {...args} />}
    </>
  );
}

export default WeatherPage;
