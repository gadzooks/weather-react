import { LocationInterface } from './LocationInterface';
import { RegionInterface } from './RegionInterface';
import { DailyForecastInterface } from './DailyForecastInterface';

export interface RegionById {
    [key: string]: RegionInterface;
}

export interface RegionsById {
  byId: RegionById;
  allIds: string[];
}

export interface LocationById {
  [key: string]: LocationInterface;
}

export interface ForecastById {
  [key: string]: DailyForecastInterface[];
}

export interface ForecastsById {
  byId: ForecastById;
}

export interface LocationsById {
  byId: LocationById;
  allIds: string[];
}

export interface ForecastResponse {
  dates: string[];
  regions: RegionsById;
  locations: LocationsById;
  forecasts: ForecastsById;
}
export interface ForeacastDates {
  dates: string[];
  parsedDates: Date[];
  weekends: boolean[];
}

export const DefaultForecastDates: ForeacastDates = {
  dates: [],
  parsedDates: [],
  weekends: [],
};

export interface ForecastResponseStatus {
  isLoaded?: boolean;
  error: Error | null;
  forecast: ForecastResponse | null;
  forecastDates: ForeacastDates;
}

export const DefaultForecastResponseStatus: ForecastResponseStatus = {
  isLoaded: false,
  error: null,
  forecast: null,
  forecastDates: DefaultForecastDates,
};

// dates: [
//     "2021-04-17T07:00:00.000+00:00",
//     "2021-04-18T07:00:00.000+00:00",
//     "2021-04-19T07:00:00.000+00:00",
//     "2021-04-20T07:00:00.000+00:00",
// ],
// regions: {
//     byId: {
//     central_cascades: {
//         id: "central_cascades",
//         description: "Central Cascades",
//         regionId: "central_cascades",
//         locations: ["renton", "yakima"],
//     },
//     western_wa: {
//         id: "western_wa",
//         description: "Western WA",
//         regionId: "western_wa",
//         locations: ["seattle", "bellevue"],
//     },
//     },
//     allIds: ["central_cascades", "western_wa"],
// },
// locations: {
//     byId: {
//     renton: {
//         id: "renton",
//         description: "Renton",
//         regionId: "central_cascades",
//     },
//     yakima: {
//         id: "yakima",
//         description: "Yakima",
//         regionId: "central_cascades",
//     },
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
