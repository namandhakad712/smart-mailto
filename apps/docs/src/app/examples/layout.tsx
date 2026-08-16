import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What smart-mailto Changes on a Contact Page',
  description:
    'Compare six simulated contact pages before and after adding a webmail picker, native-mail option, and copy-address fallback.',
  alternates: {
    canonical: 'https://smart-mailto.vercel.app/examples',
  },
};

export default function ExamplesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
