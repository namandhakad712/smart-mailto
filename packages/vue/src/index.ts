/**
 * @smart-mailto/vue
 *
 * Vue 3 wrapper for smart-mailto.
 *
 * @example Plugin (app-level, magic mode)
 * ```ts
 * // main.ts
 * import { SmartMailtoPlugin } from '@smart-mailto/vue';
 * app.use(SmartMailtoPlugin, { theme: 'dark', autoDetectGeo: true });
 * ```
 *
 * @example Component
 * ```vue
 * <SmartMailto href="mailto:hello@example.com" theme="dark">
 *   Contact Us
 * </SmartMailto>
 * ```
 */

export { SmartMailtoPlugin, SmartMailtoComponent } from './plugin.js';

export type { MailtoParams, Provider, SmartMailtoConfig, Theme } from '@smart-mailto/core';
