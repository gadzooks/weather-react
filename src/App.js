import React from 'react';
import { mockWeatherForecast, mockWeatherForecastNormalized } from './api/mockData';
import './App.css';
import SearchableTableHook from './weather/forecast_summary/SearchableTableHook';
import LocationDetails from './weather/location_details/LocationDetails';
import { format, parse } from 'fecha';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      forecast: {},
    }
  }

  componentDidMount() {
    // const result = mockWeatherForecastNormalized();
    // this.setState({

    // })
    fetch("http://localhost:4000/forecasts/mock", {mode:'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            forecast: result.data,
            error: false,
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
    } else {
      //TODO move this to a function
      const isWeekend = [];
      const dates = forecast.dates.map((d) => {
        const parsedDate = parse(d, 'YYYY-MM-DD');
        const dayOfWeek = format(parsedDate, 'ddd').toUpperCase();
        isWeekend.push(dayOfWeek === 'SUN' || dayOfWeek === 'SAT')
        return parsedDate;
      })

      //TODO return components only if all data is available
      return (
        <>
          <SearchableTableHook inputs={forecast} isWeekend={isWeekend} dates={dates} />
          <LocationDetails locationsByName={forecast.forecasts.byId} isWeekend={isWeekend} dates={dates} locations={forecast.locations.allIds} />
        </>
      )
    }
  }
}

export default App;
