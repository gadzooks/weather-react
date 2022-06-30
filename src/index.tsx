import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import ons from 'onsenui';
import reportWebVitals from './reportWebVitals';
import MyApp from './MyApp';
// import 'onsenui/css/onsen-css-components.css';

ons.ready(() => {
  const root = ReactDOM.createRoot(document.getElementById('root') as Element);
  root.render(
    <React.StrictMode>
      <MyApp />
    </React.StrictMode>,
  );
});

// const root = ReactDOM.createRoot(document.getElementById('root') as Element);
// root.render(
//   <React.StrictMode>
//     <MyApp />
//   </React.StrictMode>,
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
