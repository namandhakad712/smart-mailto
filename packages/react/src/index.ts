/**
 * @smart-mailto/react
 *
 * React wrapper for smart-mailto.
 *
 * @example App-level init (magic mode — intercepts all mailto: links)
 * ```tsx
 * import { SmartMailtoProvider } from '@smart-mailto/react';
 *
 * function App() {
 *   return (
 *     <SmartMailtoProvider theme="dark" autoDetectGeo>
 *       <YourApp />
 *     </SmartMailtoProvider>
 *   );
 * }
 * ```
 *
 * @example Component usage (standalone)
 * ```tsx
 * import { SmartMailto } from '@smart-mailto/react';
 *
 * <SmartMailto href="mailto:hello@example.com" theme="dark">
 *   Contact Us
 * </SmartMailto>
 * ```
 *
 * @example Hook usage (programmatic)
 * ```tsx
 * import { useSmartMailto } from '@smart-mailto/react';
 *
 * function ContactButton() {
 *   const { open } = useSmartMailto();
 *   return <button onClick={() => open('hello@example.com')}>Email Us</button>;
 * }
 * ```
 */

export { SmartMailto, type SmartMailtoProps } from './SmartMailto.js';
export {
  SmartMailtoProvider,
  useSmartMailto,
  type SmartMailtoProviderProps,
} from './SmartMailtoProvider.js';

// Re-export core types for convenience
export type {
  MailtoParams,
  Provider,
  SmartMailtoConfig,
  Theme,
  ClassNames,
  I18nStrings,
  GeoSignals,
  ResolvedProviders,
} from '@smart-mailto/core';
