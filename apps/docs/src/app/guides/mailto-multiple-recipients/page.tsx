import type { Metadata } from 'next';
import Link from 'next/link';

const pageUrl = 'https://smart-mailto.vercel.app/guides/mailto-multiple-recipients';

export const metadata: Metadata = {
  title: 'Mailto Multiple Recipients: HTML Examples That Work',
  description:
    'Add multiple recipients to a mailto link with comma-separated To, CC, and BCC addresses. Copy valid HTML, encode it safely, and test client support.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto multiple recipients: HTML examples that work',
    description:
      'Use the RFC 6068 format for multiple To, CC, and BCC addresses, then test the finished link in the email clients your visitors use.',
  },
};

const faqItems = [
  {
    question: 'How do I add multiple recipients to a mailto link?',
    answer:
      'Put the recipient addresses after mailto: and separate them with commas. Do not put spaces between addresses. Add subject, cc, bcc, or body after a question mark.',
  },
  {
    question: 'Should mailto recipients use commas or semicolons?',
    answer:
      'RFC 6068 defines a comma-separated recipient list. Some email clients apply their own address-list rules, so use commas in the URI and test the finished link in the clients that matter to your audience.',
  },
  {
    question: 'Can a mailto link include multiple CC or BCC addresses?',
    answer:
      'Yes. Put one cc or bcc parameter in the query string and separate its addresses with commas. Avoid repeating the same parameter because mail clients handle repeated fields inconsistently.',
  },
  {
    question: 'Is mailto suitable for a large recipient list?',
    answer:
      'No. Every address is exposed in the page source, and the visitor still has to send the message from their own email client. Use a contact form or server-side mail flow when recipients must stay private or routing must be reliable.',
  },
] as const;

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

function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="overflow-hidden border border-border bg-code-bg">
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-white">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function MailtoMultipleRecipientsGuide() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            HTML guide · RFC 6068
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Mailto links with multiple recipients
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            Separate To, CC, and BCC addresses with commas. Keep the URI compact, encode the message
            fields, and test the finished link because email-client behavior still varies.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center bg-red px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
            href="/tools/mailto-link-generator"
          >
            Build the mailto link
          </Link>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Short answer
          </p>
          <code className="mt-5 block break-all font-mono text-sm leading-7 text-ink dark:text-text">
            mailto:alex@example.com,dev@example.com
          </code>
          <p className="mt-4 text-sm leading-6 text-ink-soft dark:text-text-soft">
            The comma is part of the standard. Leave spaces out of the address list.
          </p>
        </aside>
      </header>

      <div className="grid gap-14 py-14 lg:grid-cols-[190px_minmax(0,700px)_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            On this page
          </p>
          <ol className="mt-4 space-y-3 border-l border-border pl-4 font-mono text-xs">
            <li>
              <a className="text-red hover:text-red-dark" href="#basic-format">
                Basic format
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#cc-bcc">
                To, CC, and BCC
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#encoding">
                Encoding
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#client-support">
                Client support
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#privacy">
                Privacy limits
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#faq">
                FAQ
              </a>
            </li>
          </ol>
        </nav>

        <div className="min-w-0 space-y-16">
          <section className="scroll-mt-8" id="basic-format">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Copy this
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              The correct multiple-recipient format
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Put every primary recipient directly after <code>mailto:</code>, separated by commas.
              This follows the recipient-list syntax in{' '}
              <a
                className="font-semibold text-red underline-offset-4 hover:underline"
                href="https://www.rfc-editor.org/rfc/rfc6068#section-2"
              >
                RFC 6068
              </a>
              .
            </p>
            <div className="mt-6">
              <CodeBlock label="HTML">
                {'<a href="mailto:alex@example.com,dev@example.com">Email the team</a>'}
              </CodeBlock>
            </div>
            <p className="mt-5 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Use a comma, not a semicolon, and do not add spaces between addresses. The email app
              opens a draft addressed to both recipients. The visitor can still edit the list or
              close the draft without sending.
            </p>
          </section>

          <section className="scroll-mt-8" id="cc-bcc">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Address roles
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Add CC and BCC once
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Start query fields with <code>?</code>, then join each extra field with{' '}
              <code>&amp;</code>. Keep all CC addresses in one <code>cc</code> field and all hidden
              copies in one <code>bcc</code> field. Repeating a field can produce different results
              across clients.
            </p>
            <div className="mt-6">
              <CodeBlock label="HTML with To, CC, BCC, and subject">
                {
                  '<a href="mailto:alex@example.com,dev@example.com?cc=manager@example.com&amp;bcc=archive@example.com&amp;subject=Project%20update">Send the update</a>'
                }
              </CodeBlock>
            </div>
            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y border-ink dark:border-text">
                    <th className="py-3 pr-5 font-mono text-[10px] uppercase tracking-wider">
                      Field
                    </th>
                    <th className="py-3 pr-5 font-mono text-[10px] uppercase tracking-wider">
                      Use it for
                    </th>
                    <th className="py-3 font-mono text-[10px] uppercase tracking-wider">
                      Visibility
                    </th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft dark:text-text-soft">
                  <tr className="border-b border-border">
                    <th className="py-4 pr-5 font-mono text-xs text-ink dark:text-text">To</th>
                    <td className="py-4 pr-5">Primary recipients expected to act</td>
                    <td className="py-4">Visible in the draft</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="py-4 pr-5 font-mono text-xs text-ink dark:text-text">CC</th>
                    <td className="py-4 pr-5">People who should be kept informed</td>
                    <td className="py-4">Visible in the draft</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="py-4 pr-5 font-mono text-xs text-ink dark:text-text">BCC</th>
                    <td className="py-4 pr-5">A hidden copy after the visitor sends</td>
                    <td className="py-4">Still exposed in your page source</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="scroll-mt-8" id="encoding">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Two encoding layers
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Encode the message, then escape the HTML
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Percent-encode subject and body values. Spaces become <code>%20</code>, while body
              line breaks use <code>%0D%0A</code>. In HTML source, write separators between query
              fields as <code>&amp;amp;</code> so the markup stays valid.
            </p>
            <div className="mt-6">
              <CodeBlock label="HTML with an encoded body">
                {
                  '<a href="mailto:alex@example.com,dev@example.com?subject=Project%20update&amp;body=Hello%20team%2C%0D%0AHere%20is%20the%20latest.">Email the team</a>'
                }
              </CodeBlock>
            </div>
            <p className="mt-5 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              The{' '}
              <Link
                className="font-semibold text-red underline-offset-4 hover:underline"
                href="/tools/mailto-link-generator"
              >
                mailto link generator
              </Link>{' '}
              handles both layers and gives you ready-to-paste HTML.
            </p>
          </section>

          <section className="scroll-mt-8" id="client-support">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Standards are the baseline
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Test the clients your visitors actually use
            </h2>
            <div className="mt-6 grid gap-px bg-border sm:grid-cols-2">
              <div className="bg-paper p-6 dark:bg-bg">
                <h3 className="font-headline text-xl font-medium text-ink dark:text-text">
                  What the standard defines
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  Comma-separated recipients, one query string, and percent-encoded values.
                </p>
              </div>
              <div className="bg-surface p-6 dark:bg-surface-container">
                <h3 className="font-headline text-xl font-medium text-ink dark:text-text">
                  What the standard cannot promise
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  That every browser-handler and email-client combination interprets every field the
                  same way.
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Run the finished URL through the{' '}
              <Link
                className="font-semibold text-red underline-offset-4 hover:underline"
                href="/tools/test-mailto-link"
              >
                mailto link tester
              </Link>
              , then open it in the browser and email clients that matter to your audience. A valid
              URI can still hand off to the wrong app or to no configured handler.
            </p>
          </section>

          <section className="scroll-mt-8" id="privacy">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Keep the list small
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              A mailto link is not private routing
            </h2>
            <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
              Every To, CC, and BCC address in a mailto link is visible in the page source. Do not
              place a private address or a large distribution list in public HTML. Use a contact
              form or server-side mail flow when you must hide recipients, validate a submission,
              choose a recipient dynamically, or confirm delivery.
            </p>
            <div className="mt-6 border-l-4 border-red bg-surface px-6 py-5 dark:bg-surface-container">
              <h3 className="font-semibold text-ink dark:text-text">
                smart-mailto preserves the same recipient fields
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-text-soft">
                The library parses comma-separated To, CC, and BCC addresses and carries them into
                the chosen provider&apos;s composer. It improves provider choice, but it does not
                make a public recipient list private.
              </p>
              <Link
                className="mt-4 inline-flex font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red underline-offset-4 hover:underline"
                href="/guides/replace-mailto"
              >
                Add the webmail picker →
              </Link>
            </div>
          </section>

          <section className="scroll-mt-8 border-t border-border pt-12" id="faq">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">FAQ</p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Multiple-recipient mailto questions
            </h2>
            <div className="mt-7 divide-y divide-border border-y border-border">
              {faqItems.map(item => (
                <section className="py-6" key={item.question}>
                  <h3 className="font-headline text-xl font-medium text-ink dark:text-text">
                    {item.question}
                  </h3>
                  <p className="mt-3 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
                    {item.answer}
                  </p>
                </section>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
