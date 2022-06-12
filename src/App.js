import React from 'react';
import { mockWeatherForecast, mockWeatherForecastNormalized } from './api/mockData';
import './App.css';
// import SearchableTable from './weather/SearchableTable';
import SearchableTableHook from './weather/SearchableTableHook';

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
          console.log("================");
          console.log(result);
          console.log("================");
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
      return <SearchableTableHook inputs={forecast} />;
    }
  }
}

export default App;
