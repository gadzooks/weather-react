import { parse, format } from "fecha";
import React from "react";
import { ForecastResponse } from "../../interfaces/ForecastResponseInterface";
import SearchableTableHook from "./forecast_summary/SearchableTableHook";
import LocationDetails from "./location_details/LocationDetails";

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

class WeatherPage extends React.Component<AppState, AppState> {
  constructor(props: AppState) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      forecast: null,
    }
  }

  componentDidMount() {
    const WEATHER_API = process.env.REACT_APP_WEATHER_API;

    fetch(`${WEATHER_API}/forecasts/mock`, {mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            forecast: result.data,
            error: null,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, forecast } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (forecast != null) {
      return <Page {...forecast} />
    }
  }
}

export function Page(props: ForecastResponse) {
  return (
    <>
      <div id='top' />
      <SearchableTableHook {...props} />
    </>
  )

}

export default WeatherPage;