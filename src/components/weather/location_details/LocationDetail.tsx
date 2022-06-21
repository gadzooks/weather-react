import { Link, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { format } from 'fecha';
import WeatherIcon from "../WeatherIcon";
import '../../../css/weather-icons.css'
import './LocationDetail.scss'
import { convertToSentence } from "../../../utils/string";
import React from "react";
import DailyForecastInterface from "../../../interfaces/DailyForecastInterface";
import { LocationInterface } from "../../../interfaces/LocationInterface";
import { RegionInterface } from "../../../interfaces/RegionInterface";
import WtaLink from "./WtaLink";

interface LocationDetailProps {
    region: RegionInterface;
    location: LocationInterface;
    forecast: DailyForecastInterface[];
    dates: (Date|null)[];
    isWeekend: boolean[];
}

function LocationDetail(props: LocationDetailProps) {
    const region = props.region;
    const location = props.location;
    const description = location.description;
    const forecast = props.forecast;
    const dates = props.dates;
    const isWeekend = props.isWeekend;
    return (
        <>
            <div id={location.name}>
            <Table className='location-details'>
                <TableHead>
                    <TableRow className="heading">
                        <TableCell colSpan={8} className="heading">
                            {description.toUpperCase() + '  '}
                            <WtaLink wtaRegion={region.search_key} wtaSubRegion={location.sub_region} />
                            <Link href="#top">(top)</Link>
                        </TableCell>
                    </TableRow>
                    <TableRow className="secondary-heading">
                        <TableCell colSpan={2} className="center border-right">DATE</TableCell>
                        <TableCell colSpan={2} className="center border-right">DETAILS</TableCell>
                        <TableCell className="border-right">HI / LOW</TableCell>
                        <TableCell colSpan={2} className="center border-right">PRECIP</TableCell>
                        <TableCell>CLOUD COV</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {forecast.map((row, id) => {
                        const d = dates[id];
                        const weekendClassName = isWeekend[id] ? ' weekend ' : ' ';
                        // console.log([row, id]);
                        if(d) {
                            return <TableRow className={weekendClassName} key={id}>
                                <TableCell >{format(d, 'ddd').toUpperCase()}</TableCell>
                                <TableCell className="border-right">{format(d, 'MMM Do').toUpperCase()}</TableCell>
                                <TableCell>
                                    <WeatherIcon {...row} key={id} />
                                </TableCell>
                                <TableCell className="border-right">{convertToSentence(row.icon)}</TableCell>
                                <TableCell className="border-right">{Math.round(row.tempmax) + '° / ' + Math.round(row.tempmin) + '°'}</TableCell>
                                <TableCell className="align-right">{Math.round(row.precipprob) + '%'}</TableCell>
                                <TableCell className="align-right border-right">{Math.round(row.precip) + '"'}</TableCell>
                                <TableCell className="align-right">{row.cloudcover + '%       '}</TableCell>
                            </TableRow>
                        }
                    })}
                </TableBody>
            </Table>
            </div>
        </>
    );
}

export default LocationDetail;

// forecasts: {
//     byId: {
//       renton: [
//         {
//           time: "2021-04-17T07:00:00.000+00:00",
//           summary: "Clear conditions throughout the day.",
//           icon: "day-hail",
//           precipProbability: 0.0,
//           temperature: 60.9,
//           apparentTemperature: 60.9,
//           dewPoint: 40.1,
//           visibility: 120,
//           cloudCover: 1,
//           temperatureHigh: 74.9,
//           temperatureLow: 47.3,
//           sunsetTime: 1618714951,
//           sunriseTime: 1618665359,
//           precipAmount: 0.0,
//         },