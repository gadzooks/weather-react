import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import '../css/weather-icons.css'

function Location(props) {
  const location = props.location;
  const data = location?.daily?.data || []
  return (
    <TableRow>
      <TableCell>N/A</TableCell>
      <TableCell>{location.description}</TableCell>
      {data.map((d, index) => {
          const icon = d.icon ? `wi wi-${d.icon}` : `wi`
          return <TableCell key={index}><i className={icon}></i></TableCell>
      })}
    </TableRow>
  );
}

export default Location;