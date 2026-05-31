import { describe, it, expect } from 'vitest';
import { PROVIDERS, getProvider, getAllProviders } from '../src/providers.js';
import type { MailtoParams } from '../src/types.js';

const BASE_PARAMS: MailtoParams = {
  to: ['test@example.com'],
  cc: ['cc@example.com'],
  bcc: ['bcc@example.com'],
  subject: 'Hello World & Special <Chars>',
  body: 'This is the body.\nWith newlines & "quotes".',
};

const SIMPLE_PARAMS: MailtoParams = {
  to: ['test@example.com'],
};

describe('Provider URL builders', () => {
  // ── Gmail ──────────────────────────────────────────────────────────────────

  describe('gmail', () => {
    it('builds a valid URL', () => {
      const url = PROVIDERS['gmail']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('mail.google.com');
      expect(url).toContain('view=cm');
      expect(url).toContain('fs=1');
    });

    it('includes all parameters', () => {
      const url = PROVIDERS['gmail']!.buildUrl(BASE_PARAMS);
      expect(url).toContain('to=test%40example.com');
      expect(url).toContain('cc=cc%40example.com');
      expect(url).toContain('bcc=bcc%40example.com');
      expect(url).toContain('su=Hello+World+%26+Special+%3CChars%3E');
    });

    it('produces a parseable URL', () => {
      const url = PROVIDERS['gmail']!.buildUrl(BASE_PARAMS);
      expect(() => new URL(url)).not.toThrow();
    });
  });

  // ── Outlook Personal ──────────────────────────────────────────────────────

  describe('outlook-personal', () => {
    it('uses outlook.live.com domain', () => {
      const url = PROVIDERS['outlook-personal']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('outlook.live.com');
    });

    it('includes to and subject', () => {
      const url = PROVIDERS['outlook-personal']!.buildUrl(BASE_PARAMS);
      expect(url).toContain('to=');
      expect(url).toContain('subject=');
    });
  });

  // ── Outlook Work / 365 ────────────────────────────────────────────────────

  describe('outlook-work', () => {
    it('uses outlook.office.com domain', () => {
      const url = PROVIDERS['outlook-work']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('outlook.office.com');
    });
  });

  // ── Yahoo ─────────────────────────────────────────────────────────────────

  describe('yahoo', () => {
    it('uses compose.mail.yahoo.com', () => {
      const url = PROVIDERS['yahoo']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('compose.mail.yahoo.com');
    });
  });

  // ── ProtonMail ────────────────────────────────────────────────────────────

  describe('protonmail', () => {
    it('uses mail.proton.me', () => {
      const url = PROVIDERS['protonmail']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('mail.proton.me');
    });

    it('does NOT include body in URL (E2EE restriction)', () => {
      const url = PROVIDERS['protonmail']!.buildUrl(BASE_PARAMS);
      expect(url).not.toContain('body');
    });

    it('is marked as noBodyPreFill', () => {
      expect(PROVIDERS['protonmail']!.noBodyPreFill).toBe(true);
    });
  });

  // ── iCloud ────────────────────────────────────────────────────────────────

  describe('icloud', () => {
    it('uses icloud.com domain', () => {
      const url = PROVIDERS['icloud']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('icloud.com');
    });
  });

  // ── Yandex ────────────────────────────────────────────────────────────────

  describe('yandex', () => {
    it('uses mail.yandex.ru', () => {
      const url = PROVIDERS['yandex']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('mail.yandex.ru');
    });
  });

  // ── Mail.ru ───────────────────────────────────────────────────────────────

  describe('mailru', () => {
    it('uses e.mail.ru', () => {
      const url = PROVIDERS['mailru']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('e.mail.ru');
    });
  });

  // ── GMX ───────────────────────────────────────────────────────────────────

  describe('gmx', () => {
    it('uses navigator.gmx.net', () => {
      const url = PROVIDERS['gmx']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('navigator.gmx.net');
    });
  });

  // ── Naver (South Korea) ───────────────────────────────────────────────────

  describe('naver', () => {
    it('uses mail.naver.com', () => {
      const url = PROVIDERS['naver']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('mail.naver.com');
    });
  });

  // ── Yahoo Japan ───────────────────────────────────────────────────────────

  describe('yahoo-japan', () => {
    it('uses mail.yahoo.co.jp (different from US Yahoo)', () => {
      const url = PROVIDERS['yahoo-japan']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('mail.yahoo.co.jp');
    });
  });

  // ── QQ Mail ───────────────────────────────────────────────────────────────

  describe('qq', () => {
    it('uses mail.qq.com', () => {
      const url = PROVIDERS['qq']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('mail.qq.com');
    });
  });

  // ── Seznam (Czech Republic) ───────────────────────────────────────────────

  describe('seznam', () => {
    it('uses email.seznam.cz', () => {
      const url = PROVIDERS['seznam']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toContain('email.seznam.cz');
    });
  });

  // ── Native ────────────────────────────────────────────────────────────────

  describe('native', () => {
    it('returns a mailto: URI', () => {
      const url = PROVIDERS['native']!.buildUrl(BASE_PARAMS);
      expect(url.startsWith('mailto:')).toBe(true);
    });

    it('is marked as isNative', () => {
      expect(PROVIDERS['native']!.isNative).toBe(true);
    });
  });

  // ── Copy ──────────────────────────────────────────────────────────────────

  describe('copy', () => {
    it('returns the email address as the URL', () => {
      const url = PROVIDERS['copy']!.buildUrl(SIMPLE_PARAMS);
      expect(url).toBe('test@example.com');
    });

    it('is marked as isCopy', () => {
      expect(PROVIDERS['copy']!.isCopy).toBe(true);
    });
  });
});

describe('Special character encoding', () => {
  const specialParams: MailtoParams = {
    to: ['user+tag@example.com'],
    subject: '100% Off! <Sale> & More "Deals"',
    body: 'Line 1\nLine 2\tTabbed',
  };

  it('Gmail: special chars in subject do not break URL', () => {
    const url = PROVIDERS['gmail']!.buildUrl(specialParams);
    expect(() => new URL(url)).not.toThrow();
  });

  it('Outlook: special chars in subject do not break URL', () => {
    const url = PROVIDERS['outlook-personal']!.buildUrl(specialParams);
    expect(() => new URL(url)).not.toThrow();
  });

  it('Yahoo: special chars in subject do not break URL', () => {
    const url = PROVIDERS['yahoo']!.buildUrl(specialParams);
    expect(() => new URL(url)).not.toThrow();
  });

  it('All providers build parseable URLs with special chars', () => {
    const mainProviders = ['gmail', 'outlook-personal', 'outlook-work', 'yahoo', 'fastmail', 'zoho', 'gmx', 'naver', 'seznam'];
    for (const id of mainProviders) {
      const url = PROVIDERS[id]!.buildUrl(specialParams);
      expect(() => new URL(url), `${id} URL should be parseable`).not.toThrow();
    }
  });
});

describe('getProvider', () => {
  it('returns provider for known ID', () => {
    expect(getProvider('gmail')?.id).toBe('gmail');
  });

  it('returns null for unknown ID', () => {
    expect(getProvider('unknown-provider-xyz')).toBeNull();
  });
});

describe('getAllProviders', () => {
  it('returns an array of providers', () => {
    const all = getAllProviders();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(20);
  });

  it('all providers have required fields', () => {
    for (const provider of getAllProviders()) {
      expect(provider.id, `${provider.id} must have id`).toBeTruthy();
      expect(provider.name, `${provider.id} must have name`).toBeTruthy();
      expect(typeof provider.buildUrl, `${provider.id} buildUrl must be a function`).toBe('function');
      expect(provider.color, `${provider.id} must have color`).toBeTruthy();
    }
  });
});
