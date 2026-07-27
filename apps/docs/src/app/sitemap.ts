import type { MetadataRoute } from 'next';

const baseUrl = 'https://smart-mailto.vercel.app';

const routes = [
  '',
  '/providers',
  '/spec',
  '/examples',
  '/docs/geo-routing',
  '/docs/cdn',
  '/guides/replace-mailto',
  '/tools/mailto-link-generator',
  '/blog',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === '/blog' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/tools/mailto-link-generator' ? 0.9 : 0.7,
  }));
}
