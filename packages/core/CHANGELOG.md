# @smart-mailto/core

## 0.3.0

### Minor Changes

- 4b75556: Provider registry overhaul: expand to 45 webmail providers, remove dead entries, fix broken URLs
  - Removed `indiatimes` (shut down 2013) and `spike` (client app, not webmail)
  - Fixed Gmail compose URL parameter (`su` not `subject`) using `urlType: "template"`
  - Added 15 new providers: disroot, riseup, rambler, aliyun, o2, interia, sfr, free, orange, nate, bsnl, telia, mynet, ttmail, atlas-sk
  - Marked `laposte` and `naver` as `fallbackOnly` (redesigned webmail, no deep-link compose URLs)
  - Added `native` (system mail app) and `copy` (copy-to-clipboard) as built-in fallback actions
  - Added `generate:providers` script to root package.json
  - Updated docs providers page from 31 to 47 total entries with verified data and SVGs

### Patch Changes

- 7143396: Fix geo-detection timezone prefix fallback — was matching on continent only (e.g. any unknown `Europe/*` timezone fell through to `Europe/Berlin`), now shortens IANA path one segment at a time for correct region match. Add CODE_OF_CONDUCT, SECURITY policy, and issue template config. Enforce actual coverage thresholds in CI.

## 0.3.0

### Patch Changes

- c52992d: Expand test coverage to 98% with new test suites for init, icons, providers, resolver, and storage modules
- 44812fb: Restore passing lint state across the codebase
- Updated dependencies [1db0429]

## 0.2.0

### Minor Changes

- ee3ca35: First public release — zero-dependency, geo-aware webmail picker with 37 webmail providers
