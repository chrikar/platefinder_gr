# PlateFinder GR — Greek License Plate Lookup

An Expo (React Native) app and web app that identifies the Greek prefecture behind any license plate. Enter a plate and instantly see the region it was registered in, with an interactive map highlight. Runs on iOS, Android, and the web (deployed on Vercel).

You can try the [web version](https://platefinder-gr.vercel.app/).
It's also mobile-friendly.

## Features

- Lookup any Greek license plate prefix and get the corresponding prefecture
- SVG map of Greece with historical prefecture boundaries and a highlighted lookup result
- UI available in English and Greek
- Real-time inline format validation as you type
- Vercel Web Analytics on the web build (no-op shim on native)

## Greek License Plate Format

Format: `YAB-1234` — three letters followed by four digits.

The letter prefix identifies the prefecture (e.g. `YAB` → Athens, `NAB` → Thessaloniki, `YIB` → Piraeus).

## Map data

The map uses simplified 2010 NUTS level 3 boundaries from
[Eurostat/GISCO](https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_03M_2010_4326_LEVL_3.geojson)
as a historical prefecture reference. These are not official plate-issuing boundaries. The dataset does not
separate the Attica plate areas or Lesbos from Limnos, so those results use approximate location markers
instead of highlighting a full boundary. Regenerate the compact SVG paths with
`python3 scripts/generate-region-boundaries.py`.

## Getting Started

### Prerequisites

- Node.js 24.22.0+
- npm

### Installation

```bash
npm install
```

### Running the app

```bash
npm start          # Expo dev server (all platforms)
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```

When `npm start` is running, press `i`, `a`, or `w` to open the respective platform, or scan the QR code with the Expo Go app.

## Testing & Linting

```bash
npm test           # Jest test suite
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run lint:fix   # ESLint with auto-fix
npm run format     # Prettier (write)
npm run format:check  # Prettier (check only)
```

## Web Deployment (Vercel)

The web build is produced by:

```bash
npm run build      # `expo export --platform web` → dist/
```

Vercel is configured via `vercel.json` to run the build command and serve the `dist/` directory.

GitHub Actions runs the tests, lint, TypeScript check, and web export on pushes and pull requests to `main`.

## Project Structure

| File / Folder           | Purpose                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `App.tsx`               | Root component — UI, state, plate lookup logic                      |
| `regions.ts`            | Prefecture code → region name mapping + `lookupPlateRegion`         |
| `regionTranslations.ts` | Region name translations (Greek / English)                          |
| `translations.ts`       | UI string translations                                              |
| `GreekMap.tsx`          | Interactive SVG map of Greece                                       |
| `Analytics.tsx`         | TypeScript type shim (derives props from `@vercel/analytics/react`) |
| `Analytics.web.tsx`     | Web runtime — re-exports the real Vercel Analytics component        |
| `Analytics.native.tsx`  | Native runtime — no-op shim (avoids browser-only globals)           |
| `app.json`              | Expo configuration                                                  |
| `vercel.json`           | Vercel build & output configuration                                 |
| `__tests__/`            | Jest unit tests                                                     |

## Adding More Regions

Edit `regions.ts` to add or update prefecture mappings. The `lookupPlateRegion` function strips formatting and matches the letter prefix case-insensitively.

## Building for Native (EAS)

```bash
npm install -g eas-cli
eas build --platform ios      # iOS
eas build --platform android  # Android
```

## Author

[Christos Kargas](https://github.com/chrikar)
