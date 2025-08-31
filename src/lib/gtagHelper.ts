// src/lib/gtagHelper.ts

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// This function sends a custom event to Google Analytics.
// It's important to check if `window.gtag` exists, as it will only
// be present in the production environment where our GA script runs.
export const sendEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    // Log to console in development instead of sending to GA
    console.log(`GA Event (dev mode): Action=${action}, Category=${category}, Label=${label}`);
  }
};