'use client';

import { useMemo, useState } from 'react';

type CopyTarget = 'link' | 'html';

function normalizeAddresses(value: string) {
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

export function MailtoGenerator() {
  const [to, setTo] = useState('hello@example.com');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('Website enquiry');
  const [body, setBody] = useState('Hi,\n\nI have a question about...');
  const [linkText, setLinkText] = useState('Email us');
  const [copied, setCopied] = useState<CopyTarget | null>(null);

  const mailtoLink = useMemo(() => {
    const recipient = normalizeAddresses(to);
    const headers = [
      ['cc', normalizeAddresses(cc)],
      ['bcc', normalizeAddresses(bcc)],
      ['subject', subject],
      ['body', body],
    ]
      .filter(([, value]) => value.length > 0)
      .map(([key, value]) => `${key}=${encodeHeader(value)}`);

    return `mailto:${recipient}${headers.length > 0 ? `?${headers.join('&')}` : ''}`;
  }, [bcc, body, cc, subject, to]);

  const html = useMemo(
    () => `<a href="${escapeHtml(mailtoLink)}">${escapeHtml(linkText.trim() || 'Send email')}</a>`,
    [linkText, mailtoLink],
  );

  async function copy(value: string, target: CopyTarget) {
    await navigator.clipboard.writeText(value);
    setCopied(target);
    window.setTimeout(() => setCopied(current => (current === target ? null : current)), 1800);
  }

  const inputClass =
    'mt-2 w-full border border-border bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-red dark:bg-bg dark:text-text dark:placeholder:text-text-muted';
  const labelClass =
    'font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted dark:text-text-muted';

  return (
    <section
      aria-labelledby="generator-title"
      className="border border-border bg-surface dark:bg-surface-container"
    >
      <div className="grid border-b border-border md:grid-cols-[1fr_auto] md:items-end">
        <div className="p-6 md:p-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Free browser tool
          </p>
          <h2
            className="mt-2 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text"
            id="generator-title"
          >
            Compose the link
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft dark:text-text-soft">
            Your entries stay in this browser. This page does not send, save, or validate email
            addresses.
          </p>
        </div>
        <div className="border-t border-border px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted dark:text-text-muted md:border-l md:border-t-0">
          RFC 6068 format
        </div>
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-2">
        <form
          className="grid gap-5 bg-paper p-6 dark:bg-bg md:p-8"
          onSubmit={event => event.preventDefault()}
        >
          <div>
            <label className={labelClass} htmlFor="mailto-to">
              To
            </label>
            <input
              autoComplete="email"
              className={inputClass}
              id="mailto-to"
              inputMode="email"
              onChange={event => setTo(event.target.value)}
              placeholder="hello@example.com"
              type="text"
              value={to}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="mailto-cc">
                CC
              </label>
              <input
                className={inputClass}
                id="mailto-cc"
                inputMode="email"
                onChange={event => setCc(event.target.value)}
                placeholder="copy@example.com"
                type="text"
                value={cc}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="mailto-bcc">
                BCC
              </label>
              <input
                className={inputClass}
                id="mailto-bcc"
                inputMode="email"
                onChange={event => setBcc(event.target.value)}
                placeholder="archive@example.com"
                type="text"
                value={bcc}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="mailto-subject">
              Subject
            </label>
            <input
              className={inputClass}
              id="mailto-subject"
              onChange={event => setSubject(event.target.value)}
              placeholder="How can we help?"
              type="text"
              value={subject}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="mailto-body">
              Body
            </label>
            <textarea
              className={`${inputClass} min-h-36 resize-y leading-6`}
              id="mailto-body"
              onChange={event => setBody(event.target.value)}
              placeholder="Write the opening text for the email..."
              value={body}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="mailto-link-text">
              Link text
            </label>
            <input
              className={inputClass}
              id="mailto-link-text"
              onChange={event => setLinkText(event.target.value)}
              placeholder="Email us"
              type="text"
              value={linkText}
            />
          </div>
        </form>

        <div className="flex min-w-0 flex-col bg-surface-container-low p-6 dark:bg-surface-container md:p-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Live output
          </p>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-4">
              <label className={labelClass} htmlFor="generated-mailto-link">
                Mailto link
              </label>
              <button
                className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-red hover:text-red-dark"
                onClick={() => copy(mailtoLink, 'link')}
                type="button"
              >
                {copied === 'link' ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <textarea
              className="mt-2 min-h-28 w-full resize-none border border-border bg-code-bg p-4 font-mono text-xs leading-6 text-white outline-none focus:border-red"
              id="generated-mailto-link"
              readOnly
              value={mailtoLink}
            />
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-4">
              <label className={labelClass} htmlFor="generated-mailto-html">
                HTML anchor
              </label>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted dark:text-text-muted">
                Ready to paste
              </span>
            </div>
            <textarea
              className="mt-2 min-h-36 w-full resize-none border border-border bg-code-bg p-4 font-mono text-xs leading-6 text-white outline-none focus:border-red"
              id="generated-mailto-html"
              readOnly
              value={html}
            />
          </div>

          <button
            className="mt-6 w-full bg-red px-5 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-red-dark active:opacity-80"
            onClick={() => copy(html, 'html')}
            type="button"
          >
            {copied === 'html' ? 'HTML copied' : 'Copy HTML'}
          </button>

          <a
            className="mt-4 text-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red underline-offset-4 hover:underline"
            href={mailtoLink}
          >
            Test the generated link Γåù
          </a>
        </div>
      </div>
    </section>
  );
}
