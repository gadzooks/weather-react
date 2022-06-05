import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

function Location(props) {
  const location = props.location;
  console.log(location);
  const data = location?.daily?.data || {}
  console.log(data);
  return (
    <TableRow>
      <TableCell>{props.location.name}</TableCell>
      {Object.entries(data).map(([key, value]) => {
          console.log(value);
          return <TableCell>{value.icon}</TableCell>
      })}
    </TableRow>
  );
}

export default Location;