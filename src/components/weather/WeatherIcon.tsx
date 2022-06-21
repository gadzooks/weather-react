import React from 'react';
import '../../css/weather-icons.css'
import DailyForecastInterface from '../../interfaces/DailyForecastInterface';
import {icon_class} from '../../utils/icon';

export function WeatherIcon(props: DailyForecastInterface) {
    let icon = 'wi';
    const forecast = props;

    if (forecast.icon) {
        // console.log(d);
        icon = icon_class(forecast.icon, forecast.precip, forecast.cloudcover, forecast.tempmax)
    }

    return (
        <i className={icon} title={forecast.description}></i>
    )
}

export default WeatherIcon;