// URL slug utilities for location routing

import type { LocationInterface } from '../interfaces/LocationInterface';

/**
 * Convert a location name/description to a URL-friendly slug
 * "San Juan Islands" → "san-juan-islands"
 */
export const toSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

/**
 * Find a location by its slug from a list of locations
 * "san-juan-islands" → LocationInterface | undefined
 */
export const fromSlug = (
  slug: string,
  locations: LocationInterface[],
): LocationInterface | undefined =>
  locations.find((loc) => toSlug(loc.description) === slug);

/**
 * Find a location by slug using the normalized locations object
 */
export const fromSlugById = (
  slug: string,
  locationsById: { [key: string]: LocationInterface },
): LocationInterface | undefined => {
  const locationIds = Object.keys(locationsById);
  for (const id of locationIds) {
    const loc = locationsById[id];
    if (toSlug(loc.description) === slug) {
      return loc;
    }
  }
  return undefined;
};
