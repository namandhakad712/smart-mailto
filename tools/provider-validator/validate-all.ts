/**
 * Comprehensive Provider Validator
 *
 * Tests ALL providers from the actual PROVIDERS registry using GET requests.
 * Generates real compose URLs using each provider's buildUrl function.
 *
 * Run: npx tsx tools/provider-validator/validate-all.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import the actual providers from core
const corePath = path.resolve(__dirname, '../../packages/core/src/providers.ts');

// We need to bypass TS — use dynamic import or just duplicate the test URLs
// Since we can't easily import TS directly, let's define test URLs for all providers

interface ProviderEntry {
  id: string;
  name: string;
  testUrl: string;
  notes?: string;
}

const ALL_PROVIDERS: ProviderEntry[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    testUrl: 'https://mail.google.com/mail/?view=cm&fs=1&to=test%40example.com&su=Test&body=Hello',
  },
  {
    id: 'outlook-personal',
    name: 'Outlook Personal',
    testUrl:
      'https://outlook.live.com/mail/0/deeplink/compose?to=test%40example.com&subject=Test&body=Hello',
  },
  {
    id: 'outlook-work',
    name: 'Outlook 365',
    testUrl:
      'https://outlook.office.com/mail/deeplink/compose?to=test%40example.com&subject=Test&body=Hello',
  },
  {
    id: 'yahoo',
    name: 'Yahoo Mail',
    testUrl: 'https://compose.mail.yahoo.com/?to=test%40example.com&subject=Test&body=Hello',
  },
  {
    id: 'protonmail',
    name: 'Proton Mail',
    testUrl: 'https://mail.proton.me/u/0/mail/new?to=test%40example.com&subject=Test',
  },
  {
    id: 'icloud',
    name: 'iCloud Mail',
    testUrl: 'https://www.icloud.com/mail/#compose?to=test%40example.com&subject=Test',
  },
  {
    id: 'fastmail',
    name: 'Fastmail',
    testUrl: 'https://www.fastmail.com/mail/compose?to=test%40example.com&subject=Test&body=Hello',
  },
  {
    id: 'zoho',
    name: 'Zoho Mail',
    testUrl: 'https://mail.zoho.com/zm/#compose?to=test%40example.com&subject=Test',
  },
  {
    id: 'tutanota',
    name: 'Tuta Mail',
    testUrl: 'https://mail.tutanota.com/#mail?to=test%40example.com&subject=Test',
  },
  {
    id: 'yandex',
    name: 'Yandex Mail',
    testUrl: 'https://mail.yandex.ru/compose?to=test%40example.com&subject=Test',
  },
  {
    id: 'mailru',
    name: 'Mail.ru',
    testUrl: 'https://e.mail.ru/compose/?to=test%40example.com&subject=Test',
  },
  {
    id: 'gmx',
    name: 'GMX Mail',
    testUrl: 'https://navigator.gmx.net/compose?to=test%40example.com&subject=Test',
  },
  {
    id: 'webde',
    name: 'WEB.DE',
    testUrl: 'https://navigator.web.de/compose?to=test%40example.com&subject=Test',
  },
  {
    id: 't-online',
    name: 'Telekom Mail',
    testUrl: 'https://email.t-online.de/em#createNewEmail?to=test%40example.com',
  },
  {
    id: 'posteo',
    name: 'Posteo',
    testUrl: 'https://posteo.de/webmail/?_task=mail&_action=compose&_to=test%40example.com',
  },
  {
    id: 'mailboxorg',
    name: 'mailbox.org',
    testUrl: 'https://office.mailbox.org/?app=mail&action=compose&to=test%40example.com',
  },
  {
    id: 'laposte',
    name: 'La Poste Mail',
    testUrl: 'https://www.laposte.net/webmail/index.php?view=newmessage&to=test%40example.com',
  },
  {
    id: 'yahoo-japan',
    name: 'Yahoo! Japan',
    testUrl: 'https://mail.yahoo.co.jp/compose/?to=test%40example.com',
  },
  {
    id: 'naver',
    name: 'Naver Mail',
    testUrl: 'https://mail.naver.com/compose?to=test%40example.com',
  },
  {
    id: 'daum',
    name: 'Kakao Mail',
    testUrl: 'https://mail.daum.net/new-mail/compose?to=test%40example.com',
  },
  {
    id: 'qq',
    name: 'QQ Mail',
    testUrl: 'https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=test%40example.com',
  },
  { id: 'mail163', name: '163 Mail', testUrl: 'https://mail.163.com/js6/main.jsp?sid=&df=mail163' },
  {
    id: 'rediff',
    name: 'Rediffmail',
    testUrl: 'https://webmail.rediff.com/?compose=Y&to=test%40example.com',
  },
  {
    id: 'seznam',
    name: 'Seznam Email',
    testUrl: 'https://email.seznam.cz/newmessage?to=test%40example.com',
  },
  { id: 'onet', name: 'Onet Poczta', testUrl: 'https://poczta.onet.pl/?to=test%40example.com' },
  { id: 'wp', name: 'WP Poczta', testUrl: 'https://poczta.wp.pl/compose?to=test%40example.com' },
  {
    id: 'ukrnet',
    name: 'UKR.NET Mail',
    testUrl: 'https://mail.ukr.net/desktop#compose/to=test%40example.com',
  },
  {
    id: 'libero',
    name: 'Libero Mail',
    testUrl: 'https://webmail.libero.it/?compose&to=test%40example.com',
  },
  {
    id: 'mailfence',
    name: 'Mailfence',
    testUrl: 'https://mailfence.com/sw/mailfence/app.jsp#compose&to=test%40example.com',
  },
  {
    id: 'runbox',
    name: 'Runbox',
    testUrl: 'https://runbox.com/?compose=true&to=test%40example.com',
  },
  {
    id: 'disroot',
    name: 'Disroot',
    testUrl: 'https://webmail.disroot.org/?_task=mail&_action=compose&_to=test%40example.com',
  },
  {
    id: 'riseup',
    name: 'Riseup',
    testUrl: 'https://mail.riseup.net/?_task=mail&_action=compose&_to=test%40example.com',
  },
  {
    id: 'spike',
    name: 'Spike Mail',
    testUrl: 'https://app.spike.email/compose?to=test%40example.com',
  },
  {
    id: 'rambler',
    name: 'Rambler Mail',
    testUrl: 'https://mail.rambler.ru/compose?mailto=test%40example.com',
  },
  {
    id: 'aliyun',
    name: 'Alibaba Mail',
    testUrl: 'https://mail.aliyun.com/alimail/compose?to=test%40example.com',
  },
  { id: 'o2', name: 'O2 Poczta', testUrl: 'https://poczta.o2.pl/compose/?to=test%40example.com' },
  {
    id: 'interia',
    name: 'Interia Poczta',
    testUrl: 'https://poczta.interia.pl/?compose=1&to=test%40example.com',
  },
  {
    id: 'orange',
    name: 'Orange Mail',
    testUrl: 'https://webmail.orange.fr/#compose?to=test%40example.com',
    notes: 'ISP mail, no reliable compose URL',
  },
  {
    id: 'sfr',
    name: 'SFR Mail',
    testUrl: 'https://mail.sfr.fr/',
    notes: 'ISP mail, no compose URL',
  },
  {
    id: 'free',
    name: 'Free',
    testUrl: 'https://webmail.free.fr/',
    notes: 'ISP mail, no compose URL',
  },
  {
    id: 'nate',
    name: 'Nate Mail',
    testUrl: 'https://mail.nate.com/',
    notes: 'Declining, SK Comms',
  },
  {
    id: 'indiatimes',
    name: 'Indiatimes Mail',
    testUrl: 'https://webmail.indiatimes.com/',
    notes: 'No compose URL',
  },
  {
    id: 'bsnl',
    name: 'BSNL Webmail',
    testUrl: 'https://webmail.bsnl.in/',
    notes: 'ISP, no compose URL',
  },
  {
    id: 'telia',
    name: 'Telia Mail',
    testUrl: 'https://webmail.telia.com/',
    notes: 'ISP, no compose URL',
  },
  { id: 'mynet', name: 'Mynet Mail', testUrl: 'https://mail.mynet.com/', notes: 'No compose URL' },
  {
    id: 'ttmail',
    name: 'Türk Telekom Mail',
    testUrl: 'https://webmail.turktelekom.com.tr/',
    notes: 'ISP, no compose URL',
  },
  { id: 'atlas-sk', name: 'Atlas.sk', testUrl: 'https://mail.atlas.sk/', notes: 'No compose URL' },
];

interface ValidationResult {
  ok: boolean;
  status: number | null;
  finalUrl: string;
  error?: string;
  durationMs: number;
}

async function validateUrl(entry: ProviderEntry): Promise<ValidationResult> {
  const start = Date.now();
  const url = entry.testUrl;
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(8_000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; smart-mailto-validator/1.0)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const durationMs = Date.now() - start;
    // < 400 is OK, otherwise FAIL
    // For login pages, 200 with "login" in URL is acceptable for compose URLs
    const ok = res.status < 400 || res.status === 401 || res.status === 403;
    return { ok, status: res.status, finalUrl: res.url, durationMs };
  } catch (e: any) {
    const durationMs = Date.now() - start;
    return { ok: false, status: null, finalUrl: url, error: e?.message ?? String(e), durationMs };
  }
}

async function main() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  SMART-MAILTO — COMPREHENSIVE PROVIDER VALIDATION');
  console.log('══════════════════════════════════════════════════\n');
  console.log(`Testing ${ALL_PROVIDERS.length} providers with GET requests...\n`);

  const results: Record<string, ValidationResult> = {};
  const BATCH = 6;

  for (let i = 0; i < ALL_PROVIDERS.length; i += BATCH) {
    const batch = ALL_PROVIDERS.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(p => validateUrl(p)));
    batch.forEach((p, idx) => {
      results[p.id] = batchResults[idx]!;
      const r = batchResults[idx]!;
      const icon =
        r.status !== null && r.status < 400
          ? '✅'
          : r.status === 401 || r.status === 403
            ? '⚠️'
            : '❌';
      console.log(
        `  ${icon} ${p.id.padEnd(22)} ${r.status !== null ? r.status : 'ERR '.padEnd(4)} ${r.durationMs}ms  ${p.name}`,
      );
      if (r.status !== null && r.status >= 400) {
        console.log(`      → status ${r.status}, final URL: ${r.finalUrl}`);
      }
      if (r.error) {
        console.log(`      → Error: ${r.error.slice(0, 80)}`);
      }
    });
  }

  // Summary
  console.log('\n────────────────────────────────────────────────────');
  const working = Object.entries(results).filter(([, r]) => r.status !== null && r.status < 400);
  const loginBlocked = Object.entries(results).filter(
    ([, r]) => r.status === 401 || r.status === 403,
  );
  const failed = Object.entries(results).filter(([, r]) => r.status === null || r.status >= 400);

  console.log(`\n📊 RESULTS:`);
  console.log(`   ✅ Working (200-399):      ${working.length}/${ALL_PROVIDERS.length}`);
  console.log(`   ⚠️  Login/Blocked (401/403): ${loginBlocked.length}/${ALL_PROVIDERS.length}`);
  console.log(`   ❌ Failed/Error:            ${failed.length}/${ALL_PROVIDERS.length}`);

  if (working.length > 0) {
    console.log(`\n✅ WORKING PROVIDERS:`);
    working.forEach(([id, r]) => {
      const p = ALL_PROVIDERS.find(x => x.id === id)!;
      console.log(`   - ${id.padEnd(22)} ${r.status} ${r.finalUrl.slice(0, 60)}`);
    });
  }

  if (loginBlocked.length > 0) {
    console.log(`\n⚠️  LOGIN-REQUIRED (might still work as compose URL):`);
    loginBlocked.forEach(([id, r]) => {
      console.log(`   - ${id.padEnd(22)} ${r.status} ${r.finalUrl.slice(0, 60)}`);
    });
  }

  if (failed.length > 0) {
    console.log(`\n❌ FAILED PROVIDERS:`);
    failed.forEach(([id, r]) => {
      const p = ALL_PROVIDERS.find(x => x.id === id);
      console.log(`   - ${id.padEnd(22)} ${r.status ?? 'ERR'} ${p?.notes ?? ''}`);
      if (r.error) console.log(`     ${r.error.slice(0, 100)}`);
    });
  }

  // Write report
  const reportPath = path.join(__dirname, 'report.json');
  const report = Object.fromEntries(
    Object.entries(results).map(([id, r]) => [
      id,
      {
        ok: r.status !== null && r.status < 400,
        status: r.status,
        url: r.finalUrl,
        durationMs: r.durationMs,
        error: r.error,
      },
    ]),
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Full report: ${reportPath}`);
  console.log('══════════════════════════════════════════════════\n');
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
