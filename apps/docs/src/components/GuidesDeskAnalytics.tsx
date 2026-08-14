'use client';

import { useEffect, useRef } from 'react';
import { createGuidesDeskViewCapture } from '@/lib/guidesAnalytics';

export function GuidesDeskAnalytics() {
  const captureOnce = useRef<(() => void) | null>(null);
  if (captureOnce.current == null) {
    captureOnce.current = createGuidesDeskViewCapture();
  }

  useEffect(() => {
    captureOnce.current?.();
  }, []);

  return null;
}
