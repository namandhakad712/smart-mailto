import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GuideDemo } from '@/components/GuideDemo';

const pageUrl = 'https://smart-mailto.vercel.app/compare/smart-mailto-vs-mailto';

export const metadata: Metadata = {
  title: 'smart-mailto vs. Plain Mailto Links: Which Should You Use?',
  description:
    'Compare a plain mailto link with smart-mailto. See the visitor experience, tradeoffs, fallback behavior, and when each approach fits.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'smart-mailto vs. plain mailto links',
    description: 'A practical comparison of native mailto behavior and a webmail provider picker.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const comparisonRows = [
  {
    question: 'What happens on click?',
    plain: 'The browser passes the link to the visitor’s configured mail handler.',
    smart: 'A provider picker opens before the browser hands the link to a mail app.',
  },
  {
    question: 'Can visitors choose webmail?',
    plain: 'Only when their browser or operating system already routes mailto links there.',
    smart: 'Yes. The picker offers resolved webmail providers and preserves message details.',
  },
  {
    question: 'What if native mail is preferred?',
    plain: 'Native mail is the default path.',
    smart: 'Native mail is included by default on mobile and can be enabled on desktop.',
  },
  {
    question: 'Can visitors copy the address?',
    plain: 'Not from the link itself.',
    smart: 'A copy-address action is included by default.',
  },
  {
    question: 'What changes in your HTML?',
    plain: 'Nothing beyond a standard mailto anchor.',
    smart: 'Keep the same anchor, then initialize one JavaScript package once.',
  },
  {
    question: 'What is the fallback?',
    plain: 'The configured browser and operating-system behavior.',
    smart:
      'The original mailto URL remains available when the picker cannot load or should not intercept.',
  },
];

const faqItems = [
  {
    question: 'Is smart-mailto a replacement for the mailto protocol?',
    answer:
      'No. It keeps a normal mailto anchor in the page and upgrades the click with a provider picker. The original mailto URL remains the fallback.',
  },
  {
    question: 'Does smart-mailto send email?',
    answer:
      'No. It opens a composer in the visitor’s chosen provider or native mail app. The visitor still reviews and sends the message.',
  },
  {
    question: 'Does the picker add an extra step?',
    answer:
      'Yes. Visitors with a working mail handler see a choice before their composer opens. Sites can include native mail, and a remembered provider is shown first on later visits to the same site.',
  },
  {
    question: 'When should I keep a plain mailto link?',
    answer:
      'Keep it plain when your audience is known to have a working mail handler, or when the smallest possible setup matters more than offering a webmail choice.',
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
  { name: 'Copy address', logo: '/provider-logos/copy.svg' },
];

export default function SmartMailtoVsMailtoPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_350px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Practical comparison · For web developers
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Plain mailto or a webmail picker?
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            A plain mailto link is the simplest option. smart-mailto keeps that link, then gives
            visitors a choice when their preferred email lives in the browser instead of a desktop
            app.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <GuideDemo />
            <a
              className="font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
              href="#comparison"
            >
              Compare the two
            </a>
          </div>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Short answer
          </p>
          <p className="mt-4 font-headline text-2xl leading-snug text-ink dark:text-text">
            Use plain mailto for the smallest setup. Add smart-mailto when visitors need a webmail
            choice or copy fallback.
          </p>
        </aside>
      </header>

      <section className="py-14" aria-labelledby="click-journey-heading">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              The click journey
            </p>
            <h2
              className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text"
              id="click-journey-heading"
            >
              The difference is one decision
            </h2>
            <p className="mt-4 max-w-[45ch] leading-7 text-ink-soft dark:text-text-soft">
              Both approaches start with the same anchor. The question is whether your site offers a
              provider choice before the composer opens.
            </p>
          </div>

          <div className="grid gap-px border border-border bg-border dark:border-border dark:bg-border md:grid-cols-2">
            <div className="bg-paper p-6 dark:bg-bg md:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4 dark:border-border">
                <h3 className="font-headline text-2xl font-medium text-ink dark:text-text">
                  Plain mailto
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-text-muted">
                  Browser decides
                </span>
              </div>
              <ol className="mt-6 space-y-5">
                {[
                  ['01', 'Visitor clicks the email link'],
                  ['02', 'Browser checks its configured handler'],
                  ['03', 'A mail app opens, or the click goes nowhere useful'],
                ].map(([number, text]) => (
                  <li className="grid grid-cols-[34px_1fr] gap-3" key={number}>
                    <span className="font-mono text-xs text-red">{number}</span>
                    <span className="text-sm leading-6 text-ink-soft dark:text-text-soft">
                      {text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-paper p-6 dark:bg-bg md:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4 dark:border-border">
                <h3 className="font-headline text-2xl font-medium text-ink dark:text-text">
                  smart-mailto
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-red">
                  Visitor decides
                </span>
              </div>
              <ol className="mt-6 space-y-5">
                {[
                  ['01', 'Visitor clicks the same email link'],
                  ['02', 'The site shows resolved provider choices'],
                  ['03', 'The chosen composer opens with the message preserved'],
                ].map(([number, text]) => (
                  <li className="grid grid-cols-[34px_1fr] gap-3" key={number}>
                    <span className="font-mono text-xs text-red">{number}</span>
                    <span className="text-sm leading-6 text-ink-soft dark:text-text-soft">
                      {text}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-7 grid grid-cols-4 gap-2 border-t border-border pt-5 dark:border-border">
                {providers.map(provider => (
                  <div className="text-center" key={provider.name}>
                    <Image
                      alt=""
                      className="mx-auto h-7 w-7"
                      height="28"
                      src={provider.logo}
                      width="28"
                    />
                    <span className="mt-2 block text-[9px] leading-tight text-ink-muted dark:text-text-muted">
                      {provider.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-8 border-t border-border py-14 dark:border-border"
        id="comparison"
      >
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
          Side-by-side
        </p>
        <h2 className="mt-3 text-balance font-headline text-4xl font-medium tracking-tight text-ink dark:text-text">
          smart-mailto vs. plain mailto
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-y border-ink dark:border-text">
                <th className="w-[26%] py-4 pr-6 font-mono text-[10px] uppercase tracking-wider">
                  Question
                </th>
                <th className="w-[37%] py-4 pr-6 font-mono text-[10px] uppercase tracking-wider">
                  Plain mailto
                </th>
                <th className="w-[37%] py-4 font-mono text-[10px] uppercase tracking-wider text-red">
                  smart-mailto
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(row => (
                <tr
                  className="border-b border-border align-top dark:border-border"
                  key={row.question}
                >
                  <th
                    className="py-5 pr-6 text-sm font-semibold text-ink dark:text-text"
                    scope="row"
                  >
                    {row.question}
                  </th>
                  <td className="py-5 pr-6 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {row.plain}
                  </td>
                  <td className="py-5 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {row.smart}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-px border-y border-border bg-border dark:border-border dark:bg-border md:grid-cols-2">
        <div className="bg-paper p-7 dark:bg-bg md:p-10">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted dark:text-text-muted">
            Keep it plain when
          </p>
          <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
            Your audience already has a reliable mail handler
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
            <li>Your site is internal and every device is managed.</li>
            <li>You want the browser and operating system to own the choice.</li>
            <li>You do not need an on-page copy-address fallback.</li>
          </ul>
        </div>
        <div className="bg-paper p-7 dark:bg-bg md:p-10">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Add the picker when
          </p>
          <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
            Visitors may use webmail or have no useful handler
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
            <li>Your contact links serve a mixed public audience.</li>
            <li>You want Gmail, Outlook, and regional providers available by choice.</li>
            <li>You want native mail and copy address to remain available.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-10 py-14 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Honest tradeoff
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-headline text-4xl font-medium tracking-tight text-ink dark:text-text">
            The picker solves a choice problem, not every delivery problem
          </h2>
          <p className="mt-5 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
            smart-mailto adds a step for someone whose native mail setup already works. It does not
            send the email, guarantee delivery, or replace a form. It gives the visitor clearer ways
            to continue: webmail, native mail, or copy address.
          </p>
          <p className="mt-5 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
            A remembered provider stays in this site&apos;s local storage. It is shown first on a
            later visit to the same site, but it does not follow the visitor elsewhere.
          </p>
        </div>
        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Already debugging?
          </p>
          <p className="mt-4 text-sm leading-6 text-ink-soft dark:text-text-soft">
            If your current mailto link opens nothing, check the link and handler before choosing a
            fallback.
          </p>
          <Link
            className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red underline-offset-4 hover:underline"
            href="/guides/mailto-link-opens-nothing"
          >
            Troubleshoot the dead link →
          </Link>
        </aside>
      </section>

      <section className="border-t border-border py-14 dark:border-border" id="faq">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">Questions</p>
        <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
          Comparison FAQ
        </h2>
        <div className="mt-7 max-w-3xl">
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

      <section className="border-t-4 border-double border-border py-12 text-center dark:border-border">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
          Keep the fallback. Add the choice.
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-headline text-4xl font-medium tracking-tight text-ink dark:text-text">
          Try the picker on a normal mailto link.
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
