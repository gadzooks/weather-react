/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

interface SelectDayProps {
  dateSelected: string|undefined;
  // handleChange: any;
  dates: string[];
}

export default function SelectDay(props: SelectDayProps) {
  let txt = props.dateSelected || '';
  const foundOne = props.dates.find((d) => d === txt);
  if (!foundOne) txt = '';

  return (
    <div>
      {/* <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id='demo-simple-select-helper-label'>Select a day</InputLabel>
        <Select
          labelId='demo-simple-select-helper-label'
          id='demo-simple-select-helper'
          value={txt}
          // eslint-disable-next-line react/destructuring-assignment
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
