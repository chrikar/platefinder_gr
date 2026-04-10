import { lookupPlateRegion, greekRegions, getAllRegions, plateRegex } from '../regions';
import { getTranslation } from '../translations';
import { translateRegion } from '../regionTranslations';

// ---------------------------------------------------------------------------
// plateRegex
// ---------------------------------------------------------------------------
describe('plateRegex', () => {
  const valid = [
    'YAB-1234', // Latin uppercase with dash
    'yab-1234', // Latin lowercase with dash
    'YAB 1234', // Latin with space
    'YAB1234', // Latin no separator
    'ΥΑΒ-1234', // Greek uppercase with dash
    'υαβ-1234', // Greek lowercase with dash
    'ΥΑΒ1234', // Greek no separator
    'YAB', // letters only, no digits
    'yab', // lowercase letters only
    'ΥΑΒ', // Greek letters only
  ];

  const invalid = [
    '', // empty
    'AB-1234', // too few letters (2)
    'YABCD-1234', // too many letters (5)
    'YAB-123', // too few digits (3)
    'YAB-12345', // too many digits (5)
    'YAB_1234', // invalid separator
    'Y1B-1234', // digit in letter section
    'YAB-12X4', // letter in digit section
  ];

  test.each(valid)('accepts valid plate: %s', (plate) => {
    expect(plateRegex.test(plate)).toBe(true);
  });

  test.each(invalid)('rejects invalid plate: %s', (plate) => {
    expect(plateRegex.test(plate)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// lookupPlateRegion
// ---------------------------------------------------------------------------
describe('lookupPlateRegion', () => {
  test('returns region for Latin uppercase input', () => {
    expect(lookupPlateRegion('YAB-1234')).toBe('Athens');
  });

  test('returns region for Latin lowercase input', () => {
    expect(lookupPlateRegion('yab-1234')).toBe('Athens');
  });

  test('returns region for Greek uppercase input', () => {
    expect(lookupPlateRegion('ΥΑΒ-1234')).toBe('Athens');
  });

  test('returns region for Greek lowercase input', () => {
    expect(lookupPlateRegion('υαβ-1234')).toBe('Athens');
  });

  test('handles input without separator', () => {
    expect(lookupPlateRegion('YAB1234')).toBe('Athens');
  });

  test('handles input with space separator', () => {
    expect(lookupPlateRegion('YAB 1234')).toBe('Athens');
  });

  test('returns Piraeus for ΥΙ prefix', () => {
    expect(lookupPlateRegion('YIB-1234')).toBe('Piraeus');
  });

  test('returns Thessaloniki for known Thessaloniki prefix', () => {
    // ΝΑ is Thessaloniki — use Latin N + A
    const result = lookupPlateRegion('NAB-1234');
    expect(result).toBe('Thessaloniki');
  });

  test('returns null for unknown region code', () => {
    // ΖΑ (ZA) has no entry in the mapping
    expect(lookupPlateRegion('ZAB-1234')).toBeNull();
  });

  test('returns null for empty string', () => {
    expect(lookupPlateRegion('')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// greekRegions data integrity
// ---------------------------------------------------------------------------
describe('greekRegions data integrity', () => {
  test('all keys are exactly 2 Greek uppercase characters', () => {
    const greekUppercase = /^[ΑΒΕΖΗΙΚΜΝΟΡΤΥΧ]{2}$/;
    Object.keys(greekRegions).forEach((key) => {
      expect(key).toMatch(greekUppercase);
    });
  });

  test('all values are non-empty strings', () => {
    Object.values(greekRegions).forEach((value) => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  test('getAllRegions returns a sorted, deduplicated list', () => {
    const regions = getAllRegions();
    const sorted = [...regions].sort();
    expect(regions).toEqual(sorted);
    expect(new Set(regions).size).toBe(regions.length);
  });
});

// ---------------------------------------------------------------------------
// getTranslation
// ---------------------------------------------------------------------------
describe('getTranslation', () => {
  test('returns English string for "en"', () => {
    expect(getTranslation('en', 'searchButton')).toBe('Search');
  });

  test('returns Greek string for "gr"', () => {
    expect(getTranslation('gr', 'searchButton')).toBe('Αναζήτηση');
  });

  test('falls back to key when translation is missing', () => {
    // Cast to any to simulate a missing key without TS error
    expect(getTranslation('en', 'nonExistentKey' as never)).toBe('nonExistentKey');
  });
});

// ---------------------------------------------------------------------------
// translateRegion
// ---------------------------------------------------------------------------
describe('translateRegion', () => {
  test('returns English region name for "en"', () => {
    expect(translateRegion('Athens', 'en')).toBe('Athens');
  });

  test('returns Greek region name for "gr"', () => {
    expect(translateRegion('Athens', 'gr')).toBe('Αθήνα');
  });

  test('returns original string when no Greek translation exists', () => {
    expect(translateRegion('Unknown Region', 'gr')).toBe('Unknown Region');
  });
});
