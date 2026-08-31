import { expect, test } from '@playwright/test';

const guideRoutes = [
  '/guides/mailto-subject-body-encoding',
  '/guides/mailto-button',
  '/guides/prefilled-email-templates',
] as const;

for (const route of guideRoutes) {
  test(`${route} keeps one clear generator path`, async ({ page }) => {
    await page.goto(route);

    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main section')).toHaveCount(6);
    await expect(page.locator('main a[href="/tools/mailto-link-generator"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://smart-mailto.vercel.app${route}`,
    );
  });
}

test('the guides desk exposes each new guide once', async ({ page }) => {
  await page.goto('/guides');

  for (const route of guideRoutes) {
    await expect(page.locator(`main a[href="${route}"]`)).toHaveCount(1);
  }
});
