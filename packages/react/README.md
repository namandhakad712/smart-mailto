# @smart-mailto/react

React components and hooks for the [smart-mailto](https://github.com/namandhakad712/smart-mailto) webmail provider picker.

```bash
npm i @smart-mailto/react
```

Requires `react >= 17.0.0`. Includes `@smart-mailto/core` as a dependency.

## Usage

### Magic Mode (app-level — intercepts all mailto: links)

```tsx
import { SmartMailtoProvider } from '@smart-mailto/react';

function App() {
  return (
    <SmartMailtoProvider theme="dark" autoDetectGeo>
      <RestOfYourApp />
    </SmartMailtoProvider>
  );
}
```

### Component (per-link)

```tsx
import { SmartMailto } from '@smart-mailto/react';

<SmartMailto href="mailto:hello@example.com" theme="dark">
  Contact Us
</SmartMailto>;
```

### Hook (programmatic)

```tsx
import { useSmartMailto } from '@smart-mailto/react';

function ContactButton() {
  const { open } = useSmartMailto();
  return (
    <button
      onClick={() =>
        open('hello@example.com', {
          subject: 'Hello from the website',
          body: 'I would like to learn more.',
          theme: 'dark',
        })
      }
    >
      Email Us
    </button>
  );
}
```

## API

### `<SmartMailtoProvider>`

| Prop                | Type                          | Default  | Description                 |
| ------------------- | ----------------------------- | -------- | --------------------------- |
| `theme`             | `'dark' \| 'light' \| 'auto'` | `'auto'` | Modal color scheme          |
| `autoDetectGeo`     | `boolean`                     | `true`   | Reorder providers by region |
| `preferredProvider` | `string?`                     | —        | Default-selected provider   |
| `maxProviders`      | `number`                      | `6`      | Max visible providers       |
| `includeNative`     | `boolean`                     | `true`   | Show "Mail App" option      |
| `includeCopy`       | `boolean`                     | `true`   | Show copy-to-clipboard      |
| `children`          | `ReactNode`                   | —        | App tree                    |

Accepts all options from `SmartMailtoConfig`.

### `<SmartMailto>`

Wraps a child element (typically text or a button). Same props as `SmartMailtoConfig` plus `href`.

### `useSmartMailto()`

Returns `{ open: (email: string, options?: SmartMailtoOpenOptions) => void }`.

`SmartMailtoOpenOptions` accepts `subject` and `body` message fields plus any
`SmartMailtoConfig` option as a one-call picker override. Address-only calls such as
`open('hello@example.com')` remain supported.

## License

MIT
