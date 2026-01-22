import { toSlug, fromSlug, fromSlugById } from './slug';
import type { LocationInterface } from '../interfaces/LocationInterface';

const mockLocation = (name: string, description: string): LocationInterface => ({
  name,
  description,
  region: 'Test Region',
  latitude: 47.0,
  longitude: -122.0,
});

describe('toSlug', () => {
  it('should convert spaces to hyphens', () => {
    expect(toSlug('San Juan Islands')).toBe('san-juan-islands');
  });

  it('should convert to lowercase', () => {
    expect(toSlug('SEATTLE')).toBe('seattle');
    expect(toSlug('Mount Rainier')).toBe('mount-rainier');
  });

  it('should remove special characters', () => {
    expect(toSlug("Baker's Pass")).toBe('bakers-pass');
    expect(toSlug('Mt. Hood (Oregon)')).toBe('mt-hood-oregon');
  });

  it('should handle multiple consecutive spaces', () => {
    expect(toSlug('North   Cascades')).toBe('north-cascades');
  });

  it('should handle empty string', () => {
    expect(toSlug('')).toBe('');
  });

  it('should handle strings with only special characters', () => {
    expect(toSlug('!@#$%')).toBe('');
  });

  it('should preserve numbers', () => {
    expect(toSlug('Highway 20 Pass')).toBe('highway-20-pass');
  });
});

describe('fromSlug', () => {
  const locations: LocationInterface[] = [
    mockLocation('sjuan', 'San Juan Islands'),
    mockLocation('rainier', 'Mount Rainier'),
    mockLocation('baker', 'Mt. Baker'),
  ];

  it('should find location by slug', () => {
    const result = fromSlug('san-juan-islands', locations);
    expect(result).toBeDefined();
    expect(result?.name).toBe('sjuan');
  });

  it('should return undefined for non-matching slug', () => {
    const result = fromSlug('non-existent-location', locations);
    expect(result).toBeUndefined();
  });

  it('should handle empty locations array', () => {
    const result = fromSlug('san-juan-islands', []);
    expect(result).toBeUndefined();
  });

  it('should match location with special characters in name', () => {
    const result = fromSlug('mt-baker', locations);
    expect(result).toBeDefined();
    expect(result?.name).toBe('baker');
  });
});

describe('fromSlugById', () => {
  const locationsById: { [key: string]: LocationInterface } = {
    loc1: mockLocation('sjuan', 'San Juan Islands'),
    loc2: mockLocation('rainier', 'Mount Rainier'),
    loc3: mockLocation('baker', 'Mt. Baker'),
  };

  it('should find location from normalized byId object', () => {
    const result = fromSlugById('san-juan-islands', locationsById);
    expect(result).toBeDefined();
    expect(result?.name).toBe('sjuan');
  });

  it('should return undefined for non-matching slug', () => {
    const result = fromSlugById('non-existent-location', locationsById);
    expect(result).toBeUndefined();
  });

  it('should handle empty locationsById object', () => {
    const result = fromSlugById('san-juan-islands', {});
    expect(result).toBeUndefined();
  });

  it('should iterate through all locations to find match', () => {
    // Test that it can find the last location
    const result = fromSlugById('mt-baker', locationsById);
    expect(result).toBeDefined();
    expect(result?.name).toBe('baker');
  });

  it('should match location with special characters in description', () => {
    const result = fromSlugById('mount-rainier', locationsById);
    expect(result).toBeDefined();
    expect(result?.description).toBe('Mount Rainier');
  });
});
