---
'@smart-mailto/core': patch
---

Fix geo-detection timezone prefix fallback — was matching on continent only (e.g. any unknown `Europe/*` timezone fell through to `Europe/Berlin`), now shortens IANA path one segment at a time for correct region match. Add CODE_OF_CONDUCT, SECURITY policy, and issue template config. Enforce actual coverage thresholds in CI.
