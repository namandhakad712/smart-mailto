# Security Policy

## Reporting a Vulnerability

The smart-mailto project takes security seriously. If you discover a security
vulnerability, please **do not** open a public issue. Instead, send a private
report to the maintainers via GitHub's security advisory tool:

https://github.com/namandhakad712/smart-mailto/security/advisories/new

You should receive a response within 48 hours. If not, please follow up.

## What to Include

- A clear description of the vulnerability
- Steps to reproduce (if possible)
- Affected versions and packages
- Any potential impact

## Scope

The following are in scope:
- `@smart-mailto/core` — the core engine
- `@smart-mailto/react` — React wrapper
- `@smart-mailto/vue` — Vue wrapper
- `@smart-mailto/svelte` — Svelte wrapper

## Out of Scope

The following are NOT considered vulnerabilities:
- Missing autocomplete attributes on modal inputs
- CSP bypass through legitimate provider URLs
- Social engineering of project maintainers

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.x     | ✅ Yes    |

## Disclosure Policy

We follow a 90-day disclosure timeline:
1. Report received and acknowledged within 48 hours
2. Fix developed and tested within 30 days
3. Patch released within 90 days
4. Public disclosure after patch release
