'use client';

import { useState } from 'react';
import { getCatalogProviders } from '@smart-mailto/core';
import { SmartMailto } from '@smart-mailto/react';
import { useIsDark } from '@/hooks/useIsDark';

const PROVIDERS = getCatalogProviders();
const WEBMAIL_PROVIDERS = PROVIDERS.filter(provider => !provider.isNative && !provider.isCopy);
const COMPOSE_PROVIDER_COUNT = WEBMAIL_PROVIDERS.filter(provider => !provider.fallbackOnly).length;
const FALLBACK_PROVIDER_COUNT = WEBMAIL_PROVIDERS.filter(provider => provider.fallbackOnly).length;

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  yandex: 'Yandex Mail',
  'yahoo-japan': 'Yahoo! Japan Mail',
  naver: 'Naver Mail',
  daum: 'Kakao Mail',
  qq: 'QQ Mail',
  mail163: '163 Mail',
};

const PROVIDER_VALIDATION: Record<string, boolean> = {
  gmail: true,
  'outlook-personal': true,
  'outlook-work': true,
  yahoo: true,
  protonmail: true,
  icloud: true,
  fastmail: true,
  zoho: true,
  tutanota: true,
  yandex: true,
  mailru: false,
  gmx: true,
  webde: false,
  't-online': false,
  posteo: true,
  mailboxorg: true,
  laposte: false,
  'yahoo-japan': false,
  naver: false,
  daum: false,
  qq: false,
  mail163: false,
  rediff: false,
  seznam: false,
  onet: true,
  wp: false,
  ukrnet: false,
  libero: true,
  mailfence: false,
  runbox: false,
  disroot: true,
  riseup: true,
  rambler: true,
  aliyun: true,
  o2: false,
  interia: true,
  orange: false,
  sfr: false,
  free: true,
  nate: true,
  bsnl: false,
  telia: true,
  mynet: false,
  ttmail: false,
  'atlas-sk': true,
  spike: false,
  indiatimes: false,
  sina: false,
};

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
  'power-user': '⚡ Power Users',
  'power-users': '⚡ Power Users',
  enterprise: '🏢 Enterprise',
  smb: '🏪 SMB',
  apple: '🍎 Apple',
  be: '🇧🇪 Belgium',
  no: '🇳🇴 Norway',
  se: '🇸🇪 Sweden',
  tr: '🇹🇷 Turkey',
  sk: '🇸🇰 Slovakia',
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getDisplayName(provider: (typeof PROVIDERS)[number]): string {
  return PROVIDER_DISPLAY_NAMES[provider.id] ?? provider.name;
}

function ProviderLogo({
  provider,
  displayName,
}: {
  provider: (typeof PROVIDERS)[number];
  displayName: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-sm bg-white/80 border border-border">
      {failed ? (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center font-mono text-sm font-bold"
          style={{ backgroundColor: provider.color, color: provider.textColor }}
        >
          {getInitials(displayName)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/provider-logos/${provider.id}.svg`}
          alt=""
          className="w-full h-full p-1"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function ProvidersPage() {
  const isDark = useIsDark();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string | null>(null);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProviders = PROVIDERS.filter(provider => {
    const matchesSearch =
      provider.name.toLowerCase().includes(normalizedSearch) ||
      getDisplayName(provider).toLowerCase().includes(normalizedSearch) ||
      provider.id.toLowerCase().includes(normalizedSearch);
    const matchesRegion = !regionFilter || provider.regions?.includes(regionFilter);
    return matchesSearch && matchesRegion;
  });

  const allRegions = Array.from(
    new Set(PROVIDERS.flatMap(provider => provider.regions ?? [])),
  ).sort();

  return (
    <div className="space-y-12">
      <header className="text-center max-w-2xl mx-auto">
        <span className="font-mono text-xs font-bold text-red uppercase tracking-widest block mb-3">
          Provider Registry
        </span>
        <h1 className="text-5xl md:text-6xl font-headline font-normal leading-tight tracking-tight text-ink dark:text-text mb-4">
          {WEBMAIL_PROVIDERS.length} Webmail Entries.
        </h1>
        <p className="text-lg text-ink-soft dark:text-text-soft">
          {COMPOSE_PROVIDER_COUNT} provider compose links and {FALLBACK_PROVIDER_COUNT} official
          webmail fallback pages. Prefill support varies by provider; native mail and copy-address
          remain separate fallback actions.
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
              onChange={event => setSearch(event.target.value)}
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
        {filteredProviders.map(provider => {
          const displayName = getDisplayName(provider);

          return (
            <div
              key={provider.id}
              className="group bg-surface dark:bg-surface-container border border-border dark:border-border p-5 hover:border-red dark:hover:border-red transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <ProviderLogo provider={provider} displayName={displayName} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline text-base font-medium text-ink dark:text-text truncate">
                    {displayName}
                  </h3>
                  <code className="font-mono text-[10px] text-red">{provider.id}</code>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {PROVIDER_VALIDATION[provider.id] !== undefined && (
                  <span
                    className={`px-2 py-0.5 font-mono text-[9px] border ${
                      PROVIDER_VALIDATION[provider.id]
                        ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                        : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400'
                    }`}
                  >
                    {PROVIDER_VALIDATION[provider.id] ? 'verified' : 'unverified'}
                  </span>
                )}
                {(provider.regions ?? []).map(region => (
                  <span
                    key={region}
                    className="px-2 py-0.5 bg-surface dark:bg-surface-container-high border border-border dark:border-border font-mono text-[9px] text-ink-muted dark:text-text-muted"
                  >
                    {REGION_LABELS[region] || region}
                  </span>
                ))}
              </div>

              <SmartMailto
                href={`mailto:hello@example.com?subject=Test email to ${displayName}&body=This is a test email.`}
                theme={isDark ? 'dark' : 'light'}
                preferredProvider={provider.id}
                className="w-full flex items-center justify-center gap-2 bg-red hover:bg-red-dark text-white font-body text-xs font-medium px-4 py-2 transition-colors cursor-pointer"
              >
                Try compose ↗
              </SmartMailto>
            </div>
          );
        })}
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
