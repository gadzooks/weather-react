import Region from './Region.js';
import './SummaryTable.scss';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {formatDate} from '../utils/date';
import { Table } from '@mui/material';
import { parse, format } from 'fecha';

function matchedOne(needle, haystack) {
  const names = haystack.map((l) => {return l.name});
  return names.find((element) => element.match(needle));
}

function SummaryTable(props) {
  const inputs = props.inputs;
  const isWeekend = [];
  const dates = inputs.dates.map((d) => {
    const parsedDate = parse(d, 'YYYY-MM-DD');
    const dayOfWeek = format(parsedDate, 'ddd').toUpperCase();
    isWeekend.push(dayOfWeek === 'SUN' || dayOfWeek === 'SAT')
    return parsedDate;
  })
  const regionIds = inputs.regions.allIds;
  return (
    <>
      <Table className='table table-sm weather-forecast-summary'>
        <TableHead className='table-heading'>
          <TableRow>
            <TableCell>Weather Alerts</TableCell>
            <TableCell>Location</TableCell>
            {dates.map((date) => {
              return <TableCell key={date}>{format(date, 'ddd MMM DD').toUpperCase()}</TableCell>;
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
                isWeekend={isWeekend}
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