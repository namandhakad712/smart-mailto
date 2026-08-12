'use client';

import { useCallback, useState } from 'react';
import { INSTALL_COMMAND } from '@/lib/installCommand';

type CopyState = 'idle' | 'copied' | 'error';

export function InstallCommandCopy() {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('error');
    }
  }, []);

  const buttonLabel =
    copyState === 'copied'
      ? 'Install command copied'
      : copyState === 'error'
        ? 'Copy failed. Try again'
        : 'Copy install command';

  return (
    <div className="mt-6 max-w-3xl overflow-hidden border border-border bg-code-bg dark:border-border">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2 dark:border-border">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
          Install core
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          v0.3.0
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <pre className="min-w-0 flex-1 overflow-x-auto px-4 py-4 font-mono text-xs text-white sm:px-5 sm:text-sm">
          <code>{INSTALL_COMMAND}</code>
        </pre>
        <button
          aria-label={buttonLabel}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border-t border-border px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-white/5 hover:text-red active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-red sm:border-l sm:border-t-0"
          onClick={copy}
          type="button"
        >
          {copyState === 'copied' ? (
            <svg
              aria-hidden="true"
              fill="none"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="m20 6-11 11-5-5" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              fill="none"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <rect height="14" rx="2" width="14" x="8" y="8" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
          <span aria-live="polite">{copyState === 'copied' ? 'Copied' : 'Copy command'}</span>
        </button>
      </div>
      {copyState === 'error' ? (
        <p aria-live="assertive" className="border-t border-border px-4 py-2 text-xs text-red">
          Copy failed. Select the command and copy it manually.
        </p>
      ) : null}
    </div>
  );
}
