import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGeoOrderedProviderIds, collectGeoSignals, detectRegionLabel } from '../src/geo.js';
import type { GeoSignals } from '../src/types.js';

// Helper to create signals
function makeSignals(overrides: Partial<GeoSignals> = {}): GeoSignals {
  return {
    timeZone: 'America/New_York',
    locale: 'en-US',
    locales: ['en-US', 'en'],
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    ...overrides,
  };
}

describe('getGeoOrderedProviderIds', () => {
  // ── Russia ─────────────────────────────────────────────────────────────────

  it('prioritizes Yandex + Mail.ru for Moscow timezone', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Europe/Moscow', locale: 'ru-RU' }),
    );
    expect(ids[0]).toBe('yandex');
    expect(ids[1]).toBe('mailru');
    expect(ids).toContain('gmail');
  });

  it('prioritizes Yandex for Vladivostok (far-east Russia)', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Asia/Vladivostok', locale: 'ru' }),
    );
    expect(ids[0]).toBe('yandex');
  });

  it('prioritizes Yandex + Mail.ru for Yekaterinburg', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Asia/Yekaterinburg', locale: 'ru-RU' }),
    );
    expect(ids[0]).toBe('yandex');
    expect(ids[1]).toBe('mailru');
  });

  // ── China ─────────────────────────────────────────────────────────────────

  it('prioritizes QQ Mail for Shanghai timezone', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Asia/Shanghai', locale: 'zh-CN' }),
    );
    expect(ids[0]).toBe('qq');
    expect(ids).toContain('mail163');
  });

  it('prioritizes QQ for zh-CN locale even without timezone match', () => {
    const ids = getGeoOrderedProviderIds(makeSignals({ timeZone: 'UTC', locale: 'zh-CN' }));
    expect(ids[0]).toBe('qq');
  });

  // ── Japan ─────────────────────────────────────────────────────────────────

  it('prioritizes Yahoo Japan for Tokyo timezone', () => {
    const ids = getGeoOrderedProviderIds(makeSignals({ timeZone: 'Asia/Tokyo', locale: 'ja-JP' }));
    expect(ids[0]).toBe('yahoo-japan');
    expect(ids[1]).toBe('gmail');
  });

  it('prioritizes Yahoo Japan for ja locale', () => {
    const ids = getGeoOrderedProviderIds(makeSignals({ timeZone: 'UTC', locale: 'ja' }));
    expect(ids[0]).toBe('yahoo-japan');
  });

  // ── South Korea ───────────────────────────────────────────────────────────

  it('prioritizes Naver for Seoul timezone', () => {
    const ids = getGeoOrderedProviderIds(makeSignals({ timeZone: 'Asia/Seoul', locale: 'ko-KR' }));
    expect(ids[0]).toBe('naver');
    expect(ids[1]).toBe('daum');
  });

  // ── India ─────────────────────────────────────────────────────────────────

  it('prioritizes Gmail for Kolkata timezone (India)', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Asia/Kolkata', locale: 'en-IN' }),
    );
    expect(ids[0]).toBe('gmail');
    expect(ids).toContain('zoho');
    expect(ids).toContain('rediff');
  });

  // ── Germany ───────────────────────────────────────────────────────────────

  it('prioritizes GMX + WEB.DE for Berlin timezone', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Europe/Berlin', locale: 'de-DE' }),
    );
    expect(ids[0]).toBe('gmx');
    expect(ids[1]).toBe('webde');
    expect(ids).toContain('gmail');
  });

  it('prioritizes ProtonMail for Switzerland', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Europe/Zurich', locale: 'de-CH' }),
    );
    expect(ids[0]).toBe('protonmail');
  });

  // ── France ────────────────────────────────────────────────────────────────

  it('includes LaPoste for France', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Europe/Paris', locale: 'fr-FR' }),
    );
    expect(ids).toContain('laposte');
    expect(ids[0]).toBe('gmail');
  });

  // ── Czech Republic ────────────────────────────────────────────────────────

  it('prioritizes Seznam for Prague timezone', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Europe/Prague', locale: 'cs-CZ' }),
    );
    expect(ids[0]).toBe('seznam');
  });

  // ── Poland ────────────────────────────────────────────────────────────────

  it('prioritizes Onet + WP for Warsaw timezone', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Europe/Warsaw', locale: 'pl-PL' }),
    );
    expect(ids[0]).toBe('onet');
    expect(ids[1]).toBe('wp');
  });

  // ── Australia ─────────────────────────────────────────────────────────────

  it('includes Fastmail for Australia', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'Australia/Sydney', locale: 'en-AU' }),
    );
    expect(ids).toContain('fastmail');
    expect(ids[0]).toBe('gmail');
  });

  // ── Philippines ───────────────────────────────────────────────────────────

  it('prioritizes Yahoo for Philippines (Manila timezone)', () => {
    const ids = getGeoOrderedProviderIds(makeSignals({ timeZone: 'Asia/Manila', locale: 'en-PH' }));
    expect(ids[0]).toBe('yahoo');
  });

  // ── Ukraine ───────────────────────────────────────────────────────────────

  it('includes UKR.NET for Kyiv timezone', () => {
    const ids = getGeoOrderedProviderIds(makeSignals({ timeZone: 'Europe/Kyiv', locale: 'uk-UA' }));
    expect(ids).toContain('ukrnet');
    expect(ids[0]).toBe('gmail');
  });

  // ── USA ───────────────────────────────────────────────────────────────────

  it('prioritizes Gmail + Outlook for US timezones', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'America/New_York', locale: 'en-US' }),
    );
    expect(ids[0]).toBe('gmail');
    expect(ids[1]).toBe('outlook-personal');
  });

  it('includes iCloud for US', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({ timeZone: 'America/Los_Angeles', locale: 'en-US' }),
    );
    expect(ids).toContain('icloud');
  });

  // ── Locale Fallback ───────────────────────────────────────────────────────

  it('falls back to locale when timezone is not in map', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({
        timeZone: 'Unknown/Timezone',
        locale: 'de-DE',
        locales: ['de-DE', 'de', 'en'],
      }),
    );
    expect(ids[0]).toBe('gmx');
  });

  it('falls back to short locale (de from de-DE)', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({
        timeZone: 'Unknown/Timezone',
        locale: 'de-AT',
        locales: ['de-AT'], // de-AT not in map, should try 'de'
      }),
    );
    expect(ids).toContain('gmx');
  });

  // ── Global Default ────────────────────────────────────────────────────────

  it('returns sensible global default for unknown region', () => {
    const ids = getGeoOrderedProviderIds(
      makeSignals({
        timeZone: 'Unknown/Unknown',
        locale: 'xx-XX',
        locales: ['xx-XX'],
      }),
    );
    expect(ids).toContain('gmail');
    expect(ids).toContain('outlook-personal');
    expect(ids.length).toBeGreaterThan(0);
  });

  // ── Invariants ────────────────────────────────────────────────────────────

  it('always returns a non-empty array', () => {
    const testCases: GeoSignals[] = [
      makeSignals({ timeZone: 'UTC', locale: 'en' }),
      makeSignals({ timeZone: 'Asia/Tokyo', locale: 'ja' }),
      makeSignals({ timeZone: 'Unknown', locale: 'unknown' }),
      makeSignals(),
    ];
    for (const signals of testCases) {
      expect(getGeoOrderedProviderIds(signals).length).toBeGreaterThan(0);
    }
  });

  it('never returns duplicate provider IDs', () => {
    const signals = makeSignals({ timeZone: 'Europe/Moscow', locale: 'ru-RU' });
    const ids = getGeoOrderedProviderIds(signals);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });
});

describe('detectRegionLabel', () => {
  it('identifies Russia', () => {
    const label = detectRegionLabel(makeSignals({ timeZone: 'Europe/Moscow', locale: 'ru-RU' }));
    expect(label).toBe('Russia/CIS');
  });

  it('identifies Japan', () => {
    const label = detectRegionLabel(makeSignals({ timeZone: 'Asia/Tokyo', locale: 'ja' }));
    expect(label).toBe('Japan');
  });

  it('identifies Germany', () => {
    const label = detectRegionLabel(makeSignals({ timeZone: 'Europe/Berlin', locale: 'de-DE' }));
    expect(label).toBe('Germany/DACH');
  });

  it('identifies India', () => {
    const label = detectRegionLabel(makeSignals({ timeZone: 'Asia/Kolkata', locale: 'en-IN' }));
    expect(label).toBe('India');
  });

  it('returns Global for unknown region', () => {
    const label = detectRegionLabel(makeSignals({ timeZone: 'Unknown', locale: 'xx' }));
    expect(label).toBe('Global');
  });
});
