import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Configure the smart-mailto API',
  description:
    'Configure @smart-mailto/core, parse mailto links, resolve providers, control the picker, and connect the React, Vue, and Svelte adapters.',
  alternates: {
    canonical: 'https://smart-mailto.vercel.app/spec',
  },
};

export default function SpecLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
