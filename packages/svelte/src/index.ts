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

import { initSmartMailto, destroySmartMailto, type SmartMailtoConfig } from '@smart-mailto/core';
import type { SvelteComponent, ComponentType } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';
import SmartMailtoComponent from './SmartMailto.svelte';

// ─────────────────────────────────────────────────────────────────────────────
// Svelte Action & Component
// ─────────────────────────────────────────────────────────────────────────────

export { smartMailto } from './action.js';

export type SmartMailtoProps = SmartMailtoConfig &
  Omit<HTMLAnchorAttributes, 'href'> & {
    /** The mailto: href. Required. */
    href: string;
  };

/**
 * A smart `<a>` component that opens the provider picker.
 * Accepts all SmartMailtoConfig options plus standard anchor attributes.
 */
export const SmartMailto = SmartMailtoComponent as ComponentType<SvelteComponent<SmartMailtoProps>>;

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
