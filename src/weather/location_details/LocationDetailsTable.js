import { TableBody } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Region.scss';

function LocationDetailsTable(props) {
    const regionId = props.id;
    const inputs = props.inputs;
    const region = inputs['regions']['byId'][regionId];
    const colSpan = "8";
    const locationIds = region.locations.map((l) => {return l.name; });
    return (
      <>
        <TableBody>
          <TableRow className='location-details'>
            <TableCell colSpan={colSpan} align="center">
              {region.description}
            </TableCell>
          </TableRow>
          {locationIds.map((id) => {
            if (id.match(props.searchText)) {
              return <Location id={id} key={id} inputs={inputs} isWeekend={props.isWeekend} />;
            } else {
              return null;
            }
          })}
        </TableBody>
      </>
    );

}

export default LocationDetailsTable;