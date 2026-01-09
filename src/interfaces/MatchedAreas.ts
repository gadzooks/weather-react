import type { LocationInterface } from './LocationInterface';
import type { RegionInterface } from './RegionInterface';

export interface MatchedAreas {
  regions?: RegionInterface[];
  locationsByRegion?: {
    [regionName: string]: LocationInterface[];
  };
  // dates?: string[];
  totalMatchedLocations: number;
}
