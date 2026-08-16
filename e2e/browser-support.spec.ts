import { expect, test } from '@playwright/test';

test('browser support page states the tested boundary and evidence', async ({ page }) => {
  await page.goto('/docs/browser-support');

  await expect(
    page.getByRole('heading', { name: 'Which browsers and frameworks support smart-mailto?' }),
  ).toBeVisible();
  await expect(page.getByRole('rowheader', { name: 'Playwright Chromium' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'React 17+' })).toBeVisible();
  await expect(page.getByText('Firefox', { exact: true })).toBeVisible();
  await expect(page.getByText('Not automated', { exact: true }).first()).toBeVisible();

  await expect(page.getByRole('link', { name: 'CI workflow' })).toHaveAttribute('href', /ci\.yml$/);
  await expect(page.getByRole('link', { name: 'peer range' })).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'host version' })).toHaveCount(3);
});
