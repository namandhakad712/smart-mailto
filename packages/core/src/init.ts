/**
 * @smart-mailto/core — Global Init
 *
 * The "one line of code" magic:
 *   initSmartMailto({ theme: 'dark', autoDetectGeo: true });
 *
 * Uses event delegation on document to intercept ALL mailto: link clicks
 * on the entire page — no need to modify existing HTML.
 *
 * CRITICAL SAFARI NOTE: The window.open() call that opens the webmail
 * provider MUST happen synchronously within a user-click event handler.
 * This module is designed to spawn the modal synchronously, and then
 * window.open() is called when the user clicks a provider button within
 * the modal. This satisfies Safari's popup blocker requirements.
 */

import type { SmartMailtoConfig } from './types.js';
import { parseMailto, isValidMailtoParams } from './parser.js';
import { resolveProviders } from './resolver.js';

// Module state
let initialized = false;
let activeConfig: SmartMailtoConfig = {};
let clickHandler: ((e: MouseEvent) => void) | null = null;

/**
 * Initializes smart-mailto globally on the document.
 *
 * Attaches a single event listener using capture-phase delegation that
 * intercepts ALL clicks on `<a href="mailto:...">` elements anywhere on the page.
 *
 * @param config - Optional configuration object
 * @returns A cleanup/destroy function. Call it to remove the listener.
 *
 * @example
 * const destroy = initSmartMailto({ theme: 'dark', autoDetectGeo: true });
 * // Later:
 * destroy();
 */
export function initSmartMailto(config: SmartMailtoConfig = {}): () => void {
  if (typeof document === 'undefined') {
    // SSR environment — no-op
    return () => {};
  }

  if (initialized) {
    console.warn(
      '[smart-mailto] Already initialized. Call the destroy() function returned by initSmartMailto() before re-initializing.',
    );
    return () => {};
  }

  activeConfig = { ...config };
  initialized = true;

  clickHandler = (event: MouseEvent) => {
    // Walk up the DOM from the click target to find an anchor tag
    const target = (event.target as Element).closest('a[href]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href?.toLowerCase().startsWith('mailto:')) return;

    // Parse the mailto URI
    const params = parseMailto(href);

    // Skip if no valid recipients (let the browser handle it)
    if (!isValidMailtoParams(params)) return;

    // Prevent default browser behavior (opening mail client)
    event.preventDefault();
    event.stopPropagation();

    // Resolve providers — synchronous, < 1ms
    const resolved = resolveProviders(params, activeConfig);

    // Fire analytics hook
    activeConfig.onShow?.(params, resolved.providers);

    // Dynamically import the UI to keep the core bundle small
    // The import is pre-bundled by the consumer (React/Vue/Vanilla) so this
    // does NOT cause async issues — by the time a user clicks, the UI is loaded.
    import('./modal.js')
      .then(({ spawnModal }) => {
        spawnModal(params, resolved, activeConfig);
      })
      .catch(() => {
        // UI import failed — fall back to native behavior
        window.location.href = href;
      });
  };

  // Use capture phase to intercept before any other handlers
  document.addEventListener('click', clickHandler, { capture: true });

  // Return cleanup function
  return () => destroySmartMailto();
}

/**
 * Removes the global event listener and resets state.
 * Safe to call multiple times.
 */
export function destroySmartMailto(): void {
  if (clickHandler) {
    document.removeEventListener('click', clickHandler, { capture: true });
    clickHandler = null;
  }
  initialized = false;
  activeConfig = {};
}

/**
 * Returns whether smart-mailto is currently initialized.
 */
export function isInitialized(): boolean {
  return initialized;
}

/**
 * Updates the configuration without re-attaching the event listener.
 */
export function updateConfig(config: Partial<SmartMailtoConfig>): void {
  activeConfig = { ...activeConfig, ...config };
}
