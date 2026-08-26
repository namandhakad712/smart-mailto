# @smart-mailto/vue

Vue 3 plugin and component for the [smart-mailto](https://github.com/namandhakad712/smart-mailto) webmail provider picker.

[Try the mailto link generator](https://smart-mailto.vercel.app/tools/mailto-link-generator) before installing.

```bash
npm i @smart-mailto/vue
```

Requires `vue >= 3.0.0`. Includes `@smart-mailto/core` as a dependency.

[Test a mailto link](https://smart-mailto.vercel.app/tools/test-mailto-link) · [Fix a mailto link that opens nothing](https://smart-mailto.vercel.app/guides/mailto-link-opens-nothing) · [Browser and framework support matrix](https://smart-mailto.vercel.app/docs/browser-support)

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
