'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { useIsDark } from '@/hooks/useIsDark';

const THEME_INIT_SCRIPT =
  'try{var t=localStorage.getItem("theme");var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}';

export function ThemeInit() {
  useServerInsertedHTML(() => (
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{
        __html: THEME_INIT_SCRIPT,
      }}
    />
  ));
  return null;
}

export function ThemeToggle() {
  const dark = useIsDark();

  const toggle = () => {
    const next = !dark;
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
