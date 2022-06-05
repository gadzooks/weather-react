import Region from './Region.js';
import './SummaryTable.css';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {formatDate} from '../utils/date';
import { Table } from '@mui/material';

function SummaryTable(props) {
  const inputs = props.inputs;
  const dates = inputs.dates;
  const regions = inputs.regionalForecast;
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
        {regions.map((r) => {
          return <Region region={r} key={r.name} />;
        })}
      </Table>
    </>
  );
}

export default SummaryTable;