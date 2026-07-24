# @smart-mailto/svelte

Svelte action and global initializer for the [smart-mailto](https://github.com/namandhakad712/smart-mailto) webmail provider picker.

```bash
npm i @smart-mailto/svelte
```

Requires `svelte >= 4.0.0`. Includes `@smart-mailto/core` as a dependency.

[Browser and framework support matrix](https://smart-mailto.vercel.app/docs/browser-support)

## Usage

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
