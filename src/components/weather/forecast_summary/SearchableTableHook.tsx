import SummaryTable from './SummaryTable';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { ForecastResponse, ForecastsById } from '../../../interfaces/ForecastResponseInterface';
import { parse } from 'fecha';
import LocationDetails from '../location_details/LocationDetails';
import { isWeekend } from '../WeatherPage';
import { useLocalStorage } from '../../../utils/localstorage';

function SearchableTableHook(props: ForecastResponse) {
  const [searchText, setSearchText] = useLocalStorage("searchKeyText", "")
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
        defaultValue={searchText}
        error={false}
        helperText="No matching locations"
      />
      <SummaryTable searchText={searchText} {...args} />

      <LocationDetails searchText={searchText} regionById={props.regions.byId} locationsById={props.locations} forecastsByName={props.forecasts.byId} isWeekend={weekends} dates={parsedDates} />
    </>
  );
}

export default SearchableTableHook;