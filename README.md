# smart-mailto

> **Replace broken `mailto:` links with a smart, geo-aware webmail picker.**  
> Zero dependencies. < 8KB. Works everywhere.

[![npm version](https://badge.fury.io/js/@smart-mailto%2Fcore.svg)](https://www.npmjs.com/package/@smart-mailto/core)
[![CI](https://github.com/yourusername/smart-mailto/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/smart-mailto/actions)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@smart-mailto/core)](https://bundlephobia.com/package/@smart-mailto/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## The Problem

When someone clicks `Contact Us` → `mailto:hello@company.com`:

- **Windows** → "No mail app configured" error dialog
- **macOS/Linux** → Opens an unwanted desktop app
- **Corporate users** → The "default" app is locked by IT
- **40%+ of desktop users** have no mail client configured at all

The result: **lost contacts, lost leads, lost revenue.**

## The Solution

```html
<!-- Before: broken for 40% of users -->
<a href="mailto:hello@example.com">Contact Us</a>

<!-- After: one line of JS -->
<script>
  import { initSmartMailto } from '@smart-mailto/core';
  initSmartMailto({ theme: 'dark', autoDetectGeo: true });
</script>
```

That's it. Every `mailto:` link on your site now opens a beautiful modal:

```
┌─────────────────────────────────────┐
│  Open Email With                    │
│  hello@example.com · Hello World    │
├─────────────────────────────────────┤
│  [Gmail]  [Outlook]  [Yahoo]  [...]  │
│           [Copy Address]            │
└─────────────────────────────────────┘
```

**Auto-detects the user's region** and reorders providers accordingly:
- 🇷🇺 Russia → Yandex + Mail.ru first
- 🇯🇵 Japan → Yahoo Japan first  
- 🇰🇷 Korea → Naver + Daum first
- 🇩🇪 Germany → GMX + WEB.DE first
- 🇨🇳 China → QQ + 163 first
- 🌍 Everyone else → Gmail + Outlook + Yahoo

**Zero API calls.** Uses only `Intl.DateTimeFormat` and `navigator.language`. Executes in < 1ms.

---

## Install

```bash
npm install @smart-mailto/core
# or
pnpm add @smart-mailto/core
# or
yarn add @smart-mailto/core
```

### CDN (no bundler needed)

```html
<script type="module">
  import { initSmartMailto } from 'https://cdn.jsdelivr.net/npm/@smart-mailto/core/dist/index.js';
  initSmartMailto({ theme: 'auto' });
</script>
```

---

## Usage

### Vanilla JS — Global Mode (Recommended)

```js
import { initSmartMailto } from '@smart-mailto/core';

// One line. Intercepts ALL mailto: links on your page.
const destroy = initSmartMailto({
  theme: 'dark',           // 'dark' | 'light' | 'auto'
  autoDetectGeo: true,     // Orders providers by user's region
  includeCopy: true,       // Always show "Copy Address" button
  maxProviders: 6,         // Show at most 6 providers
});

// Optional: clean up
destroy();
```

### React

```tsx
import { SmartMailtoProvider } from '@smart-mailto/react';

function App() {
  return (
    <SmartMailtoProvider theme="dark" autoDetectGeo>
      <YourApp />
    </SmartMailtoProvider>
  );
}

// Then any existing mailto: link just works:
<a href="mailto:hello@example.com">Contact Us</a>
```

### Vue 3

```ts
// main.ts
import { SmartMailtoPlugin } from '@smart-mailto/vue';
app.use(SmartMailtoPlugin, { theme: 'dark', autoDetectGeo: true });
```

### Svelte

```svelte
<script>
  import { SmartMailto } from '@smart-mailto/svelte';
</script>

<SmartMailto href="mailto:hello@example.com">Contact Us</SmartMailto>
```

---

## Supported Providers (80+)

| Region | Providers |
|--------|-----------|
| 🌍 Global | Gmail, Outlook, Yahoo, ProtonMail, iCloud, Fastmail, Zoho, Tutanota |
| 🇷🇺 Russia/CIS | Yandex Mail, Mail.ru |
| 🇨🇳 China | QQ Mail, 163 Mail |
| 🇯🇵 Japan | Yahoo! Japan |
| 🇰🇷 South Korea | Naver Mail, Daum/Kakao |
| 🇩🇪 Germany | GMX, WEB.DE, T-Online, Posteo, mailbox.org |
| 🇫🇷 France | La Poste |
| 🇮🇹 Italy | Libero Mail |
| 🇵🇱 Poland | Onet Poczta, WP Poczta |
| 🇨🇿 Czech Republic | Seznam Email |
| 🇺🇦 Ukraine | UKR.NET |
| 🇮🇳 India | Rediffmail, Zoho |
| 🇧🇪 Belgium | Mailfence |
| 🇳🇴 Norway | Runbox |
| + Native Mail App, Copy to Clipboard |

---

## Configuration

```ts
interface SmartMailtoConfig {
  theme?: 'dark' | 'light' | 'auto';     // Default: 'auto'
  autoDetectGeo?: boolean;               // Default: true
  preferredProvider?: string;            // Force a provider to the top
  maxProviders?: number;                 // Default: 6
  includeNative?: boolean;               // Include "Open in Mail App"
  includeCopy?: boolean;                 // Default: true
  excludeProviders?: string[];           // e.g. ['yahoo', 'mailru']
  rememberChoice?: boolean;              // Persist to localStorage (default: true)
  customProviders?: Provider[];          // Add your own providers
  
  // Headless mode (bring your own CSS)
  classNames?: {
    overlay?: string;
    modal?: string;
    providerButton?: string;
    copyButton?: string;
  };
  
  // Analytics hooks
  onOpen?: (provider, params) => void;   // Fired when user picks a provider
  onCopy?: (email) => void;              // Fired when user copies
  onClose?: () => void;                  // Fired when modal closes
  onShow?: (params, providers) => void;  // Fired when modal opens
  
  // i18n
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

## How Geo-Detection Works (No APIs!)

```ts
// This runs in < 1ms, zero network requests:
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // "Europe/Moscow"
const locale = navigator.language;                                  // "ru-RU"

// Maps to → ['yandex', 'mailru', 'gmail', ...]
```

We map 150+ IANA timezones to provider priority lists. No IP geolocation, no cookies, no GDPR concerns.

---

## Handling Complex Mailto Links

```
mailto:hello@site.com?cc=boss@site.com&subject=Hello%20World&body=Hi%20there
```

smart-mailto parses all RFC 6068 parameters and injects them into every provider's compose URL:
- `to`, `cc`, `bcc` — all recipients
- `subject` — URL-decoded and re-encoded for each provider
- `body` — same (note: ProtonMail blocks body pre-fill due to E2EE)

---

## Privacy

- ❌ Zero external API calls
- ❌ No cookies
- ❌ No tracking by default
- ✅ Only reads `Intl.DateTimeFormat` + `navigator.language` — data browsers already expose
- ✅ `localStorage` only stores the provider ID (e.g. `"gmail"`) after user explicitly clicks

---

## Contributing

We welcome PRs for:
- **New providers** — edit `tools/provider-generator/data/providers.json` (no TypeScript needed!)
- **Broken provider URLs** — use the [Provider Update](.github/ISSUE_TEMPLATE/provider_update.yml) issue template
- **New geo-mappings** — edit `packages/core/src/geo.ts`

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## License

MIT © smart-mailto contributors

---

*"I finally fixed mailto: links."*
