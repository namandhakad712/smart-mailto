export type MailtoGeneratorFields = {
  to: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
};

export function normalizeMailtoAddresses(value: string) {
  return value
    .split(/[,\n;]/)
    .map(address => address.trim())
    .filter(Boolean)
    .join(',');
}

function encodeHeader(value: string) {
  return encodeURIComponent(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function buildMailtoLink({
  to,
  cc = '',
  bcc = '',
  subject = '',
  body = '',
}: MailtoGeneratorFields) {
  const recipient = normalizeMailtoAddresses(to);
  const headers = [
    ['cc', normalizeMailtoAddresses(cc)],
    ['bcc', normalizeMailtoAddresses(bcc)],
    ['subject', subject],
    ['body', body],
  ]
    .filter(([, value]) => value.length > 0)
    .map(([key, value]) => `${key}=${encodeHeader(value)}`);

  return `mailto:${recipient}${headers.length > 0 ? `?${headers.join('&')}` : ''}`;
}

export function buildMailtoHtml(mailtoLink: string, linkText: string) {
  return `<a href="${escapeHtml(mailtoLink)}">${escapeHtml(linkText.trim() || 'Send email')}</a>`;
}
