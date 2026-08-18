import { parseMailto, type MailtoParams } from '@smart-mailto/core';

export const WORKING_MAILTO_EXAMPLE =
  'mailto:hello@example.com,team@example.com?cc=copy@example.com&bcc=archive@example.com&subject=Website%20question&body=Hi%20there%2C%0A%0AI%20am%20testing%20this%20mailto%20link.';

export const BROKEN_MAILTO_EXAMPLE =
  'mailto:hello example.com?subject=Website question&amp;body=Please reply';

const ADDRESS_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TROUBLESHOOTING_LINK = '/guides/mailto-link-opens-nothing#check-the-link';

export type MailtoDiagnostic = {
  code: string;
  level: 'error' | 'warning';
  title: string;
  detail: string;
  href: string;
  linkLabel: string;
};

export type MailtoTestResult = {
  status: 'empty' | 'invalid' | 'warning' | 'valid';
  params?: MailtoParams;
  diagnostics: MailtoDiagnostic[];
};

function invalidAddresses(addresses: string[] | undefined) {
  return (addresses ?? []).filter(address => !ADDRESS_PATTERN.test(address));
}

function syntaxDiagnostic(
  code: string,
  title: string,
  detail: string,
  level: MailtoDiagnostic['level'] = 'error',
): MailtoDiagnostic {
  return {
    code,
    level,
    title,
    detail,
    href: TROUBLESHOOTING_LINK,
    linkLabel: 'Open the link check',
  };
}

export function testMailtoLink(value: string): MailtoTestResult {
  const input = value.trim();
  if (!input) return { status: 'empty', diagnostics: [] };

  if (/^<a\b/i.test(input) || /href\s*=/i.test(input)) {
    return {
      status: 'invalid',
      diagnostics: [
        syntaxDiagnostic(
          'html-instead-of-href',
          'Paste the href value, not the whole anchor',
          'Use only the text that starts with mailto:. Leave the <a>, href=, quotes, and link label out.',
        ),
      ],
    };
  }

  if (!/^mailto:/i.test(input)) {
    return {
      status: 'invalid',
      diagnostics: [
        syntaxDiagnostic(
          'missing-scheme',
          'The mailto: prefix is missing',
          'A clickable email href must start with mailto: immediately before the first recipient.',
        ),
      ],
    };
  }

  const params = parseMailto(input);
  const diagnostics: MailtoDiagnostic[] = [];

  if (/%(?![0-9a-f]{2})/i.test(input)) {
    diagnostics.push(
      syntaxDiagnostic(
        'invalid-percent-encoding',
        'A percent-encoded character is incomplete',
        'Every percent sign must be followed by two hexadecimal characters, such as %20 for a space.',
      ),
    );
  }

  if (/&amp;/i.test(input)) {
    diagnostics.push(
      syntaxDiagnostic(
        'html-entity-in-href',
        'The pasted link contains &amp; instead of &',
        'Paste the browser href value with & between fields. Use &amp; only inside HTML source markup.',
      ),
    );
  }

  if (/\s/.test(input)) {
    diagnostics.push(
      syntaxDiagnostic(
        'unencoded-whitespace',
        'The link contains an unencoded space or line break',
        'Encode spaces as %20 and line breaks as %0A so browsers do not cut or rewrite a field.',
        'warning',
      ),
    );
  }

  if (params.to.length === 0) {
    diagnostics.push(
      syntaxDiagnostic(
        'missing-valid-recipient',
        'Add at least one complete recipient',
        'The address after mailto: needs text before @, a domain after it, and a final suffix such as .com.',
      ),
    );
  }

  for (const [field, label] of [
    ['to', 'To'],
    ['cc', 'CC'],
    ['bcc', 'BCC'],
  ] as const) {
    const invalid = invalidAddresses(params[field]);
    if (invalid.length === 0) continue;

    diagnostics.push(
      syntaxDiagnostic(
        `invalid-${field}`,
        `${label} contains ${invalid.length === 1 ? 'an invalid address' : 'invalid addresses'}`,
        `Check ${invalid.join(', ')}. Separate multiple addresses with commas and remove spaces inside each address.`,
      ),
    );
  }

  const query = input.split('?').slice(1).join('?');
  if (query) {
    const allowedFields = new Set(['cc', 'bcc', 'subject', 'body']);
    const unsupported = Array.from(new URLSearchParams(query).keys()).filter(
      key => !allowedFields.has(key.toLowerCase()) && key.toLowerCase() !== 'amp;body',
    );

    if (unsupported.length > 0) {
      diagnostics.push(
        syntaxDiagnostic(
          'unsupported-fields',
          'Some fields are not shown by this tester',
          `The parser supports to, cc, bcc, subject, and body. It ignored: ${Array.from(new Set(unsupported)).join(', ')}.`,
          'warning',
        ),
      );
    }
  }

  const hasError = diagnostics.some(diagnostic => diagnostic.level === 'error');
  return {
    status: hasError ? 'invalid' : diagnostics.length > 0 ? 'warning' : 'valid',
    params,
    diagnostics,
  };
}
