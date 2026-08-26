import { describe, expect, it, vi } from 'vitest';
import { buildMailtoHtml, buildMailtoLink, copyMailtoGeneratorOutput } from './mailtoGenerator';

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

  it('records only the fixed target after a successful clipboard write', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const onCopied = vi.fn();
    const privateOutput = 'mailto:private@example.com?subject=Private';

    await expect(
      copyMailtoGeneratorOutput(privateOutput, 'url', writeText, onCopied),
    ).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith(privateOutput);
    expect(onCopied).toHaveBeenCalledWith('url');
    expect(onCopied.mock.calls.flat()).not.toContain(privateOutput);
  });

  it('does not record a copy when the clipboard write fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('clipboard unavailable'));
    const onCopied = vi.fn();

    await expect(
      copyMailtoGeneratorOutput('private generated output', 'html', writeText, onCopied),
    ).resolves.toBe(false);
    expect(onCopied).not.toHaveBeenCalled();
  });
});
