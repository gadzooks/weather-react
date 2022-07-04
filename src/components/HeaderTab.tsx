/* eslint-disable react/destructuring-assignment */
import { TextField } from '@mui/material';
import React from 'react';
import { DailyForecastFilter } from '../interfaces/DailyForecastFilter';
import SelectDay from './weather/main_page/SelectDayDropDown';
import MinimumDistanceSlider from './weather/main_page/TemperatureSlider';

export interface ForecastHeaderProps {
  searchText: string;
  handleChangeForLocationName: any;
  totalMatchedRegions: number;
  handleChangeForDay: any;
  dates: string[];
  dailyForecastFilter: DailyForecastFilter;
  setDailyForecastFilter: any;
}

function ForecastHeader(props: ForecastHeaderProps) {
  const { searchText } = props;
  const { handleChangeForLocationName } = props;
  const { totalMatchedRegions } = props;
  const { handleChangeForDay } = props;
  const { dates } = props;
  const { dailyForecastFilter } = props;
  const { setDailyForecastFilter } = props;
  const { date } = dailyForecastFilter;

  return (
    <>
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

      <SelectDay
        handleChange={handleChangeForDay}
        dateSelected={date}
        // dateSelected={dailyForecastFilter.date}
        dates={dates}
      />

      <MinimumDistanceSlider
        dailyForecastFilter={dailyForecastFilter}
        setDailyForecastFilter={setDailyForecastFilter}
      />
    </>
  );
}

export default ForecastHeader;
