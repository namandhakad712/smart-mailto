import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  buttonHtml,
  buttonMailto,
  emailTemplateMailtos,
  subjectBodyHtml,
  subjectBodyMailto,
} from '../lib/generatorGuideExamples';

const guideSources = [
  './guides/mailto-subject-body-encoding/page.tsx',
  './guides/mailto-button/page.tsx',
  './guides/prefilled-email-templates/page.tsx',
].map(relativePath => readFileSync(new URL(relativePath, import.meta.url), 'utf8'));

describe('generator guide examples', () => {
  it('encodes punctuation and multiline body copy', () => {
    expect(subjectBodyMailto).toBe(
      'mailto:hello@example.com?subject=Budget%20%26%20timing%3F&body=Hi%20team%2C%0A%0ACan%20we%20talk%20at%202%3A30%3F',
    );
    expect(subjectBodyHtml).toContain(
      'subject=Budget%20%26%20timing%3F&amp;body=Hi%20team%2C%0A%0A',
    );
  });

  it('keeps the styled mailto control as an anchor', () => {
    expect(buttonMailto).toContain('subject=Pricing%20question');
    expect(buttonHtml).toMatch(/^<a class="email-button" href="mailto:/);
    expect(buttonHtml).not.toContain('<button');
  });

  it('builds three distinct, multiline email templates', () => {
    expect(emailTemplateMailtos).toHaveLength(3);
    expect(emailTemplateMailtos.map(template => template.mailto)).toEqual([
      expect.stringContaining('subject=Support%20request%3A%20%5Btopic%5D'),
      expect.stringContaining('subject=Sales%20enquiry'),
      expect.stringContaining('subject=Product%20feedback'),
    ]);
    expect(emailTemplateMailtos.every(template => template.mailto.includes('%0A%0A'))).toBe(true);
  });

  it('gives every guide one generator route and introduces the product at the final CTA', () => {
    for (const source of guideSources) {
      expect(source.match(/<GeneratorCta/g)).toHaveLength(1);
      expect(source.match(/smart-mailto generator/g)).toHaveLength(1);
    }
  });
});
