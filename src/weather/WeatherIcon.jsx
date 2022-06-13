import '../css/weather-icons.css'
import {icon_class} from '../utils/icon';

export function WeatherIcon(props) {
    const d = props.d;
    const index = props.index;
    let icon = 'wi';

    if (d.icon) {
        // console.log(d);
        icon = icon_class(d.icon, d.precip, d.cloudcover, d.tempmax)
    }

    return (
        <i className={icon} title={d.description}></i>
    )
}

export default WeatherIcon;