import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const SITE_URL = 'https://smart-mailto.vercel.app';

describe('problem page canonical metadata', () => {
  it.each([
    ['./compare/mailto-alternatives/page.tsx', `${SITE_URL}/compare/mailto-alternatives`],
    [
      './guides/mailto-opens-wrong-email-app/page.tsx',
      `${SITE_URL}/guides/mailto-opens-wrong-email-app`,
    ],
    [
      './guides/mailto-multiple-recipients/page.tsx',
      `${SITE_URL}/guides/mailto-multiple-recipients`,
    ],
    [
      './guides/mailto-without-email-client/page.tsx',
      `${SITE_URL}/guides/mailto-without-email-client`,
    ],
  ])('uses the public route as its canonical address', (relativePath, canonical) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');

    expect(source).toContain(`const pageUrl = '${canonical}';`);
    expect(source).toContain('canonical: pageUrl');
  });
});
