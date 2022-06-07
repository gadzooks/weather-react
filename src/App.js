import { mockWeatherForecast, mockWeatherForecastNormalized } from './api/mockData';
import './App.css';
// import SearchableTable from './weather/SearchableTable';
import SearchableTableHook from './weather/SearchableTableHook';

function App() {
  return <SearchableTableHook inputs={mockWeatherForecastNormalized()} />;
}

export default App;
