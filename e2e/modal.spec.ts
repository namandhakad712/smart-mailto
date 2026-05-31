import { test, expect } from '@chromatic-com/playwright';

test('SmartMailto modal opens when clicking the trigger', async ({ page }) => {
  // Navigate to the docs demo page
  await page.goto('/');

  // Wait for the Demo component to be ready
  const trigger = page.locator('a[data-smart-mailto="true"]').first();
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
