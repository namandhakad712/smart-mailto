import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GuideDemo } from '@/components/GuideDemo';

const pageUrl = 'https://smart-mailto.vercel.app/guides/mailto-opens-wrong-email-app';

export const metadata: Metadata = {
  title: 'Mailto Opens the Wrong Email App? Fix the Default',
  description:
    'Find why a mailto link opens Gmail, Outlook, or another unwanted app. Check the browser handler and device default, or offer visitors a choice.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto opens the wrong email app? Fix the default',
    description:
      'Separate the link from the saved handler, change the right default, or let each visitor choose a mail provider.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqItems = [
  {
    question: 'Can a mailto link choose Gmail or Outlook?',
    answer:
      'No. A normal mailto link supplies the recipient and optional message fields. The browser and operating system decide which registered handler receives it.',
  },
  {
    question: 'Why does mailto open in my browser instead of Outlook?',
    answer:
      'A webmail service may be saved as the browser protocol handler. Remove or change that handler, then confirm Outlook is assigned to email links in the operating system.',
  },
  {
    question: 'Can a managed browser block handler changes?',
    answer:
      'Yes. A work or school profile can apply policies that hide or lock protocol-handler settings. In that case, the profile administrator controls the available choices.',
  },
  {
    question: "Does smart-mailto change the visitor's default app?",
    answer:
      'No. It offers webmail, copy, and optional native-mail choices on the site before the browser delegates the original mailto link.',
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

const handlerLayers = [
  {
    number: '01',
    label: 'The link',
    copy: 'Carries the address and message fields. It does not name an email app.',
  },
  {
    number: '02',
    label: 'The browser',
    copy: 'May keep a saved webmail handler or pass the request to the device.',
  },
  {
    number: '03',
    label: 'The device',
    copy: 'Uses the app assigned to MAILTO when the browser delegates the click.',
  },
] as const;

const providerLogos = [
  { name: 'Gmail', src: '/provider-logos/gmail.svg' },
  { name: 'Outlook', src: '/provider-logos/outlook-personal.svg' },
  { name: 'Proton Mail', src: '/provider-logos/protonmail.svg' },
  { name: 'Native mail', src: '/provider-logos/native.svg' },
  { name: 'Copy address', src: '/provider-logos/copy.svg' },
] as const;

function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="overflow-hidden border border-border bg-code-bg dark:border-border">
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-white">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function MailtoOpensWrongEmailAppPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_350px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Wrong app guide · When the click works
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Mailto opens the wrong email app. Change the right default.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            The link is not choosing Gmail, Outlook, or a desktop app. A saved browser handler or
            the device&apos;s MAILTO default is. Check those two layers, then decide whether your
            site should offer a choice instead.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-3 bg-red px-6 py-3 font-body font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80"
              href="#find-the-owner"
            >
              Find the saved default
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                arrow_downward
              </span>
            </a>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
              href="/tools/test-mailto-link"
            >
              Test the link first
            </Link>
          </div>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            The useful clue
          </p>
          <p className="mt-4 font-headline text-3xl font-medium leading-tight text-ink dark:text-text">
            Something opens.
          </p>
          <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
            That separates this problem from a dead click. Keep the recipient and message fields;
            change the handler that receives them.
          </p>
          <div className="mt-6 flex items-center gap-3 border-t border-border pt-5 dark:border-border">
            <Image alt="" height="34" src="/provider-logos/gmail.svg" width="34" />
            <span aria-hidden="true" className="font-mono text-red">
              →
            </span>
            <Image alt="" height="34" src="/provider-logos/outlook-personal.svg" width="34" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-text-muted">
              Change the receiver
            </span>
          </div>
        </aside>
      </header>

      <div className="grid gap-14 py-14 lg:grid-cols-[190px_minmax(0,700px)_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            On this page
          </p>
          <ol className="mt-4 space-y-3 border-l border-border pl-4 font-mono text-xs dark:border-border">
            <li>
              <a className="text-red hover:text-red-dark" href="#find-the-owner">
                1. Find the owner
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#browser-handler">
                2. Change the browser
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#device-default">
                3. Change the device
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#offer-a-choice">
                4. Offer a choice
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
          <section className="scroll-mt-8" id="find-the-owner">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 1 · Prove what the link controls
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Check the address and fields before changing settings
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Paste the URL into the{' '}
              <Link
                className="font-semibold text-red hover:text-red-dark"
                href="/tools/test-mailto-link"
              >
                private mailto tester
              </Link>
              . If the expected recipient, subject, and body appear, the link is carrying the right
              request. The app that opens is a handler decision outside the link.
            </p>
            <div className="mt-7 grid gap-px border border-border bg-border dark:border-border dark:bg-border sm:grid-cols-3">
              {handlerLayers.map(layer => (
                <div className="bg-paper p-6 dark:bg-bg" key={layer.number}>
                  <p className="font-mono text-xs text-red">{layer.number}</p>
                  <h3 className="mt-4 font-headline text-xl font-medium text-ink dark:text-text">
                    {layer.label}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {layer.copy}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="scroll-mt-8" id="browser-handler">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 2 · The browser
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Remove or replace the saved webmail handler
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              A browser can register a site such as Gmail to handle email links. That choice can
              override the desktop app you expected. Open the browser&apos;s protocol-handler or
              site settings, find the email handler, and remove or replace the saved service.
            </p>
            <div className="mt-7 border-l-4 border-red bg-surface px-6 py-5 dark:bg-surface-container">
              <h3 className="font-semibold text-ink dark:text-text">Using Chrome?</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-text-soft">
                Follow the{' '}
                <Link
                  className="font-semibold text-red hover:text-red-dark"
                  href="/guides/mailto-not-working-in-chrome"
                >
                  Chrome handler guide
                </Link>{' '}
                for the exact protocol, Gmail, and system-default checks. Managed work or school
                profiles may lock those settings.
              </p>
            </div>
          </section>

          <section className="scroll-mt-8" id="device-default">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 3 · The device
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Assign MAILTO to the app you actually use
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              If the browser has no saved webmail handler, it normally delegates the click to the
              operating system. Open default-app settings, find the association for email links or
              the MAILTO protocol, and select the preferred mail app.
            </p>
            <ol className="mt-7 space-y-5">
              {[
                [
                  'Change one layer at a time',
                  'Clear the browser handler first, then test before changing the operating-system default.',
                ],
                [
                  'Test the same minimal link',
                  'Use mailto:hello@example.com so subject or body encoding cannot confuse the result.',
                ],
                [
                  'Check the active profile',
                  'Personal and managed browser profiles can keep different handler choices on the same computer.',
                ],
              ].map(([title, copy], index) => (
                <li
                  className="grid gap-3 border-t border-border pt-5 dark:border-border sm:grid-cols-[46px_1fr]"
                  key={title}
                >
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
          </section>

          <section className="scroll-mt-8" id="offer-a-choice">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 4 · Your site
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Offer a provider choice when one default is not enough
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Fixing a default solves one device. A public site serves visitors with different apps,
              accounts, and managed profiles. smart-mailto can offer webmail and copy choices before
              the browser delegates the original link. Native mail is first on mobile and can be
              enabled on desktop.
            </p>
            <div className="mt-7 grid grid-cols-5 gap-3 border-y border-border py-6 dark:border-border">
              {providerLogos.map(provider => (
                <div className="text-center" key={provider.name}>
                  <Image
                    alt=""
                    className="mx-auto h-9 w-9"
                    height="36"
                    src={provider.src}
                    width="36"
                  />
                  <span className="mt-2 block text-[9px] leading-tight text-ink-muted dark:text-text-muted">
                    {provider.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <CodeBlock label="Keep native mail available on desktop">
                {
                  'initSmartMailto({ includeNative: true });\n\n// Keep the original anchor in your HTML.\n// <a href="mailto:hello@example.com">Email us</a>'
                }
              </CodeBlock>
            </div>
            <div className="mt-8 border-t-4 border-red bg-surface p-6 dark:bg-surface-container sm:p-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
                See the choice before you install
              </p>
              <h3 className="mt-3 max-w-xl font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
                Keep the same mailto link. Put the decision in front of the visitor.
              </h3>
              <p className="mt-4 max-w-[62ch] text-sm leading-6 text-ink-soft dark:text-text-soft">
                The remembered provider stays in this site&apos;s local storage. It does not change
                the browser or device default for other sites.
              </p>
              <div className="mt-6">
                <GuideDemo />
              </div>
              <p className="mt-5 text-sm leading-6 text-ink-soft dark:text-text-soft">
                Ready to add it? Follow the{' '}
                <Link
                  className="font-semibold text-red hover:text-red-dark"
                  href="/guides/replace-mailto"
                >
                  installation guide
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="scroll-mt-8" id="faq">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Questions
            </p>
            <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Wrong email app FAQ
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
          <div className="sticky top-6 border-t border-border pt-4 dark:border-border">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
              Different symptom?
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              If nothing useful opens, use the broader diagnosis instead. A wrong destination means
              a handler exists; a dead click may not have one.
            </p>
            <Link
              className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red hover:text-red-dark"
              href="/guides/mailto-link-opens-nothing"
            >
              Diagnose a dead click →
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
