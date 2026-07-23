/**
 * @smart-mailto/core — Geo-Detection Engine
 *
 * Zero-latency, zero-API browser heuristics for provider geo-ordering.
 * Uses only: Intl.DateTimeFormat, navigator.language, navigator.languages, navigator.userAgent.
 *
 * Execution time: < 1ms.
 * Privacy: Zero network requests. Uses only data the browser already exposes.
 */

import type { GeoSignals } from './types.js';

// ─────────────────────────────────────────────────────────────────────────────
// Signal Collection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Collects all browser geo-signals in a single synchronous call.
 */
export function collectGeoSignals(): GeoSignals {
  // Safe Intl access (available in all modern browsers)
  let timeZone = 'UTC';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    // Intl not available (very old browser)
  }

  const locale = typeof navigator !== 'undefined' ? (navigator.language ?? 'en') : 'en';

  const locales: readonly string[] =
    typeof navigator !== 'undefined' && navigator.languages ? navigator.languages : [locale];

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  return { timeZone, locale, locales, isMobile, isIOS, isAndroid };
}

// ─────────────────────────────────────────────────────────────────────────────
// Timezone → Provider Priority Map
// ─────────────────────────────────────────────────────────────────────────────

/** Maps IANA timezone strings to ordered provider ID arrays */
export const TIMEZONE_PROVIDERS: Readonly<Record<string, string[]>> = {
  // ── Russia & CIS ────────────────────────────────────────────────────────
  'Europe/Moscow': ['yandex', 'mailru', 'gmail', 'outlook-personal'],
  'Europe/Kaliningrad': ['yandex', 'mailru', 'gmail', 'outlook-personal'],
  'Europe/Samara': ['yandex', 'mailru', 'gmail'],
  'Asia/Yekaterinburg': ['yandex', 'mailru', 'gmail'],
  'Asia/Omsk': ['yandex', 'mailru', 'gmail'],
  'Asia/Krasnoyarsk': ['yandex', 'mailru', 'gmail'],
  'Asia/Irkutsk': ['yandex', 'mailru', 'gmail'],
  'Asia/Yakutsk': ['yandex', 'mailru', 'gmail'],
  'Asia/Vladivostok': ['yandex', 'mailru', 'gmail'],
  'Asia/Sakhalin': ['yandex', 'mailru', 'gmail'],
  'Asia/Magadan': ['yandex', 'mailru', 'gmail'],
  'Asia/Kamchatka': ['yandex', 'mailru', 'gmail'],
  'Europe/Minsk': ['yandex', 'mailru', 'gmail'], // Belarus
  'Asia/Tashkent': ['yandex', 'mailru', 'gmail'], // Uzbekistan
  'Asia/Samarkand': ['yandex', 'mailru', 'gmail'],
  'Asia/Almaty': ['yandex', 'mailru', 'gmail'], // Kazakhstan
  'Asia/Qyzylorda': ['yandex', 'mailru', 'gmail'],
  'Asia/Aqtau': ['yandex', 'mailru', 'gmail'],
  'Asia/Aqtobe': ['yandex', 'mailru', 'gmail'],
  'Asia/Baku': ['yandex', 'mailru', 'gmail'], // Azerbaijan
  'Asia/Yerevan': ['yandex', 'mailru', 'gmail'], // Armenia
  'Asia/Tbilisi': ['yandex', 'mailru', 'gmail'], // Georgia
  'Asia/Dushanbe': ['yandex', 'mailru', 'gmail'], // Tajikistan
  'Asia/Ashgabat': ['yandex', 'mailru', 'gmail'], // Turkmenistan
  'Asia/Bishkek': ['yandex', 'mailru', 'gmail'], // Kyrgyzstan

  // ── Ukraine ──────────────────────────────────────────────────────────────
  'Europe/Kiev': ['gmail', 'ukrnet', 'outlook-personal', 'yandex'],
  'Europe/Kyiv': ['gmail', 'ukrnet', 'outlook-personal'],
  'Europe/Uzhgorod': ['gmail', 'ukrnet', 'outlook-personal'],
  'Europe/Zaporozhye': ['gmail', 'ukrnet', 'outlook-personal'],

  // ── China ─────────────────────────────────────────────────────────────────
  'Asia/Shanghai': ['qq', 'mail163', 'gmail', 'outlook-personal'],
  'Asia/Urumqi': ['qq', 'mail163', 'gmail'],
  'Asia/Harbin': ['qq', 'mail163', 'gmail'],
  'Asia/Chongqing': ['qq', 'mail163', 'gmail'],

  // ── Japan ─────────────────────────────────────────────────────────────────
  'Asia/Tokyo': ['yahoo-japan', 'gmail', 'icloud', 'outlook-personal'],

  // ── South Korea ───────────────────────────────────────────────────────────
  'Asia/Seoul': ['naver', 'daum', 'gmail', 'outlook-personal'],

  // ── India ─────────────────────────────────────────────────────────────────
  'Asia/Kolkata': ['gmail', 'yahoo', 'zoho', 'rediff', 'outlook-personal'],
  'Asia/Calcutta': ['gmail', 'yahoo', 'zoho', 'rediff'],

  // ── Germany / DACH ────────────────────────────────────────────────────────
  'Europe/Berlin': ['gmx', 'webde', 'gmail', 't-online', 'outlook-personal', 'protonmail'],
  'Europe/Vienna': ['gmx', 'gmail', 'outlook-personal', 'protonmail'],
  'Europe/Zurich': ['protonmail', 'gmail', 'gmx', 'outlook-personal', 'mailboxorg'],
  'Europe/Vaduz': ['protonmail', 'gmail', 'gmx'], // Liechtenstein

  // ── France ────────────────────────────────────────────────────────────────
  'Europe/Paris': ['gmail', 'outlook-personal', 'laposte', 'protonmail'],

  // ── Italy ─────────────────────────────────────────────────────────────────
  'Europe/Rome': ['libero', 'gmail', 'outlook-personal'],

  // ── Poland ────────────────────────────────────────────────────────────────
  'Europe/Warsaw': ['onet', 'wp', 'gmail', 'outlook-personal'],

  // ── Czech Republic ────────────────────────────────────────────────────────
  'Europe/Prague': ['seznam', 'gmail', 'outlook-personal'],

  // ── Netherlands ───────────────────────────────────────────────────────────
  'Europe/Amsterdam': ['gmail', 'outlook-personal', 'protonmail'],

  // ── Belgium ───────────────────────────────────────────────────────────────
  'Europe/Brussels': ['gmail', 'outlook-personal', 'mailfence', 'protonmail'],

  // ── Nordics ───────────────────────────────────────────────────────────────
  'Europe/Stockholm': ['gmail', 'outlook-personal', 'protonmail'],
  'Europe/Oslo': ['runbox', 'gmail', 'outlook-personal', 'protonmail'],
  'Europe/Copenhagen': ['gmail', 'outlook-personal', 'protonmail'],
  'Europe/Helsinki': ['gmail', 'outlook-personal', 'protonmail'],
  'Atlantic/Reykjavik': ['gmail', 'outlook-personal', 'protonmail'],

  // ── UK / Ireland ──────────────────────────────────────────────────────────
  'Europe/London': ['gmail', 'outlook-personal', 'yahoo', 'icloud'],
  'Europe/Dublin': ['gmail', 'outlook-personal', 'icloud'],
  'Europe/Isle_of_Man': ['gmail', 'outlook-personal'],
  'Europe/Guernsey': ['gmail', 'outlook-personal'],
  'Europe/Jersey': ['gmail', 'outlook-personal'],

  // ── Iberian Peninsula ─────────────────────────────────────────────────────
  'Europe/Madrid': ['gmail', 'outlook-personal', 'yahoo'],
  'Europe/Lisbon': ['gmail', 'outlook-personal', 'yahoo'],
  'Atlantic/Canary': ['gmail', 'outlook-personal'],
  'Atlantic/Azores': ['gmail', 'outlook-personal'],

  // ── Eastern Europe ────────────────────────────────────────────────────────
  'Europe/Bucharest': ['gmail', 'yahoo', 'outlook-personal'], // Romania
  'Europe/Sofia': ['gmail', 'yahoo', 'outlook-personal'], // Bulgaria
  'Europe/Athens': ['gmail', 'yahoo', 'outlook-personal'], // Greece
  'Europe/Budapest': ['gmail', 'outlook-personal', 'yahoo'], // Hungary
  'Europe/Bratislava': ['seznam', 'gmail', 'outlook-personal'], // Slovakia
  'Europe/Ljubljana': ['gmail', 'outlook-personal'], // Slovenia
  'Europe/Zagreb': ['gmail', 'outlook-personal'], // Croatia
  'Europe/Belgrade': ['gmail', 'yahoo', 'outlook-personal'], // Serbia
  'Europe/Sarajevo': ['gmail', 'yahoo', 'outlook-personal'], // Bosnia
  'Europe/Skopje': ['gmail', 'yahoo', 'outlook-personal'], // N. Macedonia
  'Europe/Podgorica': ['gmail', 'yahoo', 'outlook-personal'], // Montenegro
  'Europe/Tirane': ['gmail', 'yahoo', 'outlook-personal'], // Albania
  'Europe/Riga': ['gmail', 'outlook-personal', 'yandex'], // Latvia
  'Europe/Tallinn': ['gmail', 'outlook-personal'], // Estonia
  'Europe/Vilnius': ['gmail', 'outlook-personal'], // Lithuania
  'Europe/Chisinau': ['gmail', 'yandex', 'mailru'], // Moldova

  // ── Turkey ────────────────────────────────────────────────────────────────
  'Europe/Istanbul': ['gmail', 'yandex', 'outlook-personal', 'yahoo'],

  // ── Middle East ───────────────────────────────────────────────────────────
  'Asia/Dubai': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Abu_Dhabi': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Riyadh': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Kuwait': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Qatar': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Bahrain': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Muscat': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Jerusalem': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Tel_Aviv': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Beirut': ['gmail', 'yahoo', 'outlook-personal'],
  'Asia/Damascus': ['gmail', 'yahoo', 'outlook-personal'],
  'Asia/Amman': ['gmail', 'yahoo', 'outlook-personal'],
  'Asia/Baghdad': ['gmail', 'yahoo', 'outlook-personal'],
  'Asia/Tehran': ['gmail', 'yahoo', 'outlook-personal'],

  // ── South / Southeast Asia ────────────────────────────────────────────────
  'Asia/Karachi': ['gmail', 'yahoo', 'outlook-personal'], // Pakistan
  'Asia/Dhaka': ['gmail', 'yahoo', 'outlook-personal'], // Bangladesh
  'Asia/Colombo': ['gmail', 'yahoo', 'outlook-personal'], // Sri Lanka
  'Asia/Kathmandu': ['gmail', 'yahoo', 'outlook-personal'], // Nepal
  'Asia/Thimphu': ['gmail', 'outlook-personal'], // Bhutan
  'Asia/Yangon': ['gmail', 'yahoo', 'outlook-personal'], // Myanmar
  'Asia/Bangkok': ['gmail', 'outlook-personal', 'yahoo'], // Thailand
  'Asia/Phnom_Penh': ['gmail', 'yahoo', 'outlook-personal'], // Cambodia
  'Asia/Vientiane': ['gmail', 'yahoo', 'outlook-personal'], // Laos
  'Asia/Ho_Chi_Minh': ['gmail', 'yahoo', 'outlook-personal'], // Vietnam
  'Asia/Hanoi': ['gmail', 'yahoo', 'outlook-personal'],
  'Asia/Saigon': ['gmail', 'yahoo', 'outlook-personal'],
  'Asia/Singapore': ['gmail', 'outlook-personal', 'yahoo'],
  'Asia/Kuala_Lumpur': ['gmail', 'outlook-personal', 'yahoo'], // Malaysia
  'Asia/Jakarta': ['gmail', 'yahoo', 'outlook-personal'], // Indonesia
  'Asia/Makassar': ['gmail', 'yahoo', 'outlook-personal'],
  'Asia/Jayapura': ['gmail', 'yahoo', 'outlook-personal'],
  'Asia/Manila': ['yahoo', 'gmail', 'outlook-personal'], // Philippines — Yahoo is king

  // ── Latin America ─────────────────────────────────────────────────────────
  'America/Sao_Paulo': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Fortaleza': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Recife': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Belem': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Manaus': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Campo_Grande': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Cuiaba': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Argentina/Buenos_Aires': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Argentina/Cordoba': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Bogota': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Lima': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Santiago': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Mexico_City': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Monterrey': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Caracas': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Asuncion': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Montevideo': ['gmail', 'outlook-personal', 'yahoo'],
  'America/La_Paz': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Guayaquil': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Panama': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Costa_Rica': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Guatemala': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Tegucigalpa': ['gmail', 'outlook-personal', 'yahoo'],
  'America/El_Salvador': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Managua': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Havana': ['gmail', 'outlook-personal'],
  'America/Santo_Domingo': ['gmail', 'yahoo', 'outlook-personal'],
  'America/Puerto_Rico': ['gmail', 'yahoo', 'icloud', 'outlook-personal'],

  // ── USA ───────────────────────────────────────────────────────────────────
  'America/New_York': ['gmail', 'outlook-personal', 'yahoo', 'icloud', 'native'],
  'America/Detroit': ['gmail', 'outlook-personal', 'yahoo', 'icloud', 'native'],
  'America/Indiana/Indianapolis': ['gmail', 'outlook-personal', 'yahoo', 'icloud'],
  'America/Chicago': ['gmail', 'outlook-personal', 'yahoo', 'icloud', 'native'],
  'America/Menominee': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Denver': ['gmail', 'outlook-personal', 'yahoo', 'icloud'],
  'America/Phoenix': ['gmail', 'outlook-personal', 'yahoo', 'icloud'],
  'America/Los_Angeles': ['gmail', 'outlook-personal', 'yahoo', 'icloud', 'native'],
  'America/Anchorage': ['gmail', 'outlook-personal', 'icloud'],
  'America/Adak': ['gmail', 'outlook-personal'],
  'Pacific/Honolulu': ['gmail', 'icloud', 'yahoo', 'outlook-personal'],

  // ── Canada ────────────────────────────────────────────────────────────────
  'America/Toronto': ['gmail', 'outlook-personal', 'yahoo', 'icloud'],
  'America/Vancouver': ['gmail', 'outlook-personal', 'yahoo', 'icloud'],
  'America/Winnipeg': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Edmonton': ['gmail', 'outlook-personal', 'yahoo', 'icloud'],
  'America/Halifax': ['gmail', 'outlook-personal', 'yahoo'],
  'America/St_Johns': ['gmail', 'outlook-personal', 'yahoo'],
  'America/Regina': ['gmail', 'outlook-personal', 'yahoo'],

  // ── Australia ─────────────────────────────────────────────────────────────
  'Australia/Sydney': ['gmail', 'outlook-personal', 'fastmail', 'icloud'],
  'Australia/Melbourne': ['gmail', 'outlook-personal', 'fastmail', 'icloud'],
  'Australia/Brisbane': ['gmail', 'outlook-personal', 'fastmail', 'icloud'],
  'Australia/Perth': ['gmail', 'outlook-personal', 'fastmail', 'icloud'],
  'Australia/Adelaide': ['gmail', 'outlook-personal', 'fastmail'],
  'Australia/Darwin': ['gmail', 'outlook-personal', 'fastmail'],
  'Australia/Hobart': ['gmail', 'outlook-personal', 'fastmail'],

  // ── New Zealand ───────────────────────────────────────────────────────────
  'Pacific/Auckland': ['gmail', 'outlook-personal', 'icloud', 'fastmail'],
  'Pacific/Chatham': ['gmail', 'outlook-personal'],

  // ── Africa ────────────────────────────────────────────────────────────────
  'Africa/Cairo': ['gmail', 'outlook-personal', 'yahoo'], // Egypt
  'Africa/Lagos': ['gmail', 'yahoo', 'outlook-personal'], // Nigeria
  'Africa/Johannesburg': ['gmail', 'outlook-personal', 'yahoo'], // South Africa
  'Africa/Nairobi': ['gmail', 'yahoo', 'outlook-personal'], // Kenya
  'Africa/Accra': ['gmail', 'yahoo', 'outlook-personal'], // Ghana
  'Africa/Casablanca': ['gmail', 'yahoo', 'outlook-personal'], // Morocco
  'Africa/Tunis': ['gmail', 'yahoo', 'outlook-personal'], // Tunisia
  'Africa/Algiers': ['gmail', 'yahoo', 'outlook-personal'], // Algeria
  'Africa/Tripoli': ['gmail', 'yahoo', 'outlook-personal'], // Libya
  'Africa/Addis_Ababa': ['gmail', 'yahoo', 'outlook-personal'], // Ethiopia
  'Africa/Dar_es_Salaam': ['gmail', 'yahoo', 'outlook-personal'], // Tanzania
  'Africa/Kampala': ['gmail', 'yahoo', 'outlook-personal'], // Uganda
  'Africa/Khartoum': ['gmail', 'yahoo', 'outlook-personal'], // Sudan
  'Africa/Kinshasa': ['gmail', 'yahoo', 'outlook-personal'], // DRC
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Locale → Provider Override Map
// ─────────────────────────────────────────────────────────────────────────────

/** Locale-based provider ordering — overrides timezone when confidence is higher */
export const LOCALE_PROVIDERS: Readonly<Record<string, string[]>> = {
  ru: ['yandex', 'mailru', 'gmail', 'outlook-personal'],
  'ru-RU': ['yandex', 'mailru', 'gmail', 'outlook-personal'],
  'ru-UA': ['gmail', 'ukrnet', 'yandex', 'mailru'],
  'ru-BY': ['yandex', 'mailru', 'gmail'],
  'ru-KZ': ['yandex', 'mailru', 'gmail'],
  zh: ['qq', 'mail163', 'gmail'],
  'zh-CN': ['qq', 'mail163', 'gmail'],
  'zh-TW': ['gmail', 'yahoo', 'outlook-personal'],
  'zh-HK': ['gmail', 'yahoo', 'outlook-personal'],
  ja: ['yahoo-japan', 'gmail', 'icloud', 'outlook-personal'],
  'ja-JP': ['yahoo-japan', 'gmail', 'icloud'],
  ko: ['naver', 'daum', 'gmail', 'outlook-personal'],
  'ko-KR': ['naver', 'daum', 'gmail'],
  de: ['gmx', 'webde', 'gmail', 't-online', 'outlook-personal'],
  'de-DE': ['gmx', 'webde', 'gmail', 't-online'],
  'de-AT': ['gmx', 'gmail', 'outlook-personal'],
  'de-CH': ['protonmail', 'gmail', 'gmx', 'mailboxorg'],
  fr: ['gmail', 'outlook-personal', 'laposte'],
  'fr-FR': ['gmail', 'outlook-personal', 'laposte'],
  'fr-CH': ['protonmail', 'gmail', 'outlook-personal'],
  'fr-BE': ['gmail', 'mailfence', 'outlook-personal'],
  it: ['libero', 'gmail', 'outlook-personal'],
  'it-IT': ['libero', 'gmail', 'outlook-personal'],
  pl: ['onet', 'wp', 'gmail', 'outlook-personal'],
  'pl-PL': ['onet', 'wp', 'gmail'],
  cs: ['seznam', 'gmail', 'outlook-personal'],
  'cs-CZ': ['seznam', 'gmail'],
  uk: ['gmail', 'ukrnet', 'outlook-personal'],
  'uk-UA': ['gmail', 'ukrnet', 'outlook-personal'],
  tr: ['gmail', 'yandex', 'outlook-personal', 'yahoo'],
  'tr-TR': ['gmail', 'yandex', 'outlook-personal'],
  nb: ['runbox', 'gmail', 'protonmail'],
  no: ['runbox', 'gmail', 'protonmail'],
  fi: ['gmail', 'outlook-personal', 'protonmail'],
  sv: ['gmail', 'outlook-personal', 'protonmail'],
  da: ['gmail', 'outlook-personal', 'protonmail'],
  nl: ['gmail', 'outlook-personal', 'protonmail'],
  'nl-NL': ['gmail', 'outlook-personal', 'protonmail'],
  'nl-BE': ['gmail', 'mailfence', 'outlook-personal'],
};

/** Default provider ordering (global fallback) */
export const DEFAULT_PROVIDERS = [
  'gmail',
  'outlook-personal',
  'yahoo',
  'icloud',
  'native',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the ordered list of provider IDs based on browser geo-signals.
 * Priority: localStorage preference → email domain → timezone → locale → default.
 *
 * @returns Ordered provider ID array (does NOT include 'copy' — caller appends it)
 */
export function getGeoOrderedProviderIds(signals: GeoSignals): string[] {
  const { timeZone, locale, locales } = signals;

  // 1. Exact timezone match
  const tzMatch = TIMEZONE_PROVIDERS[timeZone];
  if (tzMatch) return tzMatch;

  // 2. Timezone prefix match (e.g. "America/Argentina/Buenos_Aires_Summer" → try "America/Argentina/Buenos_Aires")
  //    Falls back by shortening the timezone path one segment at a time.
  const tzParts = timeZone.split('/');
  while (tzParts.length > 1) {
    tzParts.pop();
    const parentPath = tzParts.join('/');
    const prefixMatch = TIMEZONE_PROVIDERS[parentPath];
    if (prefixMatch) return prefixMatch;
  }

  // 3. Exact locale match
  const localeMatch = LOCALE_PROVIDERS[locale];
  if (localeMatch) return localeMatch;

  // 4. Try each language from navigator.languages
  for (const lang of locales) {
    const match = LOCALE_PROVIDERS[lang];
    if (match) return match;

    // Short locale (e.g. "de" from "de-DE")
    const shortLang = lang.split('-')[0];
    if (shortLang) {
      const shortMatch = LOCALE_PROVIDERS[shortLang];
      if (shortMatch) return shortMatch;
    }
  }

  // 5. Global default
  return [...DEFAULT_PROVIDERS];
}

/**
 * Returns the detected "region" label for display/debugging purposes.
 */
export function detectRegionLabel(signals: GeoSignals): string {
  const { timeZone, locale } = signals;
  if (timeZone.startsWith('Europe/Moscow') || locale === 'ru') return 'Russia/CIS';
  if (timeZone.startsWith('Asia/Shanghai') || locale.startsWith('zh-CN')) return 'China';
  if (timeZone === 'Asia/Tokyo' || locale.startsWith('ja')) return 'Japan';
  if (timeZone === 'Asia/Seoul' || locale.startsWith('ko')) return 'South Korea';
  if (timeZone === 'Asia/Kolkata') return 'India';
  if (timeZone.startsWith('Europe/Berlin') || locale.startsWith('de')) return 'Germany/DACH';
  if (timeZone === 'Europe/Paris' || locale.startsWith('fr')) return 'France';
  if (timeZone === 'Europe/Warsaw' || locale.startsWith('pl')) return 'Poland';
  if (timeZone === 'Europe/Rome' || locale.startsWith('it')) return 'Italy';
  if (timeZone === 'Europe/Prague' || locale.startsWith('cs')) return 'Czech Republic';
  if (timeZone.startsWith('Australia/')) return 'Australia';
  if (timeZone.startsWith('America/Sao_Paulo') || locale.startsWith('pt')) return 'Brazil/LATAM';
  if (timeZone.startsWith('America/')) return 'North America';
  if (timeZone.startsWith('Europe/')) return 'Europe';
  return 'Global';
}
