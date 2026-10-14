import { getAllRegions } from '../regions';
import {
  approximateMapRegions,
  approximateRegionCoords,
  mapHeight,
  mapWidth,
  projectMapPoint,
  regionBoundaryCodes,
  regionBoundaryPaths,
} from '../regionBoundaries';
import { regionTranslations } from '../regionTranslations';

describe('map boundary data', () => {
  test('every plate region has a boundary or an explicitly approximate marker', () => {
    const approximateRegions = new Set<string>(approximateMapRegions);
    const regionsWithoutMapData = getAllRegions().filter(
      (region) => !regionBoundaryCodes[region] && !approximateRegions.has(region)
    );

    expect(regionsWithoutMapData).toEqual([]);
  });

  test('all boundary references point to generated paths', () => {
    Object.values(regionBoundaryCodes).forEach((code) => {
      expect(regionBoundaryPaths[code]).toMatch(/^M.+Z$/);
    });
  });

  test('every approximate region has a marker within the map bounds', () => {
    expect(Object.keys(approximateRegionCoords).sort()).toEqual([...approximateMapRegions].sort());

    Object.values(approximateRegionCoords).forEach(([lon, lat]) => {
      const [x, y] = projectMapPoint(lon, lat);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(mapWidth);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(mapHeight);
    });
  });

  test('every plate region has a Greek translation', () => {
    const untranslatedRegions = getAllRegions().filter((region) => !regionTranslations[region]);

    expect(untranslatedRegions).toEqual([]);
  });

  test('all map geometries use unique boundary codes', () => {
    const codes = Object.keys(regionBoundaryPaths);
    expect(codes).toHaveLength(51);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
