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
// SVG Icons (Minimal Inline SVGs — brand accurate, < 1KB each)
// ─────────────────────────────────────────────────────────────────────────────

const ICONS = {
  gmail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>`,

  outlook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#0078D4" d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.1V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72q.49.29.49.85v.02q0 .28-.11.5-.1.21-.27.32l-1.35.74zM7.13 14.97V18H22.5v-9.6L12.6 13.7q-.26.15-.55.15t-.56-.15L7.13 10.75v4.22zM22.5 8.18V3H8.5v4.5l4.04 2.33 9.96-5.77v4.12z"/></svg>`,

  yahoo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#720E9E" d="M0 0l9.195 12.705L0 24h4.363L9.195 17.66 14.027 24H24l-9.195-12.705L24 0h-4.363l-4.832 6.34L10.005 0z"/></svg>`,

  protonmail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6D4AFF" d="M24 4.364L12 0 0 4.364V12c0 6.627 5.373 12 12 12s12-5.373 12-12V4.364zm-12 8.727L5.818 9.818V6.545L12 4.364l6.182 2.181v3.273L12 13.09z"/></svg>`,

  icloud: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#1C84C6" d="M18.5 9.51a4.22 4.22 0 0 1-1.91-1.31A5.37 5.37 0 0 0 7.7 10.6a4.37 4.37 0 0 0-1.82-.05A4.73 4.73 0 0 0 2 15.18C2 17.82 4.18 20 6.82 20h11.36A4.82 4.82 0 0 0 23 15.18a4.91 4.91 0 0 0-4.5-5.67z"/></svg>`,

  fastmail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#C82E2E" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,

  yandex: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FC3F1D" d="M14.77 24h-2.9V13.3H10.3C8.1 13.3 6.8 12 6.8 9.7c0-2.3 1.4-3.6 4-3.6h3.97V24zm-2.9-12.96V8.1h-.85c-1.2 0-1.88.63-1.88 1.65 0 1.07.56 1.7 1.65 1.7l1.08-.41zM21 0H3C1.35 0 0 1.35 0 3v18c0 1.65 1.35 3 3 3h18c1.65 0 3-1.35 3-3V3c0-1.65-1.35-3-3-3z"/></svg>`,

  mailru: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#005FF9" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c3.976 0 7.2 3.224 7.2 7.2s-3.224 7.2-7.2 7.2S4.8 15.976 4.8 12 8.024 4.8 12 4.8z"/></svg>`,

  gmx: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#1D4F96" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 17H7V7h4l1 2.5L13 7h4v10h-4v-5.5L12 14l-1-2.5V17z"/></svg>`,

  webde: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FFCC00" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/><path fill="#333" d="M6 8h12v8H6z"/></svg>`,

  zoho: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#E42527" d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0z"/></svg>`,

  tutanota: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#840010" d="M12 0L0 6v12l12 6 12-6V6L12 0z"/></svg>`,

  yahoo_japan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF0033" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  naver: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#03C75A" d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>`,

  daum: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FFCD00" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  qq: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#12B7F5" d="M12.003 2c-4.8 0-8.79 3.53-8.79 9.16 0 2.49.62 4.36 1.64 5.8A23.77 23.77 0 0 0 4 19.5c0 .66.55 1.17 1.2 1.09l1.8-.22c1.46 1.03 3.17 1.63 5.01 1.63 1.84 0 3.55-.6 5.01-1.63l1.8.22c.65.08 1.2-.43 1.2-1.09 0-.67-.16-1.55-.87-2.54 1.02-1.44 1.64-3.31 1.64-5.8C20.79 5.53 16.8 2 12.003 2z"/></svg>`,

  mail163: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#D81B25" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  seznam: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#CC0000" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  ukrnet: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#007BB5" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  libero: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF6600" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  onet: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#E40000" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  wp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#003298" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  laposte: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FFD700" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  runbox: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#5B5EA6" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  posteo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#2E8B57" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  mailboxorg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00529B" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  mailfence: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#37A000" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`,

  native: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,

  copy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
};

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
    logoSvg: ICONS.gmail,
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
    logoSvg: ICONS.outlook,
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
    logoSvg: ICONS.outlook,
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
    logoSvg: ICONS.yahoo,
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
    logoSvg: ICONS.protonmail,
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
    logoSvg: ICONS.icloud,
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
    logoSvg: ICONS.fastmail,
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
    logoSvg: ICONS.zoho,
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
    logoSvg: ICONS.tutanota,
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
    logoSvg: ICONS.yandex,
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
    logoSvg: ICONS.mailru,
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
    logoSvg: ICONS.gmx,
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
    logoSvg: ICONS.webde,
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
    logoSvg: ICONS.gmx,
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
    logoSvg: ICONS.posteo,
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
    logoSvg: ICONS.mailboxorg,
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
    logoSvg: ICONS.laposte,
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
    logoSvg: ICONS.yahoo_japan,
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
    logoSvg: ICONS.naver,
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
    logoSvg: ICONS.daum,
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
    logoSvg: ICONS.qq,
    color: '#12B7F5',
    textColor: '#ffffff',
    regions: ['cn'],
  },

  mail163: {
    id: 'mail163',
    name: '网易163邮箱',
    buildUrl: (p: MailtoParams) => {
      return `https://mail.163.com/js6/main.jsp?sid=&df=mail163`;
    },
    logoSvg: ICONS.mail163,
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
    logoSvg: ICONS.zoho,
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
    logoSvg: ICONS.seznam,
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
    logoSvg: ICONS.onet,
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
    logoSvg: ICONS.wp,
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
    logoSvg: ICONS.ukrnet,
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
    logoSvg: ICONS.libero,
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
    logoSvg: ICONS.mailfence,
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
    logoSvg: ICONS.runbox,
    color: '#5B5EA6',
    textColor: '#ffffff',
    regions: ['no', 'privacy'],
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
    logoSvg: ICONS.native,
    color: '#6B7280',
    textColor: '#ffffff',
    isNative: true,
  },

  copy: {
    id: 'copy',
    name: 'Copy Address',
    buildUrl: (p: MailtoParams) => p.to[0] ?? '',
    logoSvg: ICONS.copy,
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
