import { describe, expect, it } from 'vitest';
import { buildMailtoHtml, buildMailtoLink } from './mailtoGenerator';

describe('mailto link generator', () => {
  it('normalizes multiple To, CC, and BCC recipients', () => {
    expect(
      buildMailtoLink({
        to: 'hello@example.com; team@example.com\nowner@example.com',
        cc: 'copy@example.com, second-copy@example.com',
        bcc: 'archive@example.com; records@example.com',
      }),
    ).toBe(
      'mailto:hello@example.com,team@example.com,owner@example.com?cc=copy%40example.com%2Csecond-copy%40example.com&bcc=archive%40example.com%2Crecords%40example.com',
    );
  });

  it('encodes spaces, punctuation, ampersands, and line breaks', () => {
    expect(
      buildMailtoLink({
        to: 'hello@example.com',
        subject: 'Budget & timing?',
        body: 'Hi team,\n\nCan we talk at 2:30?',
      }),
    ).toBe(
      'mailto:hello@example.com?subject=Budget%20%26%20timing%3F&body=Hi%20team%2C%0A%0ACan%20we%20talk%20at%202%3A30%3F',
    );
  });

  it('escapes the generated href and link text for HTML', () => {
    expect(
      buildMailtoHtml(
        'mailto:hello@example.com?subject=Sales%20%26%20support',
        'Ask <Sales> & "Support"',
      ),
    ).toBe(
      '<a href="mailto:hello@example.com?subject=Sales%20%26%20support">Ask &lt;Sales&gt; &amp; &quot;Support&quot;</a>',
    );
  });
});
