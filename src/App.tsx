import React from 'react';
import './App.css';
import WeatherPage from './components/weather/WeatherPage';
import {
  BrowserRouter,
  Routes,
  Route,
  Link} from "react-router-dom";

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
              <Link to="/forecasts/:dataSource">Forecasts</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/forecasts/:dataSource" element={<WeatherPage isLoaded={false} error={null} forecast={null}/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}