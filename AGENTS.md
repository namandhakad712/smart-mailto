# smart-mailto — Agent Guide

## Monorepo Structure

pnpm@9 workspace (see `pnpm-workspace.yaml`). Workspaces: `packages/*`, `apps/*`, `tools/*`.

| Directory                  | Purpose                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `packages/core`            | Zero-dependency engine, main tests (vitest+jsdom, 90% cov threshold) |
| `packages/react`           | React wrapper (peer: react>=17)                                      |
| `packages/vue`             | Vue wrapper (peer: vue>=3)                                           |
| `packages/svelte`          | Svelte wrapper (peer: svelte>=5)                                     |
| `apps/docs`                | Next.js 16.2.6 docs site (has own AGENTS.md)                         |
| `apps/demo`                | Vite demo, alias `@smart-mailto/core` → source TS                    |
| `tools/provider-validator` | Validates provider URLs weekly via cron                              |

## Commands (run from root)

```bash
pnpm build              # turbo run build
pnpm dev              # turbo run dev --parallel
pnpm test             # turbo run test (core only)
pnpm typecheck        # turbo run typecheck
pnpm format           # prettier write
pnpm format:check     # prettier check (CI)
pnpm lint             # turbo run lint (ESLint in core + docs only)
pnpm validate:providers  # tsx tools/provider-validator/index.ts
```

## Focused Verification

```bash
# Core tests only (with coverage)
pnpm --filter @smart-mailto/core test:coverage

# Single e2e test file
pnpm exec playwright test modal.spec.ts

# Run core tests without turbo (faster iteration)
pnpm --filter @smart-mailto/core exec vitest

# Build core only
pnpm --filter @smart-mailto/core build
```

## CI Flow

```
typecheck → format:check → test → bundle-size check (< 8KB gzipped)
```

The bundle size limit (8192 bytes) is enforced in `.github/workflows/ci.yml` and `.github/workflows/bundle-size.yml`.

## TypeScript & Formatting

- **Strict**: `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`
- **Prettier**: semi, single quotes, trailing commas, printWidth 100, arrowParens avoid, LF
- **No eslint** in root — only in `packages/core` and `apps/docs` (uses flat config)
- **tsx** for tools (no tsconfig needed for single-file scripts)

## Architecture Notes

- `init.ts` uses **capture-phase event delegation** on `document` (line 94) to intercept all `mailto:` links
- Modal UI (`modal.ts`) is **dynamically imported** from `init.ts:83` to keep core bundle tiny
- **Geo detection**: `Intl.DateTimeFormat().resolvedOptions().timeZone` + `navigator.language` — **zero network requests**, runs in <1ms
- **Shadow DOM** for CSS isolation in modal (no host page style leakage)
- Safari popup blocker: `window.open()` **must** be called synchronously within user click handler

## Adding Providers

Edit `packages/core/src/providers.ts` directly. Each provider needs:

- `id`, `name`, `buildUrl(params)`, `color`, `textColor`, `regions`

Edit `tools/provider-validator/index.ts` to add test URLs for new providers.

The `pnpm generate:providers` script in `package.json` is stale — the generator tool (`tools/provider-generator/`) does not exist.

## Release Flow

Changesets (base `main`, access `public`). Run `pnpm changeset publish` in CI. No auto-commit.
