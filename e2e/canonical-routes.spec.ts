import { expect, test } from '@playwright/test';

const SITE_URL = 'https://smart-mailto.vercel.app';

const publicRoutes = [
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

for (const route of publicRoutes) {
  test(`${route || '/'} has its matching production canonical`, async ({ page }) => {
    await page.goto(route || '/');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${SITE_URL}${route}`,
    );
  });
}
