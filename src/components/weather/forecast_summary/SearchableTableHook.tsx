import SummaryTable from './SummaryTable';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { ForecastResponse, ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import { parse } from 'fecha';
import LocationDetails from '../location_details/LocationDetails';
import { isWeekend } from '../WeatherPage';

function SearchableTableHook(props: ForecastResponse) {
  const [searchText, setSearchText] = useState("");
  const parsedDates = props.dates.map((d) => parse(d, 'YYYY-MM-DD'));
  const weekends = isWeekend(parsedDates);
  const args = {
    ...props,
    isWeekend: weekends,
    parsedDates: parsedDates,
  };
  return (
    <>
      <TextField
        id="outlined-basic"
        label="Search Locations"
        variant="outlined"
        autoFocus={true}
        onChange={e => setSearchText(e.target.value)}
      />
      <SummaryTable searchText={searchText} {...args} />

      <LocationDetails searchText={searchText} regionById={props.regions.byId} locationsById={props.locations} forecastsByName={props.forecasts.byId} isWeekend={weekends} dates={parsedDates} />
    </>
  );
}

export default SearchableTableHook;