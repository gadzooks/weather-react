/* eslint-disable react/destructuring-assignment */
import "./Region.scss";
import React from "react";
import { RegionInterface } from "../../../interfaces/RegionInterface";
import { ForecastsById } from "../../../interfaces/ForecastResponseInterface";
import Location from "./Location";
import WtaLink from "../location_details/WtaLink";
import { LocationInterface } from "../../../interfaces/LocationInterface";
import {
  DailyForecastFilter,
  forecastColSpan,
} from "../../../interfaces/DailyForecastFilter";
import AlertProps from "../../../interfaces/AlertProps";

export interface RegionProps {
  isWeekend: boolean[];
  region: RegionInterface;
  forecastsById: ForecastsById;
  locations: LocationInterface[];
  dailyForecastFilter: DailyForecastFilter;
  dateSelectedIsWithinForecastRange: boolean;
  setForecastDetailsForLocation: any;
  alertProps: AlertProps;
}

function Region(props: RegionProps) {
  const { region } = props;
  const { description } = region;
  const { search_key: searchKey } = region;
  const { locations } = props;
  const colSpan = forecastColSpan(
    props.dateSelectedIsWithinForecastRange,
    props.alertProps.foundAlerts
  );
  return (
    <tbody>
      <tr className="region-details">
        <td colSpan={colSpan} align="center">
          <WtaLink wtaRegion={searchKey} className="wta-link" />
          {description}
        </td>
      </tr>
      {locations.map((loc) => (
        <Location
          wtaRegionKey={region.search_key}
          location={loc}
          key={loc.name}
          atleastOneDateMatches={props.dateSelectedIsWithinForecastRange}
          alertIds={loc.alertIds}
          {...props}
        />
      ))}
    </tbody>
  );
}

export default Region;
