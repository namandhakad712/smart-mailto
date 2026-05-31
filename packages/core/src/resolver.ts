/**
 * @smart-mailto/core — Provider Resolution
 *
 * Combines all signals (email domain, geo, mobile, preferences, config)
 * into a final ordered list of Provider objects to display in the modal.
 */

import type { MailtoParams, Provider, ResolvedProviders, SmartMailtoConfig } from './types.js';
import { PROVIDERS } from './providers.js';
import { collectGeoSignals, getGeoOrderedProviderIds, detectRegionLabel } from './geo.js';
import { detectProviderFromEmail } from './detector.js';
import { loadPreference } from './storage.js';

/**
 * Resolves the final ordered provider list for a given mailto + config.
 *
 * Priority order:
 * 1. Custom providers (prepended)
 * 2. Persisted user preference (moved to top)
 * 3. Email domain detection (moved to top if matched)
 * 4. Config.preferredProvider override
 * 5. Geo-ordered list (timezone/locale heuristics)
 * 6. Mobile override (native mail app moved to top)
 * 7. Exclusions applied
 * 8. Copy button always appended last (if includeCopy !== false)
 */
export function resolveProviders(
  params: MailtoParams,
  config: SmartMailtoConfig = {},
): ResolvedProviders {
  const signals = collectGeoSignals();
  const storageKey = config.storageKey;
  const savedPreference = config.rememberChoice !== false ? loadPreference(storageKey) : null;

  // Step 1: Start with geo-ordered provider IDs
  let orderedIds: string[] =
    config.autoDetectGeo !== false
      ? getGeoOrderedProviderIds(signals)
      : ['gmail', 'outlook-personal', 'yahoo', 'icloud', 'native'];

  // Step 2: Apply email domain detection
  const detectedFromEmail = detectProviderFromEmail(params.to[0] ?? '');
  if (detectedFromEmail) {
    orderedIds = [detectedFromEmail, ...orderedIds.filter(id => id !== detectedFromEmail)];
  }

  // Step 3: Apply config.preferredProvider override
  if (config.preferredProvider) {
    const pref = config.preferredProvider;
    orderedIds = [pref, ...orderedIds.filter(id => id !== pref)];
  }

  // Step 4: Apply persisted user preference (highest priority for returning users)
  if (savedPreference) {
    orderedIds = [savedPreference, ...orderedIds.filter(id => id !== savedPreference)];
  }

  // Step 5: Mobile override — push 'native' to the top
  if (signals.isMobile) {
    orderedIds = ['native', ...orderedIds.filter(id => id !== 'native')];
  }

  // Step 6: Apply exclusions
  const excluded = new Set(config.excludeProviders ?? []);
  orderedIds = orderedIds.filter(id => !excluded.has(id));

  // Step 7: Add native option (if not already in list and includeNative is not false)
  const includeNative = config.includeNative ?? signals.isMobile;
  if (includeNative && !orderedIds.includes('native')) {
    orderedIds.push('native');
  } else if (!includeNative) {
    orderedIds = orderedIds.filter(id => id !== 'native');
  }

  // Step 8: Resolve to Provider objects (skip unknown IDs)
  let providers: Provider[] = orderedIds
    .map(id => PROVIDERS[id])
    .filter((p): p is Provider => p !== undefined);

  // Step 9: Prepend custom providers
  if (config.customProviders?.length) {
    providers = [
      ...config.customProviders,
      ...providers.filter(p => !config.customProviders!.some(cp => cp.id === p.id)),
    ];
  }

  // Step 10: Apply maxProviders limit (before adding copy)
  const maxProviders = config.maxProviders ?? 6;
  providers = providers.slice(0, maxProviders);

  // Step 11: Always append 'copy' last (unless explicitly disabled)
  if (config.includeCopy !== false && !excluded.has('copy')) {
    const copyProvider = PROVIDERS['copy'];
    if (copyProvider) providers.push(copyProvider);
  }

  return {
    providers,
    detectedRegion: detectRegionLabel(signals),
    signals,
    detectedFromEmail,
  };
}
