import React from 'react';

// This file exists only so TypeScript can resolve './Analytics'.
// Metro selects Analytics.web.tsx (web) or Analytics.native.tsx (iOS/Android)
// at bundle time, so this file is never actually executed.
export function Analytics(): React.ReactElement | null {
  return null;
}
