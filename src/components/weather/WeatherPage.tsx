import { format } from "fecha";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ForecastResponse } from "../../interfaces/ForecastResponseInterface";
import SearchableTableHook from "./forecast_summary/SearchableTableHook";

export function isWeekend(dates: (Date|null)[]) :boolean[] {
    const weekends: boolean[] = [];
    if(!dates) {
        return weekends;
    }

    dates.map((d) => {
        if (d) {
            const dayOfWeek = format(d, 'ddd').toUpperCase();
            weekends.push(dayOfWeek === 'SUN' || dayOfWeek === 'SAT')
        } else {
            weekends.push(false);
        }
    })

    return weekends; 
}

interface AppState {
  isLoaded: boolean,
  error: Error|null,
  forecast: ForecastResponse|null,
}

const WeatherPage = (props: AppState) => {

  const [appState, setAppState] = useState(props);
  const params = useParams();
  const dataSource = params.dataSource || 'useLocal';

  useEffect(() => {
    const WEATHER_API = process.env.REACT_APP_WEATHER_API;

    const url = `${WEATHER_API}/forecasts/${dataSource}`;
    console.log(`getting weather from ${url}`);
    fetch(`${url}`, { mode: 'cors' })
      .then(res => res.json())
      .then(
        (result) => {
          setAppState({
            isLoaded: true,
            forecast: result.data,
            error: null,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setAppState({
            isLoaded: true,
            error: error,
            forecast: null,
          });
        }
      )
  }, [])

  return(
    <>
    { appState.error && <div>Error: {appState.error.message}</div> }
    { !appState.isLoaded && <div>Loading...</div> }
    { appState.forecast && <Page {...appState.forecast} /> }
    </>
  );
}

export default WeatherPage;

export function Page(props: ForecastResponse) {
  return (
    <>
      <div id='top' />
      <SearchableTableHook {...props} />
    </>
  )

}