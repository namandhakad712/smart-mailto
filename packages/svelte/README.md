# @smart-mailto/svelte

Svelte action, component, and global init for [smart-mailto](https://github.com/namandhakad712/smart-mailto) — a geo-aware webmail picker that replaces broken `mailto:` links.

```bash
npm i @smart-mailto/svelte
```

Requires `svelte >= 4.0.0`. Peer: `@smart-mailto/core`.

## Usage

### Svelte Action (on any anchor)

```svelte
<script>
  import { smartMailto } from '@smart-mailto/svelte';
</script>

<a href="mailto:hello@example.com" use:smartMailto={{ theme: 'dark' }}>
  Contact Us
</a>
```

### Component

```svelte
<script>
  import { SmartMailto } from '@smart-mailto/svelte';
</script>

<SmartMailto href="mailto:hello@example.com" theme="dark">
  Contact Us
</SmartMailto>
```

### Global Init (app-level — intercepts all mailto: links)

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
