import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const guideDeskSource = readFileSync(new URL('./guides/page.tsx', import.meta.url), 'utf8');
const rootReadme = readFileSync(new URL('../../../../README.md', import.meta.url), 'utf8');

const newRoutes = [
  '/guides/mailto-opens-wrong-email-app',
  '/guides/mailto-without-email-client',
  '/compare/mailto-alternatives',
] as const;

describe('new mailto page discovery paths', () => {
  it('lists ten practical routes on the Guides desk', () => {
    expect(guideDeskSource).toContain('Guide desk · Ten practical routes');
    expect(guideDeskSource).toContain('01 / 10');
    expect(guideDeskSource).toContain('{path.number} / 10');
    expect(guideDeskSource).toContain('Nine more ways in');
    expect(guideDeskSource).toContain("href: '/guides/mailto-multiple-recipients'");

    for (const route of newRoutes) {
      expect(guideDeskSource).toContain(`href: '${route}'`);
    }
  });

  it('shows the August 19 revision date on all three new cards', () => {
    expect(guideDeskSource.match(/dateTime: '2026-08-19'/g)).toHaveLength(3);
    expect(guideDeskSource.match(/label: 'Aug\. 19, 2026'/g)).toHaveLength(3);
  });

  it('links both focused failure guides from the repository setup section', () => {
    expect(rootReadme).toContain(
      '[wrong email app guide](https://smart-mailto.vercel.app/guides/mailto-opens-wrong-email-app)',
    );
    expect(rootReadme).toContain(
      '[no email client guide](https://smart-mailto.vercel.app/guides/mailto-without-email-client)',
    );
  });
});
