import { afterEach, describe, expect, it, vi } from 'vitest';
import { spawnModal } from '../src/modal.js';
import type {
  I18nStrings,
  MailtoParams,
  Provider,
  ResolvedProviders,
  SmartMailtoConfig,
} from '../src/types.js';

const gmail: Provider = {
  id: 'gmail',
  name: 'Gmail',
  color: '#fff',
  textColor: '#000',
  buildUrl: () => 'https://mail.google.com/',
};

const outlook: Provider = {
  id: 'outlook',
  name: 'Outlook',
  color: '#fff',
  textColor: '#000',
  buildUrl: () => 'https://outlook.live.com/',
};

const protonmail: Provider = {
  id: 'protonmail',
  name: 'Proton Mail',
  color: '#fff',
  textColor: '#000',
  noBodyPreFill: true,
  buildUrl: () => 'https://mail.proton.me/',
};

const native: Provider = {
  id: 'native',
  name: 'Mail App',
  color: '#fff',
  textColor: '#000',
  isNative: true,
  buildUrl: () => 'mailto:hello@example.com',
};

const copy: Provider = {
  id: 'copy',
  name: 'Copy',
  color: '#fff',
  textColor: '#000',
  isCopy: true,
  buildUrl: () => '',
};

const resolved: ResolvedProviders = {
  providers: [gmail, outlook, native, copy],
  detectedRegion: 'Global',
  detectedFromEmail: 'gmail',
  signals: {
    timeZone: 'UTC',
    locale: 'en-US',
    locales: ['en-US'],
    isMobile: false,
    isIOS: false,
    isAndroid: false,
  },
};

function render(
  config: SmartMailtoConfig = {},
  params: MailtoParams = { to: ['hello@example.com'], subject: 'Hello' },
  resolvedProviders: ResolvedProviders = resolved,
): ShadowRoot {
  spawnModal(params, resolvedProviders, config);

  const shadow = document.getElementById('__smart-mailto-host__')?.shadowRoot;
  if (!shadow) throw new Error('Expected modal shadow root');
  return shadow;
}

function expectClasses(shadow: ShadowRoot, selector: string, ...classes: string[]): void {
  const element = shadow.querySelector(selector);
  expect(element).not.toBeNull();
  classes.forEach(className => expect(element?.classList.contains(className)).toBe(true));
}

afterEach(() => {
  document.getElementById('__smart-mailto-host__')?.remove();
});

describe('modal class names', () => {
  it('keeps the built-in stylesheet and classes by default', () => {
    const shadow = render({ theme: 'light' });

    expect(shadow.querySelector('style')?.textContent).toContain('.sm-overlay');
    expect(shadow.querySelector('.sm-overlay')).not.toBeNull();
    expect(shadow.querySelector('.sm-modal')).not.toBeNull();
    expect(shadow.querySelector('.sm-provider-btn')).not.toBeNull();
  });

  it('applies every documented custom class and skips built-in styles', () => {
    const shadow = render({
      classNames: {
        overlay: 'custom-overlay',
        modal: 'custom-modal',
        header: 'custom-header',
        providerGrid: 'custom-grid',
        providerButton: 'custom-provider',
        providerButtonActive: 'custom-active',
        providerLogo: 'custom-logo',
        providerName: 'custom-name',
        copyButton: 'custom-copy',
        closeButton: 'custom-close',
        emailPreview: 'custom-preview',
      },
    });

    expect(shadow.querySelector('style')).toBeNull();
    expectClasses(shadow, '.sm-overlay', 'custom-overlay');
    expectClasses(shadow, '.sm-modal', 'custom-modal');
    expectClasses(shadow, '.sm-header', 'custom-header');
    expectClasses(shadow, '.sm-grid', 'custom-grid');
    const providerButtons = [...shadow.querySelectorAll('.sm-provider-btn')];
    expect(providerButtons).toHaveLength(3);
    providerButtons.forEach(button =>
      expect(button.classList.contains('custom-provider')).toBe(true),
    );
    expect(shadow.querySelectorAll('.custom-active')).toHaveLength(1);
    expectClasses(shadow, '.sm-preferred', 'custom-active');
    expectClasses(shadow, '.sm-provider-logo', 'custom-logo');
    expectClasses(shadow, '.sm-provider-name', 'custom-name');
    expectClasses(shadow, '.sm-copy-btn', 'custom-copy');
    expectClasses(shadow, '.sm-close-btn', 'custom-close');
    expectClasses(shadow, '.sm-subtitle', 'custom-preview');
  });

  it('treats an empty classNames object as unstyled mode', () => {
    const shadow = render({ classNames: {} });

    expect(shadow.querySelector('style')).toBeNull();
    expect(shadow.querySelector('.sm-modal')).not.toBeNull();
  });
});

describe('modal localization', () => {
  const providersWithConditionalBodyHandling: ResolvedProviders = {
    ...resolved,
    providers: [gmail, protonmail, native, copy],
  };

  it('keeps complete, readable English defaults', () => {
    const shadow = render(
      {},
      {
        to: ['hello@example.com'],
        subject: 'Hello',
        body: 'A pre-filled message',
      },
      providersWithConditionalBodyHandling,
    );

    expect(shadow.querySelector('.sm-title')?.textContent).toBe('Open Email With');
    expect(shadow.querySelector('.sm-subtitle')?.textContent).toBe(
      'To: hello@example.com · Subject: Hello',
    );
    expect(shadow.querySelector('.sm-actions-row .sm-provider-name')?.textContent).toBe('Mail App');
    expect(shadow.querySelector('.sm-copy-btn')?.textContent).toContain('Copy Address');
    expect(shadow.querySelector('.sm-close-btn')?.getAttribute('aria-label')).toBe('Close');
    expect(shadow.querySelector('.sm-body-note')?.textContent).toBe('Message pre-filled');
    expect(shadow.querySelector('.sm-no-body-note')?.textContent).toBe(
      'Open the app to add your message',
    );
  });

  it('renders every declared localization override in its intended state', async () => {
    const localizedI18n = {
      title: 'LOCALIZED_TITLE',
      copy: 'LOCALIZED_COPY',
      copied: 'LOCALIZED_COPIED',
      native: 'LOCALIZED_NATIVE',
      close: 'LOCALIZED_CLOSE',
      toLabel: 'LOCALIZED_TO',
      subjectLabel: 'LOCALIZED_SUBJECT',
      bodyTruncatedNote: 'LOCALIZED_BODY_PREFILLED',
      noBodyPreFillNote: 'LOCALIZED_BODY_BLOCKED',
    } satisfies I18nStrings;

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const shadow = render(
      { i18n: localizedI18n },
      {
        to: ['hello@example.com'],
        subject: 'Hello',
        body: 'A pre-filled message',
      },
      providersWithConditionalBodyHandling,
    );

    expect(shadow.querySelector('.sm-title')?.textContent).toBe('LOCALIZED_TITLE');
    expect(shadow.querySelector('.sm-modal')?.getAttribute('aria-label')).toBe('LOCALIZED_TITLE');
    expect(shadow.querySelector('.sm-subtitle')?.textContent).toBe(
      'LOCALIZED_TO: hello@example.com · LOCALIZED_SUBJECT: Hello',
    );
    expect(shadow.querySelector('.sm-actions-row .sm-provider-name')?.textContent).toBe(
      'LOCALIZED_NATIVE',
    );
    expect(
      shadow.querySelector('.sm-actions-row .sm-provider-btn')?.getAttribute('aria-label'),
    ).toBe('Open in LOCALIZED_NATIVE');
    expect(shadow.querySelector('.sm-copy-btn')?.textContent).toContain('LOCALIZED_COPY');
    expect(shadow.querySelector('.sm-close-btn')?.getAttribute('aria-label')).toBe(
      'LOCALIZED_CLOSE',
    );
    expect(shadow.querySelector('.sm-body-note')?.textContent).toBe('LOCALIZED_BODY_PREFILLED');
    expect(shadow.querySelector('.sm-no-body-note')?.textContent).toBe('LOCALIZED_BODY_BLOCKED');

    shadow.querySelector<HTMLButtonElement>('.sm-copy-btn')?.click();
    await Promise.resolve();
    expect(shadow.querySelector('.sm-copy-btn')?.textContent).toContain('LOCALIZED_COPIED');
  });
});
