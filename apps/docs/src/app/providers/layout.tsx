import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Which Webmail Providers Does smart-mailto Support?',
  description:
    'Browse smart-mailto’s 51-entry webmail registry, including direct compose links, official fallback pages, native mail, and copy-address choices.',
};

export default function ProvidersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
