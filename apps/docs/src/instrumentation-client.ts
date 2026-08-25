import { captureSitePageviewNavigation, initializeDemoAnalytics } from '@/lib/demoAnalytics';

try {
  initializeDemoAnalytics();
} catch {
  // Analytics must never interfere with the product experience.
}

export function onRouterTransitionStart(url: string) {
  try {
    captureSitePageviewNavigation(url);
  } catch {
    // Analytics must never interfere with client-side navigation.
  }
}
