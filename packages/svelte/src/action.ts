import {
  isValidMailtoParams,
  parseMailto,
  resolveProviders,
  openRememberedProvider,
  spawnModal,
  type SmartMailtoConfig,
} from '@smart-mailto/core';

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
    const forcePicker = node.hasAttribute('data-smart-mailto-force-picker');
    if (!forcePicker && openRememberedProvider(params, resolved, config)) return;

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
