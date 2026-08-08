import type { MetadataRoute } from 'next';

const SITE_URL = 'https://smart-mailto.vercel.app';

const PUBLIC_ROUTES = [
  '',
  '/blog',
  '/compare/smart-mailto-vs-mailto',
  '/docs/browser-support',
  '/docs/cdn',
  '/docs/geo-routing',
  '/examples',
  '/guides/mailto-link-opens-nothing',
  '/guides/mailto-not-working-in-chrome',
  '/guides/replace-mailto',
  '/providers',
  '/spec',
  '/tools/mailto-link-generator',
] as const;

const UPDATED_ROUTES = new Map<string, string>([
  ['/compare/smart-mailto-vs-mailto', '2026-08-07'],
  ['/guides/mailto-link-opens-nothing', '2026-08-07'],
  ['/guides/mailto-not-working-in-chrome', '2026-08-07'],
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
