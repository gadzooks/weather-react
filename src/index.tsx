// index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import SummaryTableLoader from './components/weather/forecast_summary/SummaryTableLoader';
import LocationDetailWrapper from './components/weather/location_details/LocationDetailWrapper';
import HourlyForecastPage from './components/weather/hourly_page/HourlyForecastPage';
import { store } from './app/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <SummaryTableLoader />,
      },
      {
        path: 'location/:locationSlug',
        element: <LocationDetailWrapper />,
      },
      {
        path: 'location/:locationSlug/:date/hourly',
        element: <HourlyForecastPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
