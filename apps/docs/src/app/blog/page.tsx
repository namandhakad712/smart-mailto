import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — smart-mailto',
  description: 'Updates, releases, and deep dives on smart-mailto development.',
};

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <header className="text-center mb-16">
        <span className="font-mono text-xs font-bold text-red uppercase tracking-widest block mb-3">
          Dispatch
        </span>
        <h1 className="text-5xl md:text-6xl font-headline font-normal leading-tight tracking-tight text-ink dark:text-text mb-4">
          Blog
        </h1>
        <p className="text-lg text-ink-soft dark:text-text-soft">
          Updates, releases, and deep dives on smart-mailto.
        </p>
      </header>

      <div className="border border-border dark:border-border p-12 text-center">
        <p className="font-mono text-sm text-ink-muted dark:text-text-muted mb-4">
          No posts yet. Subscribe to the{' '}
          <Link
            href="https://github.com/namandhakad712/smart-mailto/releases"
            className="text-red hover:text-red-dark underline underline-offset-2"
          >
            GitHub releases
          </Link>{' '}
          to be notified when new content is published.
        </p>
        <p className="font-mono text-[10px] text-ink-muted dark:text-text-muted uppercase tracking-widest">
          Coming soon
        </p>
      </div>
    </div>
  );
}
