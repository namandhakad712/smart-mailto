/**
 * @smart-mailto/core
 *
 * Zero-dependency, framework-agnostic engine for smart-mailto.
 *
 * @example Quick start (Vanilla JS)
 * ```ts
 * import { initSmartMailto } from '@smart-mailto/core';
 * initSmartMailto({ theme: 'dark', autoDetectGeo: true });
 * ```
 *
 * @example Programmatic (no global init)
 * ```ts
 * import { parseMailto, resolveProviders, PROVIDERS } from '@smart-mailto/core';
 * const params = parseMailto('mailto:hello@example.com?subject=Hi');
 * const { providers } = resolveProviders(params);
 * ```
 */

// Public API surface
export { parseMailto, buildMailtoHref, isValidMailtoParams } from './parser.js';
export { PROVIDERS, getProvider, getAllProviders, getCatalogProviders } from './providers.js';
export { collectGeoSignals, getGeoOrderedProviderIds, detectRegionLabel } from './geo.js';
export { detectProviderFromEmail, getDomainsForProvider } from './detector.js';
export { resolveProviders } from './resolver.js';
export { openRememberedProvider } from './remembered.js';
export { savePreference, loadPreference, clearPreference, isStorageAvailable } from './storage.js';
export { initSmartMailto, destroySmartMailto, isInitialized, updateConfig } from './init.js';
export { spawnModal } from './modal.js';

// Types
export type {
  MailtoParams,
  Provider,
  SmartMailtoConfig,
  Theme,
  ClassNames,
  I18nStrings,
  SmartMailtoHooks,
  GeoSignals,
  ResolvedProviders,
  ProviderValidationResult,
} from './types.js';

// Version
export const VERSION = '__SMART_MAILTO_VERSION__';
