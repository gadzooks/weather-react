import { mockWeatherForecast } from './api/mockData';
import './App.css';
import SummaryTable from './weather/SummaryTable';

function App() {
  return (
    <SummaryTable name="SummaryTable" inputs={mockWeatherForecast()} />
  );
}

export default App;
