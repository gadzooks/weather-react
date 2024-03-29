/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import Counter from './features/counter/Counter';
import { store } from './app/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // loader: rootLoader,
    children: [
      {
        path: 'team',
        element: <Counter />,
        // loader: teamLoader,
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
