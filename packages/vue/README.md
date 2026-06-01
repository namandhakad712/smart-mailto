# @smart-mailto/vue

Vue 3 plugin and component for [smart-mailto](https://github.com/namandhakad712/smart-mailto) — a geo-aware webmail picker that replaces broken `mailto:` links.

```bash
npm i @smart-mailto/vue
```

Requires `vue >= 3.0.0`. Peer: `@smart-mailto/core`.

## Usage

### Plugin (app-level — intercepts all mailto: links)

```ts
// main.ts
import { createApp } from 'vue';
import { SmartMailtoPlugin } from '@smart-mailto/vue';

createApp(App).use(SmartMailtoPlugin, { theme: 'dark', autoDetectGeo: true }).mount('#app');
```

### Component (per-link)

```vue
<template>
  <SmartMailto href="mailto:hello@example.com" theme="dark"> Contact Us </SmartMailto>
</template>

<script setup lang="ts">
import { SmartMailtoComponent as SmartMailto } from '@smart-mailto/vue';
</script>
```

## API

### `SmartMailtoPlugin`

| Argument            | Type                          | Default  | Description                 |
| ------------------- | ----------------------------- | -------- | --------------------------- |
| `theme`             | `'dark' \| 'light' \| 'auto'` | `'auto'` | Modal color scheme          |
| `autoDetectGeo`     | `boolean`                     | `true`   | Reorder providers by region |
| `preferredProvider` | `string?`                     | —        | Default-selected provider   |
| `maxProviders`      | `number`                      | `6`      | Max visible providers       |
| `includeNative`     | `boolean`                     | `true`   | Show "Mail App" option      |
| `includeCopy`       | `boolean`                     | `true`   | Show copy-to-clipboard      |

Accepts all options from `SmartMailtoConfig`.

### `SmartMailtoComponent`

Props mirror `SmartMailtoConfig` plus required `href`.

## License

MIT
