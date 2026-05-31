/**
 * @smart-mailto/core — Modal (Vanilla DOM)
 *
 * Builds and mounts the provider picker modal using Shadow DOM for
 * complete CSS isolation. No framework dependencies.
 *
 * Key design decisions:
 * - Shadow DOM: Prevents host page CSS from leaking in or out.
 * - window.open() called synchronously within a click handler: Safari-safe.
 * - Focus trap: WCAG 2.1 AA compliant.
 * - ESC key close: Standard UX.
 * - Smooth CSS animations: Entry/exit feel premium.
 */

import type { MailtoParams, Provider, ResolvedProviders, SmartMailtoConfig } from './types.js';
import { savePreference } from './storage.js';
import { ICONS } from './icons.js';

// ─────────────────────────────────────────────────────────────────────────────
// i18n Defaults
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_I18N = {
  title: 'Open Email With',
  copy: 'Copy Address',
  copied: '✓ Copied!',
  native: 'Mail App',
  close: 'Close',
  toLabel: 'To',
  subjectLabel: 'Subject',
  bodyTruncatedNote: 'Message pre-filled',
  noBodyPreFillNote: 'Open the app to add your message',
};

// ─────────────────────────────────────────────────────────────────────────────
// Theme CSS
// ─────────────────────────────────────────────────────────────────────────────

function getDarkThemeCSS(): string {
  return `
    :host {
      --sm-bg: rgba(10, 10, 18, 0.92);
      --sm-glass: rgba(255, 255, 255, 0.055);
      --sm-glass-hover: rgba(255, 255, 255, 0.10);
      --sm-border: rgba(255, 255, 255, 0.10);
      --sm-border-active: rgba(99, 102, 241, 0.6);
      --sm-text: #f1f1f5;
      --sm-text-muted: rgba(241, 241, 245, 0.50);
      --sm-text-xs: rgba(241, 241, 245, 0.35);
      --sm-accent: #6366f1;
      --sm-accent-glow: rgba(99, 102, 241, 0.30);
      --sm-radius: 22px;
      --sm-radius-sm: 14px;
      --sm-shadow: 0 40px 100px rgba(0,0,0,0.70), 0 0 0 1px rgba(255,255,255,0.06);
      --sm-font: -apple-system, 'Inter', 'Segoe UI', system-ui, sans-serif;
      --sm-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --sm-ease: cubic-bezier(0.16, 1, 0.3, 1);
      font-family: var(--sm-font);
    }
  `;
}

function getLightThemeCSS(): string {
  return `
    :host {
      --sm-bg: rgba(250, 250, 255, 0.95);
      --sm-glass: rgba(0, 0, 0, 0.035);
      --sm-glass-hover: rgba(0, 0, 0, 0.065);
      --sm-border: rgba(0, 0, 0, 0.09);
      --sm-border-active: rgba(99, 102, 241, 0.6);
      --sm-text: #111118;
      --sm-text-muted: rgba(17, 17, 24, 0.50);
      --sm-text-xs: rgba(17, 17, 24, 0.35);
      --sm-accent: #4f46e5;
      --sm-accent-glow: rgba(79, 70, 229, 0.20);
      --sm-radius: 22px;
      --sm-radius-sm: 14px;
      --sm-shadow: 0 24px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
      --sm-font: -apple-system, 'Inter', 'Segoe UI', system-ui, sans-serif;
      --sm-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --sm-ease: cubic-bezier(0.16, 1, 0.3, 1);
      font-family: var(--sm-font);
    }
  `;
}

function getAutoThemeCSS(): string {
  return `
    ${getDarkThemeCSS()}
    @media (prefers-color-scheme: light) {
      ${getLightThemeCSS()}
    }
  `;
}

function getSharedCSS(): string {
  return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .sm-overlay {
      position: fixed; inset: 0; z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0);
      backdrop-filter: blur(0px);
      transition: background 0.25s var(--sm-ease), backdrop-filter 0.25s var(--sm-ease);
      cursor: pointer;
    }
    .sm-overlay.sm-open {
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(10px) saturate(140%);
    }

    .sm-modal {
      background: var(--sm-bg);
      backdrop-filter: blur(48px) saturate(200%);
      border: 1px solid var(--sm-border);
      border-radius: var(--sm-radius);
      box-shadow: var(--sm-shadow);
      padding: 28px;
      width: min(520px, 100%);
      max-height: min(680px, 90dvh);
      overflow-y: auto;
      cursor: default;
      transform: translateY(24px) scale(0.94);
      opacity: 0;
      transition: transform 0.38s var(--sm-spring), opacity 0.25s var(--sm-ease);
      outline: none;
      scrollbar-width: thin;
      scrollbar-color: var(--sm-border) transparent;
    }
    .sm-overlay.sm-open .sm-modal {
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    /* Header */
    .sm-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
    }
    .sm-title-area {}
    .sm-title {
      font-size: 17px;
      font-weight: 650;
      color: var(--sm-text);
      letter-spacing: -0.02em;
      line-height: 1.3;
    }
    .sm-subtitle {
      font-size: 12px;
      color: var(--sm-text-muted);
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }
    .sm-close-btn {
      flex-shrink: 0;
      width: 30px; height: 30px;
      border-radius: 50%;
      border: 1px solid var(--sm-border);
      background: var(--sm-glass);
      color: var(--sm-text-muted);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
      transition: all 0.15s var(--sm-ease);
    }
    .sm-close-btn:hover {
      background: var(--sm-glass-hover);
      color: var(--sm-text);
      border-color: var(--sm-border-active);
    }
    .sm-close-btn:focus-visible {
      outline: 2px solid var(--sm-accent);
      outline-offset: 2px;
    }

    /* Provider Grid */
    .sm-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 10px;
      margin-bottom: 16px;
    }

    .sm-provider-btn {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 12px 14px;
      background: var(--sm-glass);
      border: 1px solid var(--sm-border);
      border-radius: var(--sm-radius-sm);
      cursor: pointer;
      color: var(--sm-text);
      font-family: var(--sm-font);
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: -0.01em;
      text-align: center;
      transition: background 0.18s var(--sm-ease),
                  border-color 0.18s var(--sm-ease),
                  transform 0.25s var(--sm-spring),
                  box-shadow 0.18s var(--sm-ease);
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    .sm-provider-btn:hover {
      background: var(--sm-glass-hover);
      border-color: var(--sm-border-active);
      transform: translateY(-3px);
      box-shadow: 0 10px 28px var(--sm-accent-glow);
    }
    .sm-provider-btn:active {
      transform: translateY(-1px) scale(0.97);
    }
    .sm-provider-btn:focus-visible {
      outline: 2px solid var(--sm-accent);
      outline-offset: 2px;
    }
    .sm-provider-btn.sm-preferred {
      border-color: var(--sm-border-active);
      background: rgba(99, 102, 241, 0.10);
    }
    .sm-preferred-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 14px;
      height: 14px;
      background: var(--sm-accent);
      border-radius: 50%;
      border: 2px solid var(--sm-bg);
    }
    .sm-provider-logo {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sm-provider-logo svg {
      width: 32px;
      height: 32px;
    }
    .sm-provider-name {
      line-height: 1.2;
      color: var(--sm-text);
    }
    .sm-no-body-note {
      font-size: 9px;
      color: var(--sm-text-xs);
      text-align: center;
    }

    /* Copy / Native row */
    .sm-actions-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .sm-copy-btn {
      flex: 1;
      min-width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid var(--sm-border);
      background: var(--sm-glass);
      color: var(--sm-text-muted);
      font-size: 12px;
      font-weight: 500;
      font-family: var(--sm-font);
      cursor: pointer;
      transition: all 0.18s var(--sm-ease);
    }
    .sm-copy-btn:hover {
      background: var(--sm-glass-hover);
      color: var(--sm-text);
      border-color: var(--sm-border-active);
    }
    .sm-copy-btn.sm-copied {
      color: #22c55e;
      border-color: rgba(34, 197, 94, 0.4);
    }
    .sm-copy-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
    .sm-copy-btn:focus-visible { outline: 2px solid var(--sm-accent); outline-offset: 2px; }

    /* Divider */
    .sm-divider {
      height: 1px;
      background: var(--sm-border);
      margin: 16px 0;
    }

    /* Footer */
    .sm-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .sm-powered-by {
      font-size: 10px;
      color: var(--sm-text-xs);
      text-decoration: none;
      letter-spacing: 0.01em;
    }
    .sm-powered-by:hover { color: var(--sm-text-muted); }
    .sm-region-badge {
      font-size: 10px;
      color: var(--sm-text-xs);
    }

    /* Animations */
    @keyframes sm-check-pop {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    .sm-check-icon { animation: sm-check-pop 0.3s var(--sm-spring) forwards; }
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM Builder
// ─────────────────────────────────────────────────────────────────────────────

function buildModalDOM(
  params: MailtoParams,
  resolved: ResolvedProviders,
  config: SmartMailtoConfig,
  onClose: () => void,
): HTMLElement {
  const i18n = { ...DEFAULT_I18N, ...config.i18n };
  const { providers, detectedRegion } = resolved;

  // Filter out the 'copy' provider — it gets its own section
  const mainProviders = providers.filter(p => !p.isCopy && !p.isNative);
  const nativeProvider = providers.find(p => p.isNative);
  const copyProvider = providers.find(p => p.isCopy);

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sm-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', i18n.title);

  // Close on overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) onClose();
  });

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'sm-modal';
  modal.setAttribute('tabindex', '-1');

  // ── Header ────────────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'sm-header';

  const titleArea = document.createElement('div');
  titleArea.className = 'sm-title-area';

  const title = document.createElement('div');
  title.className = 'sm-title';
  title.textContent = i18n.title;

  const subtitle = document.createElement('div');
  subtitle.className = 'sm-subtitle';
  const recipient = params.to[0] ?? '';
  subtitle.textContent = params.subject ? `${recipient} · ${params.subject}` : recipient;
  subtitle.title = subtitle.textContent;

  titleArea.appendChild(title);
  titleArea.appendChild(subtitle);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'sm-close-btn';
  closeBtn.setAttribute('aria-label', i18n.close);
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', onClose);

  header.appendChild(titleArea);
  header.appendChild(closeBtn);
  modal.appendChild(header);

  // ── Provider Grid ─────────────────────────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'sm-grid';
  grid.setAttribute('role', 'list');

  const preferredId = resolved.detectedFromEmail ?? config.preferredProvider ?? null;

  mainProviders.forEach(provider => {
    const btn = createProviderButton(provider, params, config, preferredId, onClose, i18n);
    grid.appendChild(btn);
  });

  modal.appendChild(grid);

  // ── Divider + Actions Row ─────────────────────────────────────────────────
  if (copyProvider || nativeProvider) {
    const divider = document.createElement('div');
    divider.className = 'sm-divider';
    modal.appendChild(divider);

    const actionsRow = document.createElement('div');
    actionsRow.className = 'sm-actions-row';

    if (nativeProvider) {
      const nativeBtn = createProviderButton(nativeProvider, params, config, null, onClose, i18n);
      nativeBtn.style.flex = '1';
      actionsRow.appendChild(nativeBtn);
    }

    if (copyProvider) {
      const copyBtn = createCopyButton(copyProvider, params, i18n, config);
      actionsRow.appendChild(copyBtn);
    }

    modal.appendChild(actionsRow);
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  const dividerFoot = document.createElement('div');
  dividerFoot.className = 'sm-divider';
  modal.appendChild(dividerFoot);

  const footer = document.createElement('div');
  footer.className = 'sm-footer';

  const poweredBy = document.createElement('a');
  poweredBy.className = 'sm-powered-by';
  poweredBy.href = 'https://smart-mailto.vercel.app';
  poweredBy.target = '_blank';
  poweredBy.rel = 'noopener noreferrer';
  poweredBy.textContent = 'smart-mailto';

  const regionBadge = document.createElement('div');
  regionBadge.className = 'sm-region-badge';
  regionBadge.textContent = `📍 ${detectedRegion}`;

  footer.appendChild(poweredBy);
  footer.appendChild(regionBadge);
  modal.appendChild(footer);

  overlay.appendChild(modal);
  return overlay;
}

function createProviderButton(
  provider: Provider,
  params: MailtoParams,
  config: SmartMailtoConfig,
  preferredId: string | null,
  onClose: () => void,
  i18n: typeof DEFAULT_I18N,
): HTMLElement {
  const btn = document.createElement('button');
  btn.className = 'sm-provider-btn';
  if (provider.id === preferredId) btn.classList.add('sm-preferred');
  btn.setAttribute('role', 'listitem');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', `Open in ${provider.name}`);

  // Preferred badge dot
  if (provider.id === preferredId) {
    const badge = document.createElement('div');
    badge.className = 'sm-preferred-badge';
    badge.setAttribute('aria-label', 'Recommended');
    btn.appendChild(badge);
  }

  // Logo
  const logoWrap = document.createElement('div');
  logoWrap.className = 'sm-provider-logo';
  logoWrap.innerHTML = provider.logoSvg || ICONS[provider.id] || ICONS['native'] || '';
  btn.appendChild(logoWrap);

  // Name
  const name = document.createElement('div');
  name.className = 'sm-provider-name';
  name.textContent = provider.name;
  btn.appendChild(name);

  // No-body note for E2EE providers
  if (provider.noBodyPreFill && params.body) {
    const note = document.createElement('div');
    note.className = 'sm-no-body-note';
    note.textContent = i18n.noBodyPreFillNote;
    btn.appendChild(note);
  }

  // Click handler — MUST be synchronous for Safari popup blocker
  btn.addEventListener('click', () => {
    const url = provider.buildUrl(params);

    if (provider.isCopy) {
      // Handled by createCopyButton
      return;
    } else if (provider.isNative) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Persist preference
    if (config.rememberChoice !== false) {
      savePreference(provider.id, config.storageKey);
    }

    // Analytics hook
    config.onOpen?.(provider, params);

    onClose();
  });

  return btn;
}

function createCopyButton(
  provider: Provider,
  params: MailtoParams,
  i18n: typeof DEFAULT_I18N,
  config: SmartMailtoConfig,
): HTMLElement {
  const email = params.to[0] ?? '';

  const btn = document.createElement('button');
  btn.className = 'sm-copy-btn';
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', `Copy ${email} to clipboard`);

  const icon = provider.logoSvg || ICONS[provider.id] || ICONS['copy'] || '';
  const updateContent = (copied: boolean) => {
    btn.innerHTML = copied
      ? `<span class="sm-check-icon">${icon}</span><span>${i18n.copied}</span>`
      : `${icon}<span>${i18n.copy}</span>`;
  };
  updateContent(false);

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      updateContent(true);
      config.onCopy?.(email);
      setTimeout(() => updateContent(false), 2000);
    } catch {
      // Clipboard API blocked — try legacy
      const el = document.createElement('textarea');
      el.value = email;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      updateContent(true);
      config.onCopy?.(email);
      setTimeout(() => updateContent(false), 2000);
    }
  });

  return btn;
}

// ─────────────────────────────────────────────────────────────────────────────
// Focus Trap
// ─────────────────────────────────────────────────────────────────────────────

function trapFocus(container: ShadowRoot): () => void {
  const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const handler = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const elements = [...container.querySelectorAll<HTMLElement>(focusable)].filter(
      el => !el.hasAttribute('disabled'),
    );

    if (elements.length === 0) return;

    const first = elements[0]!;
    const last = elements[elements.length - 1]!;
    const active = container.activeElement;

    if (e.shiftKey) {
      if (active === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Spawns the smart-mailto modal as a Shadow DOM element attached to document.body.
 * Must be called synchronously within a user-click event handler.
 */
export function spawnModal(
  params: MailtoParams,
  resolved: ResolvedProviders,
  config: SmartMailtoConfig,
): void {
  // Prevent duplicate modals
  document.getElementById('__smart-mailto-host__')?.remove();

  const host = document.createElement('div');
  host.id = '__smart-mailto-host__';
  host.style.cssText = 'position:fixed;z-index:2147483647;';

  const shadow = host.attachShadow({ mode: 'open' });

  // Build styles
  const style = document.createElement('style');
  const themeCSS =
    config.theme === 'dark'
      ? getDarkThemeCSS()
      : config.theme === 'light'
        ? getLightThemeCSS()
        : getAutoThemeCSS();

  style.textContent = themeCSS + getSharedCSS();
  shadow.appendChild(style);

  // Cleanup function
  let cleanupFocusTrap: (() => void) | null = null;
  let keyHandler: ((e: KeyboardEvent) => void) | null = null;

  const close = () => {
    const overlay = shadow.querySelector('.sm-overlay');
    if (overlay) {
      overlay.classList.remove('sm-open');
      setTimeout(() => {
        host.remove();
        cleanupFocusTrap?.();
        if (keyHandler) document.removeEventListener('keydown', keyHandler);
        config.onClose?.();
      }, 280);
    }
  };

  // Build and attach modal DOM
  const overlayEl = buildModalDOM(params, resolved, config, close);
  shadow.appendChild(overlayEl);
  document.body.appendChild(host);

  // Trigger open animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlayEl.classList.add('sm-open');
      const modal = shadow.querySelector<HTMLElement>('.sm-modal');
      modal?.focus();
    });
  });

  // Focus trap
  cleanupFocusTrap = trapFocus(shadow);

  // ESC key close
  keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', keyHandler);
}
