import { TableBody } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Location from './Location.js'
function Region(props) {
    const regionId = props.id;
    const inputs = props.inputs;
    const region = inputs['regions']['byId'][regionId];
    const colSpan = "9";
    const locationIds = region.locations;
    return (
      <>
        <TableBody>
          <TableRow bgcolor="#eedf6a3d">
            <TableCell colSpan={colSpan} align="center">
              {region.description}
            </TableCell>
          </TableRow>
          {locationIds.map((id) => {
            if (id.match(props.searchText)) {
              return <Location id={id} key={id} inputs={inputs} />;
            } else {
              return null;
            }
          })}
        </TableBody>
      </>
    );

}

export default Region;