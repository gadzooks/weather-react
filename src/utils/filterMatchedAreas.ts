import { RegionsById } from "../interfaces/ForecastResponseInterface";
import { MatchedAreas } from "../interfaces/MatchedAreas";

export default function findMatchedAreas(
  needle: RegExp | null,
  regionsById: RegionsById
): MatchedAreas {
  const matchedAreas: MatchedAreas = {
    totalMatchedLocations: 0,
  };

  let totalLocations = 0;
  regionsById.allIds.forEach((regionName) => {
    const region = regionsById.byId[regionName];
    if (needle) {
      const locations = region.locations.filter((l) =>
        l.description.match(needle)
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
