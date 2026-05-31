import { describe, it, expect } from 'vitest';
import { parseMailto, buildMailtoHref, isValidMailtoParams } from '../src/parser.js';

describe('parseMailto', () => {
  // ── Basic Cases ────────────────────────────────────────────────────────────

  it('parses a simple mailto URI', () => {
    const result = parseMailto('mailto:hello@example.com');
    expect(result).toEqual({ to: ['hello@example.com'] });
  });

  it('works without the mailto: scheme', () => {
    const result = parseMailto('hello@example.com');
    expect(result).toEqual({ to: ['hello@example.com'] });
  });

  it('parses a case-insensitive scheme', () => {
    const result = parseMailto('MAILTO:hello@example.com');
    expect(result).toEqual({ to: ['hello@example.com'] });
  });

  it('returns empty to array for empty string', () => {
    const result = parseMailto('');
    expect(result.to).toEqual([]);
  });

  it('handles whitespace-only input', () => {
    const result = parseMailto('   ');
    expect(result.to).toEqual([]);
  });

  // ── Query Parameters ───────────────────────────────────────────────────────

  it('parses subject parameter', () => {
    const result = parseMailto('mailto:hello@example.com?subject=Hello%20World');
    expect(result.subject).toBe('Hello World');
  });

  it('parses body parameter', () => {
    const result = parseMailto('mailto:hello@example.com?body=Hello%20there%21');
    expect(result.body).toBe('Hello there!');
  });

  it('parses cc parameter', () => {
    const result = parseMailto('mailto:hello@example.com?cc=boss@example.com');
    expect(result.cc).toEqual(['boss@example.com']);
  });

  it('parses bcc parameter', () => {
    const result = parseMailto('mailto:hello@example.com?bcc=secret@example.com');
    expect(result.bcc).toEqual(['secret@example.com']);
  });

  it('parses all parameters together', () => {
    const result = parseMailto(
      'mailto:to@example.com?cc=cc@example.com&bcc=bcc@example.com&subject=Test&body=Body%20text',
    );
    expect(result.to).toEqual(['to@example.com']);
    expect(result.cc).toEqual(['cc@example.com']);
    expect(result.bcc).toEqual(['bcc@example.com']);
    expect(result.subject).toBe('Test');
    expect(result.body).toBe('Body text');
  });

  // ── Multiple Recipients ────────────────────────────────────────────────────

  it('parses multiple primary recipients', () => {
    const result = parseMailto('mailto:a@example.com,b@example.com');
    expect(result.to).toEqual(['a@example.com', 'b@example.com']);
  });

  it('parses multiple cc recipients', () => {
    const result = parseMailto('mailto:to@x.com?cc=a@x.com,b@x.com');
    expect(result.cc).toEqual(['a@x.com', 'b@x.com']);
  });

  it('handles whitespace around comma-separated addresses', () => {
    const result = parseMailto('mailto:a@x.com , b@x.com');
    expect(result.to).toEqual(['a@x.com', 'b@x.com']);
  });

  // ── Encoding Edge Cases ────────────────────────────────────────────────────

  it('decodes %20 as space in subject', () => {
    const result = parseMailto('mailto:x@x.com?subject=Hello%20World');
    expect(result.subject).toBe('Hello World');
  });

  it('decodes + as space in body (URLSearchParams behavior)', () => {
    const result = parseMailto('mailto:x@x.com?body=Hello+World');
    expect(result.body).toBe('Hello World');
  });

  it('handles Unicode in subject', () => {
    const result = parseMailto('mailto:x@x.com?subject=%E4%BD%A0%E5%A5%BD');
    expect(result.subject).toBe('你好');
  });

  it('handles body with newlines encoded as %0A', () => {
    const result = parseMailto('mailto:x@x.com?body=Line1%0ALine2');
    expect(result.body).toBe('Line1\nLine2');
  });

  it('handles encoded commas in cc', () => {
    const result = parseMailto('mailto:x@x.com?cc=a@x.com%2Cb@x.com');
    expect(result.cc).toEqual(['a@x.com', 'b@x.com']);
  });

  // ── Case-Insensitive Parameters ────────────────────────────────────────────

  it('handles uppercase CC parameter', () => {
    const result = parseMailto('mailto:x@x.com?CC=boss@x.com');
    expect(result.cc).toEqual(['boss@x.com']);
  });

  it('handles mixed-case Subject parameter', () => {
    const result = parseMailto('mailto:x@x.com?Subject=Test');
    expect(result.subject).toBe('Test');
  });

  // ── Body with Special Characters ───────────────────────────────────────────

  it('handles body with question marks (does not split on second ?)', () => {
    const result = parseMailto('mailto:x@x.com?body=What%3F%20Yes%3F&subject=Test');
    expect(result.body).toBe('What? Yes?');
    expect(result.subject).toBe('Test');
  });

  it('handles empty query string', () => {
    const result = parseMailto('mailto:x@x.com?');
    expect(result.to).toEqual(['x@x.com']);
    expect(result.subject).toBeUndefined();
  });
});

describe('isValidMailtoParams', () => {
  it('returns true for a valid single recipient', () => {
    expect(isValidMailtoParams({ to: ['hello@example.com'] })).toBe(true);
  });

  it('returns false for empty to array', () => {
    expect(isValidMailtoParams({ to: [] })).toBe(false);
  });

  it('returns false for invalid email format', () => {
    expect(isValidMailtoParams({ to: ['notanemail'] })).toBe(false);
  });

  it('returns true if at least one valid email exists', () => {
    expect(isValidMailtoParams({ to: ['invalid', 'valid@example.com'] })).toBe(true);
  });
});

describe('buildMailtoHref', () => {
  it('rebuilds a simple mailto href', () => {
    const href = buildMailtoHref({ to: ['hello@example.com'] });
    expect(href).toBe('mailto:hello@example.com');
  });

  it('rebuilds with subject and body', () => {
    const href = buildMailtoHref({
      to: ['x@x.com'],
      subject: 'Hello World',
      body: 'Hi there',
    });
    expect(href).toContain('subject=Hello%20World');
    expect(href).toContain('body=Hi%20there');
  });

  it('is round-trip safe (parse → build → parse)', () => {
    const original = 'mailto:hello@example.com?cc=boss@example.com&subject=Test&body=Hi';
    const parsed = parseMailto(original);
    const rebuilt = buildMailtoHref(parsed);
    const reparsed = parseMailto(rebuilt);
    expect(reparsed.to).toEqual(parsed.to);
    expect(reparsed.cc).toEqual(parsed.cc);
    expect(reparsed.subject).toEqual(parsed.subject);
    expect(reparsed.body).toEqual(parsed.body);
  });
});
