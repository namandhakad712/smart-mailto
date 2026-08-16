import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How smart-mailto Chooses Regional Webmail Providers',
  description:
    'See how smart-mailto orders regional webmail providers from browser timezone and language signals without IP lookup, cookies, or network requests.',
  alternates: {
    canonical: 'https://smart-mailto.vercel.app/docs/geo-routing',
  },
};

function CodeBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden border border-border bg-code-bg dark:border-border">
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </div>
      <pre className="p-5 text-sm leading-7 text-white">
        <code>{children}</code>
      </pre>
    </div>
  );
}

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

export default function GeoRoutingPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <header className="border-b border-border pb-12 dark:border-border mb-12">
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
          Architecture · Zero-Network Geolocation
        </p>
        <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.05] tracking-tight text-ink dark:text-text md:text-7xl">
          How does smart-mailto choose regional providers?
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft dark:text-text-soft">
          smart-mailto uses browser timezone and language signals to order regional providers. It
          does not use IP lookup, cookies, or network requests for this detection.
        </p>
      </header>

      <div className="prose-custom prose dark:prose-invert max-w-none space-y-16">
        <Section id="how-it-works" title="How It Works">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-3">1. Collect Signals</h3>
              <p className="text-sm text-ink-soft dark:text-text-soft mb-3">
                Two browser APIs, zero network:
              </p>
              <ul className="font-mono text-xs text-ink-soft dark:text-text-soft space-y-2 list-disc list-inside">
                <li>
                  <code className="text-red">Intl.DateTimeFormat().resolvedOptions().timeZone</code>
                  — IANA timezone string (e.g., <code className="text-red">Europe/Moscow</code>)
                </li>
                <li>
                  <code className="text-red">navigator.language</code> — BCP 47 language tag (e.g.,{' '}
                  <code className="text-red">ru-RU</code>)
                </li>
              </ul>
            </div>
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-3">2. Map to Region</h3>
              <p className="text-sm text-ink-soft dark:text-text-soft mb-3">
                Timezone is matched against a curated map of 180+ timezone entries:
              </p>
              <ul className="font-mono text-xs text-ink-soft dark:text-text-soft space-y-1">
                <li>
                  <span className="text-red">Europe/Moscow</span> → ru (Russia/CIS)
                </li>
                <li>
                  <span className="text-red">Asia/Tokyo</span> → jp (Japan)
                </li>
                <li>
                  <span className="text-red">America/New_York</span> → us (United States)
                </li>
              </ul>
            </div>
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-3">3. Order Providers</h3>
              <p className="text-sm text-ink-soft dark:text-text-soft mb-3">
                Each region maps to a prioritized provider list:
              </p>
              <ul className="font-mono text-xs text-ink-soft dark:text-text-soft space-y-1">
                <li>
                  <span className="text-red">Russia</span> → Yandex, Mail.ru, Rambler, Gmail
                </li>
                <li>
                  <span className="text-red">Japan</span> → Yahoo! Japan, iCloud, Gmail, docomo
                </li>
                <li>
                  <span className="text-red">Germany</span> → GMX, WEB.DE, T-Online, Gmail
                </li>
              </ul>
            </div>
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-3">4. Fallback Chain</h3>
              <p className="text-sm text-ink-soft dark:text-text-soft mb-3">
                Resolution order when no geo signals are available:
              </p>
              <ol className="font-mono text-xs text-ink-soft dark:text-text-soft space-y-1 list-decimal list-inside">
                <li>Custom providers (injected by user)</li>
                <li>Persisted preference (localStorage)</li>
                <li>Email domain detection</li>
                <li>preferredProvider override</li>
                <li>Geo-ordered default list</li>
              </ol>
            </div>
          </div>
        </Section>

        <Section id="timezone-map" title="Timezone Coverage">
          <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
            smart-mailto maps 180+ IANA timezones to 20+ regional provider configurations. Coverage
            prioritizes regions with strong local email providers:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                region: 'Russia / CIS',
                timezones: 'Europe/Moscow, Asia/Yekaterinburg, ...',
                providers: 'Yandex, Mail.ru, Rambler',
              },
              {
                region: 'Japan',
                timezones: 'Asia/Tokyo, Asia/Seoul',
                providers: 'Yahoo! Japan, iCloud, docomo',
              },
              {
                region: 'Germany',
                timezones: 'Europe/Berlin, Europe/Vienna',
                providers: 'GMX, WEB.DE, T-Online',
              },
              {
                region: 'France',
                timezones: 'Europe/Paris',
                providers: 'SFR, Free, Orange, La Poste',
              },
              { region: 'Poland', timezones: 'Europe/Warsaw', providers: 'Onet, WP, O2, Interia' },
              {
                region: 'China',
                timezones: 'Asia/Shanghai, Asia/Hong_Kong',
                providers: 'QQ, 163, Alibaba',
              },
              { region: 'India', timezones: 'Asia/Kolkata', providers: 'Gmail, Rediff, Zoho' },
              { region: 'South Korea', timezones: 'Asia/Seoul', providers: 'Naver, Kakao, Nate' },
              {
                region: 'Brazil',
                timezones: 'America/Sao_Paulo, ...',
                providers: 'Gmail, Outlook',
              },
            ].map(item => (
              <div key={item.region} className="p-4 border border-border dark:border-border">
                <h3 className="font-mono text-xs text-red mb-2">{item.region}</h3>
                <p className="font-mono text-[10px] text-ink-muted dark:text-text-muted mb-1">
                  Timezones: {item.timezones}
                </p>
                <p className="font-mono text-[10px] text-ink-muted dark:text-text-muted">
                  Providers: {item.providers}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="privacy" title="Privacy & Performance">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-3">Zero Network Requests</h3>
              <p className="text-sm text-ink-soft dark:text-text-soft">
                Unlike IP geolocation services that send user data to third-party servers,
                smart-mailto computes location entirely in-browser. No cookies, no beacons, no
                external API calls. The user&apos;s location never leaves their device.
              </p>
            </div>
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-3">Sub-Millisecond Runtime</h3>
              <p className="text-sm text-ink-soft dark:text-text-soft">
                The entire geo detection pipeline — signal collection, region mapping, and provider
                ordering — completes in under 1ms. There is no impact on page load or click response
                times.
              </p>
            </div>
          </div>
        </Section>

        <Section id="api" title="API Reference">
          <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
            Two functions control geo detection:
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-xs text-red mb-3">collectGeoSignals()</h3>
              <CodeBlock label="Returns">
                {`{
  timeZone: string;    // e.g. "Europe/Moscow"
  locale: string;      // e.g. "ru-RU"
  locales: string[];   // prioritized language tags
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}`}
              </CodeBlock>
            </div>
            <div>
              <h3 className="font-mono text-xs text-red mb-3">detectRegionLabel(signals)</h3>
              <p className="text-sm text-ink-soft dark:text-text-soft mb-3">
                Converts geo signals to a human-readable region label:
              </p>
              <CodeBlock label="Example outputs">
                {`Europe/Moscow → Russia/CIS
Asia/Tokyo → Japan
America/New_York → Global
Asia/Kolkata → India`}
              </CodeBlock>
            </div>
          </div>
          <div className="mt-6 p-4 border border-border dark:border-border">
            <p className="text-sm text-ink-soft dark:text-text-soft">
              For the complete API reference, visit the{' '}
              <Link
                href="/spec"
                className="text-red hover:text-red-dark underline underline-offset-2"
              >
                Technical Specs
              </Link>{' '}
              page.
            </p>
          </div>
        </Section>
      </div>
    </article>
  );
}
