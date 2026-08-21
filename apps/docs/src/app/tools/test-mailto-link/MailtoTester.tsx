'use client';

import { useState } from 'react';
import { captureMailtoTestOutcome } from '@/lib/demoAnalytics';
import {
  BROKEN_MAILTO_EXAMPLE,
  testMailtoLink,
  WORKING_MAILTO_EXAMPLE,
  type MailtoTestResult,
} from '@/lib/mailtoTester';

const fieldLabels = {
  to: 'To',
  cc: 'CC',
  bcc: 'BCC',
  subject: 'Subject',
  body: 'Body',
} as const;

function FieldValue({ value }: { value: string[] | string | undefined }) {
  const entries = Array.isArray(value) ? value : value ? [value] : [];
  if (entries.length === 0) {
    return <span className="text-ink-muted dark:text-text-muted">Not set</span>;
  }

  return (
    <span className="whitespace-pre-wrap break-words text-ink dark:text-text">
      {entries.join(', ')}
    </span>
  );
}

export function MailtoTester() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<MailtoTestResult>({ status: 'empty', diagnostics: [] });

  function run(nextValue = value) {
    const nextResult = testMailtoLink(nextValue);
    setValue(nextValue);
    setResult(nextResult);
    captureMailtoTestOutcome(nextResult.status);
  }

  const resultTitle =
    result.status === 'valid'
      ? 'The link is correctly formed'
      : result.status === 'warning'
        ? 'The link parses, with a warning'
        : result.status === 'invalid'
          ? 'The link needs a fix'
          : 'Your decoded fields will appear here';

  const resultLabel =
    result.status === 'valid'
      ? 'Valid mailto link'
      : result.status === 'warning'
        ? 'Check before shipping'
        : result.status === 'invalid'
          ? 'Problem found'
          : 'Waiting for a link';
  const parsedParams = result.params;

  return (
    <section
      aria-labelledby="mailto-tester-title"
      className="border border-border bg-surface dark:bg-surface-container"
      id="tester"
    >
      <div className="grid border-b border-border lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="p-6 md:p-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
            Private browser tool
          </p>
          <h2
            className="mt-2 font-headline text-3xl font-medium tracking-tight text-ink dark:text-text"
            id="mailto-tester-title"
          >
            Paste the link you want to inspect
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft dark:text-text-soft">
            The parser runs in this page. It does not open a mail app, send a message, or store the
            link you paste.
          </p>
        </div>
        <div className="border-t border-border px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted dark:text-text-muted lg:border-l lg:border-t-0">
          To · CC · BCC · Subject · Body
        </div>
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <form
          className="bg-paper p-6 dark:bg-bg md:p-8"
          onSubmit={event => {
            event.preventDefault();
            run();
          }}
        >
          <label
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted dark:text-text-muted"
            htmlFor="mailto-test-input"
          >
            Mailto href
          </label>
          <textarea
            aria-describedby="mailto-test-help"
            className="mt-2 min-h-36 w-full resize-y border border-border bg-surface px-4 py-4 font-mono text-sm leading-6 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-red dark:bg-surface-container dark:text-text dark:placeholder:text-text-muted"
            id="mailto-test-input"
            onChange={event => setValue(event.target.value)}
            placeholder="mailto:hello@example.com?subject=Website%20question"
            spellCheck={false}
            value={value}
          />
          <p
            className="mt-2 text-xs leading-5 text-ink-muted dark:text-text-muted"
            id="mailto-test-help"
          >
            Paste the href value only. Nothing is sent or saved.
          </p>

          <button
            className="mt-6 min-h-11 w-full bg-red px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            type="submit"
          >
            Test this link
          </button>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-5">
            <button
              className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-red underline-offset-4 hover:underline"
              onClick={() => run(WORKING_MAILTO_EXAMPLE)}
              type="button"
            >
              Load working example
            </button>
            <button
              className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted underline-offset-4 hover:text-red hover:underline dark:text-text-muted"
              onClick={() => run(BROKEN_MAILTO_EXAMPLE)}
              type="button"
            >
              Load broken example
            </button>
          </div>
        </form>

        <div
          aria-live="polite"
          className="min-w-0 bg-surface-container-low p-6 dark:bg-surface-container md:p-8"
        >
          <p
            className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${
              result.status === 'valid' ? 'text-green-700 dark:text-green-400' : 'text-red'
            }`}
          >
            {resultLabel}
          </p>
          <h3 className="mt-2 text-balance font-headline text-2xl font-medium tracking-tight text-ink dark:text-text">
            {resultTitle}
          </h3>

          {result.status === 'empty' ? (
            <div className="mt-8 border-l-2 border-border pl-5 text-sm leading-6 text-ink-soft dark:text-text-soft">
              Run the working example to see how recipients and message fields are decoded without
              opening an email app.
            </div>
          ) : (
            <>
              {result.diagnostics.length > 0 && (
                <ul className="mt-6 space-y-4">
                  {result.diagnostics.map(diagnostic => (
                    <li className="border-l-2 border-red pl-4" key={diagnostic.code}>
                      <p className="font-semibold text-ink dark:text-text">{diagnostic.title}</p>
                      <p className="mt-1 text-sm leading-6 text-ink-soft dark:text-text-soft">
                        {diagnostic.detail}
                      </p>
                      <a
                        className="mt-2 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-red underline-offset-4 hover:underline"
                        href={diagnostic.href}
                      >
                        {diagnostic.linkLabel} →
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {parsedParams && (
                <dl className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-2">
                  {(Object.keys(fieldLabels) as Array<keyof typeof fieldLabels>).map(field => (
                    <div
                      className={`min-w-0 bg-paper p-4 dark:bg-bg ${field === 'body' ? 'sm:col-span-2' : ''}`}
                      key={field}
                    >
                      <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted dark:text-text-muted">
                        {fieldLabels[field]}
                      </dt>
                      <dd className="mt-2 text-sm leading-6">
                        <FieldValue value={parsedParams[field]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {!result.diagnostics.some(diagnostic => diagnostic.level === 'error') && (
                <p className="mt-5 text-sm leading-6 text-ink-soft dark:text-text-soft">
                  The href is readable. A browser can still open the wrong app or nothing if the
                  visitor has no useful mail handler configured.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
