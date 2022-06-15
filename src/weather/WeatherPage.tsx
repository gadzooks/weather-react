import { parse, format } from "fecha";
import React from "react";
import { ForecastResponse } from "../interfaces/ForecastResponseInterface";
import SearchableTableHook from "./forecast_summary/SearchableTableHook";
import LocationDetails from "./location_details/LocationDetails";

function isWeekend(dates: (Date|null)[]) :Boolean[] {
    const weekends: Boolean[] = [];
    if(!dates) {
        return weekends;
    }

    dates.map((d) => {
        if (d) {
            const dayOfWeek = format(d, 'ddd').toUpperCase();
            weekends.push(dayOfWeek === 'SUN' || dayOfWeek === 'SAT')
        } else {
            weekends.push(false);
        }
    })

    return weekends; 
}

function WeatherPage(props: ForecastResponse) {
      const parsedDates = props.dates.map((d) => parse(d, 'YYYY-MM-DD'));
      const weekends = isWeekend(parsedDates);
      const args = {
        ...props,
        weekends,
        parsedDates,
      };

      return (
        <>
          <SearchableTableHook isWeekend={weekends} {...args}/>
          <LocationDetails forecastsByName={props.forecasts.byId} isWeekend={weekends} locations={props.locations.allIds} dates={parsedDates} />
        </>
      )

}

export default WeatherPage;