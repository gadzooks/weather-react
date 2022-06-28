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
  const [daySelectedValue, setDaySelected] = useLocalStorage('daySelected', '');

  const handleChangeForDay = (event: SelectChangeEvent) => {
    setDaySelected(event.target.value);
  };

  // if none of the dates match what was stored in daySelected then delete it from local storage
  // // if (!props.dates.find((d) => d === daySelectedValue)) {
  // //   setDaySelected('');
  // }

  const handleChangeForLocationName = debounce(setSearchText, 200);
  const parsedDates = props.dates.map((d) => parse(d, 'YYYY-MM-DD'));
  const weekends = isWeekend(parsedDates);
  const trimmedSearch = searchText.trim();
  const re = trimmedSearch === '' ? null : new RegExp(trimmedSearch, 'i');
  const matchedAreas = matchedLocations(re, props.regions);
  const totalMatchedRegions = matchedAreas.regions.length;
  const dailyForecastFilter: DailyForecastFilter = {
    date: daySelectedValue,
  };

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
        id="outlined-basic"
        label="Search Locations"
        variant="outlined"
        autoFocus
        onChange={(e) => handleChangeForLocationName(e.target.value)}
        defaultValue={searchText}
        error={totalMatchedRegions === 0}
        helperText={totalMatchedRegions !== 0 ? '' : 'No matches found !'}
      />

      {/* <RangeSlider /> */}

      <SelectDay
        handleChange={handleChangeForDay}
        dateSelected={daySelectedValue}
        dates={props.dates}
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
