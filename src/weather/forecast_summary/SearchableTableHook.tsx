import SummaryTable from './SummaryTable';
import { TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { ForecastResponse, ForecastsById } from '../../interfaces/ForecastResponseInterface';

export interface SearchableTableHookProps extends ForecastResponse{
  parsedDates: (Date|null)[],
  isWeekend: Boolean[],
  forecasts: ForecastsById,
}

function SearchableTableHook(props: SearchableTableHookProps) {
  const [searchText, setSearchText] = useState("");
  const [inputs, setInputs] = useState(props.forecasts);
  return (
    <>
      <TextField
        id="outlined-basic"
        label="Search Locations With Hook"
        variant="outlined"
        autoFocus={true}
        onChange={e => setSearchText(e.target.value)}
      />
      <SummaryTable
      searchText={searchText} {...props} />
    </>
  );
}

export default SearchableTableHook;