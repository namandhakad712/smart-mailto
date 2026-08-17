# @smart-mailto/core

Zero-dependency, framework-agnostic engine that replaces broken `mailto:` links with a geo-aware webmail picker modal. **7.5 KB gzipped. 51 webmail entries: 31 compose links and 20 fallback pages. Zero network requests.** Prefill support varies by provider.

```bash
npm i @smart-mailto/core
```

[Browser and framework support matrix](https://smart-mailto.vercel.app/docs/browser-support)

## Quick Start

```ts
import { initSmartMailto } from '@smart-mailto/core';

initSmartMailto({
  theme: 'auto', // 'dark' | 'light' | 'auto'
  autoDetectGeo: true, // Reorder providers by region
});
```

Every `mailto:` link on the page now opens a provider picker modal instead of triggering the OS default mail app.

[Mailto link opens nothing? Follow the troubleshooting guide.](https://smart-mailto.vercel.app/guides/mailto-link-opens-nothing)

## Manual / Programmatic

```ts
import { parseMailto, resolveProviders, spawnModal } from '@smart-mailto/core';

const params = parseMailto('mailto:hello@example.com?subject=Hi');
const resolved = resolveProviders(params, { autoDetectGeo: true });
await spawnModal(params, resolved, { theme: 'dark' });
```

## Exports

| Export                                  | Purpose                                         |
| --------------------------------------- | ----------------------------------------------- |
| `initSmartMailto(config?)`              | Attach global mailto interceptor                |
| `destroySmartMailto()`                  | Remove interceptor                              |
| `parseMailto(href)`                     | RFC 6068 parser                                 |
| `buildMailtoHref(params)`               | Reconstruct URI                                 |
| `getAllProviders()`                     | 51 webmail entries plus native and copy actions |
| `getGeoOrderedProviderIds(signals)`     | Region-aware sort                               |
| `collectGeoSignals()`                   | Read timeZone, locale, device                   |
| `resolveProviders(params, config?)`     | Resolve + order providers                       |
| `spawnModal(params, resolved, config?)` | Programmatic modal                              |
| `VERSION`                               | Library version string                          |

## Architecture

- **Capture-phase delegation** — one `click` listener on `document` intercepts all mailto: anchors
- **Lazy modal** — `modal.ts` (~15 KB) is dynamically imported on first click; core stays tiny
- **Shadow DOM** — modal mounts in `attachShadow({mode:'open'})` for full CSS isolation
- **Safari-safe** — `window.open()` called synchronously within click handler
- **Zero network** — geo detection uses `Intl.DateTimeFormat` + `navigator.language` only

## Supported Providers

| Region     | Providers                                                           |
| ---------- | ------------------------------------------------------------------- |
| Global     | Gmail, Outlook, Yahoo, ProtonMail, iCloud, Fastmail, Zoho, Tutanota |
| Russia/CIS | Yandex, Mail.ru                                                     |
| China      | QQ Mail, 163 Mail                                                   |
| Japan      | Yahoo! Japan                                                        |
| Korea      | Naver, Daum/Kakao                                                   |
| Germany    | GMX, WEB.DE, T-Online, Posteo, mailbox.org                          |
| France     | La Poste                                                            |
| Italy      | Libero                                                              |
| Poland     | Onet, WP                                                            |
| Czechia    | Seznam                                                              |
| Ukraine    | UKR.NET                                                             |
| India      | Rediffmail, Zoho                                                    |
| Belgium    | Mailfence                                                           |
| Norway     | Runbox                                                              |

## License

MIT
