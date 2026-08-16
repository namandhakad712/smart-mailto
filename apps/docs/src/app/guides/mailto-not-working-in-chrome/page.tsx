import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { chromeHowToSchema } from '@/lib/guideStructuredData';

const pageUrl = 'https://smart-mailto.vercel.app/guides/mailto-not-working-in-chrome';

export const metadata: Metadata = {
  title: 'Mailto Not Working in Chrome? 5 Fixes | smart-mailto',
  description:
    'Fix mailto links that do nothing, open the wrong app, or fail in Chrome. Check handlers, Gmail, system defaults, HTML, and a webmail fallback.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto Not Working in Chrome? 5 Fixes',
    description:
      'A practical Chrome troubleshooting guide for visitors and the site owners who publish mailto links.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqItems = [
  {
    question: 'Why does nothing happen when I click a mailto link in Chrome?',
    answer:
      'Chrome may not have permission to ask a registered email handler to open the link, or the operating system may not have a default email app. First allow sites to handle protocols in Chrome, then check the system default email app.',
  },
  {
    question: 'How do I make mailto links open in Gmail from Chrome?',
    answer:
      'Allow sites to handle protocols in Chrome, open Gmail, and accept Gmail as an email handler if Chrome offers the handler icon in the address bar. Managed profiles may hide or block that choice.',
  },
  {
    question: 'Can a website force every mailto link to open in Gmail?',
    answer:
      "No. A normal mailto link hands control to the visitor's browser and operating system. A site can offer a webmail picker, but it should preserve native mail and copy-address fallbacks.",
  },
  {
    question: 'Why does a mailto link work for me but not another visitor?',
    answer:
      "The HTML can be identical while each visitor has a different browser profile, default email app, webmail handler, extension, or device policy. Test the link itself separately from the visitor's mail setup.",
  },
  {
    question: 'Should a contact page use a form instead of a mailto link?',
    answer:
      'Use a form when you must validate fields, route submissions, measure completion, or guarantee receipt. Use mailto when the sender should compose and send from their own email account.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const providers = [
  { name: 'Gmail', logo: '/provider-logos/gmail.svg' },
  { name: 'Outlook', logo: '/provider-logos/outlook-personal.svg' },
  { name: 'Proton Mail', logo: '/provider-logos/protonmail.svg' },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto border border-border bg-code-bg p-5 text-sm leading-7 text-white">
      <code>{children}</code>
    </pre>
  );
}

export default function MailtoNotWorkingInChromePage() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chromeHowToSchema) }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Chrome troubleshooting · 8 minute fix
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Mailto not working in Chrome? Start with the handler.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            A valid mailto link can still do nothing, open the wrong app, or flash a blank tab. Use
            this checklist to separate a Chrome setting from a broken link, then choose the right
            fix for visitors or your website.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              className="inline-flex min-h-11 items-center justify-center bg-red px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-red-dark"
              href="#quick-fix"
            >
              Run the quick fix
            </a>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
              href="/tools/mailto-link-generator"
            >
              Check the link syntax
            </Link>
          </div>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            First diagnosis
          </p>
          <ol className="mt-5 space-y-5">
            {[
              ['01', 'Try a plain mailto link'],
              ['02', 'Check Chrome protocol handlers'],
              ['03', 'Check the system email default'],
            ].map(([number, label]) => (
              <li className="flex items-baseline gap-4" key={number}>
                <span className="font-mono text-xs text-ink-muted dark:text-text-muted">
                  {number}
                </span>
                <span className="font-semibold text-ink dark:text-text">{label}</span>
              </li>
            ))}
          </ol>
        </aside>
      </header>

      <div className="grid gap-14 py-14 lg:grid-cols-[190px_minmax(0,720px)_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            On this page
          </p>
          <ol className="mt-4 space-y-3 border-l border-border pl-4 font-mono text-xs">
            <li>
              <a className="text-red hover:text-red-dark" href="#quick-fix">
                Quick fix
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#gmail">
                Open Gmail
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#system-default">
                System default
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#site-owner">
                Site-owner checks
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#durable-fix">
                Durable fallback
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#faq">
                FAQ
              </a>
            </li>
          </ol>
        </nav>

        <div className="space-y-16">
          <section className="scroll-mt-8" id="quick-fix">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Fix 1 · Chrome
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Allow Chrome to open email handlers
            </h2>
            <p className="mt-4 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              Type <code>chrome://settings/handlers</code> into Chrome&apos;s address bar. Make sure
              sites are allowed to ask to handle protocols. A protocol handler tells Chrome which
              app or web service should receive a link such as <code>mailto:</code>.
            </p>
            <ol className="mt-7 divide-y divide-border border-y border-border">
              {[
                [
                  'Open Chrome handler settings',
                  'Use chrome://settings/handlers in the same browser profile where the link failed.',
                ],
                [
                  'Allow protocol requests',
                  'Turn on the option that lets sites ask to handle protocols. If it is locked, a work or school administrator may control it.',
                ],
                [
                  'Remove a wrong saved handler',
                  'If an unwanted site is registered for email, remove it and choose again the next time Chrome offers a handler.',
                ],
                [
                  'Retry in a normal tab',
                  'Private browsing, extensions, and embedded previews can behave differently. Test the original page in a standard tab.',
                ],
              ].map(([title, copy], index) => (
                <li className="grid gap-3 py-5 sm:grid-cols-[46px_1fr]" key={title}>
                  <span className="font-mono text-xs text-red">0{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-ink dark:text-text">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-soft dark:text-text-soft">
                      {copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-7 border-l-4 border-red bg-surface px-6 py-5 dark:bg-surface-container">
              <p className="font-semibold text-ink dark:text-text">No handler setting?</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-text-soft">
                Chrome labels and policy controls can differ by version, device, and managed
                account. If the setting is missing or disabled, skip to the system default check and
                ask your administrator about external protocol handling.
              </p>
            </div>
          </section>

          <section className="scroll-mt-8" id="gmail">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Fix 2 · Gmail
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Register Gmail as Chrome&apos;s email handler
            </h2>
            <p className="mt-4 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              After protocol requests are allowed, open Gmail in the Chrome profile you use. Look
              for the handler icon at the right side of the address bar. If Chrome offers the
              choice, allow Gmail to open email links, then retry the mailto link.
            </p>
            <div className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-[160px_1fr]">
              <div className="flex items-center justify-center bg-paper p-8 dark:bg-bg">
                <Image alt="Gmail" height="64" src="/provider-logos/gmail.svg" width="64" />
              </div>
              <div className="bg-paper p-6 dark:bg-bg">
                <h3 className="font-headline text-xl text-ink dark:text-text">
                  If Chrome never offers Gmail
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Confirm protocol requests are enabled, reload Gmail, and check whether Gmail is
                  already listed or blocked in handler settings. A managed Chrome profile can
                  prevent registration. In that case, use the system&apos;s default app or open a
                  webmail compose link directly.
                </p>
              </div>
            </div>
          </section>

          <section className="scroll-mt-8" id="system-default">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Fix 3 · Your device
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Choose a default email app in the operating system
            </h2>
            <p className="mt-4 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              When Chrome has no web handler, it normally passes the mailto request to the operating
              system. If the wrong desktop app opens, or nothing opens, check the default email
              application on the device.
            </p>
            <div className="mt-7 grid gap-px bg-border sm:grid-cols-2">
              <div className="bg-paper p-6 dark:bg-bg">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
                  Windows
                </p>
                <h3 className="mt-3 font-headline text-xl text-ink dark:text-text">
                  Default apps by protocol
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Open Settings, choose Apps, then Default apps. Find the email app or the MAILTO
                  protocol and assign the client you want. The exact path varies between Windows
                  versions.
                </p>
              </div>
              <div className="bg-paper p-6 dark:bg-bg">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
                  macOS
                </p>
                <h3 className="mt-3 font-headline text-xl text-ink dark:text-text">
                  Default email reader
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Open the Mail app, then its General settings, and choose a default email reader.
                  That choice controls which desktop app receives mailto links from browsers.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-ink-soft dark:text-text-soft">
              On ChromeOS, Android, iOS, Linux, or a managed device, the available defaults and
              policy controls differ. The useful test is the same: confirm that one app or web
              handler owns the email protocol, then retry in Chrome.
            </p>
          </section>

          <section className="scroll-mt-8" id="site-owner">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Fix 4 · Your website
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Prove the link works before blaming Chrome
            </h2>
            <p className="mt-4 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              If you publish the page, reduce the test to a plain anchor. A correct link starts with{' '}
              <code>mailto:</code>, contains a valid recipient, and percent-encodes subject or body
              values. It does not need JavaScript.
            </p>
            <div className="mt-6">
              <CodeBlock>{`<a href="mailto:hello@example.com?subject=Website%20question">
  Email us
</a>`}</CodeBlock>
            </div>
            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y border-ink dark:border-text">
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider">
                      Symptom
                    </th>
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider">
                      Likely layer
                    </th>
                    <th className="py-3 font-mono text-[10px] uppercase tracking-wider">
                      Next test
                    </th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft dark:text-text-soft">
                  {[
                    [
                      'Every mailto link fails',
                      'Browser or device handler',
                      'Check Chrome handlers and the system default',
                    ],
                    [
                      'Only one link fails',
                      'HTML or JavaScript',
                      'Paste a plain anchor into a blank page',
                    ],
                    [
                      'Works in a new tab, not an embed',
                      'Iframe or host policy',
                      'Test outside the preview or embedded surface',
                    ],
                    ['Wrong recipient or subject', 'Mailto syntax', 'Rebuild and encode the URL'],
                  ].map(([symptom, layer, test]) => (
                    <tr className="border-b border-border" key={symptom}>
                      <th className="py-4 pr-4 font-semibold text-ink dark:text-text">{symptom}</th>
                      <td className="py-4 pr-4">{layer}</td>
                      <td className="py-4">{test}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-7 space-y-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              <li>
                <strong className="text-ink dark:text-text">Remove click interception.</strong>{' '}
                Check whether a script calls <code>preventDefault()</code> without opening another
                destination.
              </li>
              <li>
                <strong className="text-ink dark:text-text">Test outside an iframe.</strong> Website
                builders, embedded previews, and sandboxed frames may restrict external protocol
                launches.
              </li>
              <li>
                <strong className="text-ink dark:text-text">Encode the message.</strong> Use the{' '}
                <Link
                  className="font-semibold text-red underline-offset-4 hover:underline"
                  href="/tools/mailto-link-generator"
                >
                  mailto link generator
                </Link>{' '}
                to catch spaces, line breaks, ampersands, and missing separators.
              </li>
              <li>
                <strong className="text-ink dark:text-text">Keep a visible address.</strong> A copy
                fallback still works when the visitor cannot or does not want to configure a mail
                handler.
              </li>
            </ul>
          </section>

          <section className="scroll-mt-8" id="durable-fix">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Fix 5 · Reduce visitor setup
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Offer webmail without deleting the mailto fallback
            </h2>
            <p className="mt-4 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              You cannot repair every visitor&apos;s Chrome profile from your website. You can avoid
              making handler setup the only path. smart-mailto upgrades a normal mailto anchor with
              a provider picker, while the original link remains available if the library fails to
              load.
            </p>
            <div className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-3">
              {providers.map(provider => (
                <div
                  className="flex min-h-28 flex-col items-center justify-center gap-3 bg-paper p-4 dark:bg-bg"
                  key={provider.name}
                >
                  <Image alt="" height="36" src={provider.logo} width="36" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft dark:text-text-soft">
                    {provider.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-7 border-t border-border pt-6">
              <div className="grid gap-6 text-sm leading-6 text-ink-soft dark:text-text-soft sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-ink dark:text-text">
                    Preserve the visitor&apos;s choice
                  </h3>
                  <p className="mt-2">
                    Webmail, native mail, and copy-address paths cover more setups than one forced
                    destination. Native mail is included by default on mobile and can be enabled on
                    desktop.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-ink dark:text-text">
                    Be clear about the tradeoff
                  </h3>
                  <p className="mt-2">
                    A picker adds a step for someone whose mail handler already works. A remembered
                    provider choice stays in this site&apos;s local storage and does not follow the
                    visitor across other websites.
                  </p>
                </div>
              </div>
              <Link
                className="mt-7 inline-block font-mono text-xs font-bold uppercase tracking-[0.16em] text-red underline-offset-4 hover:underline"
                href="/guides/replace-mailto"
              >
                Add the webmail fallback →
              </Link>
            </div>
          </section>

          <section className="scroll-mt-8" id="faq">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Questions
            </p>
            <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Chrome and mailto FAQ
            </h2>
            <div className="mt-7">
              {faqItems.map(item => (
                <details className="group border-t border-border py-5" key={item.question}>
                  <summary className="cursor-pointer list-none pr-8 font-semibold text-ink marker:hidden dark:text-text">
                    {item.question}
                  </summary>
                  <p className="mt-3 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 border-t border-border pt-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
              The useful split
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              If all mailto links fail, check the visitor&apos;s handler. If only yours fails,
              inspect the anchor and its click code.
            </p>
            <Link
              className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red hover:text-red-dark"
              href="/docs/browser-support"
            >
              See browser support →
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
