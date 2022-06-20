import React from 'react';
import './App.css';
import WeatherPage from './weather/WeatherPage';

function App() {
  return (
    <WeatherPage isLoaded={false} error={null} forecast={null} />
  )

}

export default App;
