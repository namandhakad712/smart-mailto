/**
 * @smart-mailto/svelte — Action & Component
 *
 * Provides a Svelte action and a component for smart-mailto.
 *
 * @example Action (on any element)
 * ```svelte
 * <script>
 *   import { smartMailto } from '@smart-mailto/svelte';
 * </script>
 * <a href="mailto:hello@example.com" use:smartMailto={{ theme: 'dark' }}>
 *   Contact Us
 * </a>
 * ```
 *
 * @example SmartMailto component
 * ```svelte
 * <script>
 *   import { SmartMailto } from '@smart-mailto/svelte';
 * </script>
 * <SmartMailto href="mailto:hello@example.com" theme="dark">
 *   Contact Us
 * </SmartMailto>
 * ```
 */

import {
  parseMailto,
  isValidMailtoParams,
  resolveProviders,
  spawnModal,
  initSmartMailto,
  destroySmartMailto,
  type SmartMailtoConfig,
} from '@smart-mailto/core';

// ─────────────────────────────────────────────────────────────────────────────
// Svelte Action
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Svelte action that adds smart-mailto behavior to an anchor element.
 *
 * @example
 * <a href="mailto:hello@example.com" use:smartMailto={{ theme: 'dark' }}>
 *   Contact Us
 * </a>
 */
export function smartMailto(node: HTMLAnchorElement, config: SmartMailtoConfig = {}) {
  function handleClick(e: MouseEvent) {
    const href = node.getAttribute('href') ?? '';
    if (!href.toLowerCase().startsWith('mailto:')) return;

    const params = parseMailto(href);
    if (!isValidMailtoParams(params)) return;

    e.preventDefault();
    e.stopPropagation();

    const resolved = resolveProviders(params, config);
    config.onShow?.(params, resolved.providers);
    spawnModal(params, resolved, config);
  }

  node.addEventListener('click', handleClick);

  return {
    update(newConfig: SmartMailtoConfig) {
      config = newConfig;
    },
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Global Init (for app-level "magic mode")
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initializes smart-mailto globally (equivalent to React's SmartMailtoProvider).
 * Call this in your root +layout.svelte or App.svelte.
 *
 * @example
 * // +layout.svelte (SvelteKit)
 * import { onMount, onDestroy } from 'svelte';
 * import { initGlobal } from '@smart-mailto/svelte';
 *
 * let destroy: () => void;
 * onMount(() => { destroy = initGlobal({ theme: 'dark' }); });
 * onDestroy(() => destroy?.());
 */
export function initGlobal(config: SmartMailtoConfig = {}): () => void {
  return initSmartMailto(config);
}

export { destroySmartMailto as destroyGlobal };

// Re-export types
export type { SmartMailtoConfig } from '@smart-mailto/core';
