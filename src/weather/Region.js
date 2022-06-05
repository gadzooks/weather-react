import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Location from './Location.js'
function Region(props) {
    const region = props.region;
    const colspan = region.colspan || "9";
    const locations = region.locations;
    return (
      <>
        <TableRow bgcolor="#eedf6a3d" >
          <TableCell colspan={colspan} align="center">
            {region.description};
          </TableCell>
        </TableRow>
        {locations.map((l) => {
            return <Location location={l} key={l.name} />
        })}
      </>
    );

}

export default Region;