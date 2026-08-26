# @smart-mailto/svelte

Svelte component, action, and global initializer for the [smart-mailto](https://github.com/namandhakad712/smart-mailto) webmail provider picker.

[Try the mailto link generator](https://smart-mailto.vercel.app/tools/mailto-link-generator) before installing.

```bash
npm i @smart-mailto/svelte
```

Requires `svelte >= 5.0.0`. Includes `@smart-mailto/core` as a dependency.

[Test a mailto link](https://smart-mailto.vercel.app/tools/test-mailto-link) · [Fix a mailto link that opens nothing](https://smart-mailto.vercel.app/guides/mailto-link-opens-nothing) · [Browser and framework support matrix](https://smart-mailto.vercel.app/docs/browser-support)

## Usage

### `SmartMailto` component

```svelte
<script>
  import { SmartMailto } from '@smart-mailto/svelte';
</script>

<SmartMailto
  href="mailto:hello@example.com?subject=Hello"
  theme="dark"
  maxProviders={4}
>
  Contact Us
</SmartMailto>
```

The component accepts a required `href`, every `SmartMailtoConfig` option, and standard anchor attributes such as `class`, `id`, and `target`.

### Svelte action (on any anchor)

```svelte
<script>
  import { smartMailto } from '@smart-mailto/svelte';
</script>

<a href="mailto:hello@example.com" use:smartMailto={{ theme: 'dark' }}>
  Contact Us
</a>
```

### Global init (app-level — intercepts all mailto: links)

```svelte
<!-- +layout.svelte (SvelteKit) -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { initGlobal } from '@smart-mailto/svelte';

  let destroy;
  onMount(() => { destroy = initGlobal({ theme: 'dark' }); });
  onDestroy(() => destroy?.());
</script>

<slot />
```

## API

### `SmartMailto`

| Prop                | Type                       | Default                    |
| ------------------- | -------------------------- | -------------------------- |
| `href`              | `string`                   | required                   |
| `theme`             | `light \| dark \| auto`    | `auto`                     |
| `autoDetectGeo`     | `boolean`                  | `true`                     |
| `preferredProvider` | `string`                   | —                          |
| `maxProviders`      | `number`                   | `6`                        |
| `includeNative`     | `boolean`                  | mobile browsers only       |
| `includeCopy`       | `boolean`                  | `true`                     |
| `customProviders`   | `Provider[]`               | `[]`                       |
| `excludeProviders`  | `string[]`                 | `[]`                       |
| `classNames`        | `ClassNames`               | built-in styles            |
| `i18n`              | `Partial<I18nStrings>`     | built-in English copy      |
| `rememberChoice`    | `boolean`                  | `true`                     |
| `storageKey`        | `string`                   | `smart-mailto:preferred`   |
| `onOpen`            | `SmartMailtoHooks.onOpen`  | —                          |
| `onCopy`            | `SmartMailtoHooks.onCopy`  | —                          |
| `onClose`           | `SmartMailtoHooks.onClose` | —                          |
| `onShow`            | `SmartMailtoHooks.onShow`  | —                          |
| anchor attributes   | `HTMLAnchorAttributes`     | passed to the rendered `a` |

### `smartMailto` (action)

| Param    | Type                | Default | Description        |
| -------- | ------------------- | ------- | ------------------ |
| `node`   | `HTMLAnchorElement` | —       | The anchor element |
| `config` | `SmartMailtoConfig` | `{}`    | Options            |

### `initGlobal`

| Param    | Type                | Default | Description      |
| -------- | ------------------- | ------- | ---------------- |
| `config` | `SmartMailtoConfig` | `{}`    | Options          |
| returns  | `() => void`        | —       | Cleanup function |

### `destroyGlobal`

Cleans up the global interceptor. Alias for `destroySmartMailto`.

## License

MIT
