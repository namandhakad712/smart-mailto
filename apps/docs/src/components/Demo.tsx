'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SmartMailto } from '@smart-mailto/react';
import { useIsDark } from '@/hooks/useIsDark';
import { captureDemoPageview, createDemoAnalyticsHooks } from '@/lib/demoAnalytics';

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

export function Demo() {
  const [copied, setCopied] = useState(false);
  const isDark = useIsDark();
  const pageviewCaptured = useRef(false);
  const analyticsHooks = useMemo(() => createDemoAnalyticsHooks(), []);

  useEffect(() => {
    if (pageviewCaptured.current) return;
    pageviewCaptured.current = true;
    captureDemoPageview();
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-surface dark:bg-surface-container border border-border dark:border-border p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border dark:border-border">
        <div className="w-10 h-10 flex items-center justify-center border border-border dark:border-border text-red">
          <MailIcon />
        </div>
        <div>
          <h3 className="font-body text-sm font-semibold text-ink dark:text-text">Live demo</h3>
          <p className="font-mono text-[0.625rem] text-ink-muted dark:text-text-muted">
            Click to trigger smart-mailto
          </p>
        </div>
      </div>

      <SmartMailto
        href="mailto:hello@example.com?subject=Hello%20from%20smart-mailto!&body=This%20is%20amazing."
        theme={isDark ? 'dark' : 'light'}
        className="group inline-flex items-center gap-2 bg-red hover:bg-red-dark text-white font-body text-sm font-medium px-6 py-2.5 transition-colors cursor-pointer"
        onShow={analyticsHooks.onShow}
        onOpen={analyticsHooks.onOpen}
        onClose={analyticsHooks.onClose}
        onCopy={() => {
          analyticsHooks.onCopy();
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <span>Send us an email</span>
        <ArrowRightIcon />
      </SmartMailto>

      {copied && (
        <div className="mt-3 flex items-center gap-1.5 font-mono text-[0.625rem] text-ink-soft dark:text-text-soft">
          <CheckIcon />
          Email address copied to clipboard
        </div>
      )}
    </div>
  );
}
