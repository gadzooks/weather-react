import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Location.scss'
import WeatherIcon from '../WeatherIcon';

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
        const weekendClassName = isWeekend[index] ? ' weekend ' : ' ';
        return <TableCell key={index} className={`weather-cell center ${weekendClassName}`}>
          <WeatherIcon d={d} index={index} />
        </TableCell>
      })}
    </TableRow>
  );
}

export default Location;