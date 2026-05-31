/**
 * @smart-mailto/react — SmartMailto Component
 *
 * Drop-in replacement for <a href="mailto:..."> that shows the provider picker.
 *
 * @example
 * // Basic usage — replaces <a href="mailto:hello@example.com">
 * <SmartMailto href="mailto:hello@example.com" theme="dark">
 *   Contact Us
 * </SmartMailto>
 *
 * @example
 * // With subject and body pre-filled
 * <SmartMailto
 *   href="mailto:hello@example.com?subject=Hello&body=Hi%20there"
 *   theme="auto"
 * >
 *   Email Us
 * </SmartMailto>
 *
 * @example
 * // Works without SmartMailtoProvider (self-contained)
 * <SmartMailto href="mailto:x@x.com" preferredProvider="gmail">
 *   Contact
 * </SmartMailto>
 */

import React, {
  type AnchorHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from 'react';
import {
  parseMailto,
  isValidMailtoParams,
  resolveProviders,
  spawnModal,
  type SmartMailtoConfig,
} from '@smart-mailto/core';

export interface SmartMailtoProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onCopy'>,
    SmartMailtoConfig {
  /** The mailto: href. Required. */
  href: string;
  children?: ReactNode;
}

/**
 * A smart `<a>` tag that intercepts mailto: clicks and shows the provider picker.
 * Can be used standalone or within a SmartMailtoProvider.
 */
export function SmartMailto({
  href,
  children,
  theme,
  autoDetectGeo,
  preferredProvider,
  maxProviders,
  includeNative,
  includeCopy,
  excludeProviders,
  customProviders,
  classNames,
  i18n,
  rememberChoice,
  storageKey,
  onOpen,
  onCopy,
  onClose,
  onShow,
  onClick,
  ...anchorProps
}: SmartMailtoProps) {
  const config: SmartMailtoConfig = {
    theme,
    autoDetectGeo,
    preferredProvider,
    maxProviders,
    includeNative,
    includeCopy,
    excludeProviders,
    customProviders,
    classNames,
    i18n,
    rememberChoice,
    storageKey,
    onOpen,
    onCopy,
    onClose,
    onShow,
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const params = parseMailto(href);

    if (!isValidMailtoParams(params)) {
      // Invalid mailto — let the browser handle it
      onClick?.(e);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Must be called synchronously within click handler (Safari popup blocker)
    const resolved = resolveProviders(params, config);
    onShow?.(params, resolved.providers);
    spawnModal(params, resolved, config);

    onClick?.(e);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      data-smart-mailto="true"
      {...anchorProps}
    >
      {children}
    </a>
  );
}
