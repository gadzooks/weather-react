import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import WeatherPage from './components/weather/main_page/WeatherPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route
            path='/forecasts/:dataSource'
            element={
              <WeatherPage isLoaded={false} error={null} forecast={null} />
            }
          />
          <Route
            path='*'
            element={(
              <main style={{ padding: '1rem' }}>
                <p>There&apos;s nothing here</p>
              </main>
            )}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
