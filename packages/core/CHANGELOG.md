# @smart-mailto/core

## 0.3.0

### Minor Changes

- 4b75556: Provider registry overhaul: expand to 51 webmail entries and fix broken URLs
  - Fixed Gmail compose URL parameter (`su` not `subject`) using `urlType: "template"`
  - Added 15 new providers: disroot, riseup, rambler, aliyun, o2, interia, sfr, free, orange, nate, bsnl, telia, mynet, ttmail, atlas-sk
  - The current registry contains 31 provider compose links and 20 official webmail fallback pages where no verified compose deep link is available
  - Added `native` (system mail app) and `copy` (copy-to-clipboard) as built-in fallback actions
  - Added `generate:providers` script to root package.json
  - Updated the provider documentation to use registry-derived totals and distinguish webmail entries from built-in actions

### Patch Changes

- 0313d9f: Fire `onClose` only when the provider picker is dismissed without a selection.
- b5b505e: Clarify the npm package description, add the `picker` discovery keyword, and refresh the npm README with the current 51-entry webmail registry: 31 compose links and 20 fallback pages.
- 62eeb1e: Honor the documented custom class names and unstyled modal mode.
- 7143396: Fix geo-detection timezone prefix fallback — was matching on continent only (e.g. any unknown `Europe/*` timezone fell through to `Europe/Berlin`), now shortens IANA path one segment at a time for correct region match. Add CODE_OF_CONDUCT, SECURITY policy, and issue template config. Enforce actual coverage thresholds in CI.

## 0.2.0

### Minor Changes

- ee3ca35: First public release — zero-dependency, geo-aware webmail picker with 37 webmail providers
