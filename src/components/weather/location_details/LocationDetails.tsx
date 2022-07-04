/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import LocationDetail from './LocationDetail';

interface LocationDetailsProps {
  isWeekend: boolean[];
  forecastsByName: {[indexer :string]: DailyForecastInterface[]};
  dates: (Date|null)[];
  matchedAreas: MatchedAreas;
}

function LocationDetails(props: LocationDetailsProps) {
  const regions = props.matchedAreas.regions || [];
  const locationsByRegion = props.matchedAreas.locationsByRegion || {};
  const forecastsByLocation = props.forecastsByName;
  return (
    <>
      {
        regions.map((region: RegionInterface) => (
          locationsByRegion[region.name].map((location: LocationInterface) => {
            const forecast = forecastsByLocation[location.name];
            return (
              <LocationDetail
                key={location.name}
                region={region}
                forecast={forecast}
                location={location}
                isWeekend={props.isWeekend}
                dates={props.dates}
              />
            );
          })
        ))
        }
    </>
  );
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
