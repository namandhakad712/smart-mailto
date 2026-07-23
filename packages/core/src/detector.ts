/**
 * @smart-mailto/core — Email Domain → Provider Detector
 *
 * When a user clicks mailto:hello@gmail.com, we know with 100% certainty
 * that they use Gmail. This module maps email domains to provider IDs,
 * enabling us to pre-select / prioritize the correct provider.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Domain Map
// ─────────────────────────────────────────────────────────────────────────────

/** Maps known email domains (lowercase) to provider IDs */
const DOMAIN_TO_PROVIDER: Readonly<Record<string, string>> = {
  // Google / Gmail
  'gmail.com': 'gmail',
  'googlemail.com': 'gmail',
  'google.com': 'gmail', // Google Workspace

  // Microsoft / Outlook
  'outlook.com': 'outlook-personal',
  'hotmail.com': 'outlook-personal',
  'hotmail.co.uk': 'outlook-personal',
  'hotmail.fr': 'outlook-personal',
  'hotmail.de': 'outlook-personal',
  'hotmail.it': 'outlook-personal',
  'hotmail.es': 'outlook-personal',
  'live.com': 'outlook-personal',
  'live.co.uk': 'outlook-personal',
  'live.ca': 'outlook-personal',
  'live.com.au': 'outlook-personal',
  'live.de': 'outlook-personal',
  'live.fr': 'outlook-personal',
  'live.it': 'outlook-personal',
  'live.nl': 'outlook-personal',
  'msn.com': 'outlook-personal',
  'passport.com': 'outlook-personal',
  'windowslive.com': 'outlook-personal',

  // Yahoo
  'yahoo.com': 'yahoo',
  'yahoo.co.uk': 'yahoo',
  'yahoo.co.in': 'yahoo',
  'yahoo.ca': 'yahoo',
  'yahoo.com.au': 'yahoo',
  'yahoo.fr': 'yahoo',
  'yahoo.de': 'yahoo',
  'yahoo.it': 'yahoo',
  'yahoo.es': 'yahoo',
  'yahoo.com.br': 'yahoo',
  'yahoo.com.ar': 'yahoo',
  'yahoo.com.mx': 'yahoo',
  'yahoo.com.ph': 'yahoo',
  'ymail.com': 'yahoo',
  'rocketmail.com': 'yahoo',

  // Yahoo Japan (separate compose URL)
  'yahoo.co.jp': 'yahoo-japan',

  // ProtonMail
  'proton.me': 'protonmail',
  'protonmail.com': 'protonmail',
  'protonmail.ch': 'protonmail',
  'pm.me': 'protonmail',

  // Apple iCloud
  'icloud.com': 'icloud',
  'me.com': 'icloud',
  'mac.com': 'icloud',

  // Fastmail
  'fastmail.com': 'fastmail',
  'fastmail.fm': 'fastmail',
  'fastmail.net': 'fastmail',
  'fastmail.org': 'fastmail',
  'fastmail.to': 'fastmail',
  'fastmail.cn': 'fastmail',
  'fastmail.es': 'fastmail',
  'fastmail.de': 'fastmail',
  'fastmail.in': 'fastmail',
  'fastmail.jp': 'fastmail',
  'fastmail.mx': 'fastmail',
  'fastmail.nl': 'fastmail',
  'fastmail.se': 'fastmail',
  'fmailbox.com': 'fastmail',
  'fmgirl.com': 'fastmail',
  'fmguy.com': 'fastmail',
  'hailmail.net': 'fastmail',
  'inoutbox.com': 'fastmail',
  'internetemails.net': 'fastmail',

  // Zoho Mail
  'zoho.com': 'zoho',
  'zohomail.com': 'zoho',

  // Tutanota
  'tutanota.com': 'tutanota',
  'tutanota.de': 'tutanota',
  'tutamail.com': 'tutanota',
  'tuta.io': 'tutanota',
  'keemail.me': 'tutanota',

  // Yandex
  'yandex.ru': 'yandex',
  'yandex.com': 'yandex',
  'yandex.ua': 'yandex',
  'yandex.by': 'yandex',
  'yandex.kz': 'yandex',
  'ya.ru': 'yandex',
  'narod.ru': 'yandex',

  // Mail.ru group
  'mail.ru': 'mailru',
  'inbox.ru': 'mailru',
  'list.ru': 'mailru',
  'bk.ru': 'mailru',
  'internet.ru': 'mailru',
  'vk.com': 'mailru',

  // GMX
  'gmx.de': 'gmx',
  'gmx.net': 'gmx',
  'gmx.com': 'gmx',
  'gmx.at': 'gmx',
  'gmx.ch': 'gmx',
  'gmx.us': 'gmx',
  'gmx.org': 'gmx',
  'gmx.biz': 'gmx',
  'gmx.info': 'gmx',

  // WEB.DE
  'web.de': 'webde',

  // T-Online (Deutsche Telekom)
  't-online.de': 't-online',
  'magenta.de': 't-online',

  // Posteo
  'posteo.de': 'posteo',
  'posteo.net': 'posteo',
  'posteo.eu': 'posteo',
  'posteo.at': 'posteo',
  'posteo.org': 'posteo',

  // mailbox.org
  'mailbox.org': 'mailboxorg',

  // Mailfence
  'mailfence.com': 'mailfence',

  // Runbox
  'runbox.com': 'runbox',
  'runbox.email': 'runbox',

  // La Poste (France)
  'laposte.net': 'laposte',

  // Orange (France)
  'orange.fr': 'orange',
  'wanadoo.fr': 'orange',
  'club-internet.fr': 'orange',

  // Naver (South Korea)
  'naver.com': 'naver',
  'hanmail.net': 'naver',

  // Daum / Kakao (South Korea)
  'daum.net': 'daum',
  'kakao.com': 'daum',

  // QQ (China)
  'qq.com': 'qq',
  'foxmail.com': 'qq', // Tencent-owned

  // NetEase (China)
  '163.com': 'mail163',
  '126.com': 'mail163',
  'yeah.net': 'mail163',

  // Sina (China)
  'sina.com': 'sina',
  'sina.cn': 'sina',

  // Seznam (Czech Republic)
  'seznam.cz': 'seznam',
  'email.cz': 'seznam',
  'post.cz': 'seznam',

  // Rediff (India)
  'rediffmail.com': 'rediff',

  // UKR.NET (Ukraine)
  'ukr.net': 'ukrnet',
  'i.ua': 'ukrnet',

  // Libero (Italy)
  'libero.it': 'libero',
  'virgilio.it': 'libero',
  'inwind.it': 'libero',
  'iol.it': 'libero',

  // Onet (Poland)
  'onet.pl': 'onet',
  'onet.eu': 'onet',
  'op.pl': 'onet',
  'onet.com.pl': 'onet',

  // WP (Poland)
  'wp.pl': 'wp',
  'o2.pl': 'o2',

  // Interia (Poland)
  'interia.pl': 'interia',
  'interia.eu': 'interia',

  // Rambler (Russia)
  'rambler.ru': 'rambler',
  'lenta.ru': 'rambler',
  'autorambler.ru': 'rambler',
  'myrambler.ru': 'rambler',
  'ro.ru': 'rambler',

  // Alibaba / Aliyun (China, Enterprise)
  'aliyun.com': 'aliyun',

  // Disroot (FOSS / Privacy)
  'disroot.org': 'disroot',

  // Riseup (Activist / Privacy)
  'riseup.net': 'riseup',

  // Yahoo Japan (separate URL)
  'ybb.ne.jp': 'yahoo-japan',

  // SFR (France)
  'sfr.fr': 'sfr',

  // Free (France)
  'free.fr': 'free',

  // Telia (Nordics)
  'telia.com': 'telia',

  // Mynet (Turkey)
  'mynet.com': 'mynet',

  // Türk Telekom (Turkey)
  'ttmail.com': 'ttmail',

  // Nate (South Korea)
  'nate.com': 'nate',
  'nate.co.kr': 'nate',

  // Indiatimes (India)
  'indiatimes.com': 'indiatimes',

  // BSNL (India)
  'bsnl.in': 'bsnl',

  // Atlas.sk (Slovakia)
  'atlas.sk': 'atlas-sk',

  // Aliyun (China, Enterprise)
  'alibaba.com': 'aliyun',

  // Spike (Conversational Email)
  'spike.email': 'spike',

  // ISP mail domains — map to personal Outlook (common pattern)
  'optusnet.com.au': 'outlook-personal',
  'bigpond.com': 'outlook-personal',
  'virginmedia.com': 'outlook-personal',
  'btinternet.com': 'outlook-personal',
  'sky.com': 'outlook-personal',
};

// ─────────────────────────────────────────────────────────────────────────────
// Enterprise Domain Heuristics
// ─────────────────────────────────────────────────────────────────────────────

/** Patterns that suggest Microsoft 365 (work Outlook, not personal) */
const MICROSOFT_365_INDICATORS = [/\.onmicrosoft\.com$/];

/** Patterns that suggest Google Workspace */
const GOOGLE_WORKSPACE_INDICATORS = [/\.google\.com$/];

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detects the email provider from a recipient's email address domain.
 * Returns the provider ID or null if unknown.
 *
 * @example
 * detectProviderFromEmail('hello@gmail.com') // → 'gmail'
 * detectProviderFromEmail('user@yandex.ru')  // → 'yandex'
 * detectProviderFromEmail('me@company.com')  // → null (unknown custom domain)
 */
export function detectProviderFromEmail(email: string): string | null {
  if (!email || !email.includes('@')) return null;

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;

  // 1. Direct domain match
  const directMatch = DOMAIN_TO_PROVIDER[domain];
  if (directMatch) return directMatch;

  // 2. Enterprise domain heuristics
  for (const pattern of MICROSOFT_365_INDICATORS) {
    if (pattern.test(domain)) return 'outlook-work';
  }
  for (const pattern of GOOGLE_WORKSPACE_INDICATORS) {
    if (pattern.test(domain)) return 'gmail';
  }

  // 3. Unknown custom domain (could be any server, show full list)
  return null;
}

/**
 * Returns all registered email domains for a given provider ID.
 * Useful for testing and documentation.
 */
export function getDomainsForProvider(providerId: string): string[] {
  return Object.entries(DOMAIN_TO_PROVIDER)
    .filter(([, id]) => id === providerId)
    .map(([domain]) => domain);
}
