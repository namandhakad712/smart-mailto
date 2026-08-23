import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeInit, ThemeToggle } from './theme';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://smart-mailto.vercel.app'),
  title: 'smart-mailto · Zero-dependency webmail picker',
  description:
    'Add a zero-dependency webmail picker to existing mailto: links. Visitors can compose in webmail, use native mail, or copy the address.',
  alternates: {
    canonical: 'https://smart-mailto.vercel.app',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'smart-mailto',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'smart-mailto, the zero-dependency webmail picker for mailto links',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: '/og-image.png',
        alt: 'smart-mailto, the zero-dependency webmail picker for mailto links',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInit />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Runtime loading preserves the brand typefaces without making a deployment depend on Google Fonts. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-body selection:bg-red selection:text-white">
        <header className="bg-paper dark:bg-bg border-b border-border dark:border-border flex flex-col items-center w-full px-6 py-4 max-w-screen-2xl mx-auto top-0">
          <div className="w-full flex justify-between items-center font-mono text-xs uppercase tracking-widest text-ink-muted dark:text-text-muted mb-4 border-b border-border dark:border-border pb-2">
            <span>VOL. I · NO. 1</span>
            <span className="hidden md:inline">DIGITAL EDITION</span>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span>PACKAGE v0.3.0</span>
            </div>
          </div>
          <div className="text-center mb-6">
            <span className="font-mono text-xs font-bold text-red tracking-[0.3em] uppercase block mb-2">
              ✦ TECHNOLOGY SPECIAL
            </span>
            <h1 className="text-4xl md:text-8xl font-headline font-light tracking-tighter text-ink dark:text-text uppercase">
              The Internet Times
            </h1>
            <p className="font-body italic text-ink-soft dark:text-text-soft mt-2 tracking-tight">
              All the protocols that are fit to fix.
            </p>
          </div>
          <nav className="flex w-full flex-wrap justify-center gap-x-5 gap-y-2 border-t border-b border-ink py-2 dark:border-text md:gap-x-8">
            <Link
              className="font-label tracking-tighter uppercase text-ink dark:text-text-soft font-medium hover:text-red dark:hover:text-red transition-colors duration-200 cursor-pointer active:opacity-80"
              href="/"
            >
              The Protocol
            </Link>
            <Link
              className="font-label tracking-tighter uppercase text-ink-soft dark:text-text-soft font-medium hover:text-red dark:hover:text-red transition-colors duration-200 cursor-pointer active:opacity-80"
              href="/providers"
            >
              Provider Support
            </Link>
            <Link
              className="font-label tracking-tighter uppercase text-ink-soft dark:text-text-soft font-medium hover:text-red dark:hover:text-red transition-colors duration-200 cursor-pointer active:opacity-80"
              href="/spec"
            >
              Technical Specs
            </Link>
            <Link
              className="font-label tracking-tighter uppercase text-ink-soft dark:text-text-soft font-medium hover:text-red dark:hover:text-red transition-colors duration-200 cursor-pointer active:opacity-80"
              href="/examples"
            >
              Examples
            </Link>
            <Link
              className="font-label tracking-tighter uppercase text-ink-soft dark:text-text-soft font-medium hover:text-red dark:hover:text-red transition-colors duration-200 cursor-pointer active:opacity-80"
              href="/docs/geo-routing"
            >
              Geo
            </Link>
            <Link
              className="font-label tracking-tighter uppercase text-ink-soft dark:text-text-soft font-medium hover:text-red dark:hover:text-red transition-colors duration-200 cursor-pointer active:opacity-80"
              href="/guides/replace-mailto"
            >
              Install
            </Link>
            <Link
              className="font-label tracking-tighter uppercase text-ink-soft dark:text-text-soft font-medium hover:text-red dark:hover:text-red transition-colors duration-200 cursor-pointer active:opacity-80"
              href="/docs/cdn"
            >
              CDN
            </Link>
            <Link
              className="font-label tracking-tighter uppercase text-ink-soft dark:text-text-soft font-medium hover:text-red dark:hover:text-red transition-colors duration-200 cursor-pointer active:opacity-80"
              href="/guides"
            >
              Guides
            </Link>
          </nav>
        </header>

        <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-12 w-full">{children}</main>

        <footer className="bg-paper dark:bg-bg border-t-4 border-double border-border dark:border-border flex flex-col md:flex-row justify-between items-center w-full px-6 py-8 mt-auto">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-widest text-ink-muted dark:text-text-muted md:mb-0 md:justify-start">
            <span>© 2026 smart-mailto — All the protocols that are fit to fix.</span>
            <a
              className="inline-flex items-center gap-1 normal-case tracking-normal hover:text-ink dark:hover:text-text transition-colors underline-offset-4 hover:underline"
              href="https://tin.computer"
            >
              <svg aria-hidden="true" className="h-[1em] w-[1em]" viewBox="0 0 32 32">
                <rect width="32" height="32" fill="#66DC9D" />
              </svg>
              Growth by Tin
            </a>
          </div>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-ink-muted dark:text-text-muted">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Style Guide</span>
            <span>Masthead</span>
            <span>RSS</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
