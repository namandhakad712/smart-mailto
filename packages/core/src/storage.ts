/**
 * @smart-mailto/core — localStorage Preference Storage
 *
 * Persists the user's last-chosen email provider.
 * On next visit, that provider is shown first.
 *
 * Privacy: Only stores a short provider ID string (e.g. "gmail").
 * No PII, no tracking, no cross-site data.
 */

export const DEFAULT_STORAGE_KEY = 'smart-mailto:preferred';

/**
 * Saves the user's preferred provider ID to localStorage.
 * Silently fails if localStorage is unavailable (SSR, incognito, storage blocked).
 */
export function savePreference(providerId: string, key = DEFAULT_STORAGE_KEY): void {
  try {
    localStorage.setItem(key, providerId);
  } catch {
    // localStorage may be blocked (storage quota, incognito, CSP)
  }
}

/**
 * Retrieves the user's saved provider preference.
 * Returns null if not set or unavailable.
 */
export function loadPreference(key = DEFAULT_STORAGE_KEY): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Clears the saved preference.
 * Call this if you want to re-trigger geo-detection.
 */
export function clearPreference(key = DEFAULT_STORAGE_KEY): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}

/**
 * Returns whether localStorage is available in this environment.
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__smart-mailto-test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
