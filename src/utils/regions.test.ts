import { describe, it, expect } from 'vitest';
import {
  getCountryRegion,
  getAssignedRegionsForCountries,
  formatRegionDisplay,
} from './regions';

describe('regions utility', () => {
  describe('getCountryRegion', () => {
    it('classifies Nordic countries under Europe with Nordic flag', () => {
      const sweden = getCountryRegion('Sweden');
      expect(sweden.primaryRegion).toBe('Europe');
      expect(sweden.isNordic).toBe(true);
      expect(sweden.displayGroups).toContain('Europe');
      expect(sweden.displayGroups).toContain('Nordic countries');

      const norway = getCountryRegion('Norway');
      expect(norway.isNordic).toBe(true);
    });

    it('classifies non-Nordic European countries under Europe only', () => {
      const germany = getCountryRegion('Germany');
      expect(germany.primaryRegion).toBe('Europe');
      expect(germany.isNordic).toBe(false);
      expect(germany.displayGroups).toEqual(['Europe']);
    });

    it('classifies GCC countries correctly', () => {
      const uae = getCountryRegion('United Arab Emirates');
      expect(uae.primaryRegion).toBe('GCC');
      expect(uae.displayGroups).toEqual(['GCC']);

      const saudi = getCountryRegion('Saudi Arabia');
      expect(saudi.primaryRegion).toBe('GCC');
    });

    it('classifies USA and Canada separately', () => {
      const usa = getCountryRegion('United States');
      expect(usa.primaryRegion).toBe('USA');

      const canada = getCountryRegion('Canada');
      expect(canada.primaryRegion).toBe('Canada');
    });

    it('falls back to Other regions for unknown countries', () => {
      const unknown = getCountryRegion('Atlantis');
      expect(unknown.primaryRegion).toBe('Other regions');
      expect(unknown.displayGroups).toEqual(['Other regions']);
    });
  });

  describe('getAssignedRegionsForCountries', () => {
    it('aggregates regions for joint programs with multiple countries', () => {
      const regions = getAssignedRegionsForCountries(['Sweden', 'France']);
      expect(regions).toContain('Europe');
      expect(regions).toContain('Nordic countries');
    });

    it('handles empty country list', () => {
      const regions = getAssignedRegionsForCountries([]);
      expect(regions).toEqual([]);
    });
  });

  describe('formatRegionDisplay', () => {
    it('formats Nordic combined with Europe cleanly', () => {
      const formatted = formatRegionDisplay(['Europe', 'Nordic countries']);
      expect(formatted).toBe('Europe (Nordic countries)');
    });

    it('returns Global for empty region arrays', () => {
      expect(formatRegionDisplay([])).toBe('Global');
    });

    it('joins standard regions with comma', () => {
      expect(formatRegionDisplay(['USA', 'Canada'])).toBe('USA, Canada');
    });
  });
});
