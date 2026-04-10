import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { translateRegion } from './regionTranslations';
import { Language } from './translations';

// SVG viewBox: 0 0 300 340
// Paths derived from Natural Earth 50m data (ISO 300 – Greece)
// Projection: lon 19.2–28.4°E, lat 34.6–41.8°N, y-axis inverted (north = top)

const LON_MIN = 19.2;
const LON_MAX = 28.4;
const LAT_MIN = 34.6;
const LAT_MAX = 41.8;
const W = 300;
const H = 340;

const project = (lon: number, lat: number): [number, number] => [
  ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W,
  H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H,
];

// Mainland + Peloponnese
const MAINLAND =
  'M232.23,3.93 L237.86,7.86 L241.62,13.60 L239.27,21.55 L232.46,33.20 L233.28,37.95 L227.53,45.98 L222.95,50.66 L217.08,45.16 L197.25,40.98 L182.34,44.51 L172.12,40.25 L159.21,50.82 L148.18,53.03 L150.99,62.30 L157.57,65.66 L167.66,78.04 L158.39,70.66 L147.71,69.43 L153.81,77.71 L155.92,85.25 L145.59,74.43 L138.08,79.51 L145.36,88.12 L134.56,80.74 L120.59,66.15 L121.41,57.13 L111.78,61.56 L111.08,71.97 L118.59,94.43 L127.28,109.03 L134.56,123.95 L127.87,125.91 L123.64,116.57 L120.24,124.19 L126.11,130.42 L113.43,136.98 L112.02,139.27 L124.58,144.44 L135.97,154.60 L151.23,164.11 L157.33,172.80 L158.51,190.10 L155.57,194.69 L142.89,178.95 L137.61,179.85 L125.52,184.03 L128.69,189.12 L132.44,198.54 L137.26,201.09 L139.84,205.84 L129.16,210.92 L124.46,203.96 L116.60,199.04 L119.06,212.97 L126.34,237.32 L129.16,252.73 L123.41,248.96 L114.72,236.42 L107.32,252.81 L103.68,243.39 L96.64,231.25 L91.71,225.93 L89.13,235.93 L77.74,222.81 L80.79,208.38 L69.40,195.02 L63.18,186.33 L68.70,178.13 L76.57,171.66 L85.60,163.95 L109.44,174.12 L118.94,181.00 L120.47,177.07 L128.92,174.85 L126.93,170.18 L121.76,169.93 L115.89,165.75 L103.92,161.25 L90.18,159.93 L79.85,162.72 L71.40,160.18 L69.40,159.44 L62.36,161.25 L54.61,142.80 L51.44,135.67 L62.36,137.14 L62.60,130.83 L56.14,130.50 L48.63,129.03 L35.95,116.81 L26.09,98.70 L28.08,99.19 L34.19,100.17 L35.71,95.25 L38.53,94.35 L36.18,87.30 L38.65,84.19 L43.23,81.73 L47.80,77.87 L50.62,69.18 L54.85,62.87 L59.66,55.58 L57.20,48.36 L62.01,44.59 L71.87,42.13 L79.15,42.70 L91.12,31.56 L99.11,30.49 L110.96,31.15 L116.83,22.13 L121.17,21.88 L131.74,19.59 L141.37,19.59 L152.64,16.23 L157.57,15.65 L166.02,12.95 L173.41,11.72 L177.76,17.95 L184.10,19.18 L197.36,26.31 L209.45,23.11 L219.20,23.03 L226.83,17.21 L224.25,7.54 L225.18,3.52 Z';

// Crete
const CRETE =
  'M151.70,295.85 L153.93,296.18 L156.98,296.10 L159.56,293.07 L161.91,292.98 L162.97,295.77 L160.62,297.00 L162.38,299.38 L164.84,298.97 L164.96,301.10 L166.72,303.97 L171.07,303.80 L174.00,303.15 L176.94,301.76 L179.99,301.02 L189.26,301.76 L192.55,304.71 L198.77,305.12 L204.64,306.67 L207.69,305.61 L212.98,304.62 L213.80,305.69 L213.09,312.41 L213.45,314.38 L216.38,314.87 L218.26,312.66 L222.60,310.94 L227.18,310.94 L231.05,306.51 L232.23,306.26 L231.52,308.40 L230.12,316.59 L227.18,320.20 L223.31,320.45 L216.15,319.95 L209.10,320.77 L195.84,323.07 L182.57,324.22 L180.81,323.48 L180.81,320.45 L179.64,316.92 L175.53,315.69 L171.65,313.56 L156.39,310.61 L152.75,309.46 L146.88,310.12 L143.24,308.97 L142.19,307.17 L141.72,301.51 L142.54,295.85 L144.30,296.10 L145.83,296.84 L147.24,295.12 L147.94,290.20 L149.00,291.18 L149.82,294.87 L151.70,295.85 Z';

// Evia
const EVIA =
  'M137.49,134.19 L139.25,139.27 L141.01,141.00 L144.65,143.05 L152.52,147.06 L159.80,147.72 L161.56,151.65 L163.08,153.87 L162.61,157.56 L163.67,163.46 L165.55,169.03 L168.25,171.74 L171.65,172.56 L175.41,178.46 L174.00,180.43 L171.07,179.20 L168.25,178.54 L163.44,173.87 L162.73,169.77 L159.91,164.44 L157.80,161.00 L152.75,160.51 L148.64,160.51 L145.12,158.54 L144.07,153.38 L140.43,150.51 L135.73,144.77 L132.09,141.57 L128.57,139.52 L121.76,139.77 L123.52,136.16 L128.69,132.06 L134.09,130.59 L137.49,134.19 Z';

// Lesbos
const LESBOS =
  'M235.16,116.65 L234.58,119.44 L239.04,124.11 L241.15,129.93 L239.04,129.19 L238.10,130.75 L239.62,132.47 L234.46,133.45 L226.95,131.00 L225.30,128.37 L229.76,124.44 L227.53,123.04 L224.13,127.72 L218.73,125.67 L217.08,123.78 L218.85,118.62 L222.60,118.78 L224.60,117.88 L227.18,114.60 L233.05,114.11 L235.16,116.65 Z';

// Rhodes
const RHODES =
  'M281.89,277.24 L279.42,278.23 L277.66,275.93 L279.07,270.60 L277.78,267.24 L279.65,263.80 L284.12,257.57 L292.57,253.80 L294.56,253.39 L294.45,256.42 L291.63,263.96 L289.16,267.73 L289.87,270.77 L285.88,271.67 L281.89,277.24 Z';

// Corfu
const CORFU =
  'M28.67,111.81 L25.27,112.80 L22.33,110.42 L19.87,104.60 L14.58,97.96 L16.58,94.51 L20.80,93.53 L22.57,94.60 L23.97,96.97 L21.63,99.52 L22.92,102.96 L23.74,108.37 L27.03,111.32 L28.67,111.81 Z';

// Cephalonia
const CEPHALONIA =
  'M46.04,161.33 L48.74,167.80 L51.80,172.72 L50.86,176.08 L45.81,173.79 L43.11,174.44 L42.29,171.66 L41.47,169.11 L38.88,170.51 L37.59,168.95 L39.47,163.54 L41.82,164.44 L43.93,160.84 L44.40,156.98 L46.04,161.33 Z';

// Chios
const CHIOS =
  'M224.83,169.11 L221.66,171.82 L218.26,167.97 L220.14,165.18 L221.43,162.72 L220.49,159.77 L216.85,155.42 L216.73,152.31 L222.13,151.00 L225.30,153.70 L226.95,153.95 L226.83,165.18 L225.07,168.38 L224.83,169.11 Z';

// Limnos
const LIMNOS =
  'M203.35,85.83 L202.18,87.38 L200.77,94.02 L196.31,97.80 L193.37,98.37 L189.26,97.47 L188.32,94.27 L190.43,91.06 L194.43,85.50 L199.24,83.45 L201.12,84.35 L203.35,85.83 Z';

// Samos
const SAMOS =
  'M248.66,188.38 L252.65,189.94 L253.71,189.77 L255.59,190.27 L256.18,193.13 L253.59,193.63 L249.25,196.25 L247.49,195.68 L245.26,193.38 L241.74,193.13 L240.68,192.48 L242.56,189.77 L245.96,188.46 L248.66,188.38 Z';

// Zakynthos
const ZAKYNTHOS =
  'M55.08,188.63 L58.49,193.22 L55.79,192.07 L52.74,195.27 L49.10,191.58 L46.75,187.81 L46.28,186.33 L48.63,182.81 L50.86,186.41 L53.44,186.99 L55.08,188.63 Z';

// Lefkada
const LEFKADA =
  'M48.51,150.67 L47.22,151.08 L46.16,150.83 L45.10,151.00 L44.17,151.90 L44.28,148.21 L45.46,143.54 L46.75,140.83 L48.74,139.60 L49.57,141.73 L49.45,149.28 L48.51,150.67 Z';

// Naxos (largest Cyclades island)
const NAXOS =
  'M188.91,190.76 L187.85,193.95 L185.39,190.27 L182.57,187.72 L181.51,185.51 L179.87,184.20 L179.40,181.25 L181.40,180.02 L182.34,179.94 L184.45,183.54 L187.74,183.95 L187.50,186.17 L188.44,189.04 L188.91,190.76 Z';

// Kos (Dodecanese)
const KOS =
  'M252.65,239.53 L251.72,239.62 L252.89,237.32 L256.29,234.21 L261.34,231.42 L262.98,231.17 L265.80,232.89 L260.64,235.68 L259.23,237.16 L255.47,237.48 L252.65,239.53 Z';

// Karpathos (Dodecanese)
const KARPATHOS =
  'M260.05,299.13 L258.88,301.76 L257.58,299.54 L258.17,297.00 L256.65,292.90 L259.46,286.84 L259.46,283.88 L261.58,282.33 L261.11,287.41 L259.46,291.43 L261.11,294.71 L261.93,298.48 L260.05,299.13 Z';

// Paros (Cyclades)
const PAROS =
  'M206.99,228.22 L204.05,230.02 L202.06,227.40 L200.88,223.30 L206.28,217.40 L207.58,217.89 L208.28,219.45 L208.16,224.78 L206.99,228.22 Z';

// Thassos (near Kavala/Drama)
const THASSOS =
  'M181.75,55.99 L177.64,57.62 L173.30,54.43 L173.41,52.54 L175.64,48.69 L176.82,47.54 L179.99,47.87 L181.75,50.49 L182.22,51.72 L181.63,53.85 L181.75,55.99 Z';

// Andros (Cyclades)
const ANDROS =
  'M178.58,141.24 L175.06,142.39 L174.12,142.23 L174.94,140.75 L171.54,137.47 L172.01,134.03 L172.36,133.13 L174.94,134.93 L175.53,137.96 L178.58,141.24 Z';

// Approximate geographic centers [lon, lat] per plate region
const regionCoords: Record<string, [number, number]> = {
  Athens: [23.73, 37.98],
  Piraeus: [23.65, 37.94],
  'West Attica': [23.3, 38.05],
  'East Attica': [24.0, 38.05],
  Thessaloniki: [22.95, 40.64],
  Boeotia: [22.92, 38.37],
  Magnesia: [22.95, 39.35],
  Aetoloacarnania: [21.4, 38.6],
  Argolida: [22.75, 37.63],
  Arcadia: [22.37, 37.5],
  Trikala: [21.77, 39.55],
  Pieria: [22.43, 40.22],
  Drama: [24.15, 41.15],
  Corfu: [19.92, 39.62],
  Preveza: [20.75, 38.95],
  Chania: [24.02, 35.52],
  Arta: [21.0, 39.16],
  Ioannina: [20.85, 39.67],
  Kavala: [24.42, 41.0],
  Laconia: [22.43, 36.9],
  Phocida: [22.35, 38.53],
  Lasithi: [25.72, 35.17],
  Xanthi: [24.88, 41.13],
  Evia: [23.6, 38.52],
  Evros: [26.1, 41.12],
  Dodecanese: [27.2, 36.4],
  Cyclades: [25.15, 37.08],
  Pella: [22.13, 40.82],
  Kilkis: [22.88, 41.0],
  Serres: [23.55, 41.08],
  Grevena: [21.43, 40.08],
  Larissa: [22.42, 39.63],
  Rethymno: [24.47, 35.37],
  Florina: [21.4, 40.78],
  Corinthia: [22.93, 37.93],
  Chalkidiki: [23.43, 40.35],
  Samos: [26.97, 37.75],
  Phthiotida: [22.37, 38.87],
  Karditsa: [21.92, 39.37],
  Kozani: [21.78, 40.3],
  Limnos: [25.08, 39.87],
  Messinia: [21.97, 37.05],
  Lesbos: [26.27, 39.23],
  Evrytania: [21.78, 38.93],
  Cephalonia: [20.5, 38.18],
  Ileia: [21.43, 37.7],
  Imathia: [22.2, 40.52],
  Heraklion: [25.14, 35.34],
  Thesprotia: [20.38, 39.47],
  Chios: [26.12, 38.37],
  Rhodope: [25.52, 41.1],
  Kastoria: [21.27, 40.52],
  Lefkada: [20.65, 38.72],
  Achaia: [21.73, 38.12],
};

interface GreekMapProps {
  region: string | null;
  language: Language;
}

export default function GreekMap({ region, language }: GreekMapProps) {
  const coords = region ? regionCoords[region] : null;
  const dot = coords ? project(coords[0], coords[1]) : null;

  const fill = '#2a3a5a';
  const stroke = '#4a6a9a';

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 300 340">
        <G>
          <Path d={MAINLAND} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={CRETE} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={EVIA} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={LESBOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={RHODES} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={CORFU} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={CEPHALONIA} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={CHIOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={LIMNOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={SAMOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={ZAKYNTHOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={LEFKADA} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={NAXOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={KOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={KARPATHOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={PAROS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={THASSOS} fill={fill} stroke={stroke} strokeWidth={1} />
          <Path d={ANDROS} fill={fill} stroke={stroke} strokeWidth={1} />
          {dot && region && (
            <G>
              <Circle cx={dot[0]} cy={dot[1]} r={10} fill="#0066ff" opacity={0.25} />
              <Circle cx={dot[0]} cy={dot[1]} r={5} fill="#0066ff" />
              {/* Outline pass for legibility against the map background */}
              <SvgText
                x={dot[0] > 150 ? dot[0] - 14 : dot[0] + 14}
                y={dot[1] + 4}
                fontSize={10}
                fontWeight="600"
                fill="#1a2a3a"
                stroke="#1a2a3a"
                strokeWidth={3}
                textAnchor={dot[0] > 150 ? 'end' : 'start'}
              >
                {translateRegion(region, language)}
              </SvgText>
              {/* Fill pass */}
              <SvgText
                x={dot[0] > 150 ? dot[0] - 14 : dot[0] + 14}
                y={dot[1] + 4}
                fontSize={10}
                fontWeight="600"
                fill="#ffffff"
                textAnchor={dot[0] > 150 ? 'end' : 'start'}
              >
                {translateRegion(region, language)}
              </SvgText>
            </G>
          )}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 300 / 340,
    alignSelf: 'center',
    backgroundColor: '#1a2a3a',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
});
