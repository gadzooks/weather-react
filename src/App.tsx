/* eslint-disable react/prop-types */
import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
// import { OnHeader } from './components/layout/Navigation';
import { AppGrid } from './components/Layout';

export default function App() {
  return (
    <>
      {/* <OnHeader /> */}
      <AppGrid />
      <Outlet />
    </>
  );
}
