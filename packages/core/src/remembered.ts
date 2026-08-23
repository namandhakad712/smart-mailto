/**
 * @smart-mailto/core — Remembered Provider Shortcut
 *
 * Opens a valid saved provider directly from the original click handler.
 * Keeping this synchronous preserves Safari popup compatibility.
 */

import type { MailtoParams, Provider, ResolvedProviders, SmartMailtoConfig } from './types.js';
import { loadPreference } from './storage.js';

function openProvider(provider: Provider, params: MailtoParams): void {
  const url = provider.buildUrl(params);

  if (provider.isNative) {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Opens the saved provider when it is still available in the resolved list.
 *
 * Returns true only when compose was opened. Missing, excluded, stale, copy,
 * and fallback-only choices return false so callers can show the picker.
 */
export function openRememberedProvider(
  params: MailtoParams,
  resolved: ResolvedProviders,
  config: SmartMailtoConfig = {},
): boolean {
  if (config.rememberChoice === false || config.skipPickerOnRememberedChoice === false) {
    return false;
  }

  const savedProviderId = loadPreference(config.storageKey);
  if (!savedProviderId) return false;

  const provider = resolved.providers.find(candidate => candidate.id === savedProviderId);
  if (!provider || provider.isCopy || provider.fallbackOnly) return false;

  openProvider(provider, params);
  config.onOpen?.(provider, params);
  return true;
}
