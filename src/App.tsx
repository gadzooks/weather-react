import React from 'react';
import './App.css';
import { ForecastResponse } from './interfaces/ForecastResponseInterface';
import WeatherPage from './weather/WeatherPage';

interface AppState {
  isLoaded: boolean,
  error: Error|null,
  forecast: ForecastResponse|null,
}

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      forecast: null,
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
    console.log(forecast);
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (forecast != null) {
      return <WeatherPage {...forecast} />
    }
  }
}

export default App;
