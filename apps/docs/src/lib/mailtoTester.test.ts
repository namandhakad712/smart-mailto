import { describe, expect, it } from 'vitest';
import { BROKEN_MAILTO_EXAMPLE, testMailtoLink, WORKING_MAILTO_EXAMPLE } from './mailtoTester';

describe('mailto link tester', () => {
  it('shows every supported field from the working example', () => {
    const result = testMailtoLink(WORKING_MAILTO_EXAMPLE);

    expect(result.status).toBe('valid');
    expect(result.params).toEqual({
      to: ['hello@example.com', 'team@example.com'],
      cc: ['copy@example.com'],
      bcc: ['archive@example.com'],
      subject: 'Website question',
      body: 'Hi there,\n\nI am testing this mailto link.',
    });
    expect(result.diagnostics).toEqual([]);
  });

  it('names each problem in the broken example and links to the matching guide check', () => {
    const result = testMailtoLink(BROKEN_MAILTO_EXAMPLE);

    expect(result.status).toBe('invalid');
    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toEqual(
      expect.arrayContaining(['html-entity-in-href', 'unencoded-whitespace', 'invalid-to']),
    );
    expect(
      result.diagnostics.every(diagnostic => diagnostic.href.includes('#check-the-link')),
    ).toBe(true);
  });

  it.each([
    ['hello@example.com', 'missing-scheme'],
    ['<a href="mailto:hello@example.com">Email us</a>', 'html-instead-of-href'],
    ['mailto:hello@example.com?subject=Bad%2', 'invalid-percent-encoding'],
    ['mailto:hello@example.com?campaign=summer', 'unsupported-fields'],
  ])('diagnoses %s', (value, expectedCode) => {
    const result = testMailtoLink(value);

    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toContain(expectedCode);
  });
});
