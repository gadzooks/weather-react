import { LocationInterface } from './LocationInterface';

export interface RegionInterface {
  name: string;
  description: string;
  search_key?: string;
  locations: LocationInterface[];
}
