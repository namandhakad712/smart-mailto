# smart-mailto

## Unreleased

### Features

- Add Japanese carrier email support (NTT Docomo, au/KDDI, SoftBank) — 3 new providers (50 total)
- Create JSON Schema for provider-generator data validation (providers-schema.json)
- Add CI sync check for provider-generator output drift detection

### Documentation

- Update providers page: 47 → 50 providers, add Japanese carrier entries

## 0.3.0

### Minor Changes

- 8509bd6: Add versioned install command (npm/yarn/pnpm/bun) alongside existing snippet
- ab338ad: Add privacy-safe product analytics via PostHog to docs and demo
- 03821c8: Add replace-mailto integration guide (PR #5)

### Patch Changes

- c52992d: Expand core test coverage to 98% with new test suites for init, icons, providers, resolver, and storage modules
- 55c34fb: Resolve Lighthouse accessibility failures — improve contrast ratios and restore focus-visible states
- 3277200: Add homepage FAQ section with 8 questions and JSON-LD FAQPage structured data
- 2751fb4: Clarify free pricing in homepage FAQ
- 31bcbf0: Replace stale homepage dateline and clarify discovery metadata (PR #7)
- 9578cca: Add package support routes/links (PR #6)
- b55121b: Clarify copy-address fallback behavior in examples section (PR #10)
- 77ad9bd: Refresh README discovery links (PR #11)
- 44812fb: Restore passing docs lint state
- 5d7eadd: Label provider search field (fix/provider-search-label-task)
- 2949b46: Merge fix/provider-search-label changes resolving merge conflicts
- a67dc0c: Remove PostHog analytics integration and posthog-js dependency

### Dependency Updates

- @smart-mailto/core: 0.2.0 → 0.3.0
- @smart-mailto/react: 0.2.0 → 0.3.0
- @smart-mailto/vue: 0.2.0 → 0.3.0
- @smart-mailto/svelte: 0.2.0 → 0.3.0
- @smart-mailto/demo: 0.0.2 → 0.0.3

---

## 0.2.0

### Minor Changes

- ee3ca35: First public release — zero-dependency, geo-aware webmail picker with 37 webmail providers
