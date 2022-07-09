/* eslint-disable react/destructuring-assignment */
import { Grid, TextField } from '@mui/material';

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
      <Grid container>
        <Grid item sx={{ margin: '8px', align: 'center' }}>
          Matching
          {' '}
          {totalMatchedRegions}
          {' '}
          Locations
        </Grid>
        <Grid item sx={{ width: 'medium', margin: '8px' }}>
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
        </Grid>
        <Grid>
          <SelectDay
            handleChange={handleChangeForDay}
            dateSelected={date}
            dates={dates}
          />
        </Grid>
        {false && (
          <MinimumDistanceSlider
            dailyForecastFilter={dailyForecastFilter}
            setDailyForecastFilter={setDailyForecastFilter}
          />
        )}
      </Grid>
      {/* <Themed /> */}
    </>
  );
}

export default ForecastFilterContainer;
