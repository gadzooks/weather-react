import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import WeatherPage from './components/weather/main_page/WeatherPage';

function Home() {
  return <h2>Home</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/forecasts/mock">Forecasts (fake)</Link>
            </li>
            <li>
              <Link to="/forecasts/real">Forecasts (real)</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecasts/:dataSource" element={<WeatherPage isLoaded={false} error={null} forecast={null} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
