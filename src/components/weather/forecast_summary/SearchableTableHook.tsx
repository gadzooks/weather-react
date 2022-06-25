import SummaryTable from './SummaryTable';
import { debounce, TextField } from '@mui/material';
import React, {  } from 'react';
import { ForecastResponse, RegionsById } from '../../../interfaces/ForecastResponseInterface';
import { parse } from 'fecha';
import LocationDetails from '../location_details/LocationDetails';
import { useLocalStorage } from '../../../utils/localstorage';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import { isWeekend } from '../../../utils/date';

export interface MatchedAreas {
  regions: RegionInterface[],
  locationsByRegion: {
    [regionName :string]: LocationInterface[],
  }
}

//TODO move this to utils and add tests for it.
function matchedLocations(needle: RegExp | null, regionsById: RegionsById) :MatchedAreas {
  // console.log(`matchedLocations called with ${needle}`);
  const matchedAreas: MatchedAreas = {
    regions: [],
    locationsByRegion: {},
  }
  for(const regionName in regionsById.byId) {
    const region = regionsById.byId[regionName];
    if(needle) {
      const locations = region.locations.filter((l) => l.description.match(needle));
      if(locations.length > 0) {
        matchedAreas.regions.push(region);
        matchedAreas.locationsByRegion[region.name] = locations;
      }
    } else {
        matchedAreas.regions.push(region);
        matchedAreas.locationsByRegion[region.name] = region.locations;
    }
  }
  return matchedAreas;
}

function SearchableTableHook(props: ForecastResponse) {
  const [searchText, setSearchText] = useLocalStorage("searchKeyText", "")
  const handleChange = debounce(setSearchText, 200);
  const parsedDates = props.dates.map((d) => parse(d, 'YYYY-MM-DD'));
  const weekends = isWeekend(parsedDates);
  const trimmedSearch = searchText.trim();
  const re = trimmedSearch === "" ? null : new RegExp(trimmedSearch, "i");
  const matchedAreas = matchedLocations(re, props.regions);
  const args = {
    ...props,
    isWeekend: weekends,
    parsedDates: parsedDates,
    matchedAreas: matchedAreas,
  };

  const totalMatchedRegions = matchedAreas.regions.length;
  return (
    <>
      <TextField
        id="outlined-basic"
        label="Search Locations"
        variant="outlined"
        autoFocus={true}
        onChange={e => handleChange(e.target.value)}
        defaultValue={searchText}
        error={totalMatchedRegions === 0}
        helperText={totalMatchedRegions !== 0 ? '' : 'No matches found !'}
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