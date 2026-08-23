import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseMailto } from '../src/parser.js';
import { openRememberedProvider } from '../src/remembered.js';
import { resolveProviders } from '../src/resolver.js';
import { clearPreference, savePreference } from '../src/storage.js';

describe('remembered provider shortcut', () => {
  const params = parseMailto('mailto:hello@example.com?subject=Remembered');

  beforeEach(() => {
    clearPreference();
    vi.restoreAllMocks();
  });

  it('opens a valid remembered provider without the picker', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const onOpen = vi.fn();
    savePreference('gmail');
    const config = { onOpen };
    const resolved = resolveProviders(params, config);

    expect(openRememberedProvider(params, resolved, config)).toBe(true);
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining('https://mail.google.com/mail/'),
      '_blank',
      'noopener,noreferrer',
    );
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: 'gmail' }), params);
  });

  it('keeps the picker when no provider is remembered', () => {
    const resolved = resolveProviders(params);

    expect(openRememberedProvider(params, resolved)).toBe(false);
  });

  it('keeps the picker when the remembered provider is excluded', () => {
    savePreference('gmail');
    const config = { excludeProviders: ['gmail'] };
    const resolved = resolveProviders(params, config);

    expect(openRememberedProvider(params, resolved, config)).toBe(false);
  });

  it('keeps the picker for a stale provider ID', () => {
    savePreference('removed-provider');
    const resolved = resolveProviders(params);

    expect(openRememberedProvider(params, resolved)).toBe(false);
  });

  it('keeps the picker for a fallback-only saved provider', () => {
    savePreference('fallback-mail');
    const fallbackProvider = {
      id: 'fallback-mail',
      name: 'Fallback Mail',
      buildUrl: () => 'https://mail.example.com',
      color: '#000000',
      textColor: '#ffffff',
      fallbackOnly: true,
    };
    const config = { customProviders: [fallbackProvider] };
    const resolved = resolveProviders(params, config);

    expect(openRememberedProvider(params, resolved, config)).toBe(false);
  });

  it('restores the picker flow when the shortcut is disabled', () => {
    savePreference('gmail');
    const config = { skipPickerOnRememberedChoice: false };
    const resolved = resolveProviders(params, config);

    expect(openRememberedProvider(params, resolved, config)).toBe(false);
  });
});
