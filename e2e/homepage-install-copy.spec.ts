import { expect, test } from '@playwright/test';

test('only the homepage installation command is wired to the install-copy event', async ({
  context,
  page,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: 'http://localhost:3000',
  });
  await page.goto('/');

  const installCopy = page.getByRole('button', { name: 'Copy install command' });
  const initializationCopy = page.getByRole('button', { name: 'Copy initialization code' });

  await expect(page.locator('[data-analytics-event="install_copy"]')).toHaveCount(1);
  await expect(installCopy).toHaveAttribute('data-analytics-event', 'install_copy');
  await expect(initializationCopy).not.toHaveAttribute('data-analytics-event', 'install_copy');

  await installCopy.click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('npm install @smart-mailto/core@0.2.0');

  await initializationCopy.click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("import { initSmartMailto } from '@smart-mailto/core';");
});
