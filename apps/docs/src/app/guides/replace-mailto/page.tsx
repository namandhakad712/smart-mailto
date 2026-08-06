import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GuideDemo } from '@/components/GuideDemo';

export const metadata: Metadata = {
  title: 'Replace a mailto link with smart-mailto',
  description:
    'A practical guide to upgrading an existing mailto link with a webmail provider picker and native fallback.',
};

const PROVIDERS = [
  { name: 'Gmail', logo: '/provider-logos/gmail.svg' },
  { name: 'Outlook', logo: '/provider-logos/outlook-personal.svg' },
  { name: 'Proton Mail', logo: '/provider-logos/protonmail.svg' },
  { name: 'Yahoo Mail', logo: '/provider-logos/yahoo.svg' },
];

function CodeBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden border border-border bg-code-bg dark:border-border">
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </div>
      <pre className="p-5 text-sm leading-7 text-white">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function ReplaceMailtoGuide() {
  return (
    <article className="mx-auto max-w-6xl">
      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Practical guide · Vanilla JavaScript
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.05] tracking-tight text-ink dark:text-text md:text-7xl">
            Keep your mailto link. Give visitors a better way to open it.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            Install one package, initialize it once, then keep using normal mailto links. Visitors
            get a webmail picker when smart-mailto is available and the original link when it
            isn&apos;t.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <GuideDemo />
            <a
              className="font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
              href="#install"
            >
              Jump to the code
            </a>
          </div>
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-text-muted">
            <a
              className="underline-offset-4 hover:text-red hover:underline"
              href="https://www.npmjs.com/package/@smart-mailto/core"
            >
              npm package ↗
            </a>
            <a
              className="underline-offset-4 hover:text-red hover:underline"
              href="https://github.com/namandhakad712/smart-mailto"
            >
              GitHub repository ↗
            </a>
          </p>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            The whole change
          </p>
          <ol className="mt-5 space-y-5">
            {[
              ['01', 'Install @smart-mailto/core'],
              ['02', 'Initialize it once'],
              ['03', 'Add or keep a mailto link'],
            ].map(([number, label]) => (
              <li className="flex items-baseline gap-4" key={number}>
                <span className="font-mono text-xs text-ink-muted dark:text-text-muted">
                  {number}
                </span>
                <span className="font-body font-semibold text-ink dark:text-text">{label}</span>
              </li>
            ))}
          </ol>
        </aside>
      </header>

      <div className="grid gap-14 py-14 lg:grid-cols-[200px_minmax(0,680px)_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            On this page
          </p>
          <ol className="mt-4 space-y-3 border-l border-border pl-4 font-mono text-xs dark:border-border">
            <li>
              <a className="text-red hover:text-red-dark" href="#install">
                1. Install
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#initialize">
                2. Initialize
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#add-the-link">
                3. Add the link
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#behavior">
                What visitors get
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#fallback">
                Fallback behavior
              </a>
            </li>
          </ol>
        </nav>

        <div className="space-y-16">
          <section id="install" className="scroll-mt-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 1
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Install the core package
            </h2>
            <p className="mt-4 max-w-[60ch] leading-7 text-ink-soft dark:text-text-soft">
              The core package is framework-agnostic and has no runtime dependencies.
            </p>
            <div className="mt-6">
              <CodeBlock label="Terminal">npm install @smart-mailto/core</CodeBlock>
            </div>
          </section>

          <section id="initialize" className="scroll-mt-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 2
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Initialize smart-mailto once
            </h2>
            <p className="mt-4 max-w-[60ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Put the import and initializer in your browser entry file. One capture-phase listener
              handles current and future mailto links on the page.
            </p>
            <div className="mt-6">
              <CodeBlock label="main.js">
                {`import { initSmartMailto } from '@smart-mailto/core';
initSmartMailto();`}
              </CodeBlock>
            </div>
            <div className="mt-8 border-t border-border dark:border-border">
              <h3 className="pt-5 font-headline text-xl text-ink dark:text-text">
                Two common options
              </h3>
              <dl className="mt-4 divide-y divide-border border-b border-border dark:divide-border dark:border-border">
                <div className="grid gap-2 py-5 sm:grid-cols-[170px_1fr]">
                  <dt className="font-mono text-sm font-semibold text-red">theme</dt>
                  <dd className="text-sm leading-6 text-ink-soft dark:text-text-soft">
                    Use <code>&apos;light&apos;</code> or <code>&apos;dark&apos;</code> to match a
                    fixed site theme. The default, <code>&apos;auto&apos;</code>, follows the
                    visitor&apos;s system preference.
                  </dd>
                </div>
                <div className="grid gap-2 py-5 sm:grid-cols-[170px_1fr]">
                  <dt className="font-mono text-sm font-semibold text-red">preferredProvider</dt>
                  <dd className="text-sm leading-6 text-ink-soft dark:text-text-soft">
                    Pass a provider ID such as <code>&apos;gmail&apos;</code> to place it first.
                    This takes priority over the browser-based regional order.
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section id="add-the-link" className="scroll-mt-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 3
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Add or keep a normal mailto link
            </h2>
            <p className="mt-4 max-w-[60ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              smart-mailto listens for valid mailto anchors across the document. You don&apos;t need
              a custom component, and existing subject and body fields stay intact.
            </p>
            <div className="mt-6">
              <CodeBlock label="Your HTML">
                {`<a href="mailto:hello@example.com">
  Email us
</a>`}
              </CodeBlock>
            </div>
            <div className="mt-6 border-l-4 border-red pl-5">
              <p className="font-semibold text-ink dark:text-text">
                That&apos;s the full migration.
              </p>
              <p className="mt-1 text-sm leading-6 text-ink-soft dark:text-text-soft">
                You can keep adding normal mailto anchors. The same initializer handles them.
              </p>
            </div>
          </section>

          <section id="behavior" className="scroll-mt-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              What visitors get
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              A picker that adapts without an IP lookup
            </h2>
            <p className="mt-4 max-w-[60ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              A valid mailto click opens the provider picker with the recipient, subject, and body
              preserved. Provider order can reflect the recipient&apos;s email domain, a saved
              choice, and regional signals from the browser&apos;s timezone and language. Geo
              detection makes no network request.
            </p>
            <div className="mt-7 border-y border-border py-6 dark:border-border">
              <h3 className="font-headline text-xl text-ink dark:text-text">
                When native mail already works
              </h3>
              <div className="mt-4 grid gap-4 text-sm leading-6 text-ink-soft dark:text-text-soft sm:grid-cols-2 sm:gap-8">
                <p>
                  The picker adds a step for visitors whose existing mail handler already works.
                  Native mail is included by default on mobile. Desktop sites can offer the same
                  option with <code className="whitespace-nowrap">includeNative: true</code>.
                </p>
                <p>
                  A provider choice is remembered in this site&apos;s local storage and shown first
                  on later visits. It does not follow the visitor across different sites.
                </p>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-px border border-border bg-border dark:border-border dark:bg-border sm:grid-cols-4">
              {PROVIDERS.map(provider => (
                <div
                  className="flex min-h-28 flex-col items-center justify-center gap-3 bg-paper p-4 dark:bg-bg"
                  key={provider.name}
                >
                  {/* Provider artwork is stored locally with the docs site. */}
                  <Image alt="" className="h-8 w-8" height="32" src={provider.logo} width="32" />
                  <span className="text-center font-mono text-[10px] uppercase tracking-wider text-ink-soft dark:text-text-soft">
                    {provider.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section id="fallback" className="scroll-mt-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Fallback behavior
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              The original link remains the safety net
            </h2>
            <div className="mt-6 space-y-5">
              {[
                [
                  'JavaScript is unavailable',
                  'The browser still sees the original mailto anchor and can open its configured mail app.',
                ],
                [
                  'The picker cannot load',
                  'smart-mailto redirects back to the original mailto URL so native behavior can continue.',
                ],
                [
                  'The recipient is empty or invalid',
                  'smart-mailto does not intercept the click. The browser handles the link normally.',
                ],
              ].map(([title, copy]) => (
                <div
                  className="grid gap-2 border-t border-border pt-5 dark:border-border sm:grid-cols-[190px_1fr]"
                  key={title}
                >
                  <h3 className="font-semibold text-ink dark:text-text">{title}</h3>
                  <p className="text-sm leading-6 text-ink-soft dark:text-text-soft">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-px border border-border bg-border dark:border-border dark:bg-border sm:grid-cols-2">
              <Link
                className="bg-paper p-5 transition-colors hover:bg-surface dark:bg-bg dark:hover:bg-surface-container"
                href="/compare/smart-mailto-vs-mailto"
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                  Compare approaches
                </span>
                <span className="mt-2 block font-semibold text-ink dark:text-text">
                  smart-mailto vs. plain mailto →
                </span>
              </Link>
              <Link
                className="bg-paper p-5 transition-colors hover:bg-surface dark:bg-bg dark:hover:bg-surface-container"
                href="/guides/mailto-link-opens-nothing"
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                  Troubleshoot first
                </span>
                <span className="mt-2 block font-semibold text-ink dark:text-text">
                  When a mailto link opens nothing →
                </span>
              </Link>
            </div>
          </section>

          <section className="border-t-4 border-double border-border pt-10 text-center dark:border-border">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
              Ready to ship
            </p>
            <h2 className="mx-auto mt-3 max-w-xl text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Three steps, one dependable mailto fallback.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-ink-soft dark:text-text-soft">
              Install from{' '}
              <a
                className="font-semibold text-red hover:text-red-dark"
                href="https://www.npmjs.com/package/@smart-mailto/core"
              >
                npm
              </a>
              , browse the{' '}
              <a
                className="font-semibold text-red hover:text-red-dark"
                href="https://github.com/namandhakad712/smart-mailto"
              >
                source on GitHub
              </a>
              , or open the{' '}
              <Link className="font-semibold text-red hover:text-red-dark" href="/spec#config">
                full configuration reference
              </Link>
              .
            </p>
            <p className="mx-auto mt-4 max-w-xl font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-text-muted">
              Tried the guide?{' '}
              <a
                className="font-bold text-red underline-offset-4 hover:text-red-dark hover:underline"
                href="https://github.com/namandhakad712/smart-mailto/discussions/40"
              >
                Share your first stopping point ↗
              </a>
            </p>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 border-t border-border pt-4 dark:border-border">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
              Result
            </p>
            <p className="mt-3 font-headline text-xl leading-snug text-ink dark:text-text">
              One initializer upgrades every valid mailto anchor on the page.
            </p>
            <a
              className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red hover:text-red-dark"
              href="https://www.npmjs.com/package/@smart-mailto/core"
            >
              View package on npm ↗
            </a>
            <a
              className="mt-3 block font-mono text-[10px] font-bold uppercase tracking-wider text-red hover:text-red-dark"
              href="https://github.com/namandhakad712/smart-mailto"
            >
              Browse source on GitHub ↗
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
