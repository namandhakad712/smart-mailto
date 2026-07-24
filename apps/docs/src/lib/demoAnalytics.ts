import posthog, { type CaptureResult, type PostHogConfig } from 'posthog-js';

const POSTHOG_PUBLIC_KEY = 'phc_qCtuutcc4o9VsAZd9jJpWsLMMBcuh6BvCStvqRpT3NZK';
const POSTHOG_HOST = 'https://us.i.posthog.com';
const DEMO_LOCATION = 'homepage_live_demo';

export const DEMO_EVENTS = {
  pageview: 'homepage_demo_pageview',
  pickerShown: 'demo_picker_shown',
  providerSelected: 'demo_provider_selected',
  addressCopied: 'demo_address_copied',
} as const;

type DemoEventName = (typeof DEMO_EVENTS)[keyof typeof DEMO_EVENTS];

const EVENT_NAMES = new Set<DemoEventName>(Object.values(DEMO_EVENTS));

export function sanitizeDemoEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event || !EVENT_NAMES.has(event.event as DemoEventName)) return null;

  return {
    uuid: event.uuid,
    event: event.event,
    properties: {
      token: event.properties?.token,
      distinct_id: event.properties?.distinct_id,
      $process_person_profile: false,
      demo_location: DEMO_LOCATION,
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

export function createDemoAnalyticsHooks(capture = captureDemoEvent) {
  return {
    onShow: () => capture(DEMO_EVENTS.pickerShown),
    onOpen: () => capture(DEMO_EVENTS.providerSelected),
    onCopy: () => capture(DEMO_EVENTS.addressCopied),
  };
}
