import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import '../css/weather-icons.css'

function Location(props) {
  const location = props.location;
  const data = location?.daily?.data || []
  return (
    <TableRow>
      <TableCell>N/A</TableCell>
      <TableCell>{props.location.name}</TableCell>
      {data.map((d) => {
          const icon = d.icon ? `wi wi-${d.icon}` : `wi`
          return <TableCell><i class={icon}></i></TableCell>
      })}
    </TableRow>
  );
}

export default Location;