import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const guideSource = readFileSync(new URL('./guides/mailto-link/page.tsx', import.meta.url), 'utf8');
const guideDeskSource = readFileSync(new URL('./guides/page.tsx', import.meta.url), 'utf8');

describe('mailto link guide', () => {
  it('owns the broad HTML syntax question with one generator action', () => {
    expect(guideSource).toContain('Mailto Link: HTML Syntax, Examples, and Common Fixes');
    expect(guideSource).toContain('Mailto link HTML: syntax, examples, and limits');
    expect(guideSource.match(/href="\/tools\/mailto-link-generator"/g)).toHaveLength(1);
    expect(guideSource).toContain('RFC 6068');
  });

  it('covers the standard fields and gives each failure one focused next step', () => {
    for (const field of ['subject=', 'body=', 'cc=', 'bcc=']) {
      expect(guideSource).toContain(field);
    }

    expect(guideSource).toContain("href: '/guides/mailto-link-opens-nothing'");
    expect(guideSource).toContain("href: '/guides/mailto-opens-wrong-email-app'");
    expect(guideSource).toContain("href: '/guides/mailto-subject-body-encoding'");
    expect(guideSource).toContain("href: '/guides/mailto-multiple-recipients'");
  });

  it('links the page once from the Guides desk', () => {
    expect(guideDeskSource.match(/href: '\/guides\/mailto-link'/g)).toHaveLength(1);
  });
});
