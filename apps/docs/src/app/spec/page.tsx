'use client';

import React, { useState } from 'react';
import { SmartMailto } from '@smart-mailto/react';
import { useIsDark } from '@/hooks/useIsDark';
import {
  parseMailto,
  resolveProviders,
  getAllProviders,
  getProvider,
  collectGeoSignals,
  isValidMailtoParams,
  ResolvedProviders,
} from '@smart-mailto/core';

const webmailProviders = getAllProviders().filter(
  provider => !provider.isNative && !provider.isCopy,
);
const composeProviderCount = webmailProviders.filter(provider => !provider.fallbackOnly).length;
const fallbackProviderCount = webmailProviders.filter(provider => provider.fallbackOnly).length;

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-headline font-normal text-ink dark:text-text border-b border-border dark:border-border pb-3 mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ApiTable({
  rows,
}: {
  rows: { name: string; type: string; desc: string; optional?: boolean; default?: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-border dark:border-border">
            <th className="text-left py-2 pr-4 font-medium text-ink dark:text-text">Name</th>
            <th className="text-left py-2 pr-4 font-medium text-ink dark:text-text">Type</th>
            <th className="text-left py-2 pr-4 font-medium text-ink dark:text-text">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.name} className="border-b border-border dark:border-border">
              <td className="py-2 pr-4">
                <code className="text-red text-xs font-mono">{row.name}</code>
                {row.optional && (
                  <span className="ml-1 font-mono text-[9px] text-ink-muted dark:text-text-muted">
                    (opt)
                  </span>
                )}
              </td>
              <td className="py-2 pr-4">
                <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1 py-0.5 border border-border dark:border-border">
                  {row.type}
                </code>
              </td>
              <td className="py-2 pr-4 text-ink-soft dark:text-text-soft text-xs">
                {row.desc}
                {row.default && (
                  <span className="ml-1 text-ink-muted dark:text-text-muted">
                    Default: {row.default}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LiveExample({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: (isDark: boolean) => React.ReactNode;
}) {
  const isDark = useIsDark();
  return (
    <div className="border border-border dark:border-border">
      <div className="bg-surface dark:bg-surface-container border-b border-border dark:border-border px-4 py-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-red">{title}</p>
        <p className="font-mono text-[9px] text-ink-muted dark:text-text-muted mt-0.5">
          {description}
        </p>
      </div>
      <div className="p-4 bg-bg dark:bg-bg flex items-center justify-center">
        {typeof children === 'function' ? children(isDark) : children}
      </div>
    </div>
  );
}

function useResolvedProviders(email: string): ResolvedProviders | null {
  try {
    const params = parseMailto(`mailto:${email}`);
    if (isValidMailtoParams(params)) {
      return resolveProviders(params, { autoDetectGeo: true });
    }
  } catch {
    // invalid email
  }
  return null;
}

function ResolverLive() {
  const [email, setEmail] = useState('hello@gmail.com');
  const resolved = useResolvedProviders(email);

  return (
    <div className="w-full max-w-md space-y-3">
      <input
        className="w-full bg-bg dark:bg-bg border border-border dark:border-border px-3 py-2 font-mono text-xs text-ink dark:text-text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter email or domain..."
      />
      {resolved && (
        <div className="text-left font-mono text-[10px] text-ink dark:text-text space-y-1">
          <p>
            Region: <span className="text-red">{resolved.detectedRegion}</span>
          </p>
          <p>
            Signals: <span className="text-red">{resolved.signals.timeZone}</span> ·{' '}
            {resolved.signals.locale}
          </p>
          <p>
            Providers:{' '}
            <span className="text-red">
              {resolved.providers
                .slice(0, 4)
                .map(p => p.id)
                .join(', ')}
            </span>
          </p>
          {resolved.detectedFromEmail && (
            <p>
              Domain match: <span className="text-red">{resolved.detectedFromEmail}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ProviderLookupLive() {
  const [id, setId] = useState('gmail');
  const provider = getProvider(id);

  return (
    <div className="w-full max-w-sm space-y-2">
      <input
        className="w-full bg-bg dark:bg-bg border border-border dark:border-border px-3 py-2 font-mono text-xs text-ink dark:text-text"
        value={id}
        onChange={e => setId(e.target.value)}
        placeholder="Provider ID (e.g. gmail, protonmail)"
      />
      {provider ? (
        <div className="font-mono text-[10px] text-ink dark:text-text text-left space-y-0.5">
          <p>
            Name: <span className="text-red">{provider.name}</span>
          </p>
          <p>
            Color: <span className="text-red">{provider.color}</span>{' '}
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: provider.color }}
            />
          </p>
          <p>
            Regions: <span className="text-red">{provider.regions?.join(', ')}</span>
          </p>
          <p>
            noBodyPreFill:{' '}
            <span className="text-red">{provider.noBodyPreFill ? 'true' : 'false'}</span>
          </p>
        </div>
      ) : (
        <p className="font-mono text-[10px] text-ink-muted dark:text-text-muted">
          Provider not found
        </p>
      )}
    </div>
  );
}

export default function SpecPage() {
  const geoSignals = collectGeoSignals();

  return (
    <div className="space-y-16">
      <header className="text-center max-w-2xl mx-auto">
        <span className="font-mono text-xs font-bold text-red uppercase tracking-widest block mb-3">
          Technical Reference
        </span>
        <h1 className="text-5xl md:text-6xl font-headline font-normal leading-tight tracking-tight text-ink dark:text-text mb-4">
          How do I configure smart-mailto?
        </h1>
        <p className="text-lg text-ink-soft dark:text-text-soft">
          Use this API reference to configure @smart-mailto/core, parse links, resolve providers,
          control the picker, and connect framework adapters.
        </p>
      </header>

      <nav className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-widest border-b border-border dark:border-border pb-4">
        {[
          'Parser',
          'Resolver',
          'Geo',
          'Detector',
          'Storage',
          'Init',
          'Config',
          'Providers',
          'Framework',
        ].map(s => (
          <a
            key={s}
            href={`#${s.toLowerCase()}`}
            className="text-red hover:text-red-dark transition-colors"
          >
            {s}
          </a>
        ))}
      </nav>

      <Section id="parser" title="Parser">
        <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
          RFC 6068-compliant mailto: URI parsing and building. All string values are decoded (not
          URL-encoded) in the output.
        </p>
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-xs text-red mb-3">parseMailto(href)</h3>
            <p className="text-xs text-ink-soft dark:text-text-soft mb-3">
              Parses a mailto: URI string into a structured{' '}
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
                MailtoParams
              </code>{' '}
              object.
            </p>
            <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-xs">
              <pre className="text-ink dark:text-text whitespace-pre-wrap">{`const params = parseMailto(
  'mailto:hello@example.com?cc=boss@site.com&subject=Hi&body=Hello'
);
// → {
//   to: ['hello@example.com'],
//   cc: ['boss@site.com'],
//   subject: 'Hi',
//   body: 'Hello'
// }`}</pre>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs text-red mb-3">buildMailtoHref(params)</h3>
            <p className="text-xs text-ink-soft dark:text-text-soft mb-3">
              Serializes a{' '}
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
                MailtoParams
              </code>{' '}
              object back into a mailto: URI string.
            </p>
            <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-xs">
              <pre className="text-ink dark:text-text whitespace-pre-wrap">{`buildMailtoHref({
  to: ['hello@example.com'],
  subject: 'Hello',
  body: 'World'
});
// → 'mailto:hello@example.com?subject=Hello&body=World'`}</pre>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs text-red mb-3">isValidMailtoParams(params)</h3>
            <p className="text-xs text-ink-soft dark:text-text-soft">
              Returns{' '}
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
                true
              </code>{' '}
              if the params object has at least one recipient.
            </p>
          </div>
        </div>
      </Section>

      <Section id="resolver" title="Resolver">
        <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
          Resolves which providers to show for a given mailto: context. Resolution order: custom →
          persisted preference → email domain detection → preferredProvider override → geo-ordered
          list.
        </p>
        <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-xs mb-6">
          <pre className="text-ink dark:text-text whitespace-pre-wrap">{`const params = parseMailto('mailto:hello@gmail.com');
const resolved = resolveProviders(params, { autoDetectGeo: true });

// resolved: ResolvedProviders
// {
//   providers: Provider[],   // ordered list to display
//   detectedRegion: string,  // e.g. 'ru' | 'global'
//   signals: GeoSignals,     // raw browser signals
//   detectedFromEmail: string | null  // provider ID if domain matched
// }`}</pre>
        </div>
        <LiveExample
          title="Live: resolveProviders"
          description="Paste any email to see geo detection and provider resolution"
        >
          {_dark => <ResolverLive />}
        </LiveExample>
      </Section>

      <Section id="geo" title="Geo Detection">
        <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
          Zero-network geo detection using only browser APIs. Maps IANA timezone +
          navigator.language to regional provider priorities. Runs in &lt;1ms, no external requests.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4">
            <h3 className="font-mono text-[10px] text-red uppercase tracking-widest mb-3">
              collectGeoSignals()
            </h3>
            <div className="font-mono text-[10px] text-ink dark:text-text space-y-1">
              <p>
                Timezone: <span className="text-red">{geoSignals.timeZone}</span>
              </p>
              <p>
                Locale: <span className="text-red">{geoSignals.locale}</span>
              </p>
              <p>
                Languages:{' '}
                <span className="text-red">{[...geoSignals.locales].slice(0, 3).join(', ')}</span>
              </p>
              <p>
                Mobile: <span className="text-red">{geoSignals.isMobile ? 'yes' : 'no'}</span>
              </p>
              <p>
                iOS: <span className="text-red">{geoSignals.isIOS ? 'yes' : 'no'}</span>
              </p>
              <p>
                Android: <span className="text-red">{geoSignals.isAndroid ? 'yes' : 'no'}</span>
              </p>
            </div>
          </div>
          <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4">
            <h3 className="font-mono text-[10px] text-red uppercase tracking-widest mb-3">
              detectRegionLabel(signals)
            </h3>
            <p className="font-mono text-[10px] text-ink-soft dark:text-text-soft mb-2">
              Returns a human-readable region string:
            </p>
            <div className="font-mono text-[10px] text-ink dark:text-text">
              <p>
                <span className="text-red">Europe/Moscow</span> →{' '}
                <span className="text-green-600 dark:text-green-400">Russia/CIS</span>
              </p>
              <p>
                <span className="text-red">Asia/Tokyo</span> →{' '}
                <span className="text-green-600 dark:text-green-400">Japan</span>
              </p>
              <p>
                <span className="text-red">America/New_York</span> →{' '}
                <span className="text-green-600 dark:text-green-400">Global</span>
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="detector" title="Email Domain Detector">
        <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
          Maps email domains to provider IDs. Used during resolution to highlight the user&apos;s
          existing email provider.
        </p>
        <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-xs mb-6">
          <pre className="text-ink dark:text-text whitespace-pre-wrap">{`detectProviderFromEmail('hello@gmail.com');
// → 'gmail'

detectProviderFromEmail('user@outlook.com');
// → 'outlook-personal'

detectProviderFromEmail('user@protonmail.com');
// → 'protonmail'

getDomainsForProvider('gmail');
// → ['gmail.com', 'googlemail.com']`}</pre>
        </div>
      </Section>

      <Section id="storage" title="Storage">
        <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
          localStorage-based preference persistence. All operations are SSR-safe and silently fail
          in incognito/private browsing.
        </p>
        <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-xs mb-6">
          <pre className="text-ink dark:text-text whitespace-pre-wrap">{`savePreference('gmail');         // Persist user's choice
loadPreference();                // → 'gmail' | null
clearPreference();               // Remove persisted choice
isStorageAvailable();            // → boolean (false in SSR/incognito)`}</pre>
        </div>
      </Section>

      <Section id="init" title="Initialization">
        <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
          Global initialization via capture-phase event delegation on{' '}
          <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
            document
          </code>
          . Intercepts all{' '}
          <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
            mailto:
          </code>{' '}
          link clicks. Modal and icons are dynamically imported to keep the core bundle tiny.
        </p>
        <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-xs mb-6">
          <pre className="text-ink dark:text-text whitespace-pre-wrap">{`import { initSmartMailto, destroySmartMailto, isInitialized, updateConfig } from '@smart-mailto/core';

const destroy = initSmartMailto({
  theme: 'dark',
  autoDetectGeo: true,
  maxProviders: 6,
  // ...config
});

destroy();          // Remove listeners, clean up
isInitialized();    // → boolean
updateConfig({ theme: 'light' });  // Update config at runtime`}</pre>
        </div>
        <div className="p-4 border border-border dark:border-border">
          <p className="font-mono text-[10px] text-red uppercase tracking-widest mb-2">
            Architecture notes
          </p>
          <ul className="font-mono text-[10px] text-ink-soft dark:text-text-soft space-y-1 list-disc list-inside">
            <li>
              Uses capture-phase (
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
                capture: true
              </code>
              ) on{' '}
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
                document
              </code>{' '}
              to intercept all mailto: links including dynamically added ones
            </li>
            <li>
              Modal (
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
                modal.ts
              </code>
              ) and icons (
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
                icons.ts
              </code>
              ) are dynamically imported on first trigger
            </li>
            <li>
              Safari popup blocker:{' '}
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
                window.open()
              </code>{' '}
              is called synchronously within the user click handler
            </li>
            <li>Shadow DOM is used for modal CSS isolation — host page styles cannot leak in</li>
          </ul>
        </div>
      </Section>

      <Section id="config" title="SmartMailtoConfig">
        <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
          Full configuration interface. All options are optional and have sensible defaults.
        </p>
        <ApiTable
          rows={[
            {
              name: 'theme',
              type: "'dark' | 'light' | 'auto'",
              desc: 'Visual theme for the modal. Defaults to auto (prefers-color-scheme).',
              optional: true,
              default: "'auto'",
            },
            {
              name: 'autoDetectGeo',
              type: 'boolean',
              desc: 'Use browser heuristics to order providers by region. Defaults to true.',
              optional: true,
              default: 'true',
            },
            {
              name: 'preferredProvider',
              type: 'string',
              desc: 'Force a specific provider ID to the top of the list.',
              optional: true,
            },
            {
              name: 'maxProviders',
              type: 'number',
              desc: 'Maximum number of provider buttons to show.',
              optional: true,
              default: '6',
            },
            {
              name: 'includeNative',
              type: 'boolean',
              desc: 'Include "Open in Native Mail App" option.',
              optional: true,
              default: 'true on mobile',
            },
            {
              name: 'includeCopy',
              type: 'boolean',
              desc: 'Always include a "Copy Email Address" button.',
              optional: true,
              default: 'true',
            },
            {
              name: 'excludeProviders',
              type: 'string[]',
              desc: 'Hide specific provider IDs from the list.',
              optional: true,
            },
            {
              name: 'customProviders',
              type: 'Provider[]',
              desc: 'Inject custom/enterprise providers. Prepended to the list.',
              optional: true,
            },
            {
              name: 'classNames',
              type: 'ClassNames',
              desc: 'CSS class overrides for headless/unstyled mode.',
              optional: true,
            },
            {
              name: 'i18n',
              type: 'Partial<I18nStrings>',
              desc: 'Override UI strings for internationalization.',
              optional: true,
            },
            {
              name: 'rememberChoice',
              type: 'boolean',
              desc: "Persist user's provider choice to localStorage.",
              optional: true,
              default: 'true',
            },
            {
              name: 'storageKey',
              type: 'string',
              desc: 'localStorage key for persisted provider choice.',
              optional: true,
              default: "'smart-mailto:preferred'",
            },
            {
              name: 'onOpen',
              type: '(provider, params) => void',
              desc: 'Lifecycle hook: fired when user clicks a provider.',
              optional: true,
            },
            {
              name: 'onCopy',
              type: '(email) => void',
              desc: 'Lifecycle hook: fired when user copies an email address.',
              optional: true,
            },
            {
              name: 'onClose',
              type: '() => void',
              desc: 'Lifecycle hook: fired when modal is dismissed.',
              optional: true,
            },
            {
              name: 'onShow',
              type: '(params, providers) => void',
              desc: 'Lifecycle hook: fired when modal is first shown.',
              optional: true,
            },
          ]}
        />
      </Section>

      <Section id="providers" title="Provider Registry">
        <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
          {webmailProviders.length} webmail entries: {composeProviderCount} provider compose links
          and {fallbackProviderCount} official webmail fallback pages, plus native mail and
          copy-address actions. Prefill support varies by provider. Registry source:{' '}
          <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
            packages/core/src/providers.ts
          </code>
          .
        </p>
        <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-xs mb-6">
          <pre className="text-ink dark:text-text whitespace-pre-wrap">{`PROVIDERS           // ReadonlyRecord<string, Provider>
getProvider(id)     // → Provider | undefined
getAllProviders()   // → Provider[]`}</pre>
        </div>
        <LiveExample
          title="Live: Provider Lookup"
          description="Type a provider ID to inspect its config"
        >
          {_dark => <ProviderLookupLive />}
        </LiveExample>
      </Section>

      <Section id="framework" title="Framework Wrappers">
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-xs text-red mb-3">React</h3>
            <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-[10px] text-ink dark:text-text mb-3">
              <pre className="whitespace-pre-wrap">{`// SmartMailtoProvider wraps your app
<SmartMailtoProvider theme="dark" autoDetectGeo>
  <App />
</SmartMailtoProvider>

// useSmartMailto() for programmatic control
const { open, config } = useSmartMailto();
open('hello@example.com', {
  subject: 'Hi',
  body: 'I would like to learn more.',
  theme: 'dark', // optional one-call picker override
});

// SmartMailto drop-in component replaces <a>
<SmartMailto href="mailto:hello@example.com" theme="dark">
  Contact Us
</SmartMailto>`}</pre>
            </div>
            <LiveExample
              title="Live: React Component"
              description="SmartMailto component with dark/light sync"
            >
              {dark => (
                <SmartMailto
                  href="mailto:hello@example.com?subject=Spec%20page%20test&body=Testing%20the%20React%20component."
                  theme={dark ? 'dark' : 'light'}
                  className="inline-flex items-center gap-2 bg-red hover:bg-red-dark text-white font-body text-xs font-medium px-4 py-2 transition-colors cursor-pointer"
                >
                  <MailIcon />
                  <span>Send test email</span>
                </SmartMailto>
              )}
            </LiveExample>
          </div>
          <div>
            <h3 className="font-mono text-xs text-red mb-3">Vue 3</h3>
            <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-[10px] text-ink dark:text-text mb-3">
              <pre className="whitespace-pre-wrap">{`// main.ts — register plugin
import { SmartMailtoPlugin } from '@smart-mailto/vue';
app.use(SmartMailtoPlugin, { theme: 'dark', autoDetectGeo: true });

// SmartMailto component (auto-registered)
<SmartMailto href="mailto:hello@example.com" theme="dark">
  Contact Us
</SmartMailto>`}</pre>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs text-red mb-3">Svelte</h3>
            <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4 font-mono text-[10px] text-ink dark:text-text mb-3">
              <pre className="whitespace-pre-wrap">{`// smartMailto action on any anchor
<a href="mailto:hello@example.com"
   use:smartMailto={{ theme: 'dark' }}>
  Contact Us
</a>

// Global init for full-page interception
import { initGlobal, destroyGlobal } from '@smart-mailto/svelte';
onMount(() => { initGlobal({ theme: 'dark' }); });
onDestroy(() => destroyGlobal());`}</pre>
            </div>
          </div>
        </div>
      </Section>

      <Section id="bundle" title="Bundle & Performance">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4">
            <h3 className="font-mono text-[10px] text-red uppercase tracking-widest mb-3">
              Bundle Size
            </h3>
            <p className="font-mono text-2xl text-ink dark:text-text mb-1">&lt; 8KB</p>
            <p className="font-mono text-[10px] text-ink-soft dark:text-text-soft">
              gzipped, all targets
            </p>
            <p className="font-mono text-[9px] text-ink-muted dark:text-text-muted mt-2">
              Enforced in CI via .github/workflows/bundle-size.yml
            </p>
          </div>
          <div className="bg-surface dark:bg-surface-container border border-border dark:border-border p-4">
            <h3 className="font-mono text-[10px] text-red uppercase tracking-widest mb-3">
              Modal Loading
            </h3>
            <p className="font-mono text-[10px] text-ink dark:text-text">
              Core bundle contains only parsing, resolution, and geo logic.
            </p>
            <p className="font-mono text-[10px] text-ink-soft dark:text-text-soft mt-1">
              Modal UI + icons are dynamically imported on first trigger, keeping initial load
              minimal.
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 border border-border dark:border-border">
          <p className="font-mono text-[10px] text-red uppercase tracking-widest mb-2">
            Build targets
          </p>
          <div className="grid grid-cols-3 gap-4 font-mono text-[10px] text-ink-soft dark:text-text-soft">
            <div>
              ESM: <span className="text-red">dist/index.js</span>
            </div>
            <div>
              CJS: <span className="text-red">dist/index.cjs</span>
            </div>
            <div>
              Types: <span className="text-red">dist/index.d.ts</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
