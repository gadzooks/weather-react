import { render, screen } from '@testing-library/react';
import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

test('show loading when waiting for data', () => {
  render(<App />);
  const linkElement = screen.getByText('Forecast (mock)');
  expect(linkElement).toBeInTheDocument();
});

it('renders a snapshot', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
