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

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map(route => ({
    url: `${SITE_URL}${route}`,
  }));
}
