/* eslint-disable no-unused-vars */
import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { Navigator } from 'react-onsenui';
import WeatherPage from './components/weather/main_page/WeatherPage';

function Home() {
  return <h2>Home</h2>;
}

export default function App() {
  return (
    <>
      {/* <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/forecasts/mock'>Forecasts (fake)</Link>
              </li>
              <li>
                <Link to='/forecasts/real'>Forecasts (real)</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/forecasts/:dataSource'
              element={
                <WeatherPage isLoaded={false} error={null} forecast={null} />
              }
            />
          </Routes>
        </div>
      </BrowserRouter> */}
      <Navigator
        renderPage={(route, navigator) => (
          <WeatherPage isLoaded={false} error={null} forecast={null} />
        )}
        initialRoute={{
          title: 'First Page',
        }}
      />
    </>
  );
}
