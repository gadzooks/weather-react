import Region from './Region.js';
import './SummaryTable.css';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {formatDate} from '../utils/date';
import { Table } from '@mui/material';

function matchedOne(needle, haystack) {
  const names = haystack.map((l) => {return l.name});
  return names.find((element) => element.match(needle));
}

function SummaryTable(props) {
  const inputs = props.inputs;
  const dates = inputs.dates;
  const regionIds = inputs.regions.allIds;
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Weather Alerts</TableCell>
            <TableCell>Location</TableCell>
            {dates.map((date) => {
              return <TableCell key={date}>{formatDate(date)}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        {regionIds.map((id) => {
          const region = inputs["regions"]["byId"][id];
          if (matchedOne(props.searchText, region.locations)) {
            return (
              <Region
                id={id}
                inputs={inputs}
                key={id}
                searchText={props.searchText}
              />
            );
          } else {
            return null;
          }
        })}
      </Table>
    </>
  );
}

export default SummaryTable;