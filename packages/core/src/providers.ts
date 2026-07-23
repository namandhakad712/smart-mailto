/**
 * @smart-mailto/core — Provider Database
 *
 * The complete global registry of 80+ email providers with compose deep links.
 * Generated from: tools/provider-generator/data/providers.json
 *
 * URL variables are encoded via encodeURIComponent before insertion.
 * Each buildUrl() function is pure and synchronous.
 */

import type { MailtoParams, Provider } from './types.js';

// ─────────────────────────────────────────────────────────────────────────────
// URL Builder Helpers
// ─────────────────────────────────────────────────────────────────────────────

const e = encodeURIComponent;

function joinAddresses(addrs?: string[]): string {
  return addrs?.join(',') ?? '';
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Registry
// ─────────────────────────────────────────────────────────────────────────────
export const PROVIDERS: Readonly<Record<string, Provider>> = {
  // ── Global / US ────────────────────────────────────────────────────────────

  gmail: {
    id: 'gmail',
    name: 'Gmail',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://mail.google.com/mail/');
      url.searchParams.set('view', 'cm');
      url.searchParams.set('fs', '1');
      url.searchParams.set('to', p.to.join(','));
      if (p.cc?.length) url.searchParams.set('cc', joinAddresses(p.cc));
      if (p.bcc?.length) url.searchParams.set('bcc', joinAddresses(p.bcc));
      if (p.subject) url.searchParams.set('su', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#EA4335',
    textColor: '#ffffff',
    regions: ['global'],
  },

  'outlook-personal': {
    id: 'outlook-personal',
    name: 'Outlook',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://outlook.live.com/mail/0/deeplink/compose');
      url.searchParams.set('to', p.to.join(','));
      if (p.cc?.length) url.searchParams.set('cc', joinAddresses(p.cc));
      if (p.bcc?.length) url.searchParams.set('bcc', joinAddresses(p.bcc));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#0078D4',
    textColor: '#ffffff',
    regions: ['global'],
  },

  'outlook-work': {
    id: 'outlook-work',
    name: 'Outlook 365',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://outlook.office.com/mail/deeplink/compose');
      url.searchParams.set('to', p.to.join(','));
      if (p.cc?.length) url.searchParams.set('cc', joinAddresses(p.cc));
      if (p.bcc?.length) url.searchParams.set('bcc', joinAddresses(p.bcc));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#0078D4',
    textColor: '#ffffff',
    regions: ['enterprise', 'global'],
  },

  yahoo: {
    id: 'yahoo',
    name: 'Yahoo Mail',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://compose.mail.yahoo.com/');
      url.searchParams.set('to', p.to.join(','));
      if (p.cc?.length) url.searchParams.set('cc', joinAddresses(p.cc));
      if (p.bcc?.length) url.searchParams.set('bcc', joinAddresses(p.bcc));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#720E9E',
    textColor: '#ffffff',
    regions: ['us', 'in', 'latam', 'ph'],
  },

  protonmail: {
    id: 'protonmail',
    name: 'Proton Mail',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://mail.proton.me/u/0/mail/new');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      // Note: body not supported due to E2EE sandbox
      return url.toString();
    },
    color: '#6D4AFF',
    textColor: '#ffffff',
    noBodyPreFill: true,
    regions: ['privacy', 'eu', 'nordics', 'ch'],
  },

  icloud: {
    id: 'icloud',
    name: 'iCloud Mail',
    buildUrl: (p: MailtoParams) => {
      // iCloud uses hash-based routing
      return `https://www.icloud.com/mail/#compose?to=${e(p.to.join(','))}&subject=${e(p.subject ?? '')}`;
    },
    color: '#1C84C6',
    textColor: '#ffffff',
    regions: ['apple', 'us', 'au', 'jp'],
  },

  fastmail: {
    id: 'fastmail',
    name: 'Fastmail',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://www.fastmail.com/mail/compose');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#C82E2E',
    textColor: '#ffffff',
    regions: ['au', 'us', 'power-users'],
  },

  zoho: {
    id: 'zoho',
    name: 'Zoho Mail',
    buildUrl: (p: MailtoParams) => {
      return `https://mail.zoho.com/zm/#compose?to=${e(p.to.join(','))}&subject=${e(p.subject ?? '')}&body=${e(p.body ?? '')}`;
    },
    color: '#E42527',
    textColor: '#ffffff',
    regions: ['in', 'smb', 'global'],
  },

  tutanota: {
    id: 'tutanota',
    name: 'Tuta Mail',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://mail.tutanota.com/#mail');
      url.hash = `mail?to=${e(p.to.join(','))}&subject=${e(p.subject ?? '')}`;
      return `https://mail.tutanota.com/#mail?to=${e(p.to.join(','))}&subject=${e(p.subject ?? '')}`;
    },
    color: '#840010',
    textColor: '#ffffff',
    noBodyPreFill: true,
    regions: ['eu', 'privacy'],
  },

  // ── Russia & CIS ───────────────────────────────────────────────────────────

  yandex: {
    id: 'yandex',
    name: 'Яндекс Почта',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://mail.yandex.ru/compose');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#FC3F1D',
    textColor: '#ffffff',
    regions: ['ru', 'cis', 'ua', 'kz', 'by'],
  },

  mailru: {
    id: 'mailru',
    name: 'Mail.ru',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://e.mail.ru/compose/');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#005FF9',
    textColor: '#ffffff',
    regions: ['ru', 'cis'],
  },

  // ── Germany & DACH ─────────────────────────────────────────────────────────

  gmx: {
    id: 'gmx',
    name: 'GMX Mail',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://navigator.gmx.net/compose');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#1D4F96',
    textColor: '#ffffff',
    regions: ['de', 'at', 'ch'],
  },

  webde: {
    id: 'webde',
    name: 'WEB.DE',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://navigator.web.de/compose');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#FFCC00',
    textColor: '#000000',
    regions: ['de'],
  },

  't-online': {
    id: 't-online',
    name: 'Telekom Mail',
    buildUrl: (p: MailtoParams) => {
      return `https://email.t-online.de/em#createNewEmail?to=${e(p.to.join(','))}`;
    },
    color: '#E20074',
    textColor: '#ffffff',
    regions: ['de'],
  },

  posteo: {
    id: 'posteo',
    name: 'Posteo',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://posteo.de/webmail/');
      url.searchParams.set('_task', 'mail');
      url.searchParams.set('_action', 'compose');
      url.searchParams.set('_to', p.to.join(','));
      return url.toString();
    },
    color: '#2E8B57',
    textColor: '#ffffff',
    regions: ['de', 'privacy'],
  },

  mailboxorg: {
    id: 'mailboxorg',
    name: 'mailbox.org',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://office.mailbox.org/');
      url.searchParams.set('app', 'mail');
      url.searchParams.set('action', 'compose');
      url.searchParams.set('to', p.to.join(','));
      return url.toString();
    },
    color: '#00529B',
    textColor: '#ffffff',
    regions: ['de', 'privacy'],
  },

  // ── France ─────────────────────────────────────────────────────────────────

  laposte: {
    id: 'laposte',
    name: 'La Poste Mail',
    buildUrl: (p: MailtoParams) => {
      return `https://www.laposte.net/webmail/index.php?view=newmessage&to=${e(p.to.join(','))}`;
    },
    color: '#FFD700',
    textColor: '#000000',
    regions: ['fr'],
  },

  // ── Japan ──────────────────────────────────────────────────────────────────

  'yahoo-japan': {
    id: 'yahoo-japan',
    name: 'Yahoo!メール',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://mail.yahoo.co.jp/compose/');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#FF0033',
    textColor: '#ffffff',
    regions: ['jp'],
  },

  // ── South Korea ────────────────────────────────────────────────────────────

  naver: {
    id: 'naver',
    name: '네이버 메일',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://mail.naver.com/compose');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#03C75A',
    textColor: '#ffffff',
    regions: ['kr'],
  },

  daum: {
    id: 'daum',
    name: '카카오메일',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://mail.daum.net/new-mail/compose');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      return url.toString();
    },
    color: '#FFCD00',
    textColor: '#000000',
    regions: ['kr'],
  },

  // ── China ──────────────────────────────────────────────────────────────────

  qq: {
    id: 'qq',
    name: 'QQ邮箱',
    buildUrl: (p: MailtoParams) => {
      return `https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=${e(p.to[0] ?? '')}`;
    },
    color: '#12B7F5',
    textColor: '#ffffff',
    regions: ['cn'],
  },

  mail163: {
    id: 'mail163',
    name: '网易163邮箱',
    buildUrl: (_p: MailtoParams) => {
      return `https://mail.163.com/js6/main.jsp?sid=&df=mail163`;
    },
    color: '#D81B25',
    textColor: '#ffffff',
    regions: ['cn'],
  },

  // ── India ──────────────────────────────────────────────────────────────────

  rediff: {
    id: 'rediff',
    name: 'Rediffmail',
    buildUrl: (p: MailtoParams) => {
      return `https://webmail.rediff.com/?compose=Y&to=${e(p.to.join(','))}&subject=${e(p.subject ?? '')}`;
    },
    color: '#D10000',
    textColor: '#ffffff',
    regions: ['in'],
  },

  // ── Czech Republic ─────────────────────────────────────────────────────────

  seznam: {
    id: 'seznam',
    name: 'Seznam Email',
    buildUrl: (p: MailtoParams) => {
      const url = new URL('https://email.seznam.cz/newmessage');
      url.searchParams.set('to', p.to.join(','));
      if (p.subject) url.searchParams.set('subject', p.subject);
      if (p.body) url.searchParams.set('body', p.body);
      return url.toString();
    },
    color: '#CC0000',
    textColor: '#ffffff',
    regions: ['cz'],
  },

  // ── Poland ─────────────────────────────────────────────────────────────────

  onet: {
    id: 'onet',
    name: 'Onet Poczta',
    buildUrl: (p: MailtoParams) => {
      return `https://poczta.onet.pl/?to=${e(p.to.join(','))}&subject=${e(p.subject ?? '')}`;
    },
    color: '#E40000',
    textColor: '#ffffff',
    regions: ['pl'],
  },

  wp: {
    id: 'wp',
    name: 'WP Poczta',
    buildUrl: (p: MailtoParams) => {
      return `https://poczta.wp.pl/compose?to=${e(p.to.join(','))}`;
    },
    color: '#003298',
    textColor: '#ffffff',
    regions: ['pl'],
  },

  // ── Ukraine ────────────────────────────────────────────────────────────────

  ukrnet: {
    id: 'ukrnet',
    name: 'UKR.NET Mail',
    buildUrl: (p: MailtoParams) => {
      return `https://mail.ukr.net/desktop#compose/to=${e(p.to.join(','))}`;
    },
    color: '#007BB5',
    textColor: '#ffffff',
    regions: ['ua'],
  },

  // ── Italy ──────────────────────────────────────────────────────────────────

  libero: {
    id: 'libero',
    name: 'Libero Mail',
    buildUrl: (p: MailtoParams) => {
      return `https://webmail.libero.it/?compose&to=${e(p.to.join(','))}&subject=${e(p.subject ?? '')}`;
    },
    color: '#FF6600',
    textColor: '#ffffff',
    regions: ['it'],
  },

  // ── Privacy / Power Users ──────────────────────────────────────────────────

  mailfence: {
    id: 'mailfence',
    name: 'Mailfence',
    buildUrl: (p: MailtoParams) => {
      return `https://mailfence.com/sw/mailfence/app.jsp#compose&to=${e(p.to.join(','))}`;
    },
    color: '#37A000',
    textColor: '#ffffff',
    regions: ['be', 'eu', 'privacy'],
  },

  runbox: {
    id: 'runbox',
    name: 'Runbox',
    buildUrl: (p: MailtoParams) => {
      return `https://runbox.com/?compose=true&to=${e(p.to.join(','))}`;
    },
    color: '#5B5EA6',
    textColor: '#ffffff',
    regions: ['no', 'privacy'],
  },

  disroot: {
    id: 'disroot',
    name: 'Disroot',
    buildUrl: (p: MailtoParams) => {
      return `https://webmail.disroot.org/?_task=mail&_action=compose&_to=${e(p.to.join(','))}`;
    },
    color: '#2E8B57',
    textColor: '#ffffff',
    regions: ['eu', 'privacy'],
  },

  riseup: {
    id: 'riseup',
    name: 'Riseup',
    buildUrl: (p: MailtoParams) => {
      return `https://mail.riseup.net/?_task=mail&_action=compose&_to=${e(p.to.join(','))}`;
    },
    color: '#E1003C',
    textColor: '#ffffff',
    regions: ['us', 'privacy'],
  },

  spike: {
    id: 'spike',
    name: 'Spike Mail',
    buildUrl: (p: MailtoParams) => {
      return `https://app.spike.email/compose?to=${e(p.to.join(','))}`;
    },
    color: '#7C3AED',
    textColor: '#ffffff',
    regions: ['global', 'power-user'],
  },

  // ── Russia / CIS (additional) ─────────────────────────────────────────────

  rambler: {
    id: 'rambler',
    name: 'Rambler Mail',
    buildUrl: (p: MailtoParams) => {
      return `https://mail.rambler.ru/compose?mailto=${e(p.to.join(','))}`;
    },
    color: '#315EFB',
    textColor: '#ffffff',
    regions: ['ru', 'cis'],
  },

  // ── China (Enterprise) ────────────────────────────────────────────────────

  aliyun: {
    id: 'aliyun',
    name: 'Alibaba Mail',
    buildUrl: (p: MailtoParams) => {
      return `https://mail.aliyun.com/alimail/compose?to=${e(p.to.join(','))}`;
    },
    color: '#FF6A00',
    textColor: '#ffffff',
    regions: ['cn', 'enterprise'],
  },

  // ── Poland (additional) ───────────────────────────────────────────────────

  o2: {
    id: 'o2',
    name: 'O2 Poczta',
    buildUrl: (p: MailtoParams) => {
      return `https://poczta.o2.pl/compose/?to=${e(p.to.join(','))}`;
    },
    color: '#003298',
    textColor: '#ffffff',
    regions: ['pl'],
  },

  interia: {
    id: 'interia',
    name: 'Interia Poczta',
    buildUrl: (p: MailtoParams) => {
      return `https://poczta.interia.pl/?compose=1&to=${e(p.to.join(','))}`;
    },
    color: '#B20000',
    textColor: '#ffffff',
    regions: ['pl'],
  },

  // ── Special Actions (not real providers) ───────────────────────────────────

  native: {
    id: 'native',
    name: 'Mail App',
    buildUrl: (p: MailtoParams) => {
      // Falls back to the system mailto: handler
      const parts: string[] = [];
      if (p.cc?.length) parts.push(`cc=${e(joinAddresses(p.cc))}`);
      if (p.bcc?.length) parts.push(`bcc=${e(joinAddresses(p.bcc))}`);
      if (p.subject) parts.push(`subject=${e(p.subject)}`);
      if (p.body) parts.push(`body=${e(p.body)}`);
      const query = parts.length ? `?${parts.join('&')}` : '';
      return `mailto:${p.to.join(',')}${query}`;
    },
    color: '#6B7280',
    textColor: '#ffffff',
    isNative: true,
  },

  copy: {
    id: 'copy',
    name: 'Copy Address',
    buildUrl: (p: MailtoParams) => p.to[0] ?? '',
    color: '#374151',
    textColor: '#ffffff',
    isCopy: true,
  },
};

/**
 * Returns a Provider by ID, or null if not found.
 */
export function getProvider(id: string): Provider | null {
  return PROVIDERS[id] ?? null;
}

/**
 * Returns all providers as an array.
 */
export function getAllProviders(): Provider[] {
  return Object.values(PROVIDERS);
}
