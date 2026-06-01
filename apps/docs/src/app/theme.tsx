'use client';

import { useState } from 'react';
import Script from 'next/script';

export function ThemeScript() {
  return (
    <Script id="theme-init" strategy="beforeInteractive">{`
      try {
        var t = localStorage.getItem('theme');
        if (t === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } catch(e) {}
    `}</Script>
  );
}

function getInitialDark(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function ThemeToggle() {
  const [dark, setDark] = useState(getInitialDark);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-ink-muted dark:text-text-muted hover:text-red dark:hover:text-red transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? '☀ light' : '\u2726 dark'}
    </button>
  );
}
