import React from "react";
import "./reset.css";
import "./App.scss";
import SummaryTableLoader from "./components/weather/forecast_summary/SummaryTableLoader";

// eslint-disable-next-line import/prefer-default-export
export function App() {
  return <SummaryTableLoader />;
}

export default {
  title: "Controls/Nav/Sidebar",
};
