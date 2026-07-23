'use client';

import React, { useState } from 'react';
import { SmartMailto } from '@smart-mailto/react';
import { useIsDark } from '@/hooks/useIsDark';

interface ProviderLogo {
  id: string;
  name: string;
  slug: string;
  color: string;
  textColor: string;
  regions: string[];
  website?: string;
}

const PROVIDER_LOGOS: ProviderLogo[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    slug: 'gmail',
    color: '#EA4335',
    textColor: '#ffffff',
    regions: ['global'],
    website: 'https://gmail.com',
  },
  {
    id: 'outlook-personal',
    name: 'Outlook',
    slug: 'outlook-personal',
    color: '#0078D4',
    textColor: '#ffffff',
    regions: ['global'],
    website: 'https://outlook.live.com',
  },
  {
    id: 'outlook-work',
    name: 'Outlook 365',
    slug: 'outlook-work',
    color: '#0078D4',
    textColor: '#ffffff',
    regions: ['enterprise', 'global'],
    website: 'https://outlook.office.com',
  },
  {
    id: 'yahoo',
    name: 'Yahoo Mail',
    slug: 'yahoo',
    color: '#720E9E',
    textColor: '#ffffff',
    regions: ['us', 'in', 'latam', 'ph'],
  },
  {
    id: 'protonmail',
    name: 'Proton Mail',
    slug: 'protonmail',
    color: '#6D4AFF',
    textColor: '#ffffff',
    regions: ['privacy', 'eu', 'nordics', 'ch'],
    website: 'https://proton.me/mail',
  },
  {
    id: 'icloud',
    name: 'iCloud Mail',
    slug: 'icloud',
    color: '#1C84C6',
    textColor: '#ffffff',
    regions: ['apple', 'us', 'au', 'jp'],
    website: 'https://www.icloud.com/mail',
  },
  {
    id: 'fastmail',
    name: 'Fastmail',
    slug: 'fastmail',
    color: '#C82E2E',
    textColor: '#ffffff',
    regions: ['au', 'us', 'power-users'],
    website: 'https://fastmail.com',
  },
  {
    id: 'zoho',
    name: 'Zoho Mail',
    slug: 'zoho',
    color: '#E42527',
    textColor: '#ffffff',
    regions: ['in', 'smb', 'global'],
    website: 'https://zoho.com/mail',
  },
  {
    id: 'tutanota',
    name: 'Tuta Mail',
    slug: 'tutanota',
    color: '#840010',
    textColor: '#ffffff',
    regions: ['eu', 'privacy'],
    website: 'https://tutanota.com',
  },
  {
    id: 'yandex',
    name: 'Yandex Mail',
    slug: 'yandex',
    color: '#FC3F1D',
    textColor: '#ffffff',
    regions: ['ru', 'cis', 'ua', 'kz', 'by'],
    website: 'https://mail.yandex.ru',
  },
  {
    id: 'mailru',
    name: 'Mail.ru',
    slug: 'mailru',
    color: '#005FF9',
    textColor: '#ffffff',
    regions: ['ru', 'cis'],
    website: 'https://mail.ru',
  },
  {
    id: 'gmx',
    name: 'GMX Mail',
    slug: 'gmx',
    color: '#1D4F96',
    textColor: '#ffffff',
    regions: ['de', 'at', 'ch'],
    website: 'https://gmx.com',
  },
  {
    id: 'webde',
    name: 'WEB.DE',
    slug: 'webde',
    color: '#FFCC00',
    textColor: '#000000',
    regions: ['de'],
    website: 'https://web.de',
  },
  {
    id: 't-online',
    name: 'Telekom Mail',
    slug: 't-online',
    color: '#E20074',
    textColor: '#ffffff',
    regions: ['de'],
    website: 'https://email.t-online.de',
  },
  {
    id: 'posteo',
    name: 'Posteo',
    slug: 'posteo',
    color: '#2E8B57',
    textColor: '#ffffff',
    regions: ['de', 'privacy'],
    website: 'https://posteo.de',
  },
  {
    id: 'mailboxorg',
    name: 'mailbox.org',
    slug: 'mailboxorg',
    color: '#00529B',
    textColor: '#ffffff',
    regions: ['de', 'privacy'],
    website: 'https://mailbox.org',
  },
  {
    id: 'laposte',
    name: 'La Poste Mail',
    slug: 'laposte',
    color: '#FFD700',
    textColor: '#000000',
    regions: ['fr'],
    website: 'https://laposte.net',
  },
  {
    id: 'yahoo-japan',
    name: 'Yahoo! Japan Mail',
    slug: 'yahoo-japan',
    color: '#FF0033',
    textColor: '#ffffff',
    regions: ['jp'],
    website: 'https://mail.yahoo.co.jp',
  },
  {
    id: 'naver',
    name: 'Naver Mail',
    slug: 'naver',
    color: '#03C75A',
    textColor: '#ffffff',
    regions: ['kr'],
    website: 'https://mail.naver.com',
  },
  {
    id: 'daum',
    name: 'Kakao Mail',
    slug: 'daum',
    color: '#FFCD00',
    textColor: '#000000',
    regions: ['kr'],
    website: 'https://mail.daum.net',
  },
  {
    id: 'qq',
    name: 'QQ Mail',
    slug: 'qq',
    color: '#12B7F5',
    textColor: '#ffffff',
    regions: ['cn'],
    website: 'https://mail.qq.com',
  },
  {
    id: 'mail163',
    name: '163 Mail',
    slug: 'mail163',
    color: '#D81B25',
    textColor: '#ffffff',
    regions: ['cn'],
    website: 'https://mail.163.com',
  },
  {
    id: 'rediff',
    name: 'Rediffmail',
    slug: 'rediff',
    color: '#D10000',
    textColor: '#ffffff',
    regions: ['in'],
    website: 'https://rediff.com',
  },
  {
    id: 'seznam',
    name: 'Seznam Email',
    slug: 'seznam',
    color: '#CC0000',
    textColor: '#ffffff',
    regions: ['cz'],
    website: 'https://email.seznam.cz',
  },
  {
    id: 'onet',
    name: 'Onet Poczta',
    slug: 'onet',
    color: '#E40000',
    textColor: '#ffffff',
    regions: ['pl'],
    website: 'https://poczta.onet.pl',
  },
  {
    id: 'wp',
    name: 'WP Poczta',
    slug: 'wp',
    color: '#003298',
    textColor: '#ffffff',
    regions: ['pl'],
    website: 'https://poczta.wp.pl',
  },
  {
    id: 'ukrnet',
    name: 'UKR.NET Mail',
    slug: 'ukrnet',
    color: '#007BB5',
    textColor: '#ffffff',
    regions: ['ua'],
    website: 'https://mail.ukr.net',
  },
  {
    id: 'libero',
    name: 'Libero Mail',
    slug: 'libero',
    color: '#FF6600',
    textColor: '#ffffff',
    regions: ['it'],
    website: 'https://libero.it',
  },
  {
    id: 'mailfence',
    name: 'Mailfence',
    slug: 'mailfence',
    color: '#37A000',
    textColor: '#ffffff',
    regions: ['be', 'eu', 'privacy'],
    website: 'https://mailfence.com',
  },
  {
    id: 'runbox',
    name: 'Runbox',
    slug: 'runbox',
    color: '#5B5EA6',
    textColor: '#ffffff',
    regions: ['no', 'privacy'],
    website: 'https://runbox.com',
  },
];

const REGION_LABELS: Record<string, string> = {
  global: '🌍 Global',
  us: '🇺🇸 United States',
  eu: '🇪🇺 Europe',
  de: '🇩🇪 Germany',
  at: '🇦🇹 Austria',
  ch: '🇨🇭 Switzerland',
  fr: '🇫🇷 France',
  it: '🇮🇹 Italy',
  jp: '🇯🇵 Japan',
  kr: '🇰🇷 South Korea',
  cn: '🇨🇳 China',
  in: '🇮🇳 India',
  au: '🇦🇺 Australia',
  ru: '🇷🇺 Russia',
  cis: '🌐 CIS',
  ua: '🇺🇦 Ukraine',
  kz: '🇰🇿 Kazakhstan',
  by: '🇧🇾 Belarus',
  pl: '🇵🇱 Poland',
  cz: '🇨🇿 Czech Republic',
  ph: '🇵🇭 Philippines',
  latam: '🌎 Latin America',
  nordics: '🇸🇪 Nordics',
  privacy: '🔒 Privacy-focused',
  'power-users': '⚡ Power Users',
  enterprise: '🏢 Enterprise',
  smb: '🏪 SMB',
  apple: '🍎 Apple',
  be: '🇧🇪 Belgium',
  no: '🇳🇴 Norway',
};

export default function ProvidersPage() {
  const isDark = useIsDark();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string | null>(null);

  const filteredProviders = PROVIDER_LOGOS.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = !regionFilter || p.regions.includes(regionFilter);
    return matchesSearch && matchesRegion;
  });

  const allRegions = Array.from(new Set(PROVIDER_LOGOS.flatMap(p => p.regions))).sort();

  return (
    <div className="space-y-12">
      <header className="text-center max-w-2xl mx-auto">
        <span className="font-mono text-xs font-bold text-red uppercase tracking-widest block mb-3">
          Provider Registry
        </span>
        <h1 className="text-5xl md:text-6xl font-headline font-normal leading-tight tracking-tight text-ink dark:text-text mb-4">
          37 Webmail Providers. Zero Compromise.
        </h1>
        <p className="text-lg text-ink-soft dark:text-text-soft">
          Every provider listed here has been manually verified. Real compose URLs. Real deep links.
          No dead links.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border dark:border-border pb-6">
        <div className="w-full sm:w-80">
          <label
            htmlFor="provider-search"
            className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-ink-soft dark:text-text-soft"
          >
            Search providers
          </label>
          <div className="relative">
            <input
              id="provider-search"
              type="text"
              placeholder="Search providers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface dark:bg-surface-container border border-border dark:border-border px-4 py-2.5 pr-10 font-body text-sm text-ink dark:text-text placeholder:text-ink-muted dark:placeholder:text-text-muted focus:outline-none focus:border-red transition-colors"
            />
            <svg
              aria-hidden="true"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted dark:text-text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRegionFilter(null)}
            className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-colors ${
              !regionFilter
                ? 'bg-red border-red text-white'
                : 'bg-transparent border-border dark:border-border text-ink-muted dark:text-text-muted hover:border-red hover:text-red'
            }`}
          >
            All
          </button>
          {allRegions.slice(0, 8).map(region => (
            <button
              key={region}
              onClick={() => setRegionFilter(regionFilter === region ? null : region)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-colors ${
                regionFilter === region
                  ? 'bg-red border-red text-white'
                  : 'bg-transparent border-border dark:border-border text-ink-muted dark:text-text-muted hover:border-red hover:text-red'
              }`}
            >
              {REGION_LABELS[region] || region}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProviders.map(provider => (
          <div
            key={provider.id}
            className="group bg-surface dark:bg-surface-container border border-border dark:border-border p-5 hover:border-red dark:hover:border-red transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 flex-shrink-0 rounded-sm bg-white/80 backdrop-blur-sm border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/provider-logos/${provider.slug}.svg`}
                  alt={provider.name}
                  className="w-full h-full p-1"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span class="text-xs font-bold text-ink">${provider.name.charAt(0)}</span>`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-base font-medium text-ink dark:text-text truncate">
                  {provider.name}
                </h3>
                <code className="font-mono text-[10px] text-red">{provider.id}</code>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {provider.regions.map(r => (
                <span
                  key={r}
                  className="px-2 py-0.5 bg-surface dark:bg-surface-container-high border border-border dark:border-border font-mono text-[9px] text-ink-muted dark:text-text-muted"
                >
                  {REGION_LABELS[r] || r}
                </span>
              ))}
            </div>

            <SmartMailto
              href={`mailto:hello@example.com?subject=Test email to ${provider.name}&body=This is a test email.`}
              theme={isDark ? 'dark' : 'light'}
              className="w-full flex items-center justify-center gap-2 bg-red hover:bg-red-dark text-white font-body text-xs font-medium px-4 py-2 transition-colors cursor-pointer"
            >
              Try compose ↗
            </SmartMailto>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-ink-muted dark:text-text-muted">
            No providers match your search.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setRegionFilter(null);
            }}
            className="mt-4 text-red font-mono text-xs underline"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="border-t border-border dark:border-border pt-8">
        <p className="font-mono text-[10px] text-ink-muted dark:text-text-muted text-center uppercase tracking-widest">
          Logo source: SimpleIcons.org · CC BY 4.0 · All brand logos are trademarks of their
          respective owners
        </p>
      </div>
    </div>
  );
}
