import { expect, test } from '@playwright/test';

test('guide keeps its main actions and routes installation feedback to Discussion #40', async ({
  page,
}) => {
  await page.goto('/guides/replace-mailto');

  await expect(page.getByRole('link', { name: 'Try the upgraded link' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'full configuration reference' })).toHaveAttribute(
    'href',
    '/spec#config',
  );

  const feedbackLink = page.getByRole('link', { name: 'Share your first stopping point ↗' });
  await expect(feedbackLink).toBeVisible();
  await expect(feedbackLink).toHaveAttribute(
    'href',
    'https://github.com/namandhakad712/smart-mailto/discussions/40',
  );
});
