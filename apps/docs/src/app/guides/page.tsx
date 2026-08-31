import type { Metadata } from 'next';
import Link from 'next/link';
import { GuidesDeskAnalytics } from '@/components/GuidesDeskAnalytics';
import { InstallCommandCopy } from '@/components/InstallCommandCopy';

const pageUrl = 'https://smart-mailto.vercel.app/guides';

const revisionDates = {
  install: { dateTime: '2026-08-09', label: 'Aug. 9, 2026' },
  comparison: { dateTime: '2026-08-07', label: 'Aug. 7, 2026' },
  troubleshooting: { dateTime: '2026-08-09', label: 'Aug. 9, 2026' },
  wrongApp: { dateTime: '2026-08-19', label: 'Aug. 19, 2026' },
  noClient: { dateTime: '2026-08-19', label: 'Aug. 19, 2026' },
  chrome: { dateTime: '2026-08-07', label: 'Aug. 7, 2026' },
  test: { dateTime: '2026-08-17', label: 'Aug. 17, 2026' },
  generator: { dateTime: '2026-08-07', label: 'Aug. 7, 2026' },
  multipleRecipients: { dateTime: '2026-08-24', label: 'Aug. 24, 2026' },
  encoding: { dateTime: '2026-08-31', label: 'Aug. 31, 2026' },
  button: { dateTime: '2026-08-31', label: 'Aug. 31, 2026' },
  templates: { dateTime: '2026-08-31', label: 'Aug. 31, 2026' },
  alternatives: { dateTime: '2026-08-19', label: 'Aug. 19, 2026' },
} as const;

export const metadata: Metadata = {
  title: 'Mailto Guides for Developers — smart-mailto',
  description:
    'Build, test, style, and troubleshoot mailto links. Use working examples for encoding, buttons, templates, recipients, browser failures, and provider choice.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'website',
    url: pageUrl,
    title: 'Mailto guides for developers',
    description:
      'Thirteen practical routes for testing, styling, fixing, generating, and upgrading mailto links.',
  },
};

const readingPaths = [
  {
    number: '02',
    label: 'Troubleshooting',
    title: 'Mailto link not working',
    description:
      'Separate broken link markup from browser and operating-system mail-handler problems.',
    href: '/guides/mailto-link-opens-nothing',
    meta: 'General checks · 8 min',
    revised: revisionDates.troubleshooting,
    className: '',
  },
  {
    number: '03',
    label: 'Wrong app',
    title: 'Mailto opens the wrong email app',
    description:
      'Reset the browser or system default first, then offer a picker when the site cannot control visitor setup.',
    href: '/guides/mailto-opens-wrong-email-app',
    meta: 'Focused failure guide',
    revised: revisionDates.wrongApp,
    className: '',
  },
  {
    number: '04',
    label: 'No client',
    title: 'Mailto without an email client',
    description:
      'Give visitors a working path when their device has no configured desktop mail handler.',
    href: '/guides/mailto-without-email-client',
    meta: 'Device fallback guide',
    revised: revisionDates.noClient,
    className: '',
  },
  {
    number: '05',
    label: 'Chrome',
    title: 'Mailto not working in Chrome',
    description:
      'Work through Chrome protocol handlers, Gmail registration, extensions, and system defaults.',
    href: '/guides/mailto-not-working-in-chrome',
    meta: 'Five fixes · 7 min',
    revised: revisionDates.chrome,
    className: '',
  },
  {
    number: '06',
    label: 'Test',
    title: 'Test a mailto link',
    description:
      'Run a known-good link and separate broken HTML from browser or default mail-app setup.',
    href: '/tools/test-mailto-link',
    meta: 'Live test · 8 min',
    revised: revisionDates.test,
    className: '',
  },
  {
    number: '07',
    label: 'Tool',
    title: 'Build a mailto link',
    description:
      'Generate a correctly encoded mailto URL with recipients, subject, body, cc, and bcc fields.',
    href: '/tools/mailto-link-generator',
    meta: 'Interactive generator',
    revised: revisionDates.generator,
    className: '',
  },
  {
    number: '08',
    label: 'Recipients',
    title: 'Add multiple mailto recipients',
    description:
      'Use valid HTML for multiple To, CC, and BCC addresses, then test the client handoff.',
    href: '/guides/mailto-multiple-recipients',
    meta: 'HTML examples · RFC 6068',
    revised: revisionDates.multipleRecipients,
    className: '',
  },
  {
    number: '09',
    label: 'Encoding',
    title: 'Encode a mailto subject and body',
    description:
      'Handle spaces, punctuation, ampersands, question marks, and multiline body copy correctly.',
    href: '/guides/mailto-subject-body-encoding',
    meta: 'HTML examples · RFC 6068',
    revised: revisionDates.encoding,
    className: '',
  },
  {
    number: '10',
    label: 'Buttons',
    title: 'Put a mailto link on a button',
    description:
      'Style an accessible anchor as a button and keep the encoded mailto destination visible in HTML.',
    href: '/guides/mailto-button',
    meta: 'HTML and CSS example',
    revised: revisionDates.button,
    className: '',
  },
  {
    number: '11',
    label: 'Templates',
    title: 'Use a prefilled email template',
    description:
      'Start support, sales, and feedback emails with short editable prompts and safe placeholders.',
    href: '/guides/prefilled-email-templates',
    meta: 'Three copy-ready patterns',
    revised: revisionDates.templates,
    className: '',
  },
  {
    number: '12',
    label: 'Alternatives',
    title: 'Compare four mailto alternatives',
    description:
      'Compare plain mailto, contact forms, copy-address controls, and smart-mailto without forcing one winner.',
    href: '/compare/mailto-alternatives',
    meta: 'Four-way comparison',
    revised: revisionDates.alternatives,
    className: 'lg:col-span-2',
  },
  {
    number: '13',
    label: 'Comparison',
    title: 'smart-mailto vs. plain mailto',
    description:
      'See when a normal mailto link is enough and when a provider picker earns the extra step.',
    href: '/compare/smart-mailto-vs-mailto',
    meta: 'Decision guide · 6 min',
    revised: revisionDates.comparison,
    className: 'lg:col-span-2',
  },
] as const;

export default function GuidesPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <GuidesDeskAnalytics />
      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Guide desk · Thirteen practical routes
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Start with the mailto problem in front of you.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            Test a link, repair a dead click or wrong-app handoff, handle a missing email client,
            compare the options, or add a webmail picker to the links you already have.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-3 bg-red px-6 py-3 font-body font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80"
            href="/guides/replace-mailto"
          >
            Install smart-mailto
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </Link>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Choose your route
          </p>
          <ol className="mt-5 space-y-4">
            {[
              'Install',
              'Troubleshoot',
              'Fix the wrong app',
              'Handle no client',
              'Fix Chrome',
              'Test',
              'Generate',
              'Add recipients',
              'Encode message fields',
              'Style a mailto button',
              'Prefill a template',
              'Compare alternatives',
              'Compare mailto',
            ].map((label, index) => (
              <li className="flex items-baseline gap-4" key={label}>
                <span className="font-mono text-xs text-ink-muted dark:text-text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-body font-semibold text-ink dark:text-text">{label}</span>
              </li>
            ))}
          </ol>
        </aside>
      </header>

      <section
        aria-labelledby="install-guide"
        className="grid gap-8 py-12 lg:grid-cols-[200px_1fr]"
      >
        <div>
          <p className="font-mono text-xs text-ink-muted dark:text-text-muted">01 / 13</p>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Start here
          </p>
        </div>
        <div className="border-l-4 border-red pl-6 md:pl-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            <span>Practical guide · Vanilla JavaScript</span>
            <span>
              Revised{' '}
              <time dateTime={revisionDates.install.dateTime}>{revisionDates.install.label}</time>
            </span>
          </div>
          <h2
            className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text md:text-4xl"
            id="install-guide"
          >
            Replace a mailto link with smart-mailto
          </h2>
          <p className="mt-4 max-w-[62ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
            Install the core package, initialize it once, and keep your existing mailto anchors. The
            guide also explains native-mail and copy-address fallbacks.
          </p>
          <InstallCommandCopy />
          <p className="mt-3 max-w-3xl text-pretty text-sm leading-6 text-ink-muted dark:text-text-muted">
            Installation stalled?{' '}
            <a
              className="font-semibold text-red underline underline-offset-4 transition-colors duration-200 hover:text-red-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
              href="https://github.com/namandhakad712/smart-mailto/discussions/40"
            >
              Share your setup feedback in Discussion #40
            </a>{' '}
            with your framework, first unclear step, exact error, and final outcome.
          </p>
          <Link
            className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
            href="/guides/replace-mailto"
          >
            Read the installation guide
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="more-guides"
        className="border-t border-border pt-10 dark:border-border"
      >
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
              Read by problem
            </p>
            <h2
              className="mt-2 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text"
              id="more-guides"
            >
              Twelve more ways in
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink-muted dark:text-text-muted">
            Each route stays focused on one decision, failure mode, or practical job.
          </p>
        </div>

        <div className="grid gap-px border border-border bg-border dark:border-border dark:bg-border lg:grid-cols-2">
          {readingPaths.map(path => (
            <article
              className={`group flex min-h-64 flex-col justify-between bg-paper p-6 dark:bg-bg md:p-8 ${path.className}`}
              key={path.href}
            >
              <div>
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span className="font-bold text-red">{path.label}</span>
                  <span className="text-ink-muted dark:text-text-muted">{path.number} / 13</span>
                </div>
                <h3 className="mt-8 max-w-xl text-balance font-headline text-2xl font-medium tracking-tight text-ink dark:text-text md:text-3xl">
                  <Link
                    className="underline-offset-4 transition-colors duration-200 hover:text-red focus-visible:text-red"
                    href={path.href}
                  >
                    {path.title}
                  </Link>
                </h3>
                <p className="mt-4 max-w-[58ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
                  {path.description}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted dark:border-border dark:text-text-muted">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span>{path.meta}</span>
                  <span>
                    Revised <time dateTime={path.revised.dateTime}>{path.revised.label}</time>
                  </span>
                </div>
                <span aria-hidden="true" className="text-base text-red">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
