import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import './App.scss';
// eslint-disable-next-line import/no-named-as-default
import SummaryTableLoader from './components/weather/forecast_summary/SummaryTableLoader';
import './reset.css';

// eslint-disable-next-line import/prefer-default-export
export function App() {
  return (
    <SummaryTableLoader />
  );
}

export default {
  title: 'Controls/Nav/Sidebar',
};
