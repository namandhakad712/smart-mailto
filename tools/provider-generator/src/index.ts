/**
 * provider-generator — Generates packages/core/src/providers.ts from JSON data.
 *
 * Usage: npx tsx tools/provider-generator/src/index.ts
 *
 * The JSON source-of-truth is tools/provider-generator/data/providers.json.
 * This keeps provider data editable by non-developers while the TypeScript
 * output stays optimized and type-safe.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_FILE = resolve(ROOT, 'data/providers.json');
const CORE_DIR = resolve(ROOT, '../../packages/core/src');
const OUTPUT_FILE = resolve(CORE_DIR, 'providers.ts');

/* ──────────────────────────────────────────────────── Types ─────── */

interface ProviderData {
  id: string;
  name: string;
  urlType: 'searchParams' | 'template' | 'none';
  baseUrl?: string;
  urlTemplate?: string;
  urlParams?: Record<string, string>;
  color: string;
  textColor: string;
  noCcBcc?: boolean;
  noBody?: boolean;
  noSubjectBody?: boolean;
  noBodyPreFill?: boolean;
  regions?: string[];
  fallbackOnly?: boolean;
  isNative?: boolean;
  isCopy?: boolean;
}

interface Schema {
  version: number;
  providers: ProviderData[];
}

/* ──────────────────────────────────────────────────── Code Gen ──── */

const e = 'encodeURIComponent';
const eShort = 'e';

function genBuildUrl(provider: ProviderData, indent: string): string {
  const { id, urlType, baseUrl, urlTemplate, urlParams, noCcBcc, noBody, noSubjectBody } = provider;

  if (provider.isNative) {
    return `${indent}buildUrl: (p: MailtoParams) => {
${indent}  return 'mailto:' + p.to.join(',') + '?subject=' + ${eShort}(p.subject ?? '') + '&body=' + ${eShort}(p.body ?? '') + (p.cc?.length ? '&cc=' + ${eShort}(joinAddresses(p.cc)) : '') + (p.bcc?.length ? '&bcc=' + ${eShort}(joinAddresses(p.bcc)) : '');
${indent}  },`;
  }

  if (provider.isCopy) {
    return `${indent}buildUrl: (p: MailtoParams) => p.to.join(','),`;
  }

  if (urlType === 'none') {
    return `${indent}buildUrl: () => '#',
    ${indent}// ${id} has no working compose URL`;
  }

  if (urlType === 'template' && urlTemplate) {
    return `${indent}buildUrl: (p: MailtoParams) => {
${indent}  return '${urlTemplate
      .replace(/\{to\}/g, `' + ${eShort}(p.to.join(',')) + '`)
      .replace(/\{subject\}/g, `' + ${eShort}(p.subject ?? '') + '`)
      .replace(/\{body\}/g, `' + ${eShort}(p.body ?? '') + '`)
      .replace(/\{cc\}/g, `' + ${eShort}(joinAddresses(p.cc)) + '`)
      .replace(/\{bcc\}/g, `' + ${eShort}(joinAddresses(p.bcc)) + '`)}';
${indent}  },`;
  }

  if (urlType === 'searchParams' && baseUrl) {
    const lines: string[] = [];
    lines.push(`${indent}buildUrl: (p: MailtoParams) => {`);
    lines.push(`${indent}  const url = new URL('${baseUrl}');`);

    if (urlParams) {
      for (const [k, v] of Object.entries(urlParams)) {
        lines.push(`${indent}  url.searchParams.set('${k}', '${v}');`);
      }
    }

    lines.push(`${indent}  url.searchParams.set('to', p.to.join(','));`);

    if (!noCcBcc) {
      lines.push(`${indent}  if (p.cc?.length) url.searchParams.set('cc', joinAddresses(p.cc));`);
      lines.push(
        `${indent}  if (p.bcc?.length) url.searchParams.set('bcc', joinAddresses(p.bcc));`,
      );
    }

    if (!noSubjectBody) {
      lines.push(`${indent}  if (p.subject) url.searchParams.set('subject', p.subject);`);
      if (!noBody) {
        lines.push(`${indent}  if (p.body) url.searchParams.set('body', p.body);`);
      }
    }

    lines.push(`${indent}  return url.toString();`);
    lines.push(`${indent}  },`);
    return lines.join('\n');
  }

  return `${indent}buildUrl: () => '#',`;
}

function genProvider(provider: ProviderData, indent: string): string {
  const lines: string[] = [];

  if (idNeedsQuotes(provider.id)) {
    lines.push(`${indent}'${provider.id}': {`);
  } else {
    lines.push(`${indent}${provider.id}: {`);
  }

  lines.push(`${indent}  id: '${provider.id}',`);
  lines.push(`${indent}  name: '${provider.name.replace(/'/g, "\\'")}',`);

  lines.push(genBuildUrl(provider, indent));

  lines.push(`${indent}  color: '${provider.color}',`);
  lines.push(`${indent}  textColor: '${provider.textColor}',`);

  if (provider.noBodyPreFill) {
    lines.push(`${indent}  noBodyPreFill: true,`);
  }
  if (provider.fallbackOnly) {
    lines.push(`${indent}  fallbackOnly: true,`);
  }
  if (provider.isNative) {
    lines.push(`${indent}  isNative: true,`);
  }
  if (provider.isCopy) {
    lines.push(`${indent}  isCopy: true,`);
  }

  if (provider.regions && provider.regions.length > 0) {
    const regionStr = provider.regions.map(r => `'${r}'`).join(', ');
    lines.push(`${indent}  regions: [${regionStr}],`);
  }

  lines.push(`${indent}},`);
  return lines.join('\n');
}

function idNeedsQuotes(id: string): boolean {
  return id.includes('-') || /^\d/.test(id);
}

/* ────────────────────────────────────────────────── Main ───────── */

async function main() {
  if (!existsSync(DATA_FILE)) {
    console.error(`❌ Data file not found: ${DATA_FILE}`);
    process.exit(1);
  }

  const raw = readFileSync(DATA_FILE, 'utf-8');
  const schema: Schema = JSON.parse(raw);

  const { providers } = schema;

  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * @smart-mailto/core — Provider Database');
  lines.push(' *');
  lines.push(' * The complete global registry of email providers with compose deep links.');
  lines.push(' * GENERATED FILE — DO NOT EDIT DIRECTLY.');
  lines.push(' * Source: tools/provider-generator/data/providers.json');
  lines.push(' * Regenerate: pnpm generate:providers');
  lines.push(' */');
  lines.push('');
  lines.push("import type { MailtoParams, Provider } from './types.js';");
  lines.push('');
  lines.push('// ─────────────────────────────────────────────────────────────');
  lines.push('// URL Builder Helpers');
  lines.push('// ─────────────────────────────────────────────────────────────');
  lines.push('');
  lines.push('const e = encodeURIComponent;');
  lines.push('');
  lines.push('function joinAddresses(addrs?: string[]): string {');
  lines.push("  return addrs?.join(',') ?? '';");
  lines.push('}');
  lines.push('');
  lines.push('// ─────────────────────────────────────────────────────────────');
  lines.push('// Provider Registry');
  lines.push('// ─────────────────────────────────────────────────────────────');
  lines.push('export const PROVIDERS: Readonly<Record<string, Provider>> = {');

  for (const provider of providers) {
    lines.push('');
    if (provider.fallbackOnly) {
      lines.push(`  // ${provider.id} — fallback only (no working compose URL)`);
    }
    lines.push(genProvider(provider, ''));
  }

  lines.push('};');
  lines.push('');
  lines.push('/**');
  lines.push(' * Returns a Provider by ID, or null if not found.');
  lines.push(' */');
  lines.push('export function getProvider(id: string): Provider | null {');
  lines.push('  return PROVIDERS[id] ?? null;');
  lines.push('}');
  lines.push('');
  lines.push('/**');
  lines.push(' * Returns all providers as an array.');
  lines.push(' */');
  lines.push('export function getAllProviders(): Provider[] {');
  lines.push('  return Object.values(PROVIDERS);');
  lines.push('}');
  lines.push('');
  lines.push('/**');
  lines.push(' * Returns the complete public provider catalog.');
  lines.push(' *');
  lines.push(' * Public catalog surfaces should use this helper so their IDs, names, regions,');
  lines.push(' * colors, and compose behavior cannot drift from the shipped registry.');
  lines.push(' */');
  lines.push('export function getCatalogProviders(): Provider[] {');
  lines.push('  return getAllProviders();');
  lines.push('}');
  lines.push('');

  const prettierConfig = await resolveConfig(OUTPUT_FILE);
  const output = await format(lines.join('\n'), {
    ...prettierConfig,
    parser: 'typescript',
  });

  writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`✅ Generated ${OUTPUT_FILE} (${providers.length} providers)`);
}

void main();
