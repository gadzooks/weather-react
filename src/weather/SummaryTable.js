import Region from './Region.js';
import './SummaryTable.css';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {formatDate} from '../utils/date'

function SummaryTable(props) {
  const inputs = props.inputs || {
    regionalForecast: [
      {
        name: "central_cascades",
        description: "Central Cascades",

        locations: [
          {
            name: "renton",
            description: "Renton",
            region: "central_cascades",
            daily: {
              type: "daily",
              summary:
                "Cooling down with a chance of rain Thursday, Friday \u0026 Saturday.",
              icon: null,
              data: [
                {
                  time: "2021-04-17T07:00:00.000+00:00",
                  summary: "Clear conditions throughout the day.",
                  icon: "day-hail",
                  precipProbability: 0.0,
                  temperature: 60.9,
                  apparentTemperature: 60.9,
                  dewPoint: 40.1,
                  visibility: 120,
                  cloudCover: 1,
                  temperatureHigh: 74.9,
                  temperatureLow: 47.3,
                  sunsetTime: 1618714951,
                  sunriseTime: 1618665359,
                  precipAmount: 0.0,
                },
                {
                  time: "2021-04-18T07:00:00.000+00:00",
                  summary: "Clear conditions throughout the day.",
                  icon: "day-haze",
                  precipProbability: 0.0,
                  temperature: 62.1,
                  apparentTemperature: 62.1,
                  dewPoint: 41.4,
                  visibility: 150,
                  cloudCover: 14,
                  temperatureHigh: 72.9,
                  temperatureLow: 52.1,
                  sunsetTime: 1618801436,
                  sunriseTime: 1618751647,
                  precipAmount: 0.0,
                },
                {
                  time: "2021-04-19T07:00:00.000+00:00",
                  summary: "Clear conditions throughout the day.",
                  icon: "day-storm-showers",
                  precipProbability: 0.0,
                  temperature: 60.4,
                  apparentTemperature: 60.4,
                  dewPoint: 39.9,
                  visibility: 150,
                  cloudCover: 18,
                  temperatureHigh: 70.1,
                  temperatureLow: 52.1,
                  sunsetTime: 1618887921,
                  sunriseTime: 1618837937,
                  precipAmount: 0.0,
                },
                {
                  time: "2021-04-20T07:00:00.000+00:00",
                  summary: "Partly cloudy throughout the day.",
                  icon: "hot",
                  precipProbability: 19.0,
                  temperature: 58.1,
                  apparentTemperature: 58.1,
                  dewPoint: 44.4,
                  visibility: 140,
                  cloudCover: 33,
                  temperatureHigh: 65.9,
                  temperatureLow: 51.0,
                  sunsetTime: 1618974405,
                  sunriseTime: 1618924228,
                  precipAmount: 0.0,
                },
              ],
            },
          },
          {
            name: "yakima",
            description: "Yakima",
            region: "central_cascades",
          },
        ],
      },
      {
        name: "central_wa",
        description: "Central Washington",
        locations: [
          {
            name: "seattle",
            description: "Seattle City",
            region: "central_wa",
          },
          {
            name: "bellevue",
            description: "Bellevue City",
            region: "central_wa",
          },
        ],
      },
    ],

    dates: [
      "2021-04-17T07:00:00.000+00:00",
      "2021-04-18T07:00:00.000+00:00",
      "2021-04-19T07:00:00.000+00:00",
      "2021-04-20T07:00:00.000+00:00",
    ],
  };

  const dates = inputs.dates || ["SAT JUN 04", "SUN JUN 05", "MON JUN 06"];
  const regions = inputs.regionalForecast;
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell>Weather Alerts</TableCell>
          <TableCell>Location</TableCell>
          {dates.map((date) => {
            return <TableCell>{formatDate(date)}</TableCell>;
          })}
        </TableRow>
      </TableHead>
      {regions.map((r) => {
        return <Region region={r} key={r.name} />;
      })}
    </>
  );
}

export default SummaryTable;