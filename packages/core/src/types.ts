/**
 * @smart-mailto/core — Types
 * The complete TypeScript type surface for the smart-mailto engine.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Core Data Structures
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parsed representation of a mailto: URI.
 * All string values are decoded (not URL-encoded).
 */
export interface MailtoParams {
  /** Primary recipient(s) */
  to: string[];
  /** CC recipient(s) */
  cc?: string[];
  /** BCC recipient(s) */
  bcc?: string[];
  /** Email subject line */
  subject?: string;
  /** Email body text */
  body?: string;
}

/**
 * A single email provider with metadata and URL builder.
 */
export interface Provider {
  /** Unique machine ID, e.g. "gmail", "outlook-personal" */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Builds the compose URL for this provider given mailto params */
  buildUrl: (params: MailtoParams) => string;
  /** Inline SVG string (data URI) for the provider logo. If omitted, will be loaded dynamically */
  logoSvg?: string;
  /** Brand hex color, e.g. "#EA4335" */
  color: string;
  /** Text color for contrast on the brand color background */
  textColor: string;
  /** If true, triggers native mailto: instead of a webmail URL */
  isNative?: boolean;
  /** If true, copies the email address to clipboard */
  isCopy?: boolean;
  /** Informational: which regions this provider is popular in */
  regions?: string[];
  /** If true, body pre-fill is not supported (e.g., ProtonMail E2EE) */
  noBodyPreFill?: boolean;
  /** If true, this provider has no working compose URL — shown as informational only */
  fallbackOnly?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light' | 'auto';

/**
 * CSS class name overrides for headless/unstyled mode.
 * When any classNames are provided, the built-in styles are NOT injected.
 */
export interface ClassNames {
  overlay?: string;
  modal?: string;
  header?: string;
  providerGrid?: string;
  providerButton?: string;
  providerButtonActive?: string;
  providerLogo?: string;
  providerName?: string;
  copyButton?: string;
  closeButton?: string;
  emailPreview?: string;
}

/**
 * i18n strings for modal UI copy.
 */
export interface I18nStrings {
  title: string;
  copy: string;
  copied: string;
  native: string;
  close: string;
  toLabel: string;
  subjectLabel: string;
  bodyTruncatedNote: string;
  noBodyPreFillNote: string;
}

/**
 * Analytics / lifecycle hooks.
 */
export interface SmartMailtoHooks {
  /** Fired when user clicks a provider button (before the window opens) */
  onOpen?: (provider: Provider, params: MailtoParams) => void;
  /** Fired when user copies an email address */
  onCopy?: (email: string) => void;
  /** Fired when the modal is dismissed without selecting a provider */
  onClose?: () => void;
  /** Fired when the modal is first shown */
  onShow?: (params: MailtoParams, providers: Provider[]) => void;
}

/**
 * Full configuration object for initSmartMailto() and all wrappers.
 */
export interface SmartMailtoConfig extends SmartMailtoHooks {
  /** Visual theme. Defaults to 'auto' (prefers-color-scheme). */
  theme?: Theme;
  /**
   * Use browser heuristics (Intl + navigator.language) to order providers.
   * Defaults to true.
   */
  autoDetectGeo?: boolean;
  /**
   * Force a specific provider to the top of the list (by provider ID).
   * Overrides geo-detection ordering.
   */
  preferredProvider?: string;
  /**
   * Maximum number of provider buttons to show in the modal.
   * Defaults to 6.
   */
  maxProviders?: number;
  /** Include the "Open in Native Mail App" option. Defaults to true on mobile. */
  includeNative?: boolean;
  /** Always include a "Copy Email Address" button. Defaults to true. */
  includeCopy?: boolean;
  /**
   * Inject additional custom/enterprise providers.
   * These are prepended to the provider list.
   */
  customProviders?: Provider[];
  /**
   * Exclude specific provider IDs from the list.
   * Example: ['yahoo', 'mailru'] to hide Yahoo and Mail.ru.
   */
  excludeProviders?: string[];
  /**
   * CSS class name overrides (activates headless/unstyled mode).
   * When provided, all built-in CSS is skipped.
   */
  classNames?: ClassNames;
  /** Override UI strings for internationalization. */
  i18n?: Partial<I18nStrings>;
  /**
   * Whether to persist the user's provider choice to localStorage.
   * On next visit, that provider will be shown first. Defaults to true.
   */
  rememberChoice?: boolean;
  /**
   * localStorage key for persisting the user's preferred provider.
   * Defaults to 'smart-mailto:preferred'.
   */
  storageKey?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal / Derived Types
// ─────────────────────────────────────────────────────────────────────────────

/** Geo-detection result from browser heuristics */
export interface GeoSignals {
  timeZone: string;
  locale: string;
  locales: readonly string[];
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

/** Result of resolving which providers to show for a given context */
export interface ResolvedProviders {
  providers: Provider[];
  detectedRegion: string;
  signals: GeoSignals;
  detectedFromEmail: string | null;
}

/** Validation result for a single provider URL */
export interface ProviderValidationResult {
  providerId: string;
  url: string;
  status: number | null;
  ok: boolean;
  redirectUrl?: string;
  error?: string;
  checkedAt: string;
}
