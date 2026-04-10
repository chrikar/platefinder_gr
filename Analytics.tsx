type AnalyticsComponent = typeof import('@vercel/analytics/react').Analytics;

// This file exists only so TypeScript can resolve './Analytics'.
// Metro selects Analytics.web.tsx (web) or Analytics.native.tsx (iOS/Android)
// at bundle time, but other tooling may still import this file directly.
// Keep the runtime behavior as a no-op while deriving the type from the
// real `@vercel/analytics/react` export so props stay in sync.
export const Analytics: AnalyticsComponent = (..._args) => {
  return null;
};
