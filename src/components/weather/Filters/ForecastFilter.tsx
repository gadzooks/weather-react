/* eslint-disable react/destructuring-assignment */
import { TextField } from '@mui/material';
import { Box } from 'grommet';

import React from 'react';
import { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';
import SelectDay from '../main_page/SelectDayDropDown';
import MinimumDistanceSlider from '../main_page/TemperatureSlider';

export interface ForecastFilterContainerProps {
  isLoaded: boolean;
  searchText: string;
  setSearchText: any;
  totalMatchedRegions: number;
  handleChangeForDay: any;
  dates: string[];
  dailyForecastFilter: DailyForecastFilter;
  setDailyForecastFilter: any;
}

function ForecastFilterContainer(props: ForecastFilterContainerProps) {
  const { isLoaded } = props;
  if (!isLoaded) {
    return <div>Loading... please wait</div>;
  }

  const { searchText } = props;
  const { setSearchText } = props;
  const { totalMatchedRegions } = props;
  const { handleChangeForDay } = props;
  const { dates } = props;
  const { dailyForecastFilter } = props;
  const { setDailyForecastFilter } = props;
  const { date } = dailyForecastFilter;

  // const [value, setValue] = useState(searchText);

  return (
    <>
      <Box direction='column' background='#ffedd6' margin='10px'>
        <Box margin='8px' align='center'>
          Matching
          {' '}
          {totalMatchedRegions}
          {' '}
          Locations
        </Box>
        <Box width='medium' margin='8px'>
          <TextField
            id='outlined-name'
            label='Search Locations'
            variant='outlined'
            autoFocus
            onChange={(e) => setSearchText(e.target.value)}
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

export default ForecastFilterContainer;