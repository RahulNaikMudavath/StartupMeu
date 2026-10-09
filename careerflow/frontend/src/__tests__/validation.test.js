import { describe, it, expect } from 'vitest';
import { isValidUrl, isNonBlank } from '../utils/validation';

describe('validation utilities', () => {
  describe('isValidUrl', () => {
    it('returns true for falsy values (optional field)', () => {
      expect(isValidUrl('')).toBe(true);
      expect(isValidUrl(null)).toBe(true);
      expect(isValidUrl(undefined)).toBe(true);
    });

    it('returns true for valid http and https URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://jobs.company.org/apply/123')).toBe(true);
    });

    it('returns false for malformed URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('htp://wrong.schema')).toBe(false);
    });
  });

  describe('isNonBlank', () => {
    it('returns true for non-empty trimmed strings', () => {
      expect(isNonBlank('Acme Corp')).toBe(true);
      expect(isNonBlank('  Software Engineer  ')).toBe(true);
    });

    it('returns false for empty or whitespace-only strings', () => {
      expect(isNonBlank('')).toBe(false);
      expect(isNonBlank('   ')).toBe(false);
      expect(isNonBlank('\t\n ')).toBe(false);
    });
  });
});
