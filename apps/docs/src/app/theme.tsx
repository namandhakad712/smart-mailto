'use client';

import { useState, useEffect } from 'react';
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

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-ink-muted dark:text-text-muted hover:text-red dark:hover:text-red transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? '☀ light' : '✦ dark'}
    </button>
  );
}
