import type { MetadataRoute } from 'next';

const SITE_URL = 'https://smart-mailto.vercel.app';

const PUBLIC_ROUTES = [
  '',
  '/compare/smart-mailto-vs-mailto',
  '/docs/browser-support',
  '/docs/cdn',
  '/docs/geo-routing',
  '/examples',
  '/guides',
  '/guides/mailto-link-opens-nothing',
  '/guides/mailto-not-working-in-chrome',
  '/guides/replace-mailto',
  '/providers',
  '/spec',
  '/tools/mailto-link-generator',
] as const;

const UPDATED_ROUTES = new Map<string, string>([
  ['/compare/smart-mailto-vs-mailto', '2026-08-07'],
  ['/docs/browser-support', '2026-08-16'],
  ['/docs/cdn', '2026-08-16'],
  ['/docs/geo-routing', '2026-08-16'],
  ['/examples', '2026-08-16'],
  ['/guides', '2026-08-09'],
  ['/guides/mailto-link-opens-nothing', '2026-08-16'],
  ['/guides/mailto-not-working-in-chrome', '2026-08-16'],
  ['/guides/replace-mailto', '2026-08-16'],
  ['/providers', '2026-08-16'],
  ['/spec', '2026-08-16'],
]);

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map(route => {
    const lastModified = UPDATED_ROUTES.get(route);

    return {
      url: `${SITE_URL}${route}`,
      ...(lastModified ? { lastModified } : {}),
    };
  });
}
