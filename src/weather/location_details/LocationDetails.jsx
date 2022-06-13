import LocationDetail from "./LocationDetail";

function LocationDetails(props) {
    const locationsByName = props.locationsByName;
    const locations = props.locations;

    return (
        <>
            {
                locations.map(key => {
                    const value = locationsByName[key];
                    return <LocationDetail key={key} forecast={value} name={key} isWeekend={props.isWeekend} dates={props.dates} />
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