/**
 * @smart-mailto/react — Context & Provider
 *
 * Provides smart-mailto configuration via React context.
 * Initializes the global event listener once on mount.
 */

import React, { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import {
  initSmartMailto,
  destroySmartMailto,
  updateConfig,
  type SmartMailtoConfig,
} from '@smart-mailto/core';

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface SmartMailtoContextValue {
  config: SmartMailtoConfig;
  /** Programmatically open the picker for any email string */
  open: (email: string, overrides?: Partial<SmartMailtoConfig>) => void;
}

const SmartMailtoContext = createContext<SmartMailtoContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export interface SmartMailtoProviderProps extends SmartMailtoConfig {
  children: ReactNode;
}

/**
 * Wrap your app with SmartMailtoProvider to enable the global mailto: interceptor.
 *
 * @example
 * <SmartMailtoProvider theme="dark" autoDetectGeo>
 *   <App />
 * </SmartMailtoProvider>
 */
export function SmartMailtoProvider({ children, ...config }: SmartMailtoProviderProps) {
  const destroyRef = useRef<(() => void) | null>(null);

  // Initialize on mount, clean up on unmount
  useEffect(() => {
    destroyRef.current = initSmartMailto(config);
    return () => {
      destroyRef.current?.();
      destroyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once

  // Sync config changes without re-attaching the listener
  useEffect(() => {
    updateConfig(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.theme, config.preferredProvider, config.maxProviders]);

  const open = (email: string, overrides?: Partial<SmartMailtoConfig>) => {
    import('@smart-mailto/core').then(({ parseMailto, resolveProviders, spawnModal }) => {
      const params = parseMailto(`mailto:${email}`);
      const resolved = resolveProviders(params, { ...config, ...overrides });
      spawnModal(params, resolved, { ...config, ...overrides });
    });
  };

  return (
    <SmartMailtoContext.Provider value={{ config, open }}>{children}</SmartMailtoContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Access the smart-mailto context and programmatic open function.
 *
 * @example
 * const { open } = useSmartMailto();
 * <button onClick={() => open('hello@example.com', { subject: 'Hi' })}>
 *   Email Us
 * </button>
 */
export function useSmartMailto(): SmartMailtoContextValue {
  const ctx = useContext(SmartMailtoContext);
  if (!ctx) {
    throw new Error('[smart-mailto] useSmartMailto must be used within a <SmartMailtoProvider>.');
  }
  return ctx;
}
