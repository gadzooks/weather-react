import React from 'react';
import '../../../css/weather-icons.css';
import { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import iconClass from '../../../utils/icon';

function WeatherIcon(props: DailyForecastInterface) {
  let icon = 'wi';
  const forecast = props;

  if (forecast.icon) {
    icon = iconClass(forecast.icon, forecast.precip, forecast.cloudcover, forecast.tempmax);
  }

  return (
    <i className={icon} title={forecast.description} />
  );
}

export default WeatherIcon;
