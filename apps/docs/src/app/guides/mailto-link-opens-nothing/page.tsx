import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GuideDemo } from '@/components/GuideDemo';

const pageUrl = 'https://smart-mailto.vercel.app/guides/mailto-link-opens-nothing';

export const metadata: Metadata = {
  title: 'Mailto Link Opens Nothing? Fix the Link and Its Fallback',
  description:
    'Troubleshoot a mailto link that does nothing. Check the href, browser handler, and operating-system mail app, then add a webmail or copy fallback.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto link opens nothing? A developer troubleshooting guide',
    description:
      'Check the link, browser handler, and native mail setup, then give visitors a useful fallback.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqItems = [
  {
    question: 'Why does clicking a mailto link do nothing?',
    answer:
      'The href may be malformed, a script may be cancelling the click, or the browser and operating system may have no useful mail handler configured. Test a minimal link first to separate link markup from device setup.',
  },
  {
    question: 'Can a website choose the visitor’s default email app?',
    answer:
      'No. A plain mailto link asks the browser and operating system to open their configured handler. The site cannot repair every visitor’s device setting.',
  },
  {
    question: 'How can I open Gmail from a mailto link?',
    answer:
      'The visitor can configure Gmail as a protocol handler in a supported browser. A site can also offer a webmail picker that opens a Gmail compose URL when the visitor chooses it.',
  },
  {
    question: 'Should I replace the mailto link with a form?',
    answer:
      'Use a form when you must validate fields, route submissions, or confirm that a request reached your system. Keep mailto when the visitor should send from their own email account.',
  },
  {
    question: 'Does smart-mailto remove the original mailto fallback?',
    answer:
      'No. It intercepts valid mailto clicks when available. If the picker cannot load or the link should not be intercepted, the original mailto URL remains the fallback.',
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
  { name: 'Yahoo Mail', logo: '/provider-logos/yahoo.svg' },
  { name: 'Native mail', logo: '/provider-logos/native.svg' },
  { name: 'Copy address', logo: '/provider-logos/copy.svg' },
];

function CodeBlock({ label, children }: { label: string; children: string }) {
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

export default function MailtoLinkOpensNothingPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Troubleshooting guide · For website owners
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Mailto link opens nothing? Start with the link, then the handler.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            A dead click can come from the page or the visitor&apos;s device. This sequence tells
            you which one failed, what you can fix, and how to leave a useful fallback.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-3 bg-red px-6 py-3 font-body font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80"
              href="#check-the-link"
            >
              Run the checks
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                arrow_downward
              </span>
            </a>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
              href="/guides/replace-mailto"
            >
              Skip to the fallback
            </Link>
          </div>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Fast diagnosis
          </p>
          <ol className="mt-5 space-y-5">
            {[
              ['01', 'Test a minimal mailto link'],
              ['02', 'Check the browser handler'],
              ['03', 'Check the default mail app'],
              ['04', 'Add a visitor-controlled fallback'],
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

      <div className="grid gap-14 py-14 lg:grid-cols-[190px_minmax(0,700px)_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            On this page
          </p>
          <ol className="mt-4 space-y-3 border-l border-border pl-4 font-mono text-xs dark:border-border">
            <li>
              <a className="text-red hover:text-red-dark" href="#check-the-link">
                1. Check the link
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#check-the-browser">
                2. Check the browser
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#check-the-system">
                3. Check the system
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#choose-a-fallback">
                4. Choose a fallback
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
          <section className="scroll-mt-8" id="check-the-link">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Check 1 · Your page
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Reduce the link to one known-good address
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Start without a subject, body, CC, or BCC. A basic anchor separates invalid markup
              from a device that has no useful mail handler.
            </p>
            <div className="mt-6">
              <CodeBlock label="Minimal HTML">
                {'<a href="mailto:hello@example.com">Email us</a>'}
              </CodeBlock>
            </div>
            <div className="mt-7 grid gap-5 border-t border-border pt-6 dark:border-border sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-ink dark:text-text">If this link works</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Reintroduce the subject and body one field at a time. Encode spaces, line breaks,
                  ampersands, and other reserved characters.
                </p>
                <Link
                  className="mt-4 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red underline-offset-4 hover:underline"
                  href="/tools/mailto-link-generator"
                >
                  Build a valid mailto link →
                </Link>
              </div>
              <div>
                <h3 className="font-semibold text-ink dark:text-text">
                  If this link still does nothing
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Test it on another device. If the same page works there, the original browser or
                  operating-system handler is the likely difference.
                </p>
              </div>
            </div>
          </section>

          <section className="scroll-mt-8" id="check-the-browser">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Check 2 · The browser
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Look for a blocked or missing protocol handler
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Browsers treat <code>mailto:</code> as an external protocol. A webmail service may be
              registered to handle it, the browser may pass it to the operating system, or a prior
              choice may leave no useful result.
            </p>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              If the click fails in Chrome, follow the{' '}
              <Link
                className="font-semibold text-red hover:text-red-dark"
                href="/guides/mailto-not-working-in-chrome"
              >
                Chrome-specific troubleshooting guide
              </Link>{' '}
              for handler and default-app checks.
            </p>
            <ol className="mt-7 space-y-5">
              {[
                [
                  'Try a private window',
                  'This helps separate the page from an extension or a saved site setting. It does not reset the operating-system mail app.',
                ],
                [
                  'Check protocol-handler settings',
                  'Look for mailto handling in the browser’s site or handler settings. The exact menu varies by browser and version.',
                ],
                [
                  'Watch for blocked pop-ups or navigation',
                  'If custom JavaScript handles the click, confirm that it does not cancel the event without opening a destination.',
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

          <section className="scroll-mt-8" id="check-the-system">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Check 3 · The device
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Confirm there is a default mail app
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              When the browser delegates the link, the operating system needs an application for
              email links. Installing a mail app is not always enough. It may also need to be set as
              the default handler.
            </p>
            <div className="mt-7 border-l-4 border-red bg-surface px-6 py-5 dark:bg-surface-container">
              <h3 className="font-semibold text-ink dark:text-text">
                This is where a site owner&apos;s control ends
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-text-soft">
                You can fix your link and avoid cancelling the click. You cannot configure every
                visitor&apos;s browser or default mail app. A public site needs a fallback the
                visitor can choose on the page.
              </p>
            </div>
          </section>

          <section className="scroll-mt-8" id="choose-a-fallback">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Check 4 · Your fallback
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Give the visitor another way to continue
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              The right fallback depends on what the contact action needs to accomplish. Do not hide
              the address behind a click that may fail.
            </p>
            <div className="mt-7 grid gap-px border border-border bg-border dark:border-border dark:bg-border sm:grid-cols-3">
              {[
                {
                  label: 'Show the address',
                  title: 'Copy fallback',
                  copy: 'Display the email address as text or add an explicit copy action.',
                },
                {
                  label: 'Offer a choice',
                  title: 'Webmail picker',
                  copy: 'Let the visitor choose a webmail provider, native mail, or copy address.',
                },
                {
                  label: 'Guarantee receipt',
                  title: 'Contact form',
                  copy: 'Use a form when your system must validate and record the submission.',
                },
              ].map(item => (
                <div className="bg-paper p-6 dark:bg-bg" key={item.title}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                    {item.label}
                  </p>
                  <h3 className="mt-3 font-headline text-xl font-medium text-ink dark:text-text">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t-4 border-red bg-surface p-6 dark:bg-surface-container sm:p-8">
              <div className="grid gap-7 sm:grid-cols-[1fr_210px] sm:items-center">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
                    Keep the same anchor
                  </p>
                  <h3 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
                    Add webmail and copy choices without removing mailto
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    smart-mailto intercepts valid links when available. The original mailto URL
                    remains the safety net when the picker cannot load or should not handle the
                    click.
                  </p>
                  <div className="mt-6">
                    <GuideDemo />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 dark:border-border sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
                  {providers.map(provider => (
                    <div className="text-center" key={provider.name}>
                      <Image
                        alt=""
                        className="mx-auto h-8 w-8"
                        height="32"
                        src={provider.logo}
                        width="32"
                      />
                      <span className="mt-2 block text-[9px] leading-tight text-ink-muted dark:text-text-muted">
                        {provider.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="scroll-mt-8" id="faq">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Questions
            </p>
            <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Mailto troubleshooting FAQ
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
              A useful test result
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              If the minimal link works on one device but not another, your HTML is probably not the
              remaining blocker.
            </p>
            <Link
              className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red hover:text-red-dark"
              href="/compare/smart-mailto-vs-mailto"
            >
              Compare fallback options →
            </Link>
          </div>
        </aside>
      </div>

      <section className="border-t-4 border-double border-border py-12 text-center dark:border-border">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
          Fix what you control
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-headline text-4xl font-medium tracking-tight text-ink dark:text-text">
          Keep the mailto link and give visitors an exit route.
        </h2>
        <div className="mt-7 flex justify-center">
          <GuideDemo />
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-ink-soft dark:text-text-soft">
          Follow the{' '}
          <Link
            className="font-semibold text-red hover:text-red-dark"
            href="/guides/replace-mailto"
          >
            installation guide
          </Link>
          , inspect the{' '}
          <a
            className="font-semibold text-red hover:text-red-dark"
            href="https://github.com/namandhakad712/smart-mailto"
          >
            source on GitHub
          </a>
          , view the{' '}
          <a
            className="font-semibold text-red hover:text-red-dark"
            href="https://www.npmjs.com/package/@smart-mailto/core"
          >
            package on npm
          </a>
          , or return to the{' '}
          <Link className="font-semibold text-red hover:text-red-dark" href="/">
            live demo
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
