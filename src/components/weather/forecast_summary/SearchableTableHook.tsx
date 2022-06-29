/* eslint-disable react/destructuring-assignment */
import { debounce, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';
import { parse } from 'fecha';
import { ForecastResponse, RegionsById } from '../../../interfaces/ForecastResponseInterface';
import SummaryTable from './SummaryTable';
import LocationDetails from '../location_details/LocationDetails';
import { isWeekend } from '../../../utils/date';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import useLocalStorage from '../../../utils/localstorage';
import SelectDay from '../main_page/SelectDayDropDown';
import MinimumDistanceSlider from '../main_page/TemperatureSlider';
import { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';

// TODO move this to utils and add tests for it.
function matchedLocations(needle: RegExp | null, regionsById: RegionsById) :MatchedAreas {
  // console.log(`matchedLocations called with ${needle}`);
  const matchedAreas: MatchedAreas = {
    regions: [],
    locationsByRegion: {},
  };

  regionsById.allIds.forEach((regionName) => {
    const region = regionsById.byId[regionName];
    if (needle) {
      const locations = region.locations.filter((l) => l.description.match(needle));
      if (locations.length > 0) {
        matchedAreas.regions.push(region);
        matchedAreas.locationsByRegion[region.name] = locations;
      }
    } else {
      matchedAreas.regions.push(region);
      matchedAreas.locationsByRegion[region.name] = region.locations;
    }
  });
  return matchedAreas;
}

function SearchableTableHook(props: ForecastResponse) {
  const [searchText, setSearchText] = useLocalStorage('searchKeyText', '');
  const defaultDailyForecastFilter: DailyForecastFilter = {
    date: undefined,
    tempmax: undefined,
    tempmin: undefined,
    precip: undefined,
    precipprob: undefined,
  };
  const [dailyForecastFilter, setDailyForecastFilter] = useLocalStorage(
    'dailyForecastFilter',
    defaultDailyForecastFilter,
  );

  const handleChangeForDay = (event: SelectChangeEvent) => {
    const dFF = { ...dailyForecastFilter } as DailyForecastFilter;
    dFF.date = event.target.value;
    setDailyForecastFilter(dFF);
  };

  const handleChangeForLocationName = debounce(setSearchText, 200);
  const parsedDates = props.dates.map((d) => parse(d, 'YYYY-MM-DD'));
  const weekends = isWeekend(parsedDates);
  const trimmedSearch = searchText.trim();
  const re = trimmedSearch === '' ? null : new RegExp(trimmedSearch, 'i');
  const matchedAreas = matchedLocations(re, props.regions);
  const totalMatchedRegions = matchedAreas.regions.length;

  const args = {
    ...props,
    isWeekend: weekends,
    parsedDates,
    matchedAreas,
    dailyForecastFilter,
  };

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
        dateSelected={dailyForecastFilter.date}
        dates={props.dates}
      />

      <MinimumDistanceSlider
        dailyForecastFilter={dailyForecastFilter}
        setDailyForecastFilter={setDailyForecastFilter}
      />

      <SummaryTable {...args} />

      <LocationDetails
        matchedAreas={matchedAreas}
        forecastsByName={props.forecasts.byId}
        isWeekend={weekends}
        dates={parsedDates}
      />
    </>
  );
}

export default SearchableTableHook;
