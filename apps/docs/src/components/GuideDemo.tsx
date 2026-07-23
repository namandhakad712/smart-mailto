'use client';

import { SmartMailto } from '@smart-mailto/react';
import { useIsDark } from '@/hooks/useIsDark';

export function GuideDemo() {
  const isDark = useIsDark();

  return (
    <SmartMailto
      href="mailto:hello@example.com?subject=Project%20question&body=Hi%2C%20I%20have%20a%20question%20about..."
      theme={isDark ? 'dark' : 'light'}
      className="inline-flex min-h-11 items-center justify-center gap-3 bg-red px-6 py-3 font-body font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80"
    >
      Try the upgraded link
      <span aria-hidden="true" className="material-symbols-outlined text-lg">
        arrow_outward
      </span>
    </SmartMailto>
  );
}
