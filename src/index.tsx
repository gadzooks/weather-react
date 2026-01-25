// index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import SummaryTableLoader from './components/weather/forecast_summary/SummaryTableLoader';
import DateDetail from './components/weather/forecast_summary/DateDetail';
import LocationDetailWrapper from './components/weather/location_details/LocationDetailWrapper';
import HourlyForecastPage from './components/weather/hourly_page/HourlyForecastPage';
import { store } from './app/store';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

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
        path: ':date',
        element: <DateDetail />,
      },
      {
        path: 'location/:locationSlug',
        element: <LocationDetailWrapper />,
      },
      {
        path: 'location/:locationSlug/:date',
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

// Register service worker for offline support
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('[App] Service Worker registered successfully - app is ready for offline use');
  },
  onUpdate: () => {
    console.log('[App] New version available - please refresh to update');
  },
});
