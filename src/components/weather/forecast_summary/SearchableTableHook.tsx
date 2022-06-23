import SummaryTable from './SummaryTable';
import { TextField } from '@mui/material';
import React from 'react';
import { ForecastResponse, RegionsById } from '../../../interfaces/ForecastResponseInterface';
import { parse } from 'fecha';
import LocationDetails from '../location_details/LocationDetails';
import { isWeekend } from '../WeatherPage';
import { useLocalStorage } from '../../../utils/localstorage';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { RegionInterface } from '../../../interfaces/RegionInterface';

export interface MatchedAreas {
  regions: RegionInterface[],
  locationsByRegion: {
    [regionName :string]: LocationInterface[],
  }
}

function matchedLocations(needle: RegExp | null, regionsById: RegionsById) :MatchedAreas {
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
  const parsedDates = props.dates.map((d) => parse(d, 'YYYY-MM-DD'));
  const weekends = isWeekend(parsedDates);
  const re = searchText === "" ? null : new RegExp(searchText, "i");
  const matchedAreas = matchedLocations(re, props.regions)
  const args = {
    ...props,
    isWeekend: weekends,
    parsedDates: parsedDates,
    matchedAreas: matchedAreas,
  };
  return (
    <>
      <TextField
        id="outlined-basic"
        label="Search Locations"
        variant="outlined"
        autoFocus={true}
        onChange={e => setSearchText(e.target.value)}
        defaultValue={searchText}
        error={false}
        helperText="No matching locations"
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