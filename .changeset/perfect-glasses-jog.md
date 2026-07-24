---
'@smart-mailto/core': minor
---

Provider registry overhaul: expand to 45 webmail providers and fix broken URLs

- Fixed Gmail compose URL parameter (`su` not `subject`) using `urlType: "template"`
- Added 15 new providers: disroot, riseup, rambler, aliyun, o2, interia, sfr, free, orange, nate, bsnl, telia, mynet, ttmail, atlas-sk
- Marked `laposte`, `naver`, `indiatimes`, `rediff`, `seznam`, `mailfence`, and `spike` as `fallbackOnly` where no verified compose deep link is available
- Added `native` (system mail app) and `copy` (copy-to-clipboard) as built-in fallback actions
- Added `generate:providers` script to root package.json
- Updated docs providers page from 31 to 47 total entries with verified data and SVGs
