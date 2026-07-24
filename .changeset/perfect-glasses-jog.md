---
'@smart-mailto/core': minor
---

Provider registry overhaul: expand to 51 webmail entries and fix broken URLs

- Fixed Gmail compose URL parameter (`su` not `subject`) using `urlType: "template"`
- Added 15 new providers: disroot, riseup, rambler, aliyun, o2, interia, sfr, free, orange, nate, bsnl, telia, mynet, ttmail, atlas-sk
- The current registry contains 31 provider compose links and 20 official webmail fallback pages where no verified compose deep link is available
- Added `native` (system mail app) and `copy` (copy-to-clipboard) as built-in fallback actions
- Added `generate:providers` script to root package.json
- Updated the provider documentation to use registry-derived totals and distinguish webmail entries from built-in actions
