import * as React from 'react';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

interface SelectDayProps {
  dateSelected: string | undefined;
  // handleChange: any;
  dates: string[];
}

export default function SelectDay(props: SelectDayProps) {
  const { dateSelected, dates } = props;
  let txt = dateSelected || '';
  const foundOne = dates.find((d) => d === txt);
  if (!foundOne) txt = '';

  return (
    <div>
      {/* <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id='demo-simple-select-helper-label'>Select a day</InputLabel>
        <Select
          labelId='demo-simple-select-helper-label'
          id='demo-simple-select-helper'
          value={txt}
          onChange={props.handleChange}
        >
          <MenuItem value=''>
            <em>Show all days</em>
          </MenuItem>
          {props.dates.map((d) => (<MenuItem key={d} value={d}>{d}</MenuItem>))}
        </Select>
      </FormControl> */}
    </div>
  );
}
