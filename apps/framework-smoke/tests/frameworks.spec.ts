import { expect, test } from '@playwright/test';

for (const framework of ['react', 'vue', 'svelte'] as const) {
  test(`${framework} host mounts, opens the picker, and cleans up`, async ({ page }) => {
    await page.goto(`/${framework}.html`);

    const contact = page.locator('#contact');
    await expect(contact).toBeVisible();
    await contact.click();

    await expect(page.locator('#__smart-mailto-host__')).toHaveCount(1);
    await expect(page.locator('#__smart-mailto-host__ .sm-modal')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.frameworkSmoke.getShowCount())).toBe(1);

    await page.keyboard.press('Escape');
    await expect(page.locator('#__smart-mailto-host__')).toHaveCount(0);

    await page.evaluate(() => window.frameworkSmoke.unmount());
    await expect(page.locator('#contact')).toHaveCount(0);
    expect(await page.evaluate(() => window.frameworkSmoke.probeAfterUnmount())).toBe(false);
    await expect(page.locator('#__smart-mailto-host__')).toHaveCount(0);

    await page.evaluate(() => window.frameworkSmoke.mount());
    await expect(contact).toBeVisible();
    await contact.click();

    await expect(page.locator('#__smart-mailto-host__')).toHaveCount(1);
    await expect.poll(() => page.evaluate(() => window.frameworkSmoke.getShowCount())).toBe(2);

    if (framework === 'svelte') {
      expect(await page.evaluate(() => window.frameworkSmoke.getLegacyExports?.())).toBe(true);
    }
  });
}
