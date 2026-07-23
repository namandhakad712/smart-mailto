```
███████╗███╗   ███╗ █████╗ ██████╗ ████████╗   ███╗   ███╗ █████╗ ██╗██╗  ████████╗ ██████╗
██╔════╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝   ████╗ ████║██╔══██╗██║██║  ╚══██╔══╝██╔═══██╗
███████╗██╔████╔██║███████║██████╔╝   ██║█████╗██╔████╔██║███████║██║██║     ██║   ██║   ██║
╚════██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║╚════╝██║╚██╔╝██║██╔══██║██║██║     ██║   ██║   ██║
███████║██║ ╚═╝ ██║██║  ██║██║  ██║   ██║      ██║ ╚═╝ ██║██║  ██║██║███████╗██║   ╚██████╔╝
╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝    ╚═════╝

```

# smart-mailto

> Framework-agnostic, zero-dependency engine that replaces broken `mailto:` links with a geo-aware webmail picker modal. Sub-8KB gzipped. 80+ providers. Zero network requests.

[![npm version](https://badge.fury.io/js/@smart-mailto%2Fcore.svg)](https://www.npmjs.com/package/@smart-mailto/core)
[![CI](https://github.com/namandhakad712/smart-mailto/actions/workflows/ci.yml/badge.svg)](https://github.com/namandhakad712/smart-mailto/actions)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@smart-mailto/core)](https://bundlephobia.com/package/@smart-mailto/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)
[![Try Demo](https://img.shields.io/badge/Try%20Demo-%E2%86%92-6366f1?style=flat&logo=vercel)](https://smart-mailto.vercel.app)

[Documentation](https://smart-mailto.vercel.app/spec) · [Examples](https://smart-mailto.vercel.app/examples) · [npm: @smart-mailto/core](https://www.npmjs.com/package/@smart-mailto/core) · [Live Demo](https://smart-mailto.vercel.app)

<!-- ═══════════════════════════════════════════════════════════════
  HERO — animated isometric SVG with brand tokens
  ═══════════════════════════════════════════════════════════════ -->

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 620" style="width:100%;max-width:1280px;height:auto;display:block;margin:0 auto;border-radius:14px;overflow:hidden">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="#0B1215"/>
      <stop offset="100%" stop-color="#11181B"/>
    </linearGradient>
    <linearGradient id="teal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2DD4BF"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
    <linearGradient id="coral" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F07A62"/>
      <stop offset="100%" stop-color="#E8634A"/>
    </linearGradient>
    <filter id="glowT" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="22" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.08 0 0 0 0 0.72 0 0 0 0 0.65 0 0 0 0.6 0"/>
    </filter>
    <filter id="glowC" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="16" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.91 0 0 0 0 0.41 0 0 0 0 0.30 0 0 0 0.55 0"/>
    </filter>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="14" cy="14" r="1" fill="#14B8A6" opacity="0.10"/>
    </pattern>
  </defs>

  <rect width="1280" height="620" fill="url(#bg)" rx="14"/>
  <rect width="1280" height="620" fill="url(#dots)" rx="14"/>

  <!-- 3D isometric envelope -->
  <g transform="translate(90,70) rotate(-6)">
    <path d="M 0 150 L 220 30 L 440 150 Z" fill="#141A1E" stroke="#283034" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M 0 150 L 220 85 L 440 150" fill="none" stroke="#283034" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="220,85 440,150 220,65" fill="#14B8A6" opacity="0.10"/>
    <path d="M 0 150 L 220 30 L 440 150 Z" fill="none" stroke="#14B8A6" stroke-width="2.6" opacity="0.45" stroke-linejoin="round">
      <animate attributeName="stroke-dasharray" values="0,980;240,740" dur="2.6s" repeatCount="indefinite"/>
    </path>
    <circle cx="220" cy="150" r="24" fill="#141A1E" stroke="#14B8A6" stroke-width="3"/>
    <circle cx="220" cy="150" r="20" fill="url(#teal)" opacity="0.14"/>
    <text x="220" y="157" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="22" fill="#14B8A6">@</text>
    <line x1="20" y1="140" x2="420" y2="140" stroke="#14B8A6" stroke-width="1" opacity="0">
      <animate attributeName="opacity" values="0;0.7;0" dur="3.1s" repeatCount="indefinite"/>
      <animate attributeName="y1" values="90;190;90" dur="3.1s" repeatCount="indefinite"/>
      <animate attributeName="y2" values="90;190;90" dur="3.1s" repeatCount="indefinite"/>
    </line>
  </g>

  <!-- title block -->
  <text x="560" y="158" font-family="Sora, system-ui, sans-serif" font-weight="300" font-size="56" fill="#F0F0EC" letter-spacing="-1.2">
    <tspan>smart</tspan>
  </text>
  <text x="560" y="226" font-family="Sora, system-ui, sans-serif" font-weight="500" font-size="56" fill="#14B8A6" letter-spacing="-1.2">
    <tspan>mailto</tspan>
  </text>

  <text x="560" y="270" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="20" fill="#9CA3AF">
    <tspan>Zero-dependency · Geo-aware · 8 KB gzipped</tspan>
  </text>

  <!-- CTAs -->
  <g transform="translate(560,310)">
    <rect x="0" y="0" width="208" height="52" rx="10" fill="#14B8A6" filter="url(#glowT)" cursor="pointer"/>
    <text x="104" y="33" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="15" fill="#0B1215">npm i @smart-mailto/core</text>

    <rect x="224" y="0" width="148" height="52" rx="10" fill="#141A1E" stroke="#283034" stroke-width="1.5" cursor="pointer"/>
    <text x="298" y="33" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="15" fill="#F0F0EC">Get Started →</text>

  </g>

  <!-- badges -->
  <g transform="translate(560,390)">
    <rect x="0" y="0" width="118" height="26" rx="13" fill="#0D5555" stroke="#14B8A6" stroke-width="1"/>
    <text x="59" y="17" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#2DD4BF">MIT LICENSE</text>

    <rect x="126" y="0" width="148" height="26" rx="13" fill="#1A2225" stroke="#283034" stroke-width="1"/>
    <text x="200" y="17" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#9CA3AF">v0.2.0</text>

    <rect x="282" y="0" width="118" height="26" rx="13" fill="#1A2225" stroke="#283034" stroke-width="1"/>
    <text x="341" y="17" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#9CA3AF">2026 · Live</text>

  </g>

  <!-- stats panel -->
  <g transform="translate(860,55)">
    <rect x="0" y="0" width="380" height="510" rx="14" fill="#141A1E" stroke="#283034" stroke-width="1.5"/>

    <text x="22" y="42" font-family="Sora, system-ui, sans-serif" font-weight="500" font-size="18" fill="#F0F0EC">By the Numbers</text>
    <line x1="22" y1="54" x2="358" y2="54" stroke="#283034" stroke-width="1.5"/>

    <g transform="translate(22,90)">
      <!-- bundle size -->
      <text x="0" y="0" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="13" fill="#9CA3AF">Gzipped bundle</text>
      <rect x="0" y="12" width="150" height="9" rx="4.5" fill="#1A2225" stroke="#283034" stroke-width="1"/>
      <rect x="0" y="12" width="118" height="9" rx="4.5" fill="url(#teal)" opacity="0.9"/>
      <text x="162" y="21" font-family="JetBrains Mono, monospace" font-size="11" fill="#2DD4BF">7.4 KB</text>

      <!-- geo latency -->
      <text x="0" y="62" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="13" fill="#9CA3AF">Geo detection</text>
      <rect x="0" y="74" width="170" height="9" rx="4.5" fill="#1A2225" stroke="#283034" stroke-width="1"/>
      <rect x="0" y="74" width="170" height="9" rx="4.5" fill="url(#coral)" opacity="0.9"/>
      <text x="182" y="83" font-family="JetBrains Mono, monospace" font-size="11" fill="#F07A62">&lt; 1 ms</text>

      <!-- providers -->
      <text x="0" y="124" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="13" fill="#9CA3AF">Providers</text>
      <rect x="0" y="136" width="200" height="9" rx="4.5" fill="#1A2225" stroke="#283034" stroke-width="1"/>
      <rect x="0" y="136" width="200" height="9" rx="4.5" fill="url(#teal)" opacity="0.9"/>
      <text x="212" y="145" font-family="JetBrains Mono, monospace" font-size="11" fill="#2DD4BF">80+</text>

      <!-- deps -->
      <text x="0" y="186" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="13" fill="#9CA3AF">Runtime dependencies</text>
      <rect x="0" y="198" width="170" height="9" rx="4.5" fill="#1A2225" stroke="#283034" stroke-width="1"/>
      <rect x="0" y="198" width="170" height="9" rx="4.5" fill="url(#coral)" opacity="0.9"/>
      <text x="182" y="207" font-family="JetBrains Mono, monospace" font-size="11" fill="#F07A62">0</text>

      <!-- coverage -->
      <text x="0" y="248" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="13" fill="#9CA3AF">Test coverage</text>
      <rect x="0" y="260" width="185" height="9" rx="4.5" fill="#1A2225" stroke="#283034" stroke-width="1"/>
      <rect x="0" y="260" width="185" height="9" rx="4.5" fill="url(#teal)" opacity="0.9"/>
      <text x="197" y="269" font-family="JetBrains Mono, monospace" font-size="11" fill="#2DD4BF">90%+</text>
    </g>

    <!-- isometric matrix cards -->
    <g transform="translate(22,390)">
      <g transform="translate(0,0)">
        <polygon points="0,0 120,0 150,0 150,28 120,28 0,28" fill="#0D5555" stroke="#14B8A6" stroke-width="1" opacity="0.65"/>
        <polygon points="120,0 150,0 150,28 120,28" fill="#14B8A6" opacity="0.28"/>
        <polygon points="0,28 150,28 150,32 0,40" fill="#14B8A6" opacity="0.10"/>
        <text x="10" y="18" font-family="JetBrains Mono, monospace" font-size="10" fill="#2DD4BF">Desktop 98%</text>
      </g>
      <g transform="translate(80,-6)">
        <polygon points="0,0 120,0 150,0 150,28 120,28 0,28" fill="#141A1E" stroke="#283034" stroke-width="1" opacity="0.85"/>
        <polygon points="120,0 150,0 150,28 120,28" fill="#283034" opacity="0.30"/>
        <polygon points="0,28 150,28 150,32 0,40" fill="#283034" opacity="0.10"/>
        <text x="10" y="18" font-family="JetBrains Mono, monospace" font-size="10" fill="#9CA3AF">Mobile Safari</text>
      </g>
      <g transform="translate(160,-12)">
        <polygon points="0,0 120,0 150,0 150,28 120,28 0,28" fill="#141A1E" stroke="#283034" stroke-width="1" opacity="0.85"/>
        <polygon points="120,0 150,0 150,28 120,28" fill="#283034" opacity="0.25"/>
        <polygon points="0,28 150,28 150,32 0,40" fill="#283034" opacity="0.08"/>
        <text x="10" y="18" font-family="JetBrains Mono, monospace" font-size="10" fill="#9CA3AF">Enterprise IT</text>
      </g>
    </g>

  </g>
</svg>

<br/>

## The Problem

```text
┌──────────────────────────────────────────────────────────────┐
│  ⚠  PROBLEM STATEMENT                                       │
│                                                              │
│   User clicks Contact Us ──► mailto:hello@company.com       │
│                                                              │
│   Windows  ──►  No mail app configured error dialog          │
│   macOS    ──►  Unwanted desktop app invocation              │
│   Linux    ──►  Undefined behavior / no handler              │
│   Corp     ──►  Default client locked by IT policy          │
│   Mobile   ──►  No native handler → blank screen            │
│                                                              │
│   40%+ of desktop users have no configured mail client.      │
│                                                              │
│   Outcome: lost contacts. Lost leads. Lost revenue.          │
└──────────────────────────────────────────────────────────────┘
```

## The Solution

```ts
// Before — broken for 40% of the internet
<a href="mailto:hello@example.com">Contact Us</a>

// After — one line of JavaScript
import { initSmartMailto } from '@smart-mailto/core';
initSmartMailto({ theme: 'auto', autoDetectGeo: true });
```

Every `mailto:` link now opens a geo-aware, provider-rich modal:

```text
┌─────────────────────────────────────────────┐
│  ✉  Open Email With                         │
│      hello@example.com · Hello World         │
│                                             │
│  [ Gmail ]  [ Outlook ]  [ Yahoo ]          │
│  [ Yandex ] [ Proton  ]  [ iCloud ]         │
│  [ Copy Address ]                           │
└─────────────────────────────────────────────┘
```

80+ providers, reordered by region automatically:

| Location       | Priority Providers                         |
| -------------- | ------------------------------------------ |
| Russia / CIS   | Yandex, Mail.ru                            |
| Japan          | Yahoo! Japan                               |
| Korea          | Naver, Daum / Kakao                        |
| Germany        | GMX, WEB.DE, T-Online, Posteo, mailbox.org |
| China          | QQ Mail, 163 Mail                          |
| Global default | Gmail, Outlook, Yahoo, ProtonMail, iCloud  |

Zero API calls. Uses `Intl.DateTimeFormat().resolvedOptions().timeZone` and `navigator.language`. Sub-1 ms.

---

## Installation

```bash
npm install @smart-mailto/core
# or
pnpm add @smart-mailto/core
# or
yarn add @smart-mailto/core
```

### CDN (no bundler required)

```html
<script type="module">
  import { initSmartMailto } from 'https://cdn.jsdelivr.net/npm/@smart-mailto/core/dist/index.js';
  initSmartMailto({ theme: 'auto' });
</script>
```

---

## Usage

### Vanilla JavaScript — Global Mode (recommended)

```ts
import { initSmartMailto } from '@smart-mailto/core';

const destroy = initSmartMailto({
  theme: 'auto', // 'dark' | 'light' | 'auto'
  autoDetectGeo: true, // Reorder providers by region
  maxProviders: 6, // Cap visible providers
  includeNative: true, // Include "Open in Mail App"
  includeCopy: true, // Include copy-to-clipboard fallback
  rememberChoice: true, // Persist preference to localStorage
  preferredProvider: undefined,
  excludeProviders: [],
  customProviders: [],
  onOpen: undefined,
  onCopy: undefined,
  onClose: undefined,
  onShow: undefined,
  i18n: {
    title: undefined,
    copy: undefined,
    copied: undefined,
    native: undefined,
    close: undefined,
  },
  classNames: {},
});

// cleanup when your app unmounts
destroy();
```

### React

```tsx
import { SmartMailtoProvider, SmartMailto } from '@smart-mailto/react';

export default function App() {
  return (
    <SmartMailtoProvider theme="auto" autoDetectGeo={true}>
      <SmartMailto href="mailto:hello@example.com">Contact Us</SmartMailto>
    </SmartMailtoProvider>
  );
}
```

### Vue 3

```ts
import { createApp } from 'vue';
import { SmartMailtoPlugin } from '@smart-mailto/vue';

createApp(App).use(SmartMailtoPlugin, { theme: 'auto', autoDetectGeo: true }).mount('#app');
```

### Svelte

```svelte
<script>
  import { smartMailto } from '@smart-mailto/svelte';
</script>

<a href="mailto:hello@example.com" use:smartMailto={{ theme: 'dark' }}>Email</a>
```

---

## Configuration

```ts
interface SmartMailtoConfig {
  theme?: 'dark' | 'light' | 'auto';
  autoDetectGeo?: boolean;
  preferredProvider?: string;
  maxProviders?: number;
  includeNative?: boolean;
  includeCopy?: boolean;
  excludeProviders?: string[];
  rememberChoice?: boolean;
  customProviders?: Provider[];
  classNames?: {
    overlay?: string;
    modal?: string;
    providerButton?: string;
    copyButton?: string;
  };
  onOpen?: (provider: string, params: MailtoParams) => void;
  onCopy?: (email: string) => void;
  onClose?: () => void;
  onShow?: (params: MailtoParams, providers: Provider[]) => void;
  i18n?: Partial<{
    title: string;
    copy: string;
    copied: string;
    native: string;
    close: string;
  }>;
}
```

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                       Consumer Application                        │
├──────────────┬──────────────┬──────────────────┬───────────────────┤
│    React     │    Vue 3     │    Svelte        │   Vanilla JS      │
│  <SmartMailtoProvider>   │   Plugin +       │  use:smartMailto  │
│  <SmartMailto>          │   Renderless     │  initGlobal()     │
│  useSmartMailto()       │   <a> wrapper    │                   │
├──────────────┴──────────────┴──────────────────┴───────────────────┤
│                         packages/core                              │
│  ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌────────────────────────┐ │
│  │  parser  │ │detector │ │ resolver │ │         modal           │ │
│  │RFC 6068  │ │domain → │ │ 11-step  │ │  Shadow DOM + focus     │ │
│  │ multi-recp│ │provider │ │ priority │ │  trap + keyboard + CSS  │ │
│  └──────────┘ └─────────┘ └──────────┘ └────────────────────────┘ │
│       ↑                   ↑         ↑                               │
│   geo.ts            provider.ts           storage                    │
│   150+ TZ           80+ providers         localStorage              │
│   locale map        buildUrl()            provider id only          │
└────────────────────────────────────────────────────────────────────┘
```

### Core Design Principles

**Capture-phase event delegation.** One `click` listener on `document` intercepts all `mailto:` anchors. No per-link binding.

```ts
// packages/core/src/init.ts
document.addEventListener('click', handleClick, { capture: true });
```

**Lazy-loaded modal.** `modal.ts` (~15 KB of CSS + icons + focus-trap) is dynamically imported only on first click, keeping the core bundle under 8 KB.

```ts
const { spawnModal } = await import('./modal.js');
```

**Shadow DOM isolation.** The modal mounts into a `div.attachShadow({ mode: 'open' })`. Styles cannot leak into or out of the host page.

**Safari-safe popup timing.** `window.open()` is called synchronously from within a user click handler on each provider button, not deferred from the original link click.

**Headless support.** Supplying any `classNames` disables built-in style injection, letting consumers own the full CSS.

**Provider strategy.** Every provider is a first-class object in `packages/core/src/providers.ts`:

```ts
const protonmail: Provider = {
  id: 'protonmail',
  name: 'Proton Mail',
  buildUrl: (params) => { ... },
  color: '#6D4AFF',
  textColor: '#FFFFFF',
  regions: ['global'],
};
```

---

## Performance

| Metric               | Limit   | Measured |
| -------------------- | ------- | -------- |
| Gzipped bundle       | < 8 KB  | 7.4 KB   |
| Geo resolution       | < 1 ms  | ~0.4 ms  |
| Link-to-modal        | < 50 ms | < 20 ms  |
| Runtime dependencies | 0       | 0        |

The CI rejects any build where gzipped `dist/index.js` exceeds 8,192 bytes.

---

## Geo Detection

```ts
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Europe/Moscow
const locale = navigator.language; // ru-RU
const ordered = getGeoOrderedProviderIds({ timeZone, locale, isMobile, isIOS, isAndroid });
// => ['yandex', 'mailru', 'gmail', 'outlook', 'native', 'copy']
```

150+ IANA timezones mapped to provider priority lists. 30+ locale patterns. No IP geolocation, no cookies, no external requests.

---

## Complex Mailto Handling

```
mailto:hello@site.com?cc=boss@site.com&subject=Hello%20World&body=Hi%20there
```

- `to`, `cc`, `bcc` — multi-recipient, comma-separated, Unicode, plus-addressing
- `subject`, `body` — URL-decoded and re-encoded per provider
- `parseMailto` and `buildMailtoHref` round-trip correctly
- Notes: ProtonMail blocks body pre-fill due to end-to-end encryption

---

## Privacy

- **Zero** external API calls — no `fetch()`, no `navigator.sendBeacon`
- **No** cookies
- **No** IP-based geo-location
- `localStorage` stores **at most one** provider id string, written only after user action
- Reads only `Intl.DateTimeFormat` and `navigator.language` — signals the browser already exposes

---

## Testing

### Unit Tests (Vitest + jsdom, 90%+ coverage)

```text
packages/core/__tests__/
├── parser.test.ts    RFC 6068, encoding, multi-recipients, round-trip
├── provider.test.ts  URL builders, encoding, getProvider/getAllProviders
├── detector.test.ts  domain → provider map, enterprise heuristics
└── geo.test.ts       timezone/locale ordering, no-duplicates invariant
```

Enforced invariants:

- Geo output is always non-empty
- Geo output contains no duplicates
- `parseMailto` ⇄ `buildMailtoHref` round-trip is lossless
- Every `buildUrl` produces an HTTP-parseable absolute URL

### E2E (Playwright + Chromatic)

```ts
// e2e/modal.spec.ts — verifies modal opens on mailto click in a real browser
test('opens the mailto modal on click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'mailto' }).click();
  await expect(page.locator('.sm-modal')).toBeVisible();
});
```

### Automated Provider Health Checks

Weekly GitHub Actions workflow HEAD-checks all 80+ provider compose URLs. A failure auto-opens a GitHub issue against the maintainer.

---

## API Reference

```ts
import {
  initSmartMailto,
  destroySmartMailto,
  isInitialized,
  updateConfig,
  spawnModal,
  parseMailto,
  buildMailtoHref,
  isValidMailtoParams,
  PROVIDERS,
  getProvider,
  getAllProviders,
  detectProviderFromEmail,
  getDomainsForProvider,
  collectGeoSignals,
  getGeoOrderedProviderIds,
  detectRegionLabel,
  savePreference,
  loadPreference,
  clearPreference,
  isStorageAvailable,
} from '@smart-mailto/core';
```

| Export                                                          | Purpose                                 |
| --------------------------------------------------------------- | --------------------------------------- |
| `initSmartMailto(config?)`                                      | Attach global mailto interceptor        |
| `destroySmartMailto()`                                          | Remove interceptor                      |
| `isInitialized()`                                               | Current state                           |
| `updateConfig(partial)`                                         | Hot-reload configuration                |
| `parseMailto(href)`                                             | RFC 6068 parser                         |
| `buildMailtoHref(params)`                                       | Reconstruct URI                         |
| `isValidMailtoParams(params)`                                   | Validate at least one recipient         |
| `getProvider(id)` / `getAllProviders()`                         | Provider registry                       |
| `detectProviderFromEmail(email)`                                | Domain → provider id                    |
| `collectGeoSignals()`                                           | Read `timeZone`, `locale`, device flags |
| `getGeoOrderedProviderIds(signals)`                             | Region-aware provider sort              |
| `detectRegionLabel(signals)`                                    | Human-readable region string            |
| `savePreference(id)` / `loadPreference()` / `clearPreference()` | Persist choice                          |
| `isStorageAvailable()`                                          | localStorage readiness                  |

---

## Supported Providers

| Region       | Providers                                                           |
| ------------ | ------------------------------------------------------------------- |
| Global       | Gmail, Outlook, Yahoo, ProtonMail, iCloud, Fastmail, Zoho, Tutanota |
| Russia / CIS | Yandex Mail, Mail.ru                                                |
| China        | QQ Mail, 163 Mail                                                   |
| Japan        | Yahoo! Japan                                                        |
| Korea        | Naver Mail, Daum / Kakao                                            |
| Germany      | GMX, WEB.DE, T-Online, Posteo, mailbox.org                          |
| France       | La Poste                                                            |
| Italy        | Libero Mail                                                         |
| Poland       | Onet Poczta, WP Poczta                                              |
| Czechia      | Seznam Email                                                        |
| Ukraine      | UKR.NET                                                             |
| India        | Rediffmail, Zoho                                                    |
| Belgium      | Mailfence                                                           |
| Norway       | Runbox                                                              |
| All regions  | Native Mail App, Copy to Clipboard                                  |

> To add a provider, see [Contributing](#contributing).

---

## Contributing

Issues and pull requests are welcome.

- **New provider** — add an entry in `packages/core/src/providers.ts`
- **Geo mapping** — extend `packages/core/src/geo.ts`
- **Broken URL** — file a bug; CI will surface it automatically on the next scheduled run
- **Tests / docs / translations** — always appreciated

### Development Setup

```bash
git clone https://github.com/namandhakad712/smart-mailto.git
cd smart-mailto
pnpm install

pnpm test             # CI-aware test run
pnpm typecheck        # TypeScript strict check
pnpm format           # Prettier write
pnpm build            # Turbo-driven build across workspace
pnpm validate:providers  # Live-check all provider compose URLs
```

---

## License

MIT © smart-mailto contributors
