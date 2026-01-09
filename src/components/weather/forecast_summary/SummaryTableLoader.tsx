import React, { useEffect, useState } from "react";
import { parse } from "fecha";
import { DailyForecastFilter } from "../../../interfaces/DailyForecastFilter";
import { MatchedAreas } from "../../../interfaces/MatchedAreas";
import findMatchedAreas from "../../../utils/filterMatchedAreas";
import useLocalStorage from "../../../utils/localstorage";
import { LS_DAILY_FORECAST_FILTER_KEY } from "../Constants";
import LocationDetail, {
  LocationDetailProps,
} from "../location_details/LocationDetail";
import SummaryTable, { SummaryTableProps } from "./SummaryTable";
import weatherLoadingError from "../../../images/little-rain-tornado-rainstorm.gif";
import weatherLoading from "../../../images/weather-loading.gif";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { mergeForecast } from "../../../features/forecast/forecastSlice";
import {
  ForecastDates,
  ForecastResponseStatus,
} from "../../../interfaces/ForecastResponseInterface";
import { calculateWeekends } from "../../../utils/date";
import fetchWithRetries from "../../../api/retry";

const dataSource = import.meta.env.PROD ? "real" : "mock";
const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_JWT_TOKEN = import.meta.env.VITE_WEATHER_JWT_TOKEN;
const url = `${WEATHER_API}/forecasts/${dataSource}`;

export function SummaryTableLoader() {
  const [forecastDetailsForLocation, setForecastDetailsForLocation] =
    useState<string>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const data = await fetchWithRetries(`${url}`, {
        mode: "cors",
        headers: new Headers({
          Authorization: `Bearer ${WEATHER_JWT_TOKEN}`,
        }),
      });
      // convert the data to json
      const json = await data.json();
      // set state with the result
      const newAppState: ForecastResponseStatus = {
        isLoaded: true,
        forecast: json.data,
        error: null,
      };
      dispatch(mergeForecast(newAppState));
    };

    fetchData().catch((err) => {
      console.log(`catching error : ${err}`);
      const errorAppState: ForecastResponseStatus = {
        isLoaded: false,
        error: err,
        forecast: null,
      };
      dispatch(mergeForecast(errorAppState));
    });
  }, []);

  const appState = useAppSelector((state) => state.forecast);

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
    defaultDailyForecastFilter
  );

  let matchedAreas: MatchedAreas = { totalMatchedLocations: 0 };
  if (appState.isLoaded && appState.forecast) {
    matchedAreas = findMatchedAreas(null, appState.forecast.regions);
  }

  const parsedDates = (appState.forecast?.dates || []).map((d: string) =>
    parse(d, "YYYY-MM-DD")
  );
  const weekends = calculateWeekends(parsedDates);

  const forecastDates: ForecastDates = {
    dates: appState.forecast?.dates || [],
    parsedDates,
    weekends,
  };

  const locationDetailArgs: LocationDetailProps = {
    appState,
    forecastDetailsForLocation,
    setForecastDetailsForLocation,
    forecastDates,
  };

  const summaryTableArgs: SummaryTableProps = {
    matchedAreas,
    dailyForecastFilter,
    setDailyForecastFilter,
    setForecastDetailsForLocation,
    forecastResponse: appState.forecast,
  };

  return (
    <div className="theme font-loader">
      <div className="container">
        {!appState.isLoaded && !appState.error && (
          <>
            <div className="loading">
              <h2>Weather loading...</h2>
            </div>
            <div className="loading">
              <img src={weatherLoading} alt="Loading..." />
            </div>
          </>
        )}
        {appState?.error && (
          <div className="error">
            <h2>{appState.error?.message}</h2>
            <div className="error-image">
              <img src={weatherLoadingError} alt="Error loading weather..." />
            </div>
          </div>
        )}
        <div>
          {!forecastDetailsForLocation &&
            matchedAreas.totalMatchedLocations > 0 && (
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
