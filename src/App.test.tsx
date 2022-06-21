import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';

test('show loading when waiting for data', () => {
  render(<App />);
  const linkElement = screen.getByText(/Forecasts/i);
  expect(linkElement).toBeInTheDocument();
});

it('renders a snapshot', () => {
  const tree = renderer.create(<App/>).toJSON();
  expect(tree).toMatchSnapshot();
});