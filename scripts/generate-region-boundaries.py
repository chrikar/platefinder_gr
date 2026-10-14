#!/usr/bin/env python3
"""Generate the compact SVG boundary data used by GreekMap.tsx."""

import json
import math
from pathlib import Path
import subprocess
from urllib.request import urlopen


SOURCE_URL = (
    'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/'
    'NUTS_RG_03M_2010_4326_LEVL_3.geojson'
)
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'regionBoundaries.ts'
WIDTH = 360
HEIGHT = 320
PADDING = 8
SIMPLIFY_TOLERANCE = 0.4
REGION_BOUNDARY_CODES = {
    'Achaia': 'EL232',
    'Aetoloacarnania': 'EL231',
    'Arcadia': 'EL252',
    'Argolida': 'EL251',
    'Arta': 'EL211',
    'Boeotia': 'EL241',
    'Cephalonia': 'EL223',
    'Chalkidiki': 'EL127',
    'Chania': 'EL434',
    'Chios': 'EL413',
    'Corfu': 'EL222',
    'Corinthia': 'EL253',
    'Cyclades': 'EL422',
    'Dodecanese': 'EL421',
    'Drama': 'EL114',
    'Evros': 'EL111',
    'Evia': 'EL242',
    'Evrytania': 'EL243',
    'Florina': 'EL134',
    'Grevena': 'EL131',
    'Heraklion': 'EL431',
    'Ileia': 'EL233',
    'Imathia': 'EL121',
    'Ioannina': 'EL213',
    'Karditsa': 'EL141',
    'Kastoria': 'EL132',
    'Kavala': 'EL115',
    'Kilkis': 'EL123',
    'Kozani': 'EL133',
    'Laconia': 'EL254',
    'Larissa': 'EL142',
    'Lasithi': 'EL432',
    'Lefkada': 'EL224',
    'Magnesia': 'EL143',
    'Messinia': 'EL255',
    'Pella': 'EL124',
    'Phocida': 'EL245',
    'Phthiotida': 'EL244',
    'Pieria': 'EL125',
    'Preveza': 'EL214',
    'Rethymno': 'EL433',
    'Rhodope': 'EL113',
    'Samos': 'EL412',
    'Serres': 'EL126',
    'Thesprotia': 'EL212',
    'Thessaloniki': 'EL122',
    'Trikala': 'EL144',
    'Xanthi': 'EL112',
}
APPROXIMATE_MAP_REGIONS = (
    'Athens',
    'East Attica',
    'Lesbos',
    'Limnos',
    'Piraeus',
    'West Attica',
)
APPROXIMATE_REGION_COORDS = {
    'Athens': (23.73, 37.98),
    'Piraeus': (23.65, 37.94),
    'West Attica': (23.3, 38.05),
    'East Attica': (24.0, 38.05),
    'Lesbos': (26.27, 39.23),
    'Limnos': (25.08, 39.87),
}


def project(lon, lat, projection):
    return (
        (lon * projection['cos_lat'] - projection['x_min']) * projection['scale'] + PADDING,
        (projection['y_max'] - lat) * projection['scale'] + PADDING,
    )


def simplify(points):
    if points[0] == points[-1]:
        points = points[:-1]
    if len(points) < 4:
        return points

    keep = {0, len(points) - 1}
    stack = [(0, len(points) - 1)]
    while stack:
        start, end = stack.pop()
        start_x, start_y = points[start]
        end_x, end_y = points[end]
        dx = end_x - start_x
        dy = end_y - start_y
        length_squared = dx * dx + dy * dy
        farthest_distance = SIMPLIFY_TOLERANCE
        farthest_index = None

        for index in range(start + 1, end):
            point_x, point_y = points[index]
            if length_squared == 0:
                distance = math.hypot(point_x - start_x, point_y - start_y)
            else:
                ratio = max(
                    0,
                    min(
                        1,
                        (
                            (point_x - start_x) * dx
                            + (point_y - start_y) * dy
                        )
                        / length_squared,
                    ),
                )
                distance = math.hypot(
                    point_x - (start_x + ratio * dx),
                    point_y - (start_y + ratio * dy),
                )
            if distance > farthest_distance:
                farthest_distance = distance
                farthest_index = index

        if farthest_index is not None:
            keep.add(farthest_index)
            stack.extend(((start, farthest_index), (farthest_index, end)))

    result = [points[index] for index in sorted(keep)]
    return result if len(result) >= 3 else points


def path_for_geometry(geometry, projection):
    commands = []
    for polygon in geometry['coordinates']:
        for ring in polygon:
            projected = [project(lon, lat, projection) for lon, lat in ring]
            points = simplify(projected)
            if len(points) < 3:
                continue
            commands.append(
                'M'
                + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in points)
                + 'Z'
            )
    return ''.join(commands)


def main():
    with urlopen(SOURCE_URL) as response:
        data = json.load(response)
    features = [
        feature
        for feature in data['features']
        if feature['properties'].get('CNTR_CODE') == 'EL'
        and feature['properties'].get('LEVL_CODE') == 3
    ]
    if len(features) != 51:
        raise RuntimeError(f'Expected 51 Greek NUTS 3 areas, got {len(features)}')

    coordinates = [
        point
        for feature in features
        for polygon in feature['geometry']['coordinates']
        for ring in polygon
        for point in ring
    ]
    cos_lat = math.cos(math.radians(38.275))
    x_values = [lon * cos_lat for lon, _ in coordinates]
    latitudes = [lat for _, lat in coordinates]
    x_min = min(x_values)
    x_max = max(x_values)
    y_min = min(latitudes)
    y_max = max(latitudes)
    scale = min(
        (WIDTH - 2 * PADDING) / (x_max - x_min),
        (HEIGHT - 2 * PADDING) / (y_max - y_min),
    )
    projection = {
        'cos_lat': cos_lat,
        'x_min': x_min,
        'y_max': y_max,
        'scale': scale,
    }

    paths = {
        feature['properties']['NUTS_ID']: path_for_geometry(
            feature['geometry'], projection
        )
        for feature in sorted(features, key=lambda item: item['properties']['NUTS_ID'])
    }
    lines = [
        '// Geographic boundaries: Eurostat/GISCO NUTS 2010, level 3, 1:3 million.',
        '// Regenerate with: python3 scripts/generate-region-boundaries.py',
        f'export const mapWidth = {WIDTH};',
        f'export const mapHeight = {HEIGHT};',
        '',
        'const projection = {',
        f'  cosLat: {cos_lat:.12f},',
        f'  xMin: {x_min:.12f},',
        f'  yMax: {y_max:.12f},',
        f'  scale: {scale:.12f},',
        f'  padding: {PADDING},',
        '};',
        '',
        'export const projectMapPoint = (lon: number, lat: number): [number, number] => [',
        '  (lon * projection.cosLat - projection.xMin) * projection.scale + projection.padding,',
        '  (projection.yMax - lat) * projection.scale + projection.padding,',
        '];',
        '',
        'export const regionBoundaryPaths: Record<string, string> = {',
    ]
    lines.extend(f"  {code}: '{path}'," for code, path in paths.items())
    lines.extend(['};', '', 'export const regionBoundaryCodes: Record<string, string> = {'])
    lines.extend(
        f"  '{region}': '{code}',"
        for region, code in sorted(REGION_BOUNDARY_CODES.items())
    )
    lines.extend(['};', '', 'export const approximateRegionCoords: Record<string, [number, number]> = {'])
    lines.extend(
        f"  '{region}': [{lon}, {lat}],"
        for region, (lon, lat) in sorted(APPROXIMATE_REGION_COORDS.items())
    )
    lines.extend(
        [
            '};',
            '',
            'export const approximateMapRegions = [',
        ]
    )
    lines.extend(f"  '{region}'," for region in APPROXIMATE_MAP_REGIONS)
    lines.extend(['] as const;', ''])
    OUTPUT.write_text('\n'.join(lines), encoding='utf-8')
    subprocess.run(
        ['npx', 'prettier', '--write', str(OUTPUT.relative_to(ROOT))],
        cwd=ROOT,
        check=True,
    )
    print(f'Wrote {len(paths)} boundaries to {OUTPUT}')


if __name__ == '__main__':
    main()
