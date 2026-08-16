import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Which Browsers and Frameworks Support smart-mailto?',
  description:
    'See smart-mailto’s tested Chromium coverage, React 17+, Vue 3+, Svelte 5+, required browser APIs, and unverified browser boundaries.',
};

const repositoryUrl = 'https://github.com/namandhakad712/smart-mailto/blob/main';

const browserRows = [
  {
    environment: 'Playwright Chromium',
    status: 'Automated',
    coverage:
      'Core picker behavior plus React, Vue, and Svelte mount, open, cleanup, and remount paths.',
    evidence: [
      {
        label: 'CI workflow',
        href: `${repositoryUrl}/.github/workflows/ci.yml`,
      },
      {
        label: 'browser tests',
        href: `${repositoryUrl}/apps/framework-smoke/tests/frameworks.spec.ts`,
      },
    ],
  },
  {
    environment: 'Firefox',
    status: 'Not automated',
    coverage: 'No Firefox release or version is claimed yet.',
    evidence: [
      {
        label: 'Playwright projects',
        href: `${repositoryUrl}/playwright.config.ts`,
      },
    ],
  },
  {
    environment: 'Safari / WebKit',
    status: 'Not automated',
    coverage: 'Desktop Safari and iOS Safari are not currently exercised in CI.',
    evidence: [
      {
        label: 'Playwright projects',
        href: `${repositoryUrl}/playwright.config.ts`,
      },
    ],
  },
  {
    environment: 'Android browsers',
    status: 'Not automated',
    coverage: 'No Android browser or device matrix is currently exercised in CI.',
    evidence: [
      {
        label: 'Playwright projects',
        href: `${repositoryUrl}/playwright.config.ts`,
      },
    ],
  },
] as const;

const packageRows = [
  {
    package: '@smart-mailto/core',
    declared: 'No framework peer',
    automated: 'ES2020 build; picker exercised in Chromium',
    links: [
      {
        label: 'build target',
        href: `${repositoryUrl}/packages/core/tsup.config.ts`,
      },
      {
        label: 'modal test',
        href: `${repositoryUrl}/e2e/modal.spec.ts`,
      },
    ],
  },
  {
    package: '@smart-mailto/react',
    declared: 'React 17+',
    automated: 'React 18.3.1 host in Chromium',
    links: [
      {
        label: 'peer range',
        href: `${repositoryUrl}/packages/react/package.json`,
      },
      {
        label: 'host version',
        href: `${repositoryUrl}/pnpm-lock.yaml`,
      },
      {
        label: 'build target',
        href: `${repositoryUrl}/packages/react/tsup.config.ts`,
      },
    ],
  },
  {
    package: '@smart-mailto/vue',
    declared: 'Vue 3+',
    automated: 'Vue 3.5.40 host in Chromium',
    links: [
      {
        label: 'peer range',
        href: `${repositoryUrl}/packages/vue/package.json`,
      },
      {
        label: 'host version',
        href: `${repositoryUrl}/pnpm-lock.yaml`,
      },
      {
        label: 'build target',
        href: `${repositoryUrl}/packages/vue/tsup.config.ts`,
      },
    ],
  },
  {
    package: '@smart-mailto/svelte',
    declared: 'Svelte 5+',
    automated: 'Svelte 5.56.8 host in Chromium',
    links: [
      {
        label: 'peer range',
        href: `${repositoryUrl}/packages/svelte/package.json`,
      },
      {
        label: 'host version',
        href: `${repositoryUrl}/pnpm-lock.yaml`,
      },
      {
        label: 'build target',
        href: `${repositoryUrl}/packages/svelte/tsup.config.ts`,
      },
    ],
  },
] as const;

const apiRows = [
  {
    api: 'DOM events, Element.closest, Shadow DOM, and requestAnimationFrame',
    role: 'Required',
    behavior: 'Intercepts mailto links and renders the isolated provider picker.',
    links: [
      {
        label: 'interceptor',
        href: `${repositoryUrl}/packages/core/src/init.ts`,
      },
      {
        label: 'modal',
        href: `${repositoryUrl}/packages/core/src/modal.ts`,
      },
    ],
  },
  {
    api: 'URL and URLSearchParams',
    role: 'Required',
    behavior: 'Parses mailto fields and builds provider compose URLs.',
    links: [
      {
        label: 'parser',
        href: `${repositoryUrl}/packages/core/src/parser.ts`,
      },
      {
        label: 'providers',
        href: `${repositoryUrl}/packages/core/src/providers.ts`,
      },
    ],
  },
  {
    api: 'Intl.DateTimeFormat and navigator locale signals',
    role: 'Optional',
    behavior:
      'Improves provider ordering; missing signals fall back to the default provider order.',
    links: [
      {
        label: 'geo signals',
        href: `${repositoryUrl}/packages/core/src/geo.ts`,
      },
    ],
  },
  {
    api: 'window.open',
    role: 'Required',
    behavior: 'Opens the selected webmail compose page after a visitor chooses a provider.',
    links: [
      {
        label: 'provider open',
        href: `${repositoryUrl}/packages/core/src/modal.ts`,
      },
    ],
  },
  {
    api: 'Clipboard API',
    role: 'Optional',
    behavior: 'Used first for Copy address; a textarea copy fallback is included.',
    links: [
      {
        label: 'copy fallback',
        href: `${repositoryUrl}/packages/core/src/modal.ts`,
      },
    ],
  },
  {
    api: 'localStorage',
    role: 'Optional',
    behavior: 'Remembers a provider choice. Blocked storage disables only that preference.',
    links: [
      {
        label: 'storage fallback',
        href: `${repositoryUrl}/packages/core/src/storage.ts`,
      },
    ],
  },
] as const;

function EvidenceLinks({ links }: { links: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {links.map(link => (
        <a
          key={link.href + link.label}
          className="text-red underline decoration-red/35 underline-offset-4 hover:text-red-dark"
          href={link.href}
        >
          {link.label}
        </a>
      ))}
    </span>
  );
}

export default function BrowserSupportPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <header className="mb-12 border-b border-border pb-12 dark:border-border">
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
          Compatibility record
        </p>
        <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.05] tracking-tight text-ink dark:text-text md:text-7xl">
          Which browsers and frameworks support smart-mailto?
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-soft dark:text-text-soft">
          smart-mailto targets ES2020 and is automatically exercised in Chromium. Firefox, Safari,
          WebKit, iOS, and Android browsers are unverified, not claimed as supported.
        </p>
      </header>

      <div className="space-y-16">
        <section aria-labelledby="browser-coverage">
          <div className="mb-6 max-w-3xl">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
              Current test boundary
            </p>
            <h2
              id="browser-coverage"
              className="font-headline text-3xl font-normal text-ink dark:text-text"
            >
              Browser coverage
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              The ES2020 build target describes emitted JavaScript syntax. It does not replace
              testing the browser APIs used by the picker.
            </p>
          </div>

          <div className="overflow-x-auto border-y border-border dark:border-border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">Automated browser coverage for smart-mailto</caption>
              <thead>
                <tr className="border-b border-border font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted dark:border-border dark:text-text-muted">
                  <th className="px-4 py-3 font-medium">Environment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">What is covered</th>
                  <th className="px-4 py-3 font-medium">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {browserRows.map(row => (
                  <tr
                    key={row.environment}
                    className="border-b border-border last:border-b-0 dark:border-border"
                  >
                    <th className="px-4 py-4 font-mono text-xs font-medium text-ink dark:text-text">
                      {row.environment}
                    </th>
                    <td className="px-4 py-4">
                      <span
                        className={
                          row.status === 'Automated'
                            ? 'font-mono text-xs font-semibold text-red'
                            : 'font-mono text-xs text-ink-muted dark:text-text-muted'
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="max-w-md px-4 py-4 leading-6 text-ink-soft dark:text-text-soft">
                      {row.coverage}
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px]">
                      <EvidenceLinks links={row.evidence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="package-support">
          <div className="mb-6 max-w-3xl">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
              Published packages
            </p>
            <h2
              id="package-support"
              className="font-headline text-3xl font-normal text-ink dark:text-text"
            >
              Framework version ranges
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              Peer ranges are the public compatibility contract. The automated host column names the
              exact dependency version currently installed in the browser smoke app.
            </p>
          </div>

          <div className="overflow-x-auto border-y border-border dark:border-border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">
                Declared and automatically tested framework versions
              </caption>
              <thead>
                <tr className="border-b border-border font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted dark:border-border dark:text-text-muted">
                  <th className="px-4 py-3 font-medium">Package</th>
                  <th className="px-4 py-3 font-medium">Declared range</th>
                  <th className="px-4 py-3 font-medium">Automated host</th>
                  <th className="px-4 py-3 font-medium">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {packageRows.map(row => (
                  <tr
                    key={row.package}
                    className="border-b border-border last:border-b-0 dark:border-border"
                  >
                    <th className="px-4 py-4 font-mono text-xs font-medium text-ink dark:text-text">
                      {row.package}
                    </th>
                    <td className="px-4 py-4 font-mono text-xs text-ink-soft dark:text-text-soft">
                      {row.declared}
                    </td>
                    <td className="px-4 py-4 text-ink-soft dark:text-text-soft">{row.automated}</td>
                    <td className="px-4 py-4 font-mono text-[11px]">
                      <EvidenceLinks links={row.links} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="browser-apis">
          <div className="mb-6 max-w-3xl">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red">
              Runtime requirements
            </p>
            <h2
              id="browser-apis"
              className="font-headline text-3xl font-normal text-ink dark:text-text"
            >
              Browser APIs
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft dark:text-text-soft">
              Required APIs power the picker itself. Optional APIs have a fallback or disable one
              non-essential behavior when unavailable.
            </p>
          </div>

          <div className="grid gap-px border border-border bg-border dark:border-border dark:bg-border md:grid-cols-2">
            {apiRows.map(row => (
              <article key={row.api} className="bg-paper p-6 dark:bg-bg">
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <h3 className="font-mono text-sm font-medium text-ink dark:text-text">
                    {row.api}
                  </h3>
                  <span
                    className={
                      row.role === 'Required'
                        ? 'font-mono text-[10px] font-semibold uppercase tracking-widest text-red'
                        : 'font-mono text-[10px] uppercase tracking-widest text-ink-muted dark:text-text-muted'
                    }
                  >
                    {row.role}
                  </span>
                </div>
                <p className="text-sm leading-6 text-ink-soft dark:text-text-soft">
                  {row.behavior}
                </p>
                <span className="mt-4 block font-mono text-[11px]">
                  <EvidenceLinks links={row.links} />
                </span>
              </article>
            ))}
          </div>
        </section>

        <aside className="border-l-2 border-red pl-6">
          <h2 className="font-headline text-2xl font-normal text-ink dark:text-text">
            What ΓÇ£not automatedΓÇ¥ means
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft dark:text-text-soft">
            It does not mean the browser is known to fail. It means the project does not yet have a
            repeatable check that justifies a public support promise. If your target is outside the
            Chromium and framework versions above, test it in your own supported environment before
            release.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
            <Link
              className="text-red underline decoration-red/35 underline-offset-4 hover:text-red-dark"
              href="/spec"
            >
              Read the API spec
            </Link>
            <a
              className="text-red underline decoration-red/35 underline-offset-4 hover:text-red-dark"
              href="https://github.com/namandhakad712/smart-mailto/issues"
            >
              Report a compatibility issue
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
