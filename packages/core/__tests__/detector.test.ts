import { describe, it, expect } from 'vitest';
import { detectProviderFromEmail, getDomainsForProvider } from '../src/detector.js';

describe('detectProviderFromEmail', () => {
  // ── Gmail ──────────────────────────────────────────────────────────────────
  it('detects Gmail from gmail.com', () => {
    expect(detectProviderFromEmail('hello@gmail.com')).toBe('gmail');
  });
  it('detects Gmail from googlemail.com', () => {
    expect(detectProviderFromEmail('hello@googlemail.com')).toBe('gmail');
  });
  it('is case-insensitive for domain', () => {
    expect(detectProviderFromEmail('hello@GMAIL.COM')).toBe('gmail');
  });

  // ── Outlook ────────────────────────────────────────────────────────────────
  it('detects Outlook from outlook.com', () => {
    expect(detectProviderFromEmail('user@outlook.com')).toBe('outlook-personal');
  });
  it('detects Outlook from hotmail.com', () => {
    expect(detectProviderFromEmail('user@hotmail.com')).toBe('outlook-personal');
  });
  it('detects Outlook from live.com', () => {
    expect(detectProviderFromEmail('user@live.com')).toBe('outlook-personal');
  });
  it('detects Outlook from hotmail.co.uk', () => {
    expect(detectProviderFromEmail('user@hotmail.co.uk')).toBe('outlook-personal');
  });

  // ── Yahoo ─────────────────────────────────────────────────────────────────
  it('detects Yahoo from yahoo.com', () => {
    expect(detectProviderFromEmail('user@yahoo.com')).toBe('yahoo');
  });
  it('detects Yahoo from ymail.com', () => {
    expect(detectProviderFromEmail('user@ymail.com')).toBe('yahoo');
  });
  it('detects Yahoo from yahoo.co.in', () => {
    expect(detectProviderFromEmail('user@yahoo.co.in')).toBe('yahoo');
  });

  // ── Yahoo Japan (separate provider) ──────────────────────────────────────
  it('detects Yahoo Japan from yahoo.co.jp', () => {
    expect(detectProviderFromEmail('user@yahoo.co.jp')).toBe('yahoo-japan');
  });

  // ── ProtonMail ────────────────────────────────────────────────────────────
  it('detects ProtonMail from proton.me', () => {
    expect(detectProviderFromEmail('user@proton.me')).toBe('protonmail');
  });
  it('detects ProtonMail from protonmail.com', () => {
    expect(detectProviderFromEmail('user@protonmail.com')).toBe('protonmail');
  });
  it('detects ProtonMail from pm.me', () => {
    expect(detectProviderFromEmail('user@pm.me')).toBe('protonmail');
  });

  // ── iCloud ────────────────────────────────────────────────────────────────
  it('detects iCloud from icloud.com', () => {
    expect(detectProviderFromEmail('user@icloud.com')).toBe('icloud');
  });
  it('detects iCloud from me.com', () => {
    expect(detectProviderFromEmail('user@me.com')).toBe('icloud');
  });
  it('detects iCloud from mac.com', () => {
    expect(detectProviderFromEmail('user@mac.com')).toBe('icloud');
  });

  // ── Yandex ────────────────────────────────────────────────────────────────
  it('detects Yandex from yandex.ru', () => {
    expect(detectProviderFromEmail('user@yandex.ru')).toBe('yandex');
  });
  it('detects Yandex from ya.ru', () => {
    expect(detectProviderFromEmail('user@ya.ru')).toBe('yandex');
  });
  it('detects Yandex from yandex.com', () => {
    expect(detectProviderFromEmail('user@yandex.com')).toBe('yandex');
  });

  // ── Mail.ru ───────────────────────────────────────────────────────────────
  it('detects Mail.ru from mail.ru', () => {
    expect(detectProviderFromEmail('user@mail.ru')).toBe('mailru');
  });
  it('detects Mail.ru from inbox.ru', () => {
    expect(detectProviderFromEmail('user@inbox.ru')).toBe('mailru');
  });
  it('detects Mail.ru from bk.ru', () => {
    expect(detectProviderFromEmail('user@bk.ru')).toBe('mailru');
  });

  // ── GMX ───────────────────────────────────────────────────────────────────
  it('detects GMX from gmx.de', () => {
    expect(detectProviderFromEmail('user@gmx.de')).toBe('gmx');
  });
  it('detects GMX from gmx.net', () => {
    expect(detectProviderFromEmail('user@gmx.net')).toBe('gmx');
  });
  it('detects GMX from gmx.com', () => {
    expect(detectProviderFromEmail('user@gmx.com')).toBe('gmx');
  });

  // ── WEB.DE ────────────────────────────────────────────────────────────────
  it('detects WEB.DE from web.de', () => {
    expect(detectProviderFromEmail('user@web.de')).toBe('webde');
  });

  // ── Fastmail ──────────────────────────────────────────────────────────────
  it('detects Fastmail from fastmail.com', () => {
    expect(detectProviderFromEmail('user@fastmail.com')).toBe('fastmail');
  });
  it('detects Fastmail from fastmail.fm', () => {
    expect(detectProviderFromEmail('user@fastmail.fm')).toBe('fastmail');
  });

  // ── Naver ─────────────────────────────────────────────────────────────────
  it('detects Naver from naver.com', () => {
    expect(detectProviderFromEmail('user@naver.com')).toBe('naver');
  });

  // ── QQ ────────────────────────────────────────────────────────────────────
  it('detects QQ from qq.com', () => {
    expect(detectProviderFromEmail('user@qq.com')).toBe('qq');
  });
  it('detects QQ from foxmail.com (Tencent)', () => {
    expect(detectProviderFromEmail('user@foxmail.com')).toBe('qq');
  });

  // ── NetEase ───────────────────────────────────────────────────────────────
  it('detects NetEase from 163.com', () => {
    expect(detectProviderFromEmail('user@163.com')).toBe('mail163');
  });
  it('detects NetEase from 126.com', () => {
    expect(detectProviderFromEmail('user@126.com')).toBe('mail163');
  });

  // ── Seznam ────────────────────────────────────────────────────────────────
  it('detects Seznam from seznam.cz', () => {
    expect(detectProviderFromEmail('user@seznam.cz')).toBe('seznam');
  });

  // ── Tutanota ──────────────────────────────────────────────────────────────
  it('detects Tutanota from tutanota.com', () => {
    expect(detectProviderFromEmail('user@tutanota.com')).toBe('tutanota');
  });
  it('detects Tutanota from tuta.io', () => {
    expect(detectProviderFromEmail('user@tuta.io')).toBe('tutanota');
  });

  // ── Unknown Domains ───────────────────────────────────────────────────────
  it('returns null for unknown custom domain', () => {
    expect(detectProviderFromEmail('user@mycompany.com')).toBeNull();
  });
  it('returns null for unknown TLD', () => {
    expect(detectProviderFromEmail('user@example.xyz')).toBeNull();
  });
  it('returns null for malformed email (no @)', () => {
    expect(detectProviderFromEmail('notanemail')).toBeNull();
  });
  it('returns null for empty string', () => {
    expect(detectProviderFromEmail('')).toBeNull();
  });
  it('returns null for just @', () => {
    expect(detectProviderFromEmail('@')).toBeNull();
  });

  // ── Plus addressing ───────────────────────────────────────────────────────
  it('correctly extracts domain from plus-addressed email', () => {
    expect(detectProviderFromEmail('user+tag@gmail.com')).toBe('gmail');
    expect(detectProviderFromEmail('user+newsletter@proton.me')).toBe('protonmail');
  });
});

describe('getDomainsForProvider', () => {
  it('returns multiple domains for gmail', () => {
    const domains = getDomainsForProvider('gmail');
    expect(domains).toContain('gmail.com');
    expect(domains).toContain('googlemail.com');
  });

  it('returns multiple domains for outlook-personal', () => {
    const domains = getDomainsForProvider('outlook-personal');
    expect(domains).toContain('outlook.com');
    expect(domains).toContain('hotmail.com');
    expect(domains).toContain('live.com');
  });

  it('returns empty array for unknown provider', () => {
    const domains = getDomainsForProvider('unknown-xyz');
    expect(domains).toEqual([]);
  });
});
