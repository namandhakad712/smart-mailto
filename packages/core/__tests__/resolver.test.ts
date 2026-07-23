import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolveProviders } from '../src/resolver.js';
import { parseMailto } from '../src/parser.js';
import { savePreference, clearPreference } from '../src/storage.js';

describe('resolver module', () => {
  beforeEach(() => {
    clearPreference();
    vi.restoreAllMocks();
  });

  it('resolves default providers for standard mailto params', () => {
    const params = parseMailto('mailto:user@example.com');
    const result = resolveProviders(params);

    expect(result.providers).toBeDefined();
    expect(result.providers.length).toBeGreaterThan(0);
    expect(result.detectedRegion).toBeDefined();
    expect(result.signals).toBeDefined();
  });

  it('applies email domain detection to push detected provider to top', () => {
    const params = parseMailto('mailto:user@gmail.com');
    const result = resolveProviders(params);

    expect(result.detectedFromEmail).toBe('gmail');
    expect(result.providers[0]?.id).toBe('gmail');
  });

  it('honors config.preferredProvider override', () => {
    const params = parseMailto('mailto:user@example.com');
    const result = resolveProviders(params, { preferredProvider: 'protonmail' });

    expect(result.providers[0]?.id).toBe('protonmail');
  });

  it('honors saved user preference with highest priority', () => {
    savePreference('yahoo');
    const params = parseMailto('mailto:user@gmail.com');
    const result = resolveProviders(params, { preferredProvider: 'protonmail' });

    expect(result.providers[0]?.id).toBe('yahoo');
  });

  it('handles config.excludeProviders option', () => {
    const params = parseMailto('mailto:user@example.com');
    const result = resolveProviders(params, { excludeProviders: ['gmail', 'copy'] });

    const providerIds = result.providers.map(p => p.id);
    expect(providerIds).not.toContain('gmail');
    expect(providerIds).not.toContain('copy');
  });

  it('respects maxProviders limit', () => {
    const params = parseMailto('mailto:user@example.com');
    const result = resolveProviders(params, { maxProviders: 3, includeCopy: false });

    expect(result.providers.length).toBe(3);
  });

  it('prepends custom providers', () => {
    const params = parseMailto('mailto:user@example.com');
    const customProvider = {
      id: 'custom-webmail',
      name: 'Custom Webmail',
      buildUrl: () => 'https://mail.custom.com',
      color: '#000',
      textColor: '#fff',
      regions: ['global'],
    };

    const result = resolveProviders(params, { customProviders: [customProvider] });
    expect(result.providers[0]?.id).toBe('custom-webmail');
  });

  it('disables autoDetectGeo when autoDetectGeo is false', () => {
    const params = parseMailto('mailto:user@example.com');
    const result = resolveProviders(params, { autoDetectGeo: false });

    expect(result.providers).toBeDefined();
    expect(result.providers.map(p => p.id)).toEqual(
      expect.arrayContaining(['gmail', 'outlook-personal', 'yahoo']),
    );
  });
});
