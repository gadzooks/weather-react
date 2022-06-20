import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('show loading when waiting for data', () => {
  render(<App />);
  const linkElement = screen.getByText(/Forecasts/i);
  expect(linkElement).toBeInTheDocument();
});
