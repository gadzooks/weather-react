import { LocationInterface } from './LocationInterface';
import { RegionInterface } from './RegionInterface';

export interface MatchedAreas {
  regions?: RegionInterface[];
  locationsByRegion?: {
    [regionName: string]: LocationInterface[];
  };
  // dates?: string[];
  totalMatchedRegions: number;
}
