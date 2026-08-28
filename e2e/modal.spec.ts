import { test, expect } from '@chromatic-com/playwright';

test('SmartMailto modal opens when clicking the trigger', async ({ page }) => {
  // Navigate to the docs demo page
  await page.goto('/');

  // Wait for the Demo component to be ready
  const trigger = page.getByRole('link', { name: 'Open the email app picker' });
  await expect(trigger).toBeVisible();

  // Click the trigger link
  await trigger.click();

  // Verify the modal is spawned
  const modal = page.locator('.sm-modal');
  await expect(modal).toBeVisible();

  // Verify modal title
  const title = page.locator('.sm-title');
  await expect(title).toHaveText('Open Email With');

  // Verify at least one provider is listed
  const providers = page.locator('.sm-provider-btn');
  await expect(providers.first()).toBeVisible();
});

test('remembered choice skips the picker and the change link restores it', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, '__smartMailtoOpenedUrls', {
      value: [] as string[],
      writable: false,
    });
    window.open = (url?: string | URL) => {
      (
        window as typeof window & { __smartMailtoOpenedUrls: string[] }
      ).__smartMailtoOpenedUrls.push(String(url));
      return null;
    };
  });
  await page.goto('/');

  const sendLink = page.getByRole('link', { name: 'Open the email app picker' });
  await sendLink.click();
  await page.getByRole('listitem', { name: 'Open in Gmail' }).click();
  await expect(page.locator('#__smart-mailto-host__')).toHaveCount(0);

  await sendLink.click();
  await expect(page.locator('#__smart-mailto-host__')).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __smartMailtoOpenedUrls: string[] }).__smartMailtoOpenedUrls
            .length,
      ),
    )
    .toBe(2);

  await page.getByRole('link', { name: 'Change email app' }).click();
  await expect(page.locator('.sm-modal')).toBeVisible();
});
