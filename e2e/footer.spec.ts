import { test, expect } from '@chromatic-com/playwright';

test('footer has no placeholder links', async ({ page }) => {
  await page.goto('/');

  const footer = page.getByRole('contentinfo');

  await expect(footer.locator('a[href="#"]')).toHaveCount(0);
  await expect(footer.getByRole('link', { name: 'Growth by Tin' })).toHaveAttribute(
    'href',
    'https://tin.computer',
  );

  for (const label of ['Terms of Service', 'Privacy Policy', 'Style Guide', 'Masthead', 'RSS']) {
    await expect(footer.getByText(label, { exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: label, exact: true })).toHaveCount(0);
  }
});
