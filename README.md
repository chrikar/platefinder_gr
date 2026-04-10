# PlateFinder GR — Greek License Plate Lookup

An Expo (React Native) app and web app that identifies the Greek prefecture behind any license plate. Enter a plate and instantly see the region it was registered in, with an interactive map highlight. Runs on iOS, Android, and the web (deployed on Vercel).

## Features

- Lookup any Greek license plate prefix and get the corresponding prefecture
- Interactive SVG map of Greece that highlights the matched region
- UI available in English and Greek
- Real-time inline format validation as you type
- Vercel Web Analytics on the web build (no-op shim on native)

## Greek License Plate Format

Format: `ΑΒΓ-1234` — three letters followed by four digits.

The letter prefix identifies the prefecture (e.g. `ABE` → Veria, `AMA` → Amalia).

## Getting Started

### Prerequisites

- Node.js 18+
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
npm run lint:fix   # ESLint with auto-fix
npm run format     # Prettier (write)
npm run format:check  # Prettier (check only)
```

## Web Deployment (Vercel)

The web build is produced by:

```bash
npm run build      # runs tests then `expo export --platform web` → dist/
```

Vercel is configured via `vercel.json` to run the build command and serve the `dist/` directory.

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
