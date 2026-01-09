import type { LocationInterface } from './LocationInterface';
import type { RegionInterface } from './RegionInterface';
import type { DailyForecastInterface } from './DailyForecastInterface';
import type { AlertInterface } from './AlertInterface';

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

export interface AlertsById {
  [key: string]: AlertInterface;
}

export interface ForecastResponse {
  dates: string[];
  regions: RegionsById;
  locations: LocationsById;
  forecasts: ForecastsById;
  alertsById: AlertsById;
  allAlertIds: string[];
}

export interface ForecastDates {
  dates: string[];
  parsedDates: (Date | null)[];
  weekends: boolean[];
}

export const DefaultForecastDates: ForecastDates = {
  dates: [],
  parsedDates: [],
  weekends: [],
};

export interface ForecastResponseStatus {
  isLoaded?: boolean;
  error: Error | null;
  forecast: ForecastResponse | null;
}

export const DefaultForecastResponseStatus: ForecastResponseStatus = {
  isLoaded: false,
  error: null,
  forecast: null,
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
// "alertsById": {
//   "NOAA-NWS-ALERTS-WA12619ABA37B4.AvalancheWarning.12619AC97A58WA.PDTSABPDT.f41d1bf5e5099be84383a979175e608e": {
//     "event": "Avalanche Warning",
//     "headline": "Avalanche Warning issued April 16 at 7:29PM PDT  by NWS Pendleton",
//     "description": "...THE NORTHWEST AVALANCHE CENTER HAS ISSUED A SPECIAL AVALANCHE\nBULLETIN...\n* WHAT..UNIQUELY DANGEROUS AVALANCHE CONDITIONS ARE EXPECTED DUE TO\nPROLONGED HOT AND SUNNY WEATHER. LARGE AND DESTRUCTIVE WET\nAVALANCHES COULD OCCUR.\n* WHERE...THE OLYMPIC MOUNTAINS AND WASHINGTON CASCADES FROM THE\nCOLUMBIA RIVER TO THE CANADIAN BORDER.\n* WHEN...IN EFFECT FROM FRI 18:30 PST TO MON 18:30 PST.\n* IMPACTS...MULTIPLE DAYS OF ABOVE FREEZING TEMPERATURES AND\nCONTINUED FORECASTED HOT AND SUNNY WEATHER MAY PRODUCE A NATURAL\nSPRING AVALANCHE CYCLE. THIS COULD INCLUDE WET, HEAVY, AND\nPOTENTIALLY DESTRUCTIVE SLIDES THAT CROSS COMMON ROUTES.\nADDITIONALLY, TRAVELERS MAY EASILY TRIGGER AVALANCHES ON ANY STEEP\nOPEN SLOPES.\n* PRECAUTIONARY/PREPAREDNESS ACTIONS...PAY ATTENTION TO THE SLOPES\nABOVE YOU. LIMIT ANY TIME YOU SPEND NEAR AND UNDERNEATH STEEP AND\nHANGING SNOW, ESPECIALLY DURING THE HEAT OF THE DAY.\nCONSULT WWW.NWAC.US OR WWW.AVALANCHE.ORG FOR FURTHER INFORMATION.\nSIMILAR AVALANCHE DANGER MAY EXIST AT LOCATIONS OUTSIDE THE COVERAGE\nAREA OF THIS OR ANY AVALANCHE CENTER.",
//     "ends": "2021-04-17T19:30:00",
//     "endsEpoch": 1618713000,
//     "id": "NOAA-NWS-ALERTS-WA12619ABA37B4.AvalancheWarning.12619AC97A58WA.PDTSABPDT.f41d1bf5e5099be84383a979175e608e",
//     "language": "en",
//     "link": "https://alerts.weather.gov/cap/wwacapget.php?x=NOAA-NWS-ALERTS-WA12619ABA37B4.AvalancheWarning.12619AC97A58WA.PDTSABPDT.f41d1bf5e5099be84383a979175e608e"
//   },
