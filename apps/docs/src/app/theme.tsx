'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';

export function ThemeInit() {
  useServerInsertedHTML(() => (
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{
        __html:
          'try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}',
      }}
    />
  ));
  return null;
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
    >
      {dark ? '☀ light' : '\u2726 dark'}
    </button>
  );
}
