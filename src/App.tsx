import { Grommet } from 'grommet';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import App from './App';
import { Layout } from './components/Layout';
import WeatherPage from './components/weather/main_page/WeatherPage';

export default function App() {
  const theme = {
    global: {
      colors: {
        'light-2': '#f5f5f5',
        text: {
          light: 'rgba(0, 0, 0, 0.87)',
        },
      },
      edgeSize: {
        small: '14px',
      },
      elevation: {
        light: {},
      },
      font: {
        family: 'Roboto',
        size: '14px',
        height: '20px',
      },
    },
    button: {
      border: {
        width: '1px',
        radius: '4px',
      },
      padding: {
        vertical: '8px',
        horizontal: '16px',
      },
    },
  };

  return (
    <Grommet theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/forecasts/:dataSource' element={<WeatherPage />} />
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
    </Grommet>
  );
}
