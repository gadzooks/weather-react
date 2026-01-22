import findMatchedAreas from './filterMatchedAreas';
import type { RegionsById } from '../interfaces/ForecastResponseInterface';
import type { LocationInterface } from '../interfaces/LocationInterface';
import type { RegionInterface } from '../interfaces/RegionInterface';

const createLocation = (
  name: string,
  description: string,
): LocationInterface => ({
  name,
  description,
  region: 'test-region',
  latitude: 47.0,
  longitude: -122.0,
});

const createRegion = (
  name: string,
  description: string,
  locations: LocationInterface[],
): RegionInterface => ({
  name,
  description,
  locations,
});

describe('findMatchedAreas', () => {
  const seattleLocation = createLocation('seattle', 'Seattle');
  const bellevueLocation = createLocation('bellevue', 'Bellevue');
  const portlandLocation = createLocation('portland', 'Portland');
  const eugenLocation = createLocation('eugene', 'Eugene');

  const washingtonRegion = createRegion('washington', 'Washington', [
    seattleLocation,
    bellevueLocation,
  ]);
  const oregonRegion = createRegion('oregon', 'Oregon', [
    portlandLocation,
    eugenLocation,
  ]);

  const regionsById: RegionsById = {
    byId: {
      washington: washingtonRegion,
      oregon: oregonRegion,
    },
    allIds: ['washington', 'oregon'],
  };

  it('should return all regions when needle is null', () => {
    const result = findMatchedAreas(null, regionsById);

    expect(result.regions).toHaveLength(2);
    expect(result.totalMatchedLocations).toBe(4);
    expect(result.locationsByRegion?.washington).toHaveLength(2);
    expect(result.locationsByRegion?.oregon).toHaveLength(2);
  });

  it('should filter locations matching regex pattern', () => {
    const result = findMatchedAreas(/Seattle/i, regionsById);

    expect(result.regions).toHaveLength(1);
    expect(result.regions?.[0].name).toBe('washington');
    expect(result.totalMatchedLocations).toBe(1);
    expect(result.locationsByRegion?.washington).toHaveLength(1);
    expect(result.locationsByRegion?.washington?.[0].description).toBe(
      'Seattle',
    );
  });

  it('should return empty regions array when no matches', () => {
    const result = findMatchedAreas(/NonExistent/i, regionsById);

    expect(result.regions).toBeUndefined();
    expect(result.totalMatchedLocations).toBe(0);
  });

  it('should correctly count totalMatchedLocations', () => {
    // Match all locations starting with capital letter followed by lowercase
    const result = findMatchedAreas(/^[A-Z][a-z]+$/, regionsById);

    expect(result.totalMatchedLocations).toBe(4);
  });

  it('should build locationsByRegion mapping', () => {
    const result = findMatchedAreas(null, regionsById);

    expect(result.locationsByRegion).toBeDefined();
    expect(Object.keys(result.locationsByRegion!)).toContain('washington');
    expect(Object.keys(result.locationsByRegion!)).toContain('oregon');
  });

  it('should handle multiple regions with partial matches', () => {
    // Pattern matches Seattle, Eugene (both start with S or E)
    const result = findMatchedAreas(/^[SE]/, regionsById);

    expect(result.totalMatchedLocations).toBe(2); // Seattle, Eugene
    expect(result.regions).toHaveLength(2);
  });

  it('should handle case-insensitive regex', () => {
    const result = findMatchedAreas(/seattle/i, regionsById);

    expect(result.totalMatchedLocations).toBe(1);
    expect(result.locationsByRegion?.washington?.[0].description).toBe(
      'Seattle',
    );
  });

  it('should handle empty regionsById', () => {
    const emptyRegions: RegionsById = {
      byId: {},
      allIds: [],
    };

    const result = findMatchedAreas(null, emptyRegions);

    expect(result.totalMatchedLocations).toBe(0);
    expect(result.regions).toBeUndefined();
  });

  it('should handle region with no matching locations', () => {
    const result = findMatchedAreas(/Portland/, regionsById);

    // Only Oregon region should be returned
    expect(result.regions).toHaveLength(1);
    expect(result.regions?.[0].name).toBe('oregon');
    expect(result.locationsByRegion?.oregon).toHaveLength(1);
    // Washington region should not be included
    expect(result.locationsByRegion?.washington).toBeUndefined();
  });
});
