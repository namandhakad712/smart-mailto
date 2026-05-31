/**
 * @smart-mailto/core — Mailto Parser
 *
 * Parses a mailto: URI into a structured MailtoParams object.
 * Handles all RFC 6068 edge cases:
 * - Multiple recipients (comma-separated)
 * - URL-encoded values
 * - Complex query strings with cc, bcc, subject, body
 * - Nested percent-encoding
 * - Whitespace in addresses
 */

import type { MailtoParams } from './types.js';

// Regex to validate email addresses (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Safely decodes a URI component, returning the original string on failure.
 */
function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * Parses a comma-separated list of email addresses.
 * Handles encoded commas (%2C) and whitespace.
 */
function parseAddressList(raw: string): string[] {
  if (!raw.trim()) return [];

  // Replace encoded commas before splitting
  const normalized = raw.replace(/%2C/gi, ',');

  return normalized
    .split(',')
    .map(addr => safeDecode(addr.trim()))
    .filter(addr => addr.length > 0);
}

/**
 * Parses a full mailto: URI into structured MailtoParams.
 *
 * @example
 * parseMailto('mailto:hello@site.com?cc=boss@site.com&subject=Hello%20World&body=Hi')
 * // → { to: ['hello@site.com'], cc: ['boss@site.com'], subject: 'Hello World', body: 'Hi' }
 *
 * @example
 * parseMailto('mailto:a@x.com,b@x.com')
 * // → { to: ['a@x.com', 'b@x.com'] }
 *
 * @example
 * parseMailto('hello@site.com') // works without scheme
 * // → { to: ['hello@site.com'] }
 */
export function parseMailto(href: string): MailtoParams {
  if (!href || typeof href !== 'string') {
    return { to: [] };
  }

  // Normalize: strip leading/trailing whitespace
  const normalized = href.trim();

  // Strip the mailto: scheme (case-insensitive)
  const withoutScheme = normalized.replace(/^mailto:/i, '');

  // Split on the FIRST '?' only (body content can contain '?')
  const questionIdx = withoutScheme.indexOf('?');
  const recipientPart = questionIdx === -1 ? withoutScheme : withoutScheme.slice(0, questionIdx);
  const queryPart = questionIdx === -1 ? '' : withoutScheme.slice(questionIdx + 1);

  // Parse primary recipients
  const to = parseAddressList(recipientPart);

  const params: MailtoParams = { to };

  // Parse query string parameters
  if (queryPart) {
    // Use URLSearchParams for robust parsing
    // Note: URLSearchParams handles + as space, which is correct for mailto
    const searchParams = new URLSearchParams(queryPart);

    // RFC 6068: header names are case-insensitive
    const cc = searchParams.get('cc') ?? searchParams.get('CC');
    const bcc = searchParams.get('bcc') ?? searchParams.get('BCC');
    const subject =
      searchParams.get('subject') ?? searchParams.get('Subject') ?? searchParams.get('SUBJECT');
    const body = searchParams.get('body') ?? searchParams.get('Body') ?? searchParams.get('BODY');

    if (cc) params.cc = parseAddressList(cc);
    if (bcc) params.bcc = parseAddressList(bcc);
    if (subject) params.subject = subject;
    if (body) params.body = body;
  }

  return params;
}

/**
 * Validates that the parsed MailtoParams has at least one valid recipient.
 */
export function isValidMailtoParams(params: MailtoParams): boolean {
  return params.to.length > 0 && params.to.some(addr => EMAIL_REGEX.test(addr));
}

/**
 * Reconstructs a mailto: URI from MailtoParams.
 * Useful for testing and the "copy" fallback.
 */
export function buildMailtoHref(params: MailtoParams): string {
  const recipients = params.to.join(',');
  const queryParts: string[] = [];

  if (params.cc?.length) queryParts.push(`cc=${encodeURIComponent(params.cc.join(','))}`);
  if (params.bcc?.length) queryParts.push(`bcc=${encodeURIComponent(params.bcc.join(','))}`);
  if (params.subject) queryParts.push(`subject=${encodeURIComponent(params.subject)}`);
  if (params.body) queryParts.push(`body=${encodeURIComponent(params.body)}`);

  const query = queryParts.length ? `?${queryParts.join('&')}` : '';
  return `mailto:${recipients}${query}`;
}
