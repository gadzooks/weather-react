import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { format } from 'fecha';
import WeatherIcon from "../WeatherIcon";
import '../../css/weather-icons.css'
import {icon_class} from '../../utils/icon';

function LocationDetail(props) {
    const name = props.name;
    const forecast = props.forecast;
    const dates = props.dates;
    const isWeekend = props.isWeekend;
    console.log(name);
    return (
        <>
            <Table>
                <TableHead className='location-details'>
                    <TableRow>
                        <TableCell colSpan={8} align="center">
                            {name.toUpperCase()}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>DATE</TableCell>
                        <TableCell colSpan={2}>DETAILS</TableCell>
                        <TableCell>HI / LOW</TableCell>
                        <TableCell colSpan={2}>PRECIP</TableCell>
                        <TableCell>CLOUD COVER</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {forecast.map((row, id) => {
                        const d = dates[id];
                        const weekendClassName = isWeekend[id] ? ' weekend ' : ' ';
                        console.log([row, id]);
                        return <TableRow className={weekendClassName}>
                            <TableCell key={id}>{format(d, 'ddd').toUpperCase()}</TableCell>
                            <TableCell key={id}>{format(d, 'MMM Do').toUpperCase()}</TableCell>
                            <TableCell key={id} className={`weather-cell center`}>
                                <WeatherIcon d={d} index={id} />
                            </TableCell>
                            <TableCell key={id}>{d.icon}</TableCell>
                            <TableCell key={id}>{d.tempmax + '° / ' + d.tempmin + '°'}</TableCell>
                            <TableCell key={id}>{d.precipprob + '%'}</TableCell>
                            <TableCell key={id}>{d.precip + '"'}</TableCell>
                            <TableCell key={id}>{d.cloudcover + '%'}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </>
    );
}

export default LocationDetail;