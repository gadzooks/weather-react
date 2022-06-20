import React from "react";
import DailyForecastInterface from "../../interfaces/DailyForecastInterface";
import { LocationsById } from "../../interfaces/ForecastResponseInterface";
import LocationDetail from "./LocationDetail";

interface LocationDetailsProps {

    locationsById: LocationsById;
    isWeekend: boolean[];
    forecastsByName: {[indexer :string]: DailyForecastInterface[]};
    dates: (Date|null)[];
}

function LocationDetails(props: LocationDetailsProps) {
    const locationsByName = props.forecastsByName;
    const locationsById = props.locationsById;

    return (
        <>
            {
                locationsById.allIds.map(key => {
                    const value = locationsByName[key];
                    const location = locationsById.byId[key];
                    return <LocationDetail key={location.name} forecast={value} location={location} isWeekend={props.isWeekend} dates={props.dates} />
                })
            }
        </>
    )
}

export default LocationDetails;

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