import posthog, { type CaptureResult, type PostHogConfig } from 'posthog-js';

const POSTHOG_PUBLIC_KEY = 'phc_qCtuutcc4o9VsAZd9jJpWsLMMBcuh6BvCStvqRpT3NZK';
const POSTHOG_HOST = 'https://us.i.posthog.com';
const DEMO_LOCATION = 'homepage_live_demo';
const QUICK_START_PAGE = 'homepage';
const QUICK_START_POSITION = 'quick_start';
const GUIDES_PAGE = 'guides';
const GUIDES_INSTALL_POSITION = 'guide_desk';
const MAILTO_TEST_PAGE = 'mailto_link_tester';
const MAILTO_TEST_POSITION = 'tester';

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

function normalizeGuidesVisitSource(value: unknown): GuidesVisitSource {
  return typeof value === 'string' && GUIDES_VISIT_SOURCE_VALUES.has(value as GuidesVisitSource)
    ? (value as GuidesVisitSource)
    : GUIDES_VISIT_SOURCES.unclassified;
}

export function sanitizeDemoEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event || !EVENT_NAMES.has(event.event as DemoEventName)) return null;

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
