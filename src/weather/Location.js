import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import '../css/weather-icons.css'

function Location(props) {
  // debugger;
  const locationId = props.id;
  const location = props.inputs['locations']['byId'][locationId];
  const forecasts = props.inputs["forecasts"]["byId"][locationId] || [];
  return (
    <TableRow>
      <TableCell>N/A</TableCell>
      <TableCell>{location.description}</TableCell>
      {forecasts.map((d, index) => {
          const icon = d.icon ? `wi wi-${d.icon}` : `wi`
          return <TableCell key={index}><i className={icon}></i></TableCell>
      })}
    </TableRow>
  );
}

export default Location;