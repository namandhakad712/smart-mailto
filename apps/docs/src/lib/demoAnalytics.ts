import posthog, { type CaptureResult, type PostHogConfig } from 'posthog-js';

import { PUBLIC_PAGE_PATH_SET } from './publicRoutes';

const POSTHOG_PUBLIC_KEY = 'phc_qCtuutcc4o9VsAZd9jJpWsLMMBcuh6BvCStvqRpT3NZK';
const POSTHOG_HOST = 'https://us.i.posthog.com';
const DEMO_LOCATION = 'homepage_live_demo';
const QUICK_START_PAGE = 'homepage';
const QUICK_START_POSITION = 'quick_start';
const GUIDES_PAGE = 'guides';
const GUIDES_INSTALL_POSITION = 'guide_desk';
const MAILTO_TEST_PAGE = 'mailto_link_tester';
const MAILTO_TEST_POSITION = 'tester';
export const SITE_PAGEVIEW_EVENT = '$pageview';

export const ARRIVAL_SOURCES = {
  search: 'search',
  direct: 'direct',
  directory: 'directory',
  repository: 'repository',
  other: 'other',
  unclassified: 'unclassified',
} as const;

export type ArrivalSource = (typeof ARRIVAL_SOURCES)[keyof typeof ARRIVAL_SOURCES];

const ARRIVAL_SOURCE_VALUES = new Set<ArrivalSource>(Object.values(ARRIVAL_SOURCES));
const NO_REFERRER = 'none';
const UNCLASSIFIED_REFERRER = 'unclassified';
const CONTROLLED_VISIT_SOURCE = 'direct_invitation';
const SEARCH_HOSTS = [
  'google.',
  'bing.com',
  'duckduckgo.com',
  'search.yahoo.com',
  'search.brave.com',
  'ecosia.org',
  'yandex.',
  'baidu.com',
];
const DIRECTORY_HOSTS = [
  'devtoolsdirectory.com',
  'devhunt.org',
  'libhunt.com',
  'peerlist.io',
  'reporanker.com',
  'jster.net',
];
const REPOSITORY_HOSTS = ['github.com', 'gitlab.com', 'bitbucket.org', 'npmjs.com'];

export const GUIDES_VISIT_SOURCES = {
  directInvitation: 'direct_invitation',
  search: 'search',
  repository: 'repository',
  unclassified: 'unclassified',
} as const;

export type GuidesVisitSource = (typeof GUIDES_VISIT_SOURCES)[keyof typeof GUIDES_VISIT_SOURCES];

const GUIDES_VISIT_SOURCE_VALUES = new Set<GuidesVisitSource>(Object.values(GUIDES_VISIT_SOURCES));

export const DEMO_EVENTS = {
  pageview: 'homepage_demo_pageview',
  pickerShown: 'demo_picker_shown',
  providerSelected: 'demo_provider_selected',
  addressCopied: 'demo_address_copied',
  pickerDismissed: 'demo_picker_dismissed',
  quickStartViewed: 'quick_start_viewed',
  installCopied: 'install_copy',
  guidesDeskViewed: 'guides_desk_viewed',
  guidesInstallCopied: 'guides_install_copy',
  mailtoTestValid: 'mailto_test_valid',
  mailtoTestWarning: 'mailto_test_warning',
  mailtoTestInvalid: 'mailto_test_invalid',
  mailtoTestInstallCopied: 'mailto_test_install_copy',
} as const;

type DemoEventName = (typeof DEMO_EVENTS)[keyof typeof DEMO_EVENTS];
type MailtoTestStatus = 'empty' | 'invalid' | 'warning' | 'valid';

const EVENT_NAMES = new Set<DemoEventName>(Object.values(DEMO_EVENTS));
const MAILTO_TEST_OUTCOME_EVENTS = {
  invalid: DEMO_EVENTS.mailtoTestInvalid,
  warning: DEMO_EVENTS.mailtoTestWarning,
  valid: DEMO_EVENTS.mailtoTestValid,
} as const satisfies Record<Exclude<MailtoTestStatus, 'empty'>, DemoEventName>;
const MAILTO_TEST_EVENT_NAMES = new Set<DemoEventName>([
  ...Object.values(MAILTO_TEST_OUTCOME_EVENTS),
  DEMO_EVENTS.mailtoTestInstallCopied,
]);

type PageviewCapture = (
  event: typeof SITE_PAGEVIEW_EVENT,
  properties: SitePageviewProperties,
) => void;

export interface SitePageviewProperties {
  page_path: string;
  referrer_origin: string;
  arrival_source: ArrivalSource;
  controlled_event: boolean;
}

interface SitePageviewTracker {
  captureInitial: () => void;
  captureNavigation: (url: string) => void;
}

let sitePageviewTracker: SitePageviewTracker | null = null;

function hostnameMatches(hostname: string, candidate: string): boolean {
  return hostname === candidate || hostname.endsWith(`.${candidate}`);
}

function isSearchHostname(hostname: string): boolean {
  return SEARCH_HOSTS.some(candidate =>
    candidate.endsWith('.')
      ? hostname.startsWith(candidate) || hostname.includes(`.${candidate}`)
      : hostnameMatches(hostname, candidate),
  );
}

function readUrl(value: string, base = 'https://smart-mailto.invalid'): URL | null {
  try {
    const parsed = new URL(value, base);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed : null;
  } catch {
    return null;
  }
}

function readAbsoluteUrl(value: string): URL | null {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed : null;
  } catch {
    return null;
  }
}

export function sanitizePagePath(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const parsed = readUrl(value);
  if (!parsed) return null;
  const pagePath = parsed.pathname || '/';
  return PUBLIC_PAGE_PATH_SET.has(pagePath) ? pagePath : null;
}

export function sanitizeReferrerOrigin(value: unknown): string {
  if (value === NO_REFERRER || value === UNCLASSIFIED_REFERRER) return value;
  if (typeof value !== 'string' || value.length === 0) return NO_REFERRER;

  return readAbsoluteUrl(value)?.origin ?? UNCLASSIFIED_REFERRER;
}

function explicitArrivalSource(url: string): ArrivalSource | null {
  const parsed = readUrl(url);
  const visitSource = parsed?.searchParams.get('visit_source');

  if (visitSource === GUIDES_VISIT_SOURCES.search) return ARRIVAL_SOURCES.search;
  if (visitSource === GUIDES_VISIT_SOURCES.repository) return ARRIVAL_SOURCES.repository;
  if (visitSource === CONTROLLED_VISIT_SOURCE) return ARRIVAL_SOURCES.direct;
  return null;
}

export function classifyArrivalSource(url: string, referrer: string): ArrivalSource {
  const explicitSource = explicitArrivalSource(url);
  if (explicitSource) return explicitSource;
  if (!referrer) return ARRIVAL_SOURCES.direct;

  const parsedReferrer = readAbsoluteUrl(referrer);
  if (!parsedReferrer) return ARRIVAL_SOURCES.unclassified;

  const hostname = parsedReferrer.hostname.toLowerCase();
  if (isSearchHostname(hostname)) return ARRIVAL_SOURCES.search;
  if (REPOSITORY_HOSTS.some(candidate => hostnameMatches(hostname, candidate))) {
    return ARRIVAL_SOURCES.repository;
  }
  if (DIRECTORY_HOSTS.some(candidate => hostnameMatches(hostname, candidate))) {
    return ARRIVAL_SOURCES.directory;
  }
  return ARRIVAL_SOURCES.other;
}

function normalizeArrivalSource(value: unknown): ArrivalSource {
  return typeof value === 'string' && ARRIVAL_SOURCE_VALUES.has(value as ArrivalSource)
    ? (value as ArrivalSource)
    : ARRIVAL_SOURCES.unclassified;
}

function isControlledPageview(url: string): boolean {
  return readUrl(url)?.searchParams.get('visit_source') === CONTROLLED_VISIT_SOURCE;
}

export function createSitePageviewTracker(
  initialUrl: string,
  referrer: string,
  capture: PageviewCapture = (event, properties) => posthog.capture(event, properties),
): SitePageviewTracker {
  const referrerOrigin = sanitizeReferrerOrigin(referrer);
  const arrivalSource = classifyArrivalSource(initialUrl, referrer);
  const controlledEvent = isControlledPageview(initialUrl);
  let lastPagePath: string | null = null;

  const capturePageview = (url: string) => {
    const pagePath = sanitizePagePath(url);
    if (!pagePath || pagePath === lastPagePath) return;

    lastPagePath = pagePath;
    capture(SITE_PAGEVIEW_EVENT, {
      page_path: pagePath,
      referrer_origin: referrerOrigin,
      arrival_source: arrivalSource,
      controlled_event: controlledEvent,
    });
  };

  return {
    captureInitial: () => capturePageview(initialUrl),
    captureNavigation: capturePageview,
  };
}

function normalizeGuidesVisitSource(value: unknown): GuidesVisitSource {
  return typeof value === 'string' && GUIDES_VISIT_SOURCE_VALUES.has(value as GuidesVisitSource)
    ? (value as GuidesVisitSource)
    : GUIDES_VISIT_SOURCES.unclassified;
}

export function sanitizeDemoEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event) return null;

  if (event.event === SITE_PAGEVIEW_EVENT) {
    const pagePath = sanitizePagePath(event.properties?.page_path);
    if (!pagePath) return null;

    return {
      uuid: event.uuid,
      event: event.event,
      properties: {
        token: event.properties?.token,
        distinct_id: event.properties?.distinct_id,
        $process_person_profile: false,
        page_path: pagePath,
        referrer_origin: sanitizeReferrerOrigin(event.properties?.referrer_origin),
        arrival_source: normalizeArrivalSource(event.properties?.arrival_source),
        controlled_event: event.properties?.controlled_event === true,
      },
    };
  }

  if (!EVENT_NAMES.has(event.event as DemoEventName)) return null;

  const fixedLocationProperties =
    event.event === DEMO_EVENTS.guidesDeskViewed
      ? {
          page: GUIDES_PAGE,
          command_position: GUIDES_INSTALL_POSITION,
          visit_source: normalizeGuidesVisitSource(event.properties?.visit_source),
        }
      : event.event === DEMO_EVENTS.guidesInstallCopied
        ? {
            page: GUIDES_PAGE,
            command_position: GUIDES_INSTALL_POSITION,
          }
        : MAILTO_TEST_EVENT_NAMES.has(event.event as DemoEventName)
          ? {
              page: MAILTO_TEST_PAGE,
              command_position: MAILTO_TEST_POSITION,
            }
          : event.event === DEMO_EVENTS.installCopied ||
              event.event === DEMO_EVENTS.quickStartViewed
            ? {
                page: QUICK_START_PAGE,
                command_position: QUICK_START_POSITION,
              }
            : {};

  return {
    uuid: event.uuid,
    event: event.event,
    properties: {
      token: event.properties?.token,
      distinct_id: event.properties?.distinct_id,
      $process_person_profile: false,
      ...(event.event === DEMO_EVENTS.quickStartViewed ||
      event.event === DEMO_EVENTS.installCopied ||
      event.event === DEMO_EVENTS.guidesDeskViewed ||
      event.event === DEMO_EVENTS.guidesInstallCopied ||
      MAILTO_TEST_EVENT_NAMES.has(event.event as DemoEventName)
        ? {}
        : { demo_location: DEMO_LOCATION }),
      ...fixedLocationProperties,
    },
  };
}

export const POSTHOG_PRIVACY_CONFIG: Partial<PostHogConfig> = {
  api_host: POSTHOG_HOST,
  autocapture: false,
  capture_pageview: false,
  capture_pageleave: false,
  capture_performance: false,
  capture_heatmaps: false,
  capture_dead_clicks: false,
  capture_exceptions: false,
  rageclick: false,
  disable_session_recording: true,
  disable_external_dependency_loading: true,
  person_profiles: 'never',
  persistence: 'memory',
  advanced_disable_decide: true,
  disable_surveys: true,
  before_send: sanitizeDemoEvent,
};

export function initializeDemoAnalytics() {
  posthog.init(POSTHOG_PUBLIC_KEY, POSTHOG_PRIVACY_CONFIG);

  if (typeof window === 'undefined') return;
  sitePageviewTracker = createSitePageviewTracker(window.location.href, document.referrer);
  sitePageviewTracker.captureInitial();
}

export function captureSitePageviewNavigation(url: string) {
  sitePageviewTracker?.captureNavigation(url);
}

export function captureDemoEvent(event: DemoEventName) {
  posthog.capture(event, { demo_location: DEMO_LOCATION });
}

export const captureDemoPageview = () => captureDemoEvent(DEMO_EVENTS.pageview);

export function captureQuickStartView() {
  posthog.capture(DEMO_EVENTS.quickStartViewed, {
    page: QUICK_START_PAGE,
    command_position: QUICK_START_POSITION,
  });
}

export function captureInstallCopy() {
  posthog.capture(DEMO_EVENTS.installCopied, {
    page: QUICK_START_PAGE,
    command_position: QUICK_START_POSITION,
  });
}

export function captureGuidesInstallCopy() {
  posthog.capture(DEMO_EVENTS.guidesInstallCopied, {
    page: GUIDES_PAGE,
    command_position: GUIDES_INSTALL_POSITION,
  });
}

export function captureGuidesDeskView(
  visitSource: GuidesVisitSource = GUIDES_VISIT_SOURCES.unclassified,
) {
  posthog.capture(DEMO_EVENTS.guidesDeskViewed, {
    page: GUIDES_PAGE,
    command_position: GUIDES_INSTALL_POSITION,
    visit_source: normalizeGuidesVisitSource(visitSource),
  });
}

export function captureMailtoTestOutcome(status: MailtoTestStatus) {
  if (status === 'empty') return;

  posthog.capture(MAILTO_TEST_OUTCOME_EVENTS[status], {
    page: MAILTO_TEST_PAGE,
    command_position: MAILTO_TEST_POSITION,
  });
}

export function captureMailtoTestInstallCopy() {
  posthog.capture(DEMO_EVENTS.mailtoTestInstallCopied, {
    page: MAILTO_TEST_PAGE,
    command_position: MAILTO_TEST_POSITION,
  });
}

export function observeQuickStartView(
  element: Element,
  capture = captureQuickStartView,
): () => void {
  let captured = false;
  const observer = new IntersectionObserver(entries => {
    if (captured || !entries.some(entry => entry.isIntersecting)) return;

    captured = true;
    capture();
    observer.disconnect();
  });

  observer.observe(element);
  return () => observer.disconnect();
}

export function createDemoAnalyticsHooks(capture = captureDemoEvent) {
  return {
    onShow: () => capture(DEMO_EVENTS.pickerShown),
    onOpen: () => capture(DEMO_EVENTS.providerSelected),
    onCopy: () => capture(DEMO_EVENTS.addressCopied),
    onClose: () => capture(DEMO_EVENTS.pickerDismissed),
  };
}
