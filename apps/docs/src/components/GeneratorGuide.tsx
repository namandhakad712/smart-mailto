import Link from 'next/link';

export function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <figure className="overflow-hidden border border-border bg-code-bg">
      <figcaption className="border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </figcaption>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-white">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export function GuideHeader({
  eyebrow,
  title,
  intro,
  answer,
  answerCode,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  answer: string;
  answerCode: string;
}) {
  return (
    <header className="grid gap-10 border-b border-border pb-12 dark:border-border lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
      <div>
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.04] tracking-tight text-ink dark:text-text md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-ink-soft dark:text-text-soft">
          {intro}
        </p>
      </div>

      <aside className="border-t-4 border-red bg-surface p-6 dark:bg-surface-container">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
          Short answer
        </p>
        <p className="mt-4 text-pretty text-sm leading-6 text-ink-soft dark:text-text-soft">
          {answer}
        </p>
        <code className="mt-5 block break-all border-t border-border pt-4 font-mono text-xs leading-6 text-ink dark:border-border dark:text-text">
          {answerCode}
        </code>
      </aside>
    </header>
  );
}

export function GuideSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">{label}</p>
      <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-pretty leading-7 text-ink-soft dark:text-text-soft">
        {children}
      </div>
    </section>
  );
}

export function GeneratorCta({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="grid gap-px border border-border bg-border dark:border-border dark:bg-border lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="bg-code-bg p-7 text-white md:p-9">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
          Live output preview
        </p>
        <div aria-hidden="true" className="mt-6 space-y-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
              Subject
            </span>
            <div className="mt-2 border border-white/15 bg-white/5 px-4 py-3 font-mono text-xs text-white/85">
              Website enquiry
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
              Encoded link
            </span>
            <div className="mt-2 break-all border border-white/15 bg-white/5 px-4 py-3 font-mono text-xs leading-6 text-white/85">
              mailto:hello@example.com?subject=Website%20enquiry
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center bg-surface p-7 dark:bg-surface-container md:p-9">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
          Ready to build
        </p>
        <h2 className="mt-3 text-balance font-headline text-3xl font-medium tracking-tight text-ink dark:text-text">
          {title}
        </h2>
        <p className="mt-4 text-pretty text-sm leading-6 text-ink-soft dark:text-text-soft">
          {copy}
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center self-start bg-red px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
          href="/tools/mailto-link-generator"
        >
          Open the mailto generator
        </Link>
      </div>
    </section>
  );
}
