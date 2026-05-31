/**
 * Provider URL Validator
 *
 * Checks that each provider's compose URL returns 200/301/302
 * (not a dead URL). Generates a report.json for CI.
 *
 * Run: pnpm validate:providers
 */

import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────────────────────
// Test URLs for each provider — these are real compose URLs with dummy params
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDER_TEST_URLS: Record<string, string> = {
  gmail: 'https://mail.google.com/mail/?view=cm&fs=1&to=test%40example.com',
  'outlook-personal': 'https://outlook.live.com/mail/0/deeplink/compose?to=test%40example.com',
  'outlook-work': 'https://outlook.office.com/mail/deeplink/compose?to=test%40example.com',
  yahoo: 'https://compose.mail.yahoo.com/?to=test%40example.com',
  protonmail: 'https://mail.proton.me/u/0/inbox',
  icloud: 'https://www.icloud.com/mail/',
  fastmail: 'https://app.fastmail.com/mail/compose',
  zoho: 'https://mail.zoho.com/zm/#compose',
  tutanota: 'https://app.tuta.com/mail',
  yandex: 'https://mail.yandex.ru/compose',
  mailru: 'https://e.mail.ru/compose/',
  gmx: 'https://navigator.gmx.net/mail/compose/',
  webde: 'https://web.de/email/compose/',
  naver: 'https://mail.naver.com/v2/new',
  'yahoo-japan': 'https://mail.yahoo.co.jp/compose',
  qq: 'https://mail.qq.com/cgi-bin/compose_send',
  mail163: 'https://mail.163.com/js5/write.do',
  seznam: 'https://email.seznam.cz/?compose',
  laposte: 'https://www.laposte.net/accueil',
  daum: 'https://mail.daum.net/',
  posteo: 'https://posteo.de/en',
  mailboxorg: 'https://office.mailbox.org/',
  mailfence: 'https://mailfence.com',
  runbox: 'https://runbox.com',
  libero: 'https://mail.libero.it/',
  onet: 'https://poczta.onet.pl/',
  wp: 'https://poczta.wp.pl/',
  rediff: 'https://mail.rediff.com/',
  ukrnet: 'https://mail.ukr.net/',
  sina: 'https://mail.sina.com.cn/',
};

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

interface ValidationResult {
  ok: boolean;
  status: number | null;
  url: string;
  error?: string;
  durationMs?: number;
}

async function validateUrl(id: string, url: string, verbose: boolean): Promise<ValidationResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
      headers: {
        'User-Agent': 'smart-mailto-validator/1.0 (https://github.com/yourusername/smart-mailto)',
      },
    });

    const ok = res.status < 400;
    const result: ValidationResult = {
      ok,
      status: res.status,
      url,
      durationMs: Date.now() - start,
    };

    if (verbose) {
      const icon = ok ? '✅' : '❌';
      console.log(`  ${icon} ${id.padEnd(20)} ${res.status} ${url} (${result.durationMs}ms)`);
    }

    return result;
  } catch (e: any) {
    const result: ValidationResult = {
      ok: false,
      status: null,
      url,
      error: e?.message ?? String(e),
      durationMs: Date.now() - start,
    };

    if (verbose) {
      console.log(`  ❌ ${id.padEnd(20)} ERROR ${result.error}`);
    }

    return result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  const report: Record<string, ValidationResult> = {};
  const entries = Object.entries(PROVIDER_TEST_URLS);

  console.log(`\n🔍 Validating ${entries.length} provider URLs...\n`);
  if (verbose) {
    console.log('  Status:');
  }

  // Validate in batches of 8 (be polite to servers)
  const BATCH_SIZE = 8;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(([id, url]) => validateUrl(id, url, verbose)));
    batch.forEach(([id], idx) => {
      report[id] = results[idx]!;
    });
  }

  // Summary
  const passing = Object.values(report).filter(r => r.ok);
  const failing = Object.values(report).filter(r => !r.ok);

  console.log(`\n📊 Results: ${passing.length} passing / ${failing.length} failing`);

  if (failing.length > 0) {
    console.log('\n❌ Failing providers:');
    Object.entries(report)
      .filter(([, v]) => !v.ok)
      .forEach(([id, v]) => {
        console.log(`  - ${id}: ${v.status ?? 'ERROR'} — ${v.url}`);
        if (v.error) console.log(`    Error: ${v.error}`);
      });
  } else {
    console.log('\n✅ All providers are healthy!');
  }

  // Write JSON report for CI
  const reportPath = path.join(__dirname, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report written to: ${reportPath}\n`);

  // Exit with error code if any providers are failing
  if (failing.length > 0) {
    process.exit(1);
  }
}

main().catch(e => {
  console.error('Validator crashed:', e);
  process.exit(1);
});
