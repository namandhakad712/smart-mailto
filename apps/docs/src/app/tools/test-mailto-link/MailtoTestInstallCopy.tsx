'use client';

import { useState } from 'react';
import { captureMailtoTestInstallCopy } from '@/lib/demoAnalytics';
import { INSTALL_COMMAND } from '@/lib/installCommand';

export function MailtoTestInstallCopy() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    captureMailtoTestInstallCopy();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      <code className="min-w-0 flex-1 overflow-x-auto border border-border bg-code-bg px-4 py-3 font-mono text-xs text-white">
        {INSTALL_COMMAND}
      </code>
      <button
        className="min-h-11 shrink-0 border border-red px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-red transition-colors hover:bg-red hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
        onClick={copy}
        type="button"
      >
        {copied ? 'Command copied' : 'Copy install command'}
      </button>
    </div>
  );
}
