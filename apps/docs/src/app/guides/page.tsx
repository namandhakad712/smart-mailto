import type { Metadata } from 'next';
import Link from 'next/link';
import { GuidesDeskAnalytics } from '@/components/GuidesDeskAnalytics';
import { InstallCommandCopy } from '@/components/InstallCommandCopy';

const pageUrl = 'https://smart-mailto.vercel.app/guides';

const revisionDates = {
  install: { dateTime: '2026-08-09', label: 'Aug. 9, 2026' },
  comparison: { dateTime: '2026-08-07', label: 'Aug. 7, 2026' },
  troubleshooting: { dateTime: '2026-08-09', label: 'Aug. 9, 2026' },
  chrome: { dateTime: '2026-08-07', label: 'Aug. 7, 2026' },
  generator: { dateTime: '2026-08-07', label: 'Aug. 7, 2026' },
} as const;

export const metadata: Metadata = {
  title: 'Mailto Guides for Developers — smart-mailto',
  description:
    'Compare plain mailto links, troubleshoot links that open nothing, fix Chrome handler setup, generate a mailto URL, or install smart-mailto.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'website',
    url: pageUrl,
    title: 'Mailto guides for developers',
    description:
      'Five practical routes for comparing, fixing, generating, and upgrading mailto links.',
  },
};

const readingPaths = [
  {
    number: '02',
    label: 'Comparison',
    title: 'smart-mailto vs. plain mailto',
    description:
      'See when a normal mailto link is enough and when a provider picker earns the extra step.',
    href: '/compare/smart-mailto-vs-mailto',
    meta: 'Decision guide · 6 min',
    revised: revisionDates.comparison,
    className: 'lg:col-span-2',
  },
  {
    number: '03',
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
    number: '04',
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
    number: '05',
    label: 'Tool',
    title: 'Build a mailto link',
    description:
      'Generate a correctly encoded mailto URL with recipients, subject, body, cc, and bcc fields.',
    href: '/tools/mailto-link-generator',
    meta: 'Interactive generator',
    revised: revisionDates.generator,
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
            Guide desk · Five practical routes
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Start with the mailto problem in front of you.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            Compare the options, repair a dead click, fix Chrome, generate a link, or add a webmail
            picker to the links you already have.
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
            {['Install', 'Compare', 'Troubleshoot', 'Fix Chrome', 'Generate'].map(
              (label, index) => (
                <li className="flex items-baseline gap-4" key={label}>
                  <span className="font-mono text-xs text-ink-muted dark:text-text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body font-semibold text-ink dark:text-text">{label}</span>
                </li>
              ),
            )}
          </ol>
        </aside>
      </header>

      <section
        aria-labelledby="install-guide"
        className="grid gap-8 py-12 lg:grid-cols-[200px_1fr]"
      >
        <div>
          <p className="font-mono text-xs text-ink-muted dark:text-text-muted">01 / 05</p>
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
              Four more ways in
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
                  <span className="text-ink-muted dark:text-text-muted">{path.number} / 05</span>
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
