---
'@smart-mailto/core': minor
---

Provider registry overhaul: expand to 45 webmail providers, remove dead entries, fix broken URLs

- Removed `indiatimes` (shut down 2013) and `spike` (client app, not webmail)
- Fixed Gmail compose URL parameter (`su` not `subject`) using `urlType: "template"`
- Added 15 new providers: disroot, riseup, rambler, aliyun, o2, interia, sfr, free, orange, nate, bsnl, telia, mynet, ttmail, atlas-sk
- Marked `laposte` and `naver` as `fallbackOnly` (redesigned webmail, no deep-link compose URLs)
- Added `native` (system mail app) and `copy` (copy-to-clipboard) as built-in fallback actions
- Added `generate:providers` script to root package.json
- Updated docs providers page from 31 to 47 total entries with verified data and SVGs
