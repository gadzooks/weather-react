import { LocationInterface } from './LocationInterface';

export interface RegionInterface {
  name: string;
  description: string;
  searchKey?: string;
  locations: LocationInterface[];
}
