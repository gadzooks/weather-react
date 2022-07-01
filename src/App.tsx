/* eslint-disable react/prop-types */
import React from 'react';
import './App.css';
import { Grommet } from 'grommet';
import { Outlet } from 'react-router-dom';
import { OnHeader } from './components/layout/Navigation';
// import WeatherPage from './components/weather/main_page/WeatherPage';

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
        light: {
        },
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
    <>
      <Grommet theme={theme}>
        <OnHeader />
      </Grommet>
      <Outlet />
    </>
  );
}
