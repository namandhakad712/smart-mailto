import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GuideDemo } from '@/components/GuideDemo';

const pageUrl = 'https://smart-mailto.vercel.app/guides/mailto-without-email-client';

export const metadata: Metadata = {
  title: 'Mailto Without an Email Client: What Happens and Fixes',
  description:
    'Learn what a mailto link does when no email client is configured. Fix one device, then compare copy, contact-form, and webmail fallbacks for a public site.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto without an email client: what happens and fixes',
    description:
      'See why a valid mailto link can still reach no usable handler, then give visitors a fallback they control.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqItems = [
  {
    question: 'What happens when no email client is configured?',
    answer:
      'The browser passes the mailto request to a registered webmail handler or the operating system. If neither has a usable receiver, the click may do nothing, show a prompt, or produce an error depending on the browser and device.',
  },
  {
    question: 'Can a website detect whether a visitor has an email client?',
    answer:
      'Not reliably. A site should not promise that it can identify every usable desktop app or webmail handler before a click.',
  },
  {
    question: 'Should a public site use a contact form instead?',
    answer:
      'Use a form when your system must validate, route, or confirm receipt. Keep mailto when the visitor should send from their own account, but show the address or add another fallback.',
  },
  {
    question: 'Does smart-mailto remove the original mailto link?',
    answer:
      'No. It uses the existing valid anchor and offers webmail or copy choices when it intercepts the click. The original mailto URL remains available when interception does not happen or the picker cannot load.',
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

const fallbacks = [
  {
    label: 'Lowest setup',
    title: 'Show the address',
    copy: 'Make the email address visible as text so the contact path does not disappear with the click.',
    fit: 'Good for a simple public address',
  },
  {
    label: 'One useful action',
    title: 'Copy the address',
    copy: 'Add an explicit copy control for visitors who already know where they want to compose.',
    fit: 'Good as a last-resort fallback',
  },
  {
    label: 'Recorded receipt',
    title: 'Use a contact form',
    copy: 'Send through your own system when validation, routing, or confirmation is required.',
    fit: 'Good for support and lead intake',
  },
  {
    label: 'Visitor choice',
    title: 'Offer webmail',
    copy: 'Open a provider compose page from the same mailto fields without requiring a desktop app.',
    fit: 'Good when visitors use different providers',
  },
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

export default function MailtoWithoutEmailClientPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_350px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            No-client guide · Design for the missing handler
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Mailto without an email client: what the browser can and cannot do.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            A valid mailto link asks for a compose window. It does not supply the app that opens it.
            Fix one device by assigning a handler. For a public site, keep the address visible and
            offer a fallback that does not depend on local mail software.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-3 bg-red px-6 py-3 font-body font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80"
              href="#choose-a-fallback"
            >
              Compare four fallbacks
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                arrow_downward
              </span>
            </a>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
              href="/tools/test-mailto-link"
            >
              Check your link
            </Link>
          </div>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            The handoff
          </p>
          <div className="mt-5 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2">
            <span className="font-mono text-xs font-bold text-ink dark:text-text">LINK</span>
            <span aria-hidden="true" className="h-px bg-border" />
            <span className="font-mono text-xs font-bold text-ink dark:text-text">BROWSER</span>
            <span aria-hidden="true" className="h-px bg-border" />
            <span className="border border-red px-2 py-1 font-mono text-xs font-bold text-red">
              ?
            </span>
          </div>
          <p className="mt-5 text-sm leading-6 text-ink-soft dark:text-text-soft">
            With no registered webmail handler and no assigned desktop app, the browser has no
            dependable receiver for the request.
          </p>
          <div className="mt-5 flex items-center gap-3 border-t border-border pt-5 dark:border-border">
            <Image alt="" height="34" src="/provider-logos/copy.svg" width="34" />
            <span className="text-sm font-semibold text-ink dark:text-text">
              A copy action still works.
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
              <a className="text-red hover:text-red-dark" href="#what-mailto-does">
                1. What mailto does
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#fix-one-device">
                2. Fix one device
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#choose-a-fallback">
                3. Choose a fallback
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#keep-the-anchor">
                4. Keep the anchor
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
          <section className="scroll-mt-8" id="what-mailto-does">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 1 · Follow the request
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              A mailto link describes a message, not the software that sends it
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              The link can include recipients, copies, hidden copies, a subject, and a body. When it
              is clicked, the browser looks for a registered webmail handler or delegates the
              request to the operating system. The link itself does not install or select a client.
            </p>
            <div className="mt-7">
              <CodeBlock label="A valid link still needs a receiver">
                {'<a href="mailto:hello@example.com?subject=Project%20question">Email us</a>'}
              </CodeBlock>
            </div>
            <p className="mt-5 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Verify the address and fields with the{' '}
              <Link
                className="font-semibold text-red hover:text-red-dark"
                href="/tools/test-mailto-link"
              >
                live mailto tester
              </Link>
              . A passing test proves the link can be parsed. It does not prove that every visitor
              has a usable handler.
            </p>
          </section>

          <section className="scroll-mt-8" id="fix-one-device">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 2 · Fix one device
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Register webmail or assign a desktop app to MAILTO
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              For your own computer, choose one receiver. Register the webmail service as the
              browser&apos;s email handler, or install a desktop mail app and assign it to email
              links in default-app settings. Then test the minimal link again.
            </p>
            <div className="mt-7 grid gap-px border border-border bg-border dark:border-border dark:bg-border sm:grid-cols-2">
              <div className="bg-paper p-6 dark:bg-bg">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                  Browser path
                </p>
                <h3 className="mt-3 font-headline text-xl font-medium text-ink dark:text-text">
                  Register a webmail handler
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Use this when you compose in a browser service such as Gmail. A managed profile
                  may restrict the setting.
                </p>
              </div>
              <div className="bg-paper p-6 dark:bg-bg">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                  Device path
                </p>
                <h3 className="mt-3 font-headline text-xl font-medium text-ink dark:text-text">
                  Assign the default mail app
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Use this when you compose in installed software. Installing the app alone may not
                  assign the MAILTO protocol.
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-[65ch] text-sm leading-6 text-ink-soft dark:text-text-soft">
              If the failure is in Chrome, use the{' '}
              <Link
                className="font-semibold text-red hover:text-red-dark"
                href="/guides/mailto-not-working-in-chrome"
              >
                Chrome-specific steps
              </Link>
              . If the cause is still unknown, start with the{' '}
              <Link
                className="font-semibold text-red hover:text-red-dark"
                href="/guides/mailto-link-opens-nothing"
              >
                four-layer diagnosis
              </Link>
              .
            </p>
          </section>

          <section className="scroll-mt-8" id="choose-a-fallback">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 3 · Design for visitors
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              A website cannot configure every visitor&apos;s device
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              There is no dependable cross-browser test for a usable email client. Keep the contact
              information visible, then choose a fallback based on what the interaction must
              accomplish.
            </p>
            <div className="mt-7 grid gap-px border border-border bg-border dark:border-border dark:bg-border sm:grid-cols-2">
              {fallbacks.map(item => (
                <div
                  className="flex min-h-64 flex-col justify-between bg-paper p-6 dark:bg-bg"
                  key={item.title}
                >
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                      {item.label}
                    </p>
                    <h3 className="mt-5 font-headline text-2xl font-medium text-ink dark:text-text">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                      {item.copy}
                    </p>
                  </div>
                  <p className="mt-7 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:border-border dark:text-text-muted">
                    {item.fit}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="scroll-mt-8" id="keep-the-anchor">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 4 · Add webmail without erasing mailto
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Keep the original anchor as the safety net
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              smart-mailto reads the existing valid link and builds provider-specific compose URLs
              from its fields. Visitors can choose webmail or copy the address without a desktop
              client. If interception does not happen or the picker cannot load, the original mailto
              URL remains available.
            </p>
            <div className="mt-7">
              <CodeBlock label="Install once, keep the normal anchor">
                {
                  'import { initSmartMailto } from \'@smart-mailto/core\';\n\ninitSmartMailto();\n\n// Existing markup stays valid without the library.\n// <a href="mailto:hello@example.com">Email us</a>'
                }
              </CodeBlock>
            </div>
            <div className="mt-8 border-t-4 border-red bg-surface p-6 dark:bg-surface-container sm:p-8">
              <div className="grid gap-7 sm:grid-cols-[1fr_180px] sm:items-center">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
                    Try the no-client path
                  </p>
                  <h3 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
                    Open webmail or copy the address from one valid link.
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    Copy is included unless disabled. Native mail is offered first on mobile, while
                    desktop sites can enable it explicitly.
                  </p>
                  <div className="mt-6">
                    <GuideDemo />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 border-t border-border pt-6 dark:border-border sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
                  {[
                    { name: 'Gmail', src: '/provider-logos/gmail.svg' },
                    { name: 'Outlook', src: '/provider-logos/outlook-personal.svg' },
                    { name: 'Proton Mail', src: '/provider-logos/protonmail.svg' },
                    { name: 'Copy', src: '/provider-logos/copy.svg' },
                  ].map(provider => (
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
              </div>
              <p className="mt-6 border-t border-border pt-5 text-sm leading-6 text-ink-soft dark:border-border dark:text-text-soft">
                Follow the{' '}
                <Link
                  className="font-semibold text-red hover:text-red-dark"
                  href="/guides/replace-mailto"
                >
                  installation guide
                </Link>{' '}
                or compare{' '}
                <Link
                  className="font-semibold text-red hover:text-red-dark"
                  href="/compare/smart-mailto-vs-mailto"
                >
                  smart-mailto with a plain link
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
              No email client FAQ
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
              The honest boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              A compose window is not proof that a message was sent or received. Use a contact form
              when your system must confirm submission.
            </p>
            <Link
              className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red hover:text-red-dark"
              href="/guides/replace-mailto"
            >
              Read the install guide →
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
