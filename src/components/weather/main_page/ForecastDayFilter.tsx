/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface SelectDayProps {
  dateSelected: string|undefined;
  handleChange: any;
  dates: string[];
}

export default function SelectDay(props: SelectDayProps) {
  const txt = props.dateSelected || '';

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Day</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={txt}
          label="Age"
          // eslint-disable-next-line react/destructuring-assignment
          onChange={props.handleChange}
        >
          <MenuItem value="">
            <em>Select a day</em>
          </MenuItem>
          {props.dates.map((d) => (<MenuItem key={d} value={d}>{d}</MenuItem>))}
        </Select>
        <FormHelperText>Select a day for further filtering</FormHelperText>
      </FormControl>
    </div>
  );
}
