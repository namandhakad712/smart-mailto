import { describe, expect, it } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';

const SITE_URL = 'https://smart-mailto.vercel.app';

describe('search discovery metadata routes', () => {
  it('lists every public page with a production URL', () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      SITE_URL,
      `${SITE_URL}/compare/smart-mailto-vs-mailto`,
      `${SITE_URL}/docs/browser-support`,
      `${SITE_URL}/docs/cdn`,
      `${SITE_URL}/docs/geo-routing`,
      `${SITE_URL}/examples`,
      `${SITE_URL}/guides`,
      `${SITE_URL}/guides/mailto-link-opens-nothing`,
      `${SITE_URL}/guides/mailto-not-working-in-chrome`,
      `${SITE_URL}/guides/replace-mailto`,
      `${SITE_URL}/providers`,
      `${SITE_URL}/spec`,
      `${SITE_URL}/tools/mailto-link-generator`,
    ]);
  });

  it('dates only pages with a supported publication or update date', () => {
    expect(sitemap().filter(({ lastModified }) => lastModified)).toEqual([
      {
        url: `${SITE_URL}/compare/smart-mailto-vs-mailto`,
        lastModified: '2026-08-07',
      },
      {
        url: `${SITE_URL}/docs/browser-support`,
        lastModified: '2026-08-16',
      },
      {
        url: `${SITE_URL}/docs/cdn`,
        lastModified: '2026-08-16',
      },
      {
        url: `${SITE_URL}/docs/geo-routing`,
        lastModified: '2026-08-16',
      },
      {
        url: `${SITE_URL}/examples`,
        lastModified: '2026-08-16',
      },
      {
        url: `${SITE_URL}/guides`,
        lastModified: '2026-08-09',
      },
      {
        url: `${SITE_URL}/guides/mailto-link-opens-nothing`,
        lastModified: '2026-08-16',
      },
      {
        url: `${SITE_URL}/guides/mailto-not-working-in-chrome`,
        lastModified: '2026-08-16',
      },
      {
        url: `${SITE_URL}/guides/replace-mailto`,
        lastModified: '2026-08-16',
      },
      {
        url: `${SITE_URL}/providers`,
        lastModified: '2026-08-16',
      },
      {
        url: `${SITE_URL}/spec`,
        lastModified: '2026-08-16',
      },
    ]);
  });

  it('allows crawling and points to the production sitemap', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    });
  });
});
