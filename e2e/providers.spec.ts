import { test, expect } from '@chromatic-com/playwright';

test('provider search has a persistent label and preserves filtering', async ({ page }) => {
  await page.goto('/providers');

  const search = page.getByLabel('Search providers');
  await expect(search).toBeVisible();

  await search.fill('Gmail');
  await expect(page.getByRole('heading', { name: 'Gmail' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Outlook' })).toBeHidden();

  await search.clear();
  await page.getByRole('button', { name: 'Apple' }).click();
  await expect(page.getByRole('heading', { name: 'iCloud Mail' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gmail' })).toBeHidden();
});
