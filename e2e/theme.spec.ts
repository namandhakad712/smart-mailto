import { test, expect, type Page } from '@chromatic-com/playwright';

const themeButton = (page: Page) => page.getByRole('button', { name: /light|dark/ });

test.describe('saved theme', () => {
  test('restores dark after reload and toggles to light on the first click', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.reload();

    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await expect(themeButton(page)).toHaveText('☀ light');

    await themeButton(page).click();

    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
  });

  test('keeps a saved light preference when the system prefers dark', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();

    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    await expect(themeButton(page)).toHaveText('✦ dark');
  });

  test('restores a saved system preference from the current color scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'system'));
    await page.reload();

    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await expect(themeButton(page)).toHaveText('☀ light');

    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();

    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    await expect(themeButton(page)).toHaveText('✦ dark');
  });
});
