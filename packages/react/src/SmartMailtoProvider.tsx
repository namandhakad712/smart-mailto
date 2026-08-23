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
  type MailtoParams,
  type SmartMailtoConfig,
} from '@smart-mailto/core';

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

export type SmartMailtoOpenOptions = Partial<SmartMailtoConfig> &
  Pick<MailtoParams, 'subject' | 'body'>;

export interface SmartMailtoContextValue {
  config: SmartMailtoConfig;
  /** Programmatically open the picker for any email string */
  open: (email: string, options?: SmartMailtoOpenOptions) => void;
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
  const previousConfigRef = useRef(config);

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
    const clearedConfig = Object.fromEntries(
      Object.keys(previousConfigRef.current).map(key => [key, undefined]),
    ) as Partial<SmartMailtoConfig>;

    updateConfig({ ...clearedConfig, ...config });
    previousConfigRef.current = config;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.theme,
    config.autoDetectGeo,
    config.preferredProvider,
    config.maxProviders,
    config.includeNative,
    config.includeCopy,
    config.customProviders,
    config.excludeProviders,
    config.classNames,
    config.i18n,
    config.rememberChoice,
    config.skipPickerOnRememberedChoice,
    config.storageKey,
    config.onOpen,
    config.onCopy,
    config.onClose,
    config.onShow,
  ]);

  const open = (email: string, options: SmartMailtoOpenOptions = {}) => {
    const { subject, body, ...overrides } = options;

    import('@smart-mailto/core').then(
      ({ buildMailtoHref, parseMailto, resolveProviders, spawnModal }) => {
        const baseParams = parseMailto(`mailto:${email}`);
        const href = buildMailtoHref({
          ...baseParams,
          ...(subject !== undefined && { subject }),
          ...(body !== undefined && { body }),
        });
        const params = parseMailto(href);
        const modalConfig = { ...config, ...overrides };
        const resolved = resolveProviders(params, modalConfig);
        spawnModal(params, resolved, modalConfig);
      },
    );
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
 * <button onClick={() => open('hello@example.com', { subject: 'Hi', body: 'Hello!' })}>
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
