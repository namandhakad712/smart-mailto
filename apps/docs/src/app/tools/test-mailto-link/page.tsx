import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const pageUrl = 'https://smart-mailto.vercel.app/tools/test-mailto-link';

export const metadata: Metadata = {
  title: 'Mailto Link Test: Check Browser and HTML | smart-mailto',
  description:
    'Run a mailto link test, diagnose a broken handler or malformed href, and copy reliable browser and Playwright checks for subject and body fields.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto link test: check the browser, HTML, and fallback',
    description:
      'Use two safe test links to separate mailto markup problems from browser and mail-app setup.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const basicTestHref = 'mailto:hello@example.com';
const encodedTestHref =
  'mailto:hello@example.com?subject=Website%20question&body=Hi%20there%2C%0A%0AI%20am%20testing%20this%20mailto%20link.';

const faqItems = [
  {
    question: 'How do I test whether a mailto link works?',
    answer:
      'Start with a minimal mailto link that contains only one address. If it opens a compose window, add the subject and body back one field at a time. If it does not open, test another browser or device to separate the page from the visitor’s mail-handler setup.',
  },
  {
    question: 'Does clicking the test link send an email?',
    answer:
      'No. A mailto link asks a configured mail app or webmail handler to open a draft. Nothing is sent unless you review the draft and press Send in that app.',
  },
  {
    question: 'Why does a mailto link work for me but not for visitors?',
    answer:
      'The link can be valid while a visitor has no default mail app, no browser protocol handler, or a different saved choice. A website cannot configure those settings on every device.',
  },
  {
    question: 'Can Playwright verify which mail app opens?',
    answer:
      'A reliable page test should verify the link’s href and decoded parameters without launching an external mail app. Test the provider or native-mail destination separately in a controlled browser flow if your product replaces the default behavior.',
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

const outcomes = [
  {
    label: 'A draft opens',
    title: 'The basic handler works',
    copy: 'Your browser found a mail app or webmail handler. If the real link still fails, inspect its parameters and page scripts.',
  },
  {
    label: 'Nothing happens',
    title: 'Check the handler next',
    copy: 'Try the same test in another browser or on another device. One working result points away from the HTML and toward local setup.',
  },
  {
    label: 'The wrong app opens',
    title: 'The device chose it',
    copy: 'The link is reaching a handler, but the saved browser or operating-system default is not the one you expected.',
  },
] as const;

const providers = [
  { name: 'Gmail', logo: '/provider-logos/gmail.svg' },
  { name: 'Outlook', logo: '/provider-logos/outlook-personal.svg' },
  { name: 'Native mail', logo: '/provider-logos/native.svg' },
  { name: 'Copy address', logo: '/provider-logos/copy.svg' },
] as const;

function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="overflow-x-auto border border-border bg-code-bg dark:border-border">
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </div>
      <pre className="min-w-max p-5 text-sm leading-7 text-white">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function TestMailtoLinkPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Browser test · No email is sent
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Test a mailto link in 30 seconds.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            Open one known-good link before debugging your own. The result tells you whether to
            inspect the HTML, the browser&apos;s mail handler, or the device&apos;s default app.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-3 bg-red px-6 py-3 font-body font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80"
              href={basicTestHref}
            >
              Run the basic test
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                open_in_new
              </span>
            </a>
            <a
              className="inline-flex min-h-11 items-center justify-center border border-border px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-red transition-colors hover:border-red dark:border-border"
              href={encodedTestHref}
            >
              Test subject and body
            </a>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-ink-muted dark:text-text-muted">
            Both links use an example address. They only open a draft. Close the draft without
            sending it when the test is complete.
          </p>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            What this test isolates
          </p>
          <ol className="mt-5 space-y-5">
            {[
              ['01', 'A valid, minimal mailto href'],
              ['02', 'The browser protocol handler'],
              ['03', 'The device default mail app'],
              ['04', 'Encoded subject and body fields'],
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
            {[
              ['#read-the-result', '1. Read the result'],
              ['#check-the-html', '2. Check the HTML'],
              ['#test-parameters', '3. Test parameters'],
              ['#automate-the-check', '4. Automate the check'],
              ['#test-across-devices', '5. Test across devices'],
              ['#add-a-fallback', '6. Add a fallback'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <li key={href}>
                <a className="text-red hover:text-red-dark" href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-16">
          <section className="scroll-mt-8" id="read-the-result">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 1 · Read the result
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              One click narrows the failure to the page or the device
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              A mailto link does not send a message itself. It asks the browser to hand an email
              address to a registered handler. That can be a desktop app, a webmail service, or
              nothing useful. The browser and operating system make that choice, not the link.
            </p>
            <div className="mt-7 grid gap-px border border-border bg-border dark:border-border dark:bg-border sm:grid-cols-3">
              {outcomes.map(outcome => (
                <div className="bg-paper p-6 dark:bg-bg" key={outcome.label}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                    {outcome.label}
                  </p>
                  <h3 className="mt-3 font-headline text-xl font-medium text-ink dark:text-text">
                    {outcome.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {outcome.copy}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="scroll-mt-8" id="check-the-html">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 2 · Check the HTML
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Reduce your real link to one address
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Replace your current anchor temporarily with the minimal version below. Keep
              <code className="mx-1">mailto:</code> lowercase, put the email address immediately
              after it, and do not add a space between the scheme and address. This syntax follows
              the mailto URI format defined in{' '}
              <a
                className="font-semibold text-red hover:text-red-dark"
                href="https://datatracker.ietf.org/doc/html/rfc6068"
              >
                RFC 6068
              </a>
              .
            </p>
            <div className="mt-6">
              <CodeBlock label="Minimal HTML">
                {'<a href="mailto:hello@example.com">Email us</a>'}
              </CodeBlock>
            </div>
            <p className="mt-5 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              If the minimal version works, the handler is available and the original link needs
              attention. Add each recipient or parameter back separately. If the minimal version
              still fails, use the{' '}
              <Link
                className="font-semibold text-red hover:text-red-dark"
                href="/guides/mailto-link-opens-nothing"
              >
                four-check troubleshooting guide
              </Link>{' '}
              to inspect page scripts, the browser, and the default mail app.
            </p>
          </section>

          <section className="scroll-mt-8" id="test-parameters">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 3 · Test parameters
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Add subject and body only after the basic link passes
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              The first parameter starts with <code>?</code>. Later parameters start with
              <code className="mx-1">&amp;</code>. Encode spaces as <code>%20</code>, line breaks as
              <code className="ml-1">%0A</code>, and any literal ampersand inside a value as
              <code className="ml-1">%26</code>. Otherwise one field can be cut short or parsed as
              another parameter.
            </p>
            <div className="mt-6">
              <CodeBlock label="Subject and body">
                {
                  '<a href="mailto:hello@example.com?subject=Website%20question&body=Hi%20there%2C%0A%0AI%20am%20testing%20this%20mailto%20link.">Email us</a>'
                }
              </CodeBlock>
            </div>
            <p className="mt-5 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              Open the draft and compare the visible address, subject, and body with the values you
              intended. For a longer message, use the{' '}
              <Link
                className="font-semibold text-red hover:text-red-dark"
                href="/tools/mailto-link-generator"
              >
                mailto link generator
              </Link>{' '}
              instead of encoding the URL by hand.
            </p>
          </section>

          <section className="scroll-mt-8" id="automate-the-check">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 4 · Automated test
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Test the href without launching an external app
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              End-to-end tests become unreliable when they depend on whichever mail app happens to
              be installed on the test runner. Verify the anchor, parse the URI, and assert the
              decoded fields on the page instead.
            </p>
            <div className="mt-6">
              <CodeBlock label="Playwright">
                {`const link = page.getByRole('link', { name: 'Email support' });

await expect(link).toHaveAttribute('href', /^mailto:/);

const href = await link.getAttribute('href');
const mailto = new URL(href!);

expect(mailto.pathname).toBe('support@example.com');
expect(mailto.searchParams.get('subject')).toBe('Website question');`}
              </CodeBlock>
            </div>
            <p className="mt-5 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              This proves that your rendered page exposes the expected address and parameters. It
              does not prove that every visitor has a working mail handler, because that behavior
              lives outside your page.
            </p>
          </section>

          <section className="scroll-mt-8" id="test-across-devices">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 5 · Cross-device check
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Test the outcome, not every possible email client
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Run the minimal link on one desktop browser and one mobile device. Record whether a
              draft opens, which destination appears, and whether the address and subject survive.
              That small matrix catches the important difference between valid page markup and a
              visitor-side configuration problem.
            </p>
            <div className="mt-7 border-l-4 border-red bg-surface px-6 py-5 dark:bg-surface-container">
              <h3 className="font-semibold text-ink dark:text-text">
                Do not treat one laptop as universal proof
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-text-soft">
                A mailto link can pass on your machine and still fail for someone without a useful
                handler. Your page can keep the link correct, but it cannot repair every
                visitor&apos;s browser or operating-system defaults.
              </p>
            </div>
          </section>

          <section className="scroll-mt-8" id="add-a-fallback">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Step 6 · Visitor fallback
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Keep the valid link and add a way around local setup
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              When the link is correct but the visitor has no suitable handler, show the address,
              offer a copy action, or let them choose a webmail service. smart-mailto keeps your
              existing anchor and adds provider, native-mail, and copy choices on top.
            </p>
            <div className="mt-7 grid gap-7 border-t-4 border-red bg-surface p-6 dark:bg-surface-container sm:grid-cols-[1fr_240px] sm:items-center sm:p-8">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
                  One link, several exits
                </p>
                <h3 className="mt-3 font-headline text-2xl font-medium tracking-tight text-ink dark:text-text">
                  Let the visitor choose what works on their device
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Use native mail when it is configured, open a selected webmail compose page, or
                  copy the address without abandoning the contact attempt.
                </p>
                <Link
                  className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
                  href="/guides/replace-mailto"
                >
                  Install smart-mailto <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-border pt-6 dark:border-border sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
                {providers.map(provider => (
                  <div className="text-center" key={provider.name}>
                    <Image
                      alt=""
                      className="mx-auto h-9 w-9"
                      height="36"
                      src={provider.logo}
                      width="36"
                    />
                    <span className="mt-2 block text-[9px] leading-tight text-ink-muted dark:text-text-muted">
                      {provider.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="scroll-mt-8" id="faq">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Questions
            </p>
            <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Mailto link testing FAQ
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
              The useful boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              Your page owns the href and its scripts. The visitor owns the browser handler and
              default mail app.
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
    </article>
  );
}
