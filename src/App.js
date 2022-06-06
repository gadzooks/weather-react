import { mockWeatherForecast, mockWeatherForecastNormalized } from './api/mockData';
import './App.css';
import SearchableTable from './weather/SearchableTable';

function App() {
  return <SearchableTable inputs={mockWeatherForecastNormalized()} />;
}

export default App;
