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

interface GreekMapProps {
  region: string | null;
  language: Language;
}

function GreekMap({ region, language }: GreekMapProps) {
  const boundaryCode = region ? regionBoundaryCodes[region] : undefined;
  const isApproximate = region
    ? approximateMapRegions.some((approximateRegion) => approximateRegion === region)
    : false;
  const approximateCoords = region && isApproximate ? approximateRegionCoords[region] : undefined;
  const dot = approximateCoords
    ? projectMapPoint(approximateCoords[0], approximateCoords[1])
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
