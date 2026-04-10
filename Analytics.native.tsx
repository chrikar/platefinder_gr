import React from 'react';

// @vercel/analytics/react is a web-only package; this no-op shim is used on
// iOS and Android so the native bundle never requires browser-only globals.
export function Analytics(): React.ReactElement | null {
  return null;
}
