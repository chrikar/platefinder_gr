# PlateFinder GR - Greek License Plate Lookup

A React Native app that lets you enter a Greek license plate and get the region/area it's from.

## Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the app:
```bash
npm start
```

3. Follow the prompts:
   - Press `i` to launch iOS simulator
   - Press `a` to launch Android emulator
   - Press `w` to open in web browser
   - Scan the QR code with Expo Go app on your phone

## How It Works

- Enter a Greek license plate (e.g., `ABE-1234`)
- The app extracts the first 2-3 letters (region code)
- Looks it up in the Greek prefectures database
- Returns the area/region name

## Greek License Plate Format

Format: `XYZ-1234` (3 letters + 4 digits)
- First 3 letters = region code (prefecture)
- Last 4 digits = sequential number

## Adding More Regions

Edit `regions.ts` to add more prefecture mappings. The file contains a object mapping region codes to area names.

## Build for Production

### iOS
```bash
npm install -g eas-cli
eas build --platform ios
```

### Android
```bash
npm install -g eas-cli
eas build --platform android
```

## Project Structure

- `App.tsx` - Main app component with UI
- `regions.ts` - Greek prefecture/region mapping database
- `app.json` - Expo config
- `package.json` - Dependencies
