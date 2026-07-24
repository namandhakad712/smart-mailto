import { initializeDemoAnalytics } from '@/lib/demoAnalytics';

try {
  initializeDemoAnalytics();
} catch {
  // Analytics must never interfere with the product experience.
}
