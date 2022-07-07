/* eslint-disable react/destructuring-assignment */
import {
  TextField,
} from '@mui/material';
import {
  Box,
} from 'grommet';

import React from 'react';
import { DailyForecastFilter } from '../interfaces/DailyForecastFilter';
import SelectDay from './weather/main_page/SelectDayDropDown';
import MinimumDistanceSlider from './weather/main_page/TemperatureSlider';

export interface ForecastHeaderProps {
  isLoaded: boolean;
  searchText: string;
  handleChangeForLocationName: any;
  totalMatchedRegions: number;
  handleChangeForDay: any;
  dates: string[];
  dailyForecastFilter: DailyForecastFilter;
  setDailyForecastFilter: any;
}

function ForecastHeader(props: ForecastHeaderProps) {
  const { isLoaded } = props;
  const { searchText } = props;
  const { handleChangeForLocationName } = props;
  const { totalMatchedRegions } = props;
  const { handleChangeForDay } = props;
  const { dates } = props;
  const { dailyForecastFilter } = props;
  const { setDailyForecastFilter } = props;
  const { date } = dailyForecastFilter;

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Box direction='column' background='#ffedd6' margin='10px'>
        <Box width='medium' margin='8px'>
          <TextField
            id='outlined-basic'
            label='Search Locations'
            variant='outlined'
            autoFocus
            onChange={(e) => handleChangeForLocationName(e.target.value)}
            defaultValue={searchText}
            error={totalMatchedRegions === 0}
            helperText={totalMatchedRegions !== 0 ? '' : 'No matches found !'}
          />
        </Box>
        <Box width='medium' margin='8px'>
          <SelectDay
            handleChange={handleChangeForDay}
            dateSelected={date}
            dates={dates}
          />
        </Box>
        {false && (
          <MinimumDistanceSlider
            dailyForecastFilter={dailyForecastFilter}
            setDailyForecastFilter={setDailyForecastFilter}
          />
        )}
      </Box>
      {/* <Themed /> */}
    </>
  );
}

export default ForecastHeader;
