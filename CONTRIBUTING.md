# Contributing to smart-mailto

## Ways to contribute

1. **Add a new email provider** — Edit `packages/core/src/providers.ts`
2. **Fix a broken provider URL** — Use the [Provider Update](.github/ISSUE_TEMPLATE/provider_update.yml) issue template
3. **Add a new geo-mapping** — Edit `packages/core/src/geo.ts`
4. **Write docs** — The docs site is in `apps/docs/`
5. **Add a framework wrapper** — New `packages/[framework]/`

## Development

```bash
git clone https://github.com/namandhakad712/smart-mailto.git
cd smart-mailto
pnpm install
pnpm dev
```

## The easiest first contribution

Adding a provider is intentionally simple. Edit `packages/core/src/providers.ts` and add an entry following the existing pattern:

```ts
myprovider: {
  id: 'myprovider',
  name: 'My Provider',
  buildUrl: (p: MailtoParams) => {
    const params = new URLSearchParams({ to: p.to?.[0] ?? '', subject: p.subject ?? '', body: p.body ?? '' });
    return `https://mail.myprovider.com/compose?${params}`;
  },
  color: '#FF5500',
  textColor: '#ffffff',
  regions: ['global'],
}
```

## Guidelines

- Use the issue templates for bugs, features, and provider updates
- Ensure tests pass: `pnpm test`
- Ensure formatting is correct: `pnpm format:check`
- Keep the core bundle under 8KB gzipped

## License

MIT — by contributing, you agree that your contributions will be licensed under the MIT License.
