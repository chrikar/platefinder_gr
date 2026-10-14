import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import {
  approximateMapRegions,
  approximateRegionCoords,
  mapHeight,
  mapWidth,
  projectMapPoint,
  regionBoundaryCodes,
  regionBoundaryPaths,
} from './regionBoundaries';
import { getTranslation, Language } from './translations';
import { translateRegion } from './regionTranslations';

interface GreekMapProps {
  region: string | null;
  language: Language;
}

const islandRegions = new Set([
  'Cephalonia',
  'Chios',
  'Corfu',
  'Cyclades',
  'Dodecanese',
  'Heraklion',
  'Lasithi',
  'Lesbos',
  'Lefkada',
  'Limnos',
  'Rethymno',
  'Samos',
  'Chania',
]);

const getRegionViewBox = (path: string): string | null => {
  const coordinates = [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  if (coordinates.length < 4 || coordinates.length % 2 !== 0) {
    return null;
  }

  const xs = coordinates.filter((_, index) => index % 2 === 0);
  const ys = coordinates.filter((_, index) => index % 2 === 1);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const padding = Math.max(width, height) * 0.15;

  return `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`;
};

function GreekMap({ region, language }: GreekMapProps) {
  const boundaryCode = region ? regionBoundaryCodes[region] : undefined;
  const isApproximate = region
    ? approximateMapRegions.some((approximateRegion) => approximateRegion === region)
    : false;
  const approximateCoords = region && isApproximate ? approximateRegionCoords[region] : undefined;
  const dot = approximateCoords
    ? projectMapPoint(approximateCoords[0], approximateCoords[1])
    : null;
  const selectedPath = boundaryCode ? regionBoundaryPaths[boundaryCode] : undefined;
  const showIslandDetail = region ? islandRegions.has(region) : false;
  const selectedRegionName = region ? translateRegion(region, language) : '';
  const detailViewBox = selectedPath
    ? getRegionViewBox(selectedPath)
    : dot
      ? `${dot[0] - 12} ${dot[1] - 12} 24 24`
      : null;

  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        {...(Platform.OS === 'web' ? {} : { accessible: true })}
        accessibilityRole="image"
        accessibilityLabel={getTranslation(language, 'mapDescription')}
        style={styles.map}
      >
        <G>
          {boundaryCode && regionBoundaryPaths[boundaryCode] && (
            <Path
              d={regionBoundaryPaths[boundaryCode]}
              fill="none"
              stroke="#72aaff"
              strokeWidth={5}
              strokeOpacity={0.55}
              strokeLinejoin="round"
              fillRule="evenodd"
            />
          )}
          {Object.entries(regionBoundaryPaths).map(([code, path]) => {
            const isSelected = code === boundaryCode;
            return (
              <Path
                key={code}
                d={path}
                fill={isSelected ? '#3d82f6' : '#263b56'}
                stroke={isSelected ? '#c6ddff' : '#7189a5'}
                strokeWidth={isSelected ? 1.5 : 0.65}
                fillRule="evenodd"
              />
            );
          })}
          {boundaryCode && regionBoundaryPaths[boundaryCode] && (
            <Path
              d={regionBoundaryPaths[boundaryCode]}
              fill="none"
              stroke="#e3efff"
              strokeWidth={1.5}
              strokeLinejoin="round"
              fillRule="evenodd"
            />
          )}
          {dot && (
            <G>
              <Circle cx={dot[0]} cy={dot[1]} r={10} fill="#4b8dff" opacity={0.3} />
              <Circle
                cx={dot[0]}
                cy={dot[1]}
                r={4.5}
                fill="#4b8dff"
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            </G>
          )}
        </G>
      </Svg>
      {showIslandDetail && detailViewBox && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailTitle}>
            {getTranslation(language, 'mapDetailTitle')}: {selectedRegionName}
          </Text>
          <Svg
            width="100%"
            height={96}
            viewBox={detailViewBox}
            preserveAspectRatio="xMidYMid meet"
            accessibilityRole="image"
            accessibilityLabel={`${selectedRegionName} ${getTranslation(language, 'mapDetailTitle')}`}
            style={styles.detailMap}
          >
            {selectedPath && (
              <Path
                d={selectedPath}
                fill="#3d82f6"
                stroke="#d7e7ff"
                strokeWidth={1.5}
                fillRule="evenodd"
              />
            )}
            {dot && (
              <G>
                <Circle cx={dot[0]} cy={dot[1]} r={5} fill="#4b8dff" opacity={0.35} />
                <Circle
                  cx={dot[0]}
                  cy={dot[1]}
                  r={2}
                  fill="#4b8dff"
                  stroke="#ffffff"
                  strokeWidth={0.8}
                />
              </G>
            )}
          </Svg>
          <Text style={styles.detailCaption}>{getTranslation(language, 'mapDetailCaption')}</Text>
        </View>
      )}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.boundarySwatch} />
          <Text style={styles.legendText}>{getTranslation(language, 'mapBoundaryLegend')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.markerSwatch} />
          <Text style={styles.legendText}>{getTranslation(language, 'mapMarkerLegend')}</Text>
        </View>
      </View>
      <Text style={styles.caption}>{getTranslation(language, 'mapCaption')}</Text>
    </View>
  );
}

export default React.memo(GreekMap);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    marginBottom: 16,
  },
  map: {
    aspectRatio: mapWidth / mapHeight,
    backgroundColor: '#111e30',
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#111e30',
    borderColor: '#263b56',
    borderWidth: 1,
    borderRadius: 12,
  },
  detailTitle: {
    color: '#d2dbea',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailMap: {
    backgroundColor: '#0d1929',
    borderRadius: 8,
  },
  detailCaption: {
    color: '#9eacc0',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 5,
  },
  caption: {
    color: '#9eacc0',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 16,
    rowGap: 6,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boundarySwatch: {
    width: 12,
    height: 12,
    backgroundColor: '#3d82f6',
    borderColor: '#c6ddff',
    borderWidth: 1,
    borderRadius: 3,
  },
  markerSwatch: {
    width: 8,
    height: 8,
    backgroundColor: '#4b8dff',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 4,
  },
  legendText: {
    color: '#9eacc0',
    fontSize: 11,
  },
});
