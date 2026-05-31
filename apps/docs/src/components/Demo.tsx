'use client';

import React, { useState } from 'react';
import { SmartMailto } from '@smart-mailto/react';

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <path d="m9 11 3 3L22 4"></path>
  </svg>
);

export function Demo() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 translate-y-12">
        <div className="mx-auto w-[40rem] h-[20rem] bg-gradient-to-r from-blue-500 to-purple-600 blur-[100px] opacity-20 rounded-full" />
      </div>

      <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl shadow-2xl">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
            <MailIcon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Try the Live Demo</h2>
          <p className="text-zinc-400 max-w-lg mb-10 text-lg">
            Click the button below to see smart-mailto in action. It will automatically detect your
            best webmail options.
          </p>

          <SmartMailto
            href="mailto:hello@example.com?subject=Hello%20from%20smart-mailto!&body=This%20is%20amazing."
            theme="dark"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-200 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full hover:scale-[1.02] active:scale-[0.98]"
            onCopy={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <span className="mr-2">Send us an email</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </SmartMailto>

          {copied && (
            <div className="mt-6 flex items-center text-sm text-green-400 bg-green-400/10 px-4 py-2 rounded-full">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Email address copied to clipboard
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
