import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import '../css/weather-icons.css'
import {icon_class} from '../utils/icon';
import './Location.scss'

function Location(props) {
  const locationId = props.id;
  const isWeekend = props.isWeekend;
  const location = props.inputs['locations']['byId'][locationId];
  const forecasts = props.inputs["forecasts"]["byId"][locationId] || [];
  return (
    <TableRow className='weather-cell'>
      <TableCell className='weather-cell'>N/A</TableCell>
      <TableCell className='weather-cell'>{location.description}</TableCell>
      {forecasts.map((d, index) => {
        let icon = 'wi';
        if (d.icon) {
          // console.log(d);
          icon = icon_class(d.icon, d.precip, d.cloudcover, d.tempmax)
        }
        let weekendClassName = '';
        if (isWeekend[index]) {
          weekendClassName = ' weekend ';
        }
        return <TableCell key={index} className={`weather-cell center ${weekendClassName}`}><i className={icon} title={d.description}></i></TableCell>
      })}
    </TableRow>
  );
}

export default Location;