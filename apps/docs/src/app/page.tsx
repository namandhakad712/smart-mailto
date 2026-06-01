'use client';

import { Demo } from '@/components/Demo';
import { ProviderTable } from '@/components/ProviderTable';
import { SmartMailto } from '@smart-mailto/react';
import { getAllProviders } from '@smart-mailto/core';
import { useState, useCallback } from 'react';
import { useIsDark } from '@/hooks/useIsDark';

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const allProviders = getAllProviders();
const featuredProviders = allProviders.slice(0, 8);

const QUICK_START_CODE = `import { initSmartMailto } from '@smart-mailto/core';

initSmartMailto({
  theme: 'dark',
  autoDetectGeo: true
});`;

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted dark:text-text-muted hover:text-red transition-colors"
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m20 6-11 11-5-5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function Home() {
  const isDark = useIsDark();

  return (
    <>
      <div className="newspaper-grid">
        <article className="space-y-8">
          <header>
            <span className="font-mono text-xs font-bold text-red uppercase tracking-widest block mb-3">
              Open Source · JavaScript Library
            </span>
            <h2 className="text-5xl md:text-7xl font-headline font-normal leading-tight tracking-tight text-ink dark:text-text">
              Fix mailto: links once. Ship and done.
            </h2>
            <p className="text-xl md:text-2xl font-body font-light text-ink-soft dark:text-text-soft mt-4 leading-relaxed max-w-3xl">
              Zero-dependency library that intercepts broken mailto: links and shows a smart picker.
              Works in under 1ms with zero network requests.
            </p>
            <div className="mt-6 font-mono text-xs uppercase tracking-tight text-ink-muted dark:text-text-muted border-b border-border dark:border-border pb-4">
              npm · github.com/namandhakad712/smart-mailto · 31 May 2026
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-ink dark:text-text leading-relaxed text-lg">
              <p className="drop-cap">
                The{' '}
                <code className="font-mono bg-surface dark:bg-surface-container px-1">mailto:</code>{' '}
                protocol was designed in 1997 for a world where every computer had a desktop email
                client. That world no longer exists. Today, 40% of users have no mail client
                configured, and corporate users are locked into webmail.
              </p>
              <p className="text-ink-soft dark:text-text-soft">
                smart-mailto intercepts every{' '}
                <code className="font-mono bg-surface dark:bg-surface-container px-1">mailto:</code>{' '}
                link on your page and shows a beautiful modal with the user&apos;s preferred email
                provider. It detects region automatically using only browser APIs — no IP lookup, no
                cookies.
              </p>
            </div>

            <div className="space-y-6">
              <blockquote className="border-l-4 border-red pl-6 py-2">
                <p className="text-2xl font-headline italic font-light leading-snug text-ink dark:text-text">
                  &ldquo;One line of code. Every mailto: link on your site now works for everyone,
                  everywhere.&rdquo;
                </p>
                <cite className="block mt-4 font-mono text-xs uppercase text-ink-muted dark:text-text-muted">
                  — README, @smart-mailto/core
                </cite>
              </blockquote>

              <div className="bg-code-bg dark:bg-code-bg p-6 rounded-sm border border-border dark:border-border overflow-hidden">
                <div className="flex justify-between items-center mb-4 border-b border-border dark:border-border pb-2">
                  <span className="font-mono text-[10px] text-text-muted dark:text-text-muted uppercase tracking-[0.2em]">
                    Quick Start
                  </span>
                  <CopyButton code={QUICK_START_CODE} />
                </div>
                <pre className="font-mono text-xs md:text-sm text-text dark:text-text overflow-x-auto">
                  <code>
                    <span className="text-red">import</span> {'{ initSmartMailto }'}{' '}
                    <span className="text-red">from</span>{' '}
                    <span className="text-text-soft dark:text-text-soft">
                      &apos;@smart-mailto/core&apos;
                    </span>
                    ;
                    <span className="text-ink-muted dark:text-text-muted">
                      {'// One line. That\u2019s it.'}
                    </span>
                    initSmartMailto(&#123; theme:{' '}
                    <span className="text-text-soft dark:text-text-soft">&apos;dark&apos;</span>,
                    autoDetectGeo: <span className="text-red">true</span>
                    &#125;);
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-8 border-t border-border dark:border-border">
            <SmartMailto
              href="mailto:hello@smart-mailto.org?subject=Nice%20work&body=Just%20wanted%20to%20say%20thanks."
              theme={isDark ? 'dark' : 'light'}
              className="bg-red hover:bg-red-dark text-white px-8 py-4 font-body font-semibold flex items-center gap-3 transition-colors duration-200 cursor-pointer"
            >
              <MailIcon />
              Try it now
            </SmartMailto>
            <a
              href="/providers"
              className="border border-border dark:border-border text-ink dark:text-text px-8 py-4 font-body font-semibold flex items-center gap-3 hover:border-red dark:hover:border-red transition-colors duration-200"
            >
              View all providers
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </a>
          </div>
        </article>

        <aside className="space-y-12 border-l border-border dark:border-border pl-8 hidden lg:block">
          <section>
            <h3 className="font-mono text-[10px] font-bold text-red uppercase tracking-[0.3em] mb-4">
              Package Stats
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Bundle Size', value: '< 8KB' },
                { label: 'Dependencies', value: 'Zero' },
                { label: 'Providers', value: allProviders.length + '+' },
                { label: 'Regions', value: '30+' },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex justify-between items-end border-b border-border dark:border-border pb-1"
                >
                  <span className="text-xs font-body text-ink-soft dark:text-text-soft uppercase">
                    {item.label}
                  </span>
                  <span className="font-mono font-medium text-lg text-ink dark:text-text">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-mono text-[10px] font-bold text-red uppercase tracking-[0.3em] mb-6">
              Geo Detection
            </h3>
            <div className="relative pl-6 border-l border-border dark:border-border">
              <div className="space-y-6">
                {[
                  { region: '🇷🇺 Russia', providers: 'Yandex, Mail.ru' },
                  { region: '🇩🇪 Germany', providers: 'GMX, WEB.DE' },
                  { region: '🇯🇵 Japan', providers: 'Yahoo! Japan' },
                  { region: '🌍 Global', providers: 'Gmail, Outlook' },
                ].map(item => (
                  <div key={item.region} className="relative">
                    <div className="absolute -left-[27px] top-1 w-2 h-2 rounded-full border-2 border-paper dark:border-bg bg-red" />
                    <span className="font-mono text-xs font-bold text-ink dark:text-text block">
                      {item.region}
                    </span>
                    <p className="text-xs text-ink-soft dark:text-text-soft mt-0.5 leading-tight">
                      {item.providers}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-mono text-[10px] font-bold text-red uppercase tracking-[0.3em] mb-4">
              Supported Providers
            </h3>
            <div className="flex flex-wrap gap-2">
              {featuredProviders.map(p => (
                <span
                  key={p.id}
                  className="px-2 py-1 border border-border dark:border-border font-mono text-[10px] text-ink-muted dark:text-text-muted hover:border-red hover:text-red transition-colors cursor-default uppercase"
                >
                  {p.name.split(' ')[0]}
                </span>
              ))}
            </div>
            <a
              href="/providers"
              className="mt-3 font-mono text-[10px] text-red hover:text-red-dark transition-colors uppercase tracking-widest block"
            >
              View all {allProviders.length}+ providers →
            </a>
          </section>

          <section>
            <h3 className="font-mono text-[10px] font-bold text-red uppercase tracking-[0.3em] mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Documentation', href: '/spec' },
                { label: 'Provider Registry', href: '/providers' },
                { label: 'GitHub', href: 'https://github.com/namandhakad712/smart-mailto' },
                { label: 'npm', href: 'https://npmjs.com/package/@smart-mailto/core' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between px-2 py-1 border border-border dark:border-border font-mono text-[10px] text-ink-soft dark:text-text-soft hover:border-red hover:text-red transition-colors"
                >
                  {link.label}
                  <span className="text-red">↗</span>
                </a>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-16 pt-8 border-t border-border dark:border-border">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] font-bold text-red uppercase tracking-[0.3em] block mb-2">
            Live Demo
          </span>
          <h3 className="text-3xl font-headline font-normal text-ink dark:text-text">
            Try it yourself
          </h3>
          <p className="font-body italic text-ink-soft dark:text-text-soft mt-2">
            Click the button below to see smart-mailto in action.
          </p>
        </div>
        <Demo />
      </div>

      <div className="mt-16 pt-8 border-t border-border dark:border-border">
        <ProviderTable />
      </div>
    </>
  );
}
