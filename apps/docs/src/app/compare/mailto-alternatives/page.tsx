import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GuideDemo } from '@/components/GuideDemo';

const pageUrl = 'https://smart-mailto.vercel.app/compare/mailto-alternatives';

export const metadata: Metadata = {
  title: 'Mailto Alternatives: Link, Form, Copy, or Webmail Picker?',
  description:
    'Compare plain mailto links, contact forms, copy-address controls, and smart-mailto by visitor experience, setup, privacy, and best-fit use case.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto alternatives for website contact links',
    description:
      'A practical four-way comparison of plain mailto, contact forms, copy address, and a webmail provider picker.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const approaches = [
  {
    number: '01',
    label: 'Lowest setup',
    title: 'Plain mailto',
    summary: 'Let the browser hand a normal email link to the visitor’s configured mail handler.',
    fit: 'A known audience with reliable mail apps',
  },
  {
    number: '02',
    label: 'Structured intake',
    title: 'Contact form',
    summary:
      'Collect the fields your site needs, then pass them through a receiving system you control.',
    fit: 'Support, qualification, and routed requests',
  },
  {
    number: '03',
    label: 'Universal fallback',
    title: 'Copy the address',
    summary: 'Give visitors the address and let them choose where and how to compose the message.',
    fit: 'A dependable secondary contact action',
  },
  {
    number: '04',
    label: 'Provider choice',
    title: 'smart-mailto',
    summary: 'Keep the mailto link, then offer webmail, native mail, or copy before delegation.',
    fit: 'Public audiences using different mail providers',
  },
] as const;

const comparisonRows = [
  {
    question: 'Visitor experience',
    mailto: 'One click hands the request to the configured browser or device handler.',
    form: 'The visitor stays on the site and completes the fields the form requires.',
    copy: 'The visitor copies the address, opens a composer, and pastes it manually.',
    smart: 'A picker adds one choice, then opens webmail or native mail, or copies the address.',
  },
  {
    question: 'Setup burden',
    mailto: 'One anchor with a valid mailto URL.',
    form: 'A form interface plus a receiving, validation, and response path.',
    copy: 'Visible address text, with an optional clipboard control and success state.',
    smart: 'Keep existing anchors, install one package, and initialize it once.',
  },
  {
    question: 'Privacy boundary',
    mailto: 'The link itself does not submit message content to the site.',
    form: 'The site receives the submitted fields and needs a clear handling policy.',
    copy: 'The site can expose only the address; composition happens elsewhere.',
    smart: 'Regional ordering runs in the browser without a network request for detection.',
  },
  {
    question: 'Best fit',
    mailto: 'Managed devices or audiences with a dependable default mail handler.',
    form: 'Requests that need required fields, routing, or an on-site submission flow.',
    copy: 'A secondary fallback that works with any composer the visitor chooses.',
    smart: 'Mixed public audiences that use webmail, native mail, or no useful handler.',
  },
  {
    question: 'Main tradeoff',
    mailto: 'The site cannot choose or repair the visitor’s mail handler.',
    form: 'You own the intake system and the data it receives.',
    copy: 'The visitor must switch context and build the message themselves.',
    smart: 'The picker adds a step for visitors whose current mail setup already works.',
  },
] as const;

const faqItems = [
  {
    question: 'What is the simplest alternative to a mailto link?',
    answer:
      'Showing the email address as text is the smallest fallback. An explicit copy control reduces selection effort, but the visitor still chooses and opens a composer.',
  },
  {
    question: 'Should a contact form replace every mailto link?',
    answer:
      'No. Use a form when the site needs structured fields, routing, or an on-site submission flow. Keep mailto when the visitor should compose and send from their own account.',
  },
  {
    question: 'Does smart-mailto send or receive the email?',
    answer:
      'No. It opens a composer in the chosen provider or native mail app, or copies the address. The visitor still reviews and sends the message.',
  },
  {
    question: 'Can these approaches be combined?',
    answer:
      'Yes. A page can use a form for structured requests, keep a visible email address, and offer mailto or webmail for visitors who prefer their own composer.',
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

const providerLogos = [
  { name: 'Gmail', src: '/provider-logos/gmail.svg' },
  { name: 'Outlook', src: '/provider-logos/outlook-personal.svg' },
  { name: 'Proton Mail', src: '/provider-logos/protonmail.svg' },
  { name: 'Native mail', src: '/provider-logos/native.svg' },
  { name: 'Copy address', src: '/provider-logos/copy.svg' },
] as const;

export default function MailtoAlternativesPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
        type="application/ld+json"
      />

      <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_370px] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Contact pattern desk · Four honest options
          </p>
          <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
            Choose the contact path by what must happen after the click.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
            Plain mailto, a contact form, a copy action, and a webmail picker solve different jobs.
            Compare the handoff, the setup you own, and the boundary around message data before you
            choose.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <GuideDemo />
            <a
              className="font-mono text-xs font-semibold uppercase tracking-wider text-red underline-offset-4 hover:underline"
              href="#full-comparison"
            >
              Compare all four
            </a>
          </div>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Start with the job
          </p>
          <dl className="mt-5 divide-y divide-border dark:divide-border">
            {[
              ['Just open the default app', 'Plain mailto'],
              ['Collect required fields', 'Contact form'],
              ['Give a dependable fallback', 'Copy address'],
              ['Offer provider choice', 'smart-mailto'],
            ].map(([need, answer]) => (
              <div className="grid grid-cols-[1fr_auto] gap-4 py-3 first:pt-0 last:pb-0" key={need}>
                <dt className="text-sm leading-6 text-ink-soft dark:text-text-soft">{need}</dt>
                <dd className="text-right text-sm font-semibold text-ink dark:text-text">
                  {answer}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </header>

      <section className="py-14" aria-labelledby="four-jobs-heading">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
              Four jobs
            </p>
            <h2
              className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text"
              id="four-jobs-heading"
            >
              Each option moves responsibility to a different place
            </h2>
            <p className="mt-4 max-w-[45ch] leading-7 text-ink-soft dark:text-text-soft">
              The right answer depends on whether the browser, the visitor, or your own intake
              system should own the next step.
            </p>
          </div>

          <div className="border-y border-ink dark:border-text">
            {approaches.map((approach, index) => (
              <div
                className={`grid gap-4 py-6 sm:grid-cols-[52px_150px_1fr] sm:items-start ${index < approaches.length - 1 ? 'border-b border-border dark:border-border' : ''}`}
                key={approach.title}
              >
                <span className="font-mono text-xs text-red">{approach.number}</span>
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted dark:text-text-muted">
                    {approach.label}
                  </p>
                  <h3 className="mt-1 font-headline text-xl font-medium text-ink dark:text-text">
                    {approach.title}
                  </h3>
                </div>
                <div className="grid gap-3 md:grid-cols-[1fr_190px]">
                  <p className="max-w-[55ch] text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {approach.summary}
                  </p>
                  <p className="text-sm leading-6 text-ink dark:text-text">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-red">
                      Best fit
                    </span>
                    {approach.fit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-8 border-t border-border py-14 dark:border-border"
        id="full-comparison"
      >
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
          Side-by-side
        </p>
        <h2 className="mt-3 max-w-3xl text-balance font-headline text-4xl font-medium tracking-tight text-ink dark:text-text">
          Mailto alternatives compared by the work they create
        </h2>
        <p className="mt-4 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
          No column wins every row. Pick the tradeoff that matches your contact flow, then keep a
          visible route for anyone the primary action does not serve.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="border-y border-ink dark:border-text">
                <th className="w-[16%] py-4 pr-5 font-mono text-[10px] uppercase tracking-wider">
                  Question
                </th>
                <th className="w-[21%] py-4 pr-5 font-mono text-[10px] uppercase tracking-wider">
                  Plain mailto
                </th>
                <th className="w-[21%] py-4 pr-5 font-mono text-[10px] uppercase tracking-wider">
                  Contact form
                </th>
                <th className="w-[21%] py-4 pr-5 font-mono text-[10px] uppercase tracking-wider">
                  Copy address
                </th>
                <th className="w-[21%] py-4 font-mono text-[10px] uppercase tracking-wider text-red">
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
                    className="py-5 pr-5 text-sm font-semibold text-ink dark:text-text"
                    scope="row"
                  >
                    {row.question}
                  </th>
                  <td className="py-5 pr-5 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {row.mailto}
                  </td>
                  <td className="py-5 pr-5 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {row.form}
                  </td>
                  <td className="py-5 pr-5 text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {row.copy}
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

      <section className="grid gap-px border-y border-border bg-border dark:border-border dark:bg-border lg:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-paper p-7 dark:bg-bg md:p-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Choose by use case
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-headline text-4xl font-medium tracking-tight text-ink dark:text-text">
            Start with the outcome you need to control
          </h2>
          <div className="mt-8 space-y-6">
            {[
              [
                'The visitor should send from their own account',
                'Use plain mailto when the audience has a reliable handler. Add copy when they may not.',
              ],
              [
                'Your team needs the same fields every time',
                'Use a contact form and make the submission path clear.',
              ],
              [
                'The address must remain usable anywhere',
                'Show it visibly and offer a copy action.',
              ],
              [
                'Visitors use different webmail providers',
                'Use smart-mailto to add a provider choice while keeping the original anchor.',
              ],
            ].map(([need, choice], index) => (
              <div className="grid grid-cols-[34px_1fr] gap-3" key={need}>
                <span className="font-mono text-xs text-red">0{index + 1}</span>
                <div>
                  <h3 className="font-semibold text-ink dark:text-text">{need}</h3>
                  <p className="mt-2 max-w-[60ch] text-sm leading-6 text-ink-soft dark:text-text-soft">
                    {choice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-surface p-7 dark:bg-surface-container md:p-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Combinations are valid
          </p>
          <p className="mt-4 font-headline text-3xl leading-snug text-ink dark:text-text">
            A form can be primary while email stays visible as a second route.
          </p>
          <p className="mt-5 max-w-[52ch] text-sm leading-6 text-ink-soft dark:text-text-soft">
            A copy action can sit beside a plain link. smart-mailto can upgrade that same link
            without removing the original mailto URL. The useful pattern is the one that leaves no
            visitor with a dead end.
          </p>
          <div className="mt-7 border-t border-border pt-6 dark:border-border">
            <Link
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-red underline-offset-4 hover:underline"
              href="/guides/mailto-without-email-client"
            >
              Design for visitors with no email client →
            </Link>
          </div>
        </aside>
      </section>

      <section className="grid gap-10 py-14 lg:grid-cols-[1fr_360px] lg:items-start">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
            Where smart-mailto fits
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-headline text-4xl font-medium tracking-tight text-ink dark:text-text">
            A small browser-side choice layer, not a form replacement
          </h2>
          <p className="mt-5 max-w-[65ch] text-pretty leading-7 text-ink-soft dark:text-text-soft">
            smart-mailto keeps a normal mailto anchor and intercepts valid clicks to show a provider
            picker. It does not submit a form, detect every installed email client, send the
            message, or guarantee delivery.
          </p>
          <div className="mt-8 grid gap-px border border-border bg-border dark:border-border dark:bg-border sm:grid-cols-3">
            {[
              ['Under 8KB', 'Gzipped core build'],
              ['Zero', 'Runtime dependencies'],
              ['No request', 'For regional detection'],
            ].map(([value, label]) => (
              <div className="bg-paper p-5 dark:bg-bg" key={label}>
                <p className="font-headline text-2xl font-medium text-ink dark:text-text">
                  {value}
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-ink-muted dark:text-text-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            One link, several exits
          </p>
          <div className="mt-6 grid grid-cols-5 gap-3">
            {providerLogos.map(provider => (
              <div className="text-center" key={provider.name}>
                <Image alt="" height="34" src={provider.src} width="34" />
                <span className="mt-2 block text-[9px] leading-tight text-ink-muted dark:text-text-muted">
                  {provider.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t border-border pt-5 text-sm leading-6 text-ink-soft dark:border-border dark:text-text-soft">
            The visitor chooses a resolved webmail provider, native mail when offered, or the copy
            fallback. The message remains theirs to review and send.
          </p>
          <Link
            className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-red underline-offset-4 hover:underline"
            href="/compare/smart-mailto-vs-mailto"
          >
            See the focused mailto comparison →
          </Link>
        </aside>
      </section>

      <section className="border-t border-border py-14 dark:border-border" id="faq">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">Questions</p>
        <h2 className="mt-3 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
          Mailto alternatives FAQ
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
          Keep the original link. Add the useful choice.
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-headline text-4xl font-medium tracking-tight text-ink dark:text-text">
          Try the webmail path before you install it.
        </h2>
        <div className="mt-7 flex justify-center">
          <GuideDemo />
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-ink-soft dark:text-text-soft">
          See the full picker on the{' '}
          <Link className="font-semibold text-red hover:text-red-dark" href="/">
            live demo
          </Link>
          , then follow the{' '}
          <Link
            className="font-semibold text-red hover:text-red-dark"
            href="/guides/replace-mailto"
          >
            installation guide
          </Link>{' '}
          for core, React, Vue, or Svelte.
        </p>
      </section>
    </article>
  );
}
