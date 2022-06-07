import SummaryTable from './SummaryTable';
import { TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';

function SearchableTableHook(props) {
  const [searchText, setSearchText] = useState("");
  const [inputs, setInputs] = useState(props.inputs);
  return (
    <>
      <TextField
        id="outlined-basic"
        label="Search Locations With Hook"
        variant="outlined"
        padding="5px"
        autoFocus={true}
        onChange={e => setSearchText(e.target.value)}
      />
      <SummaryTable
        name="SummaryTable"
        inputs={inputs}
        searchText={searchText}
      />
    </>
  );
}

export default SearchableTableHook;