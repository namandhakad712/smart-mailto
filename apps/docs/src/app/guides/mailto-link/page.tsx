import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock, GuideSection } from '@/components/GeneratorGuide';

const pageUrl = 'https://smart-mailto.vercel.app/guides/mailto-link';

export const metadata: Metadata = {
  title: 'Mailto Link: HTML Syntax, Examples, and Common Fixes',
  description:
    'Create a mailto link in HTML with subject, body, CC, BCC, and multiple recipients. Copy valid examples, encode values, test the result, and fix failures.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto link: HTML syntax, examples, and common fixes',
    description:
      'Use valid mailto HTML, encode optional fields, understand the client handoff, and fix links that open nothing or the wrong app.',
  },
};

const faqItems = [
  {
    question: 'What is a mailto link?',
    answer:
      'A mailto link is an HTML anchor whose href starts with mailto:. Clicking it asks the browser or operating system to open an email composer with the supplied fields.',
  },
  {
    question: 'Does a mailto link send an email automatically?',
    answer:
      'No. It opens a draft in the visitor’s configured email handler. The visitor can edit, send, or close that draft.',
  },
  {
    question: 'Do mailto links still work?',
    answer:
      'Yes, when the device has a working email handler. A valid link can still open the wrong app or do nothing when that handler is missing or misconfigured.',
  },
  {
    question: 'Are mailto links safe?',
    answer:
      'The link itself does not send data, but every address and prefilled field is visible in the page source. Do not put private or sensitive information in a mailto URL.',
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

const parameterRows = [
  ['Recipient', 'After mailto:', 'mailto:hello@example.com'],
  ['Subject', 'subject=', '?subject=Project%20question'],
  ['Body', 'body=', '&body=Can%20we%20talk%3F'],
  ['CC', 'cc=', '&cc=team@example.com'],
  ['BCC', 'bcc=', '&bcc=archive@example.com'],
] as const;

const fixRows = [
  {
    symptom: 'Nothing opens',
    cause: 'The link is malformed, or the device has no working mail handler.',
    href: '/guides/mailto-link-opens-nothing',
    label: 'Run the general checks',
  },
  {
    symptom: 'The wrong app opens',
    cause: 'The browser or operating system controls the default handler.',
    href: '/guides/mailto-opens-wrong-email-app',
    label: 'Change the handler',
  },
  {
    symptom: 'Subject or body breaks',
    cause: 'A reserved character was not percent-encoded.',
    href: '/guides/mailto-subject-body-encoding',
    label: 'Fix the encoding',
  },
  {
    symptom: 'Several addresses fail',
    cause: 'The list uses semicolons, spaces, or a client-specific format.',
    href: '/guides/mailto-multiple-recipients',
    label: 'Use the standard list',
  },
] as const;

export default function MailtoLinkGuide() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            HTML guide · RFC 6068
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Mailto link HTML: syntax, examples, and limits
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            Put <code>mailto:</code> inside an anchor&apos;s <code>href</code>. Add encoded subject,
            body, CC, or BCC fields only when they help the visitor start the message.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center bg-red px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
            href="/tools/mailto-link-generator"
          >
            Build a mailto link
          </Link>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Short answer
          </p>
          <code className="mt-5 block break-all font-mono text-sm leading-7 text-ink dark:text-text">
            {'<a href="mailto:hello@example.com">Email us</a>'}
          </code>
          <p className="mt-4 text-sm leading-6 text-ink-soft dark:text-text-soft">
            The browser passes this link to the visitor&apos;s configured email handler. The link
            does not send the message.
          </p>
        </aside>
      </header>

      <div className="grid gap-14 py-14 lg:grid-cols-[190px_minmax(0,720px)_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            On this page
          </p>
          <ol className="mt-4 space-y-3 border-l border-border pl-4 font-mono text-xs">
            <li>
              <a className="text-red hover:text-red-dark" href="#basic-syntax">
                Basic syntax
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#parameters">
                Parameters
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#encoding">
                Encoding
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#limits">
                Limits
              </a>
            </li>
            <li>
              <a className="text-red hover:text-red-dark" href="#fixes">
                Common fixes
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
          <GuideSection label="Start here" title="Use a normal HTML anchor">
            <div id="basic-syntax" className="scroll-mt-8">
              <p>
                Put the recipient after <code>mailto:</code>. Use useful link text, such as “Email
                support,” so the destination is clear before the visitor clicks.
              </p>
              <CodeBlock label="Basic HTML">
                {'<a href="mailto:hello@example.com">Email support</a>'}
              </CodeBlock>
              <p>
                This format follows the mailto URI defined by{' '}
                <a
                  className="font-semibold text-red underline-offset-4 hover:underline"
                  href="https://www.rfc-editor.org/rfc/rfc6068"
                >
                  RFC 6068
                </a>
                . The browser chooses what opens next. Your page cannot force Gmail, Outlook, or a
                desktop app with a plain mailto link.
              </p>
            </div>
          </GuideSection>

          <GuideSection label="Field reference" title="Start optional fields with a question mark">
            <div id="parameters" className="scroll-mt-8">
              <p>
                The first optional field starts with <code>?</code>. Later fields start with{' '}
                <code>&amp;</code>. In HTML source, write that separator as <code>&amp;amp;</code>.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-y border-ink dark:border-text">
                      <th className="py-3 pr-5 font-mono text-[10px] uppercase tracking-wider">
                        Field
                      </th>
                      <th className="py-3 pr-5 font-mono text-[10px] uppercase tracking-wider">
                        Syntax
                      </th>
                      <th className="py-3 font-mono text-[10px] uppercase tracking-wider">
                        Example
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameterRows.map(([field, syntax, example]) => (
                      <tr className="border-b border-border" key={field}>
                        <th className="py-4 pr-5 font-medium text-ink dark:text-text">{field}</th>
                        <td className="py-4 pr-5 font-mono text-xs text-red">{syntax}</td>
                        <td className="py-4 font-mono text-xs text-ink-soft dark:text-text-soft">
                          {example}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <CodeBlock label="HTML with every common field">
                {
                  '<a href="mailto:hello@example.com?cc=team@example.com&amp;bcc=archive@example.com&amp;subject=Project%20question&amp;body=Hi%20team%2C%0D%0A%0D%0ACan%20we%20talk%3F">Email the team</a>'
                }
              </CodeBlock>
            </div>
          </GuideSection>

          <GuideSection label="Reserved characters" title="Encode values, not the whole link">
            <div id="encoding" className="scroll-mt-8">
              <p>
                Percent-encode subject and body values. Use <code>%20</code> for a space,{' '}
                <code>%26</code> for an ampersand, <code>%3F</code> for a question mark, and{' '}
                <code>%0D%0A</code> for a line break.
              </p>
              <div className="grid gap-px bg-border sm:grid-cols-2">
                <div className="bg-paper p-6 dark:bg-bg">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red">
                    Keep structural
                  </p>
                  <p className="mt-3 text-sm leading-6">
                    <code>mailto:</code>, <code>?</code>, field names, and separators.
                  </p>
                </div>
                <div className="bg-surface p-6 dark:bg-surface-container">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red">
                    Encode as data
                  </p>
                  <p className="mt-3 text-sm leading-6">
                    Subject text, body text, punctuation, and line breaks.
                  </p>
                </div>
              </div>
              <p>
                Do not run <code>encodeURIComponent()</code> over the full URL. Build the structure
                first and encode each text value separately.
              </p>
            </div>
          </GuideSection>

          <GuideSection label="Client handoff" title="Know what the link cannot guarantee">
            <div id="limits" className="scroll-mt-8">
              <p>
                A mailto link opens a draft. It cannot send automatically, confirm delivery, hide
                addresses from the page source, or choose the visitor&apos;s email app.
              </p>
              <p>
                Use mailto for a simple, visitor-led message. Use a contact form when routing,
                required fields, private recipients, or a reliable submission record matter.
              </p>
              <div className="border-l-4 border-red pl-5">
                <p className="font-semibold text-ink dark:text-text">Keep private data out.</p>
                <p className="mt-1 text-sm leading-6">
                  Recipients, BCC addresses, subjects, and body text remain visible in the URL and
                  page source.
                </p>
              </div>
            </div>
          </GuideSection>

          <GuideSection label="Diagnostic desk" title="Fix the handoff, not only the HTML">
            <div id="fixes" className="scroll-mt-8">
              <p>
                Start with the symptom. A valid link and a broken device handler need different
                fixes.
              </p>
              <div className="divide-y divide-border border-y border-border">
                {fixRows.map(row => (
                  <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]" key={row.symptom}>
                    <h3 className="font-semibold text-ink dark:text-text">{row.symptom}</h3>
                    <div>
                      <p className="text-sm leading-6">{row.cause}</p>
                      <Link
                        className="mt-2 inline-flex font-mono text-[10px] font-bold uppercase tracking-wider text-red underline-offset-4 hover:underline"
                        href={row.href}
                      >
                        {row.label} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GuideSection>

          <GuideSection label="Common questions" title="Mailto link FAQ">
            <div id="faq" className="scroll-mt-8 divide-y divide-border border-y border-border">
              {faqItems.map(item => (
                <div className="py-6" key={item.question}>
                  <h3 className="font-headline text-xl font-medium text-ink dark:text-text">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-6">{item.answer}</p>
                </div>
              ))}
            </div>
          </GuideSection>
        </div>
      </div>
    </article>
  );
}
