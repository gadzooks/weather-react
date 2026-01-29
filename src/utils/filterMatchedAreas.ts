// filterMatchedAreas.ts

import type { RegionsById } from '../interfaces/ForecastResponseInterface';
import type { MatchedAreas } from '../interfaces/MatchedAreas';

export interface FilterOptions {
  needle?: RegExp | null;
  regionFilter?: string | null; // Filter by region name (slug)
}

export default function findMatchedAreas(
  needle: RegExp | null,
  regionsById: RegionsById,
  options?: FilterOptions,
): MatchedAreas {
  const matchedAreas: MatchedAreas = {
    totalMatchedLocations: 0,
  };

  const regionFilter = options?.regionFilter;

  let totalLocations = 0;
  regionsById.allIds.forEach((regionName) => {
    const region = regionsById.byId[regionName];

    // If region filter is set, only include matching region
    if (regionFilter) {
      const regionSlug = region.name.toLowerCase().replace(/\s+/g, '-');
      if (regionSlug !== regionFilter) {
        return; // Skip this region
      }
    }

    if (needle) {
      const locations = region.locations.filter((l) =>
        l.description.match(needle),
      );
      if (locations.length > 0) {
        totalLocations += locations.length;
        matchedAreas.regions ||= [];
        matchedAreas.locationsByRegion ||= {};
        matchedAreas.regions.push(region);
        matchedAreas.locationsByRegion[region.name] = locations;
      }
    } else {
      matchedAreas.regions ||= [];
      matchedAreas.regions.push(region);
      matchedAreas.locationsByRegion ||= {};
      matchedAreas.locationsByRegion[region.name] = region.locations;
      totalLocations += region.locations.length;
    }
  });
  matchedAreas.totalMatchedLocations = totalLocations;
  return matchedAreas;
}
