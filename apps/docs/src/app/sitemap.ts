import type { MetadataRoute } from 'next';

import { PUBLIC_PAGE_PATHS } from '../lib/publicRoutes';

const SITE_URL = 'https://smart-mailto.vercel.app';

const UPDATED_ROUTES = new Map<string, string>([
  ['/compare/mailto-alternatives', '2026-08-19'],
  ['/compare/smart-mailto-vs-mailto', '2026-08-07'],
  ['/docs/browser-support', '2026-08-16'],
  ['/docs/cdn', '2026-08-16'],
  ['/docs/geo-routing', '2026-08-16'],
  ['/examples', '2026-08-16'],
  ['/guides', '2026-08-31'],
  ['/guides/mailto-link-opens-nothing', '2026-08-16'],
  ['/guides/mailto-button', '2026-08-31'],
  ['/guides/mailto-multiple-recipients', '2026-08-24'],
  ['/guides/mailto-not-working-in-chrome', '2026-08-16'],
  ['/guides/mailto-opens-wrong-email-app', '2026-08-19'],
  ['/guides/mailto-subject-body-encoding', '2026-08-31'],
  ['/guides/mailto-without-email-client', '2026-08-19'],
  ['/guides/prefilled-email-templates', '2026-08-31'],
  ['/guides/replace-mailto', '2026-08-16'],
  ['/providers', '2026-08-16'],
  ['/spec', '2026-08-16'],
  ['/tools/mailto-link-generator', '2026-08-26'],
  ['/tools/test-mailto-link', '2026-08-18'],
]);

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGE_PATHS.map(route => {
    const lastModified = UPDATED_ROUTES.get(route);

    return {
      url: route === '/' ? SITE_URL : `${SITE_URL}${route}`,
      ...(lastModified ? { lastModified } : {}),
    };
  });
}
