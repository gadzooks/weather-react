import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import '../css/weather-icons.css'
import {icon_class} from '../utils/icon';

function Location(props) {
  const locationId = props.id;
  const location = props.inputs['locations']['byId'][locationId];
  const forecasts = props.inputs["forecasts"]["byId"][locationId] || [];
  return (
    <TableRow className='weather-cell'>
      <TableCell className='weather-cell'>N/A</TableCell>
      <TableCell className='weather-cell'>{location.description}</TableCell>
      {forecasts.map((d, index) => {
          let icon = 'wi';
          if(d.icon) {
            icon = icon_class(d.icon, d.precipAmount, d.cloudCover, d.maxtemp)
          }
          return <TableCell key={index} className='weather-cell center'><i className={icon}></i></TableCell>
      })}
    </TableRow>
  );
}

export default Location;