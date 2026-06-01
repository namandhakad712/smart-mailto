'use client';

import { useSyncExternalStore } from 'react';

function getDarkSnapshot(): boolean {
  return document.documentElement.classList.contains('dark');
}

function subscribeToDark(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export function useIsDark(): boolean {
  return useSyncExternalStore(subscribeToDark, getDarkSnapshot, () => false);
}
