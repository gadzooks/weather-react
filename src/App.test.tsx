import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('show loading when waiting for data', () => {
  render(<App isLoaded={false} error={null} forecast={null} />);
  const linkElement = screen.getByText(/loading/i);
  expect(linkElement).toBeInTheDocument();
});
