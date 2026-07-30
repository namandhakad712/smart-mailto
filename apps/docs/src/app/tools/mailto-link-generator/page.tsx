import type { Metadata } from 'next';
import Link from 'next/link';
import { MailtoGenerator } from './MailtoGenerator';

const pageUrl = 'https://smart-mailto.vercel.app/tools/mailto-link-generator';

export const metadata: Metadata = {
  title: 'Free Mailto Link Generator: Subject, Body, CC & BCC',
  description:
    'Create a properly encoded mailto link and HTML anchor with To, subject, body, CC, and BCC. Free browser-based generator; nothing is sent.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'website',
    url: pageUrl,
    title: 'Free Mailto Link Generator',
    description:
      'Build a properly encoded mailto link with subject, body, CC, and BCC, then copy the ready-to-use HTML.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqItems = [
  {
    question: 'How do I create a mailto link?',
    answer:
      'Start the href with mailto: followed by the recipient. Add a question mark before the first optional field and an ampersand before each additional field. This generator handles the separators and percent-encoding for you.',
  },
  {
    question: 'Can a mailto link include a subject and body?',
    answer:
      'Yes. Add subject and body as query parameters. Spaces, line breaks, ampersands, and other reserved characters must be percent-encoded so email clients read them correctly.',
  },
  {
    question: 'Can I add CC, BCC, or multiple recipients?',
    answer:
      'Yes. CC and BCC are supported fields. RFC 6068 also allows comma-separated recipients, but email-client behavior can vary, so test the finished link in the clients your audience uses.',
  },
  {
    question: 'Does a mailto link send an email automatically?',
    answer:
      'No. It asks the browser or operating system to open an email composer. The visitor still reviews and sends the message.',
  },
  {
    question: 'Why does a correct mailto link open the wrong app?',
    answer:
      'The browser hands the link to the visitorΓÇÖs configured mail handler. A valid link can therefore open a desktop app, a webmail service, or nothing useful if no handler is configured.',
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

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto border border-border bg-code-bg p-5 text-sm leading-7 text-white">
      <code>{children}</code>
    </pre>
  );
}

export default function MailtoLinkGeneratorPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />

      <header className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[minmax(0,1fr)_270px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Free tool ┬╖ No signup
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Mailto link generator
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            Add a recipient, subject, body, CC, or BCC. Get a properly encoded mailto URL and a
            ready-to-paste HTML link.
          </p>
        </div>
        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            What this tool does
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
            <li>Encodes spaces, line breaks, and punctuation.</li>
            <li>Builds both the raw URL and HTML anchor.</li>
            <li>Runs entirely in your browser.</li>
          </ul>
        </aside>
      </header>

      <div className="py-12">
        <MailtoGenerator />
      </div>

      <div className="grid gap-14 border-t border-border py-14 lg:grid-cols-[190px_minmax(0,720px)_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            On this page
          </p>
          <ol className="mt-4 space-y-3 border-l border-border pl-4 font-mono text-xs">
            <li>
              <a className="text-red hover:text-red-dark" href="#how-to">
                How to use it
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#format">
                Mailto format
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#limits">
                Limits
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#not-working">
                Troubleshooting
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
          <section className="scroll-mt-8" id="how-to">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Quick answer
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              How to create a mailto link
            </h2>
            <ol className="mt-6 space-y-5">
              {[
                [
                  'Enter the recipient',
                  'Add one address or separate multiple addresses with commas. CC and BCC are optional.',
                ],
                [
                  'Write the prefilled message',
                  'Add a subject and opening body copy. The visitor can still edit both before sending.',
                ],
                [
                  'Copy and test',
                  'Use the HTML output on a website, or copy the raw URL into a document or button builder. Test it before publishing.',
                ],
              ].map(([title, copy], index) => (
                <li
                  className="grid gap-3 border-t border-border pt-5 sm:grid-cols-[46px_1fr]"
                  key={title}
                >
                  <span className="font-mono text-xs text-red">0{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-ink dark:text-text">{title}</h3>
                    <p className="mt-1 leading-7 text-ink-soft dark:text-text-soft">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="scroll-mt-8" id="format">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Syntax
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              The mailto link format
            </h2>
            <p className="mt-4 max-w-[65ch] leading-7 text-ink-soft dark:text-text-soft">
              A basic link starts with <code>mailto:</code> and an email address. Optional fields
              come after <code>?</code>. Each extra field starts with <code>&amp;</code>. The format
              is defined by{' '}
              <a
                className="font-semibold text-red underline-offset-4 hover:underline"
                href="https://www.rfc-editor.org/rfc/rfc6068"
              >
                RFC 6068
              </a>
              .
            </p>
            <div className="mt-6">
              <CodeBlock>
                {'mailto:hello@example.com?subject=Hello&body=Can%20we%20talk%3F'}
              </CodeBlock>
            </div>
            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y border-ink dark:border-text">
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider">
                      Part
                    </th>
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="py-3 font-mono text-[10px] uppercase tracking-wider">Example</th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft dark:text-text-soft">
                  {[
                    ['mailto:', 'Starts the email link', 'mailto:'],
                    ['To', 'Sets the main recipient', 'hello@example.com'],
                    ['subject', 'Prefills the subject line', '?subject=Hello'],
                    ['body', 'Prefills the message body', '&body=Can%20we%20talk%3F'],
                    ['cc / bcc', 'Adds copied recipients', '&cc=team@example.com'],
                  ].map(([part, purpose, example]) => (
                    <tr className="border-b border-border" key={part}>
                      <th className="py-4 pr-4 font-mono text-xs font-semibold text-ink dark:text-text">
                        {part}
                      </th>
                      <td className="py-4 pr-4">{purpose}</td>
                      <td className="py-4 font-mono text-xs">{example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 leading-7 text-ink-soft dark:text-text-soft">
              Percent-encoding matters. A space becomes <code>%20</code>, a line break becomes{' '}
              <code>%0A</code>, and a literal ampersand inside the subject or body must not be
              confused with the separator between fields. The generator handles those conversions as
              you type.
            </p>
          </section>

          <section className="scroll-mt-8" id="limits">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Use the right tool
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              When a mailto link works, and when it does not
            </h2>
            <div className="mt-7 grid gap-px bg-border sm:grid-cols-2">
              <div className="bg-paper p-6 dark:bg-bg">
                <h3 className="font-headline text-xl font-medium text-ink dark:text-text">
                  Good fit
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  <li>Simple contact and support links</li>
                  <li>Prefilled feedback or enquiry prompts</li>
                  <li>Links in internal documents and prototypes</li>
                  <li>Cases where the sender should use their own email account</li>
                </ul>
              </div>
              <div className="bg-paper p-6 dark:bg-bg">
                <h3 className="font-headline text-xl font-medium text-ink dark:text-text">
                  Use a form instead
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  <li>You must guarantee that a submission reaches you</li>
                  <li>You need attachments, validation, or structured fields</li>
                  <li>You need conversion tracking or automated routing</li>
                  <li>The visitor may not have a mail app configured</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 leading-7 text-ink-soft dark:text-text-soft">
              A mailto link does not send anything by itself. It opens a composer and leaves the
              visitor in control. That makes it lightweight, but it also means you cannot treat a
              click as a completed enquiry.
            </p>
          </section>

          <section className="scroll-mt-8" id="not-working">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Common failure
            </p>
            <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Why a valid mailto link can still feel broken
            </h2>
            <p className="mt-4 leading-7 text-ink-soft dark:text-text-soft">
              The browser passes the link to the visitor&apos;s configured email handler. That may
              be Apple Mail, Outlook, another desktop app, a webmail service, or no useful handler
              at all. Correct syntax cannot choose the visitor&apos;s preferred provider.
            </p>
            <div className="mt-6 border-l-4 border-red bg-surface px-6 py-5 dark:bg-surface-container">
              <h3 className="font-semibold text-ink dark:text-text">
                Keep the generated link as your fallback
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-text-soft">
                If you want visitors to choose Gmail, Outlook, Proton Mail, Yahoo Mail, or their
                native app, smart-mailto upgrades the same anchor without removing its standard
                mailto behavior.
              </p>
              <Link
                className="mt-4 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-red underline-offset-4 hover:underline"
                href="/guides/replace-mailto"
              >
                Read the upgrade guide ΓåÆ
              </Link>
            </div>
          </section>

          <section className="scroll-mt-8" id="faq">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Questions
            </p>
            <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
              Mailto link FAQ
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
              Test before shipping
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              Try the final link in Gmail, Outlook, and at least one native mail app when those
              clients matter to your audience.
            </p>
            <Link
              className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red hover:text-red-dark"
              href="/spec"
            >
              Browse technical specs ΓåÆ
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
