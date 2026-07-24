import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { spawnModal } from '../src/modal.js';
import type { Provider, ResolvedProviders, SmartMailtoConfig } from '../src/types.js';

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

function render(config: SmartMailtoConfig = {}): ShadowRoot {
  spawnModal({ to: ['hello@example.com'], subject: 'Hello' }, resolved, config);

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
  vi.useRealTimers();
  vi.restoreAllMocks();
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

describe('modal lifecycle hooks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it.each([
    {
      method: 'close button',
      dismiss: (shadow: ShadowRoot) =>
        shadow.querySelector<HTMLButtonElement>('.sm-close-btn')?.click(),
    },
    {
      method: 'overlay',
      dismiss: (shadow: ShadowRoot) => shadow.querySelector<HTMLElement>('.sm-overlay')?.click(),
    },
    {
      method: 'Escape key',
      dismiss: () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })),
    },
  ])('fires onClose after dismissal with the $method', ({ dismiss }) => {
    const previousFocus = document.createElement('button');
    document.body.appendChild(previousFocus);
    previousFocus.focus();
    const onClose = vi.fn();
    const shadow = render({ onClose });

    dismiss(shadow);
    vi.advanceTimersByTime(280);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.getElementById('__smart-mailto-host__')).toBeNull();
    expect(document.activeElement).toBe(previousFocus);
    previousFocus.remove();
  });

  it('cleans up after provider selection without firing onClose', () => {
    const previousFocus = document.createElement('button');
    document.body.appendChild(previousFocus);
    previousFocus.focus();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const shadow = render({ onOpen, onClose });

    shadow.querySelector<HTMLButtonElement>('.sm-provider-btn')?.click();

    expect(openSpy).toHaveBeenCalledWith(
      'https://mail.google.com/',
      '_blank',
      'noopener,noreferrer',
    );
    expect(onOpen).toHaveBeenCalledWith(
      gmail,
      expect.objectContaining({ to: ['hello@example.com'], subject: 'Hello' }),
    );
    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(280);

    expect(onClose).not.toHaveBeenCalled();
    expect(document.getElementById('__smart-mailto-host__')).toBeNull();
    expect(document.activeElement).toBe(previousFocus);
    previousFocus.remove();
  });

  it('fires onCopy without dismissing the modal', async () => {
    const onCopy = vi.fn();
    const onClose = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const shadow = render({ onCopy, onClose });

    shadow.querySelector<HTMLButtonElement>('.sm-copy-btn')?.click();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith('hello@example.com');
    expect(onCopy).toHaveBeenCalledWith('hello@example.com');
    expect(onClose).not.toHaveBeenCalled();
    expect(document.getElementById('__smart-mailto-host__')).not.toBeNull();
  });
});
