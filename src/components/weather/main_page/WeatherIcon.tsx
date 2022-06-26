import React from 'react';
import '../../../css/weather-icons.css';
import DailyForecastInterface from '../../../interfaces/DailyForecastInterface.js';
import iconClass from '../../../utils/icon';

export function WeatherIcon(props: DailyForecastInterface) {
  let icon = 'wi';
  const forecast = props;

  if (forecast.icon) {
    // console.log(d);
    icon = iconClass(forecast.icon, forecast.precip, forecast.cloudcover, forecast.tempmax);
  }

  return (
    <i className={icon} title={forecast.description} />
  );
}

export default WeatherIcon;
