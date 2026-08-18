import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const posthog = vi.hoisted(() => ({
  capture: vi.fn(),
  init: vi.fn(),
}));

vi.mock('posthog-js', () => ({ default: posthog }));

import {
  captureInstallCopy,
  captureGuidesDeskView,
  captureGuidesInstallCopy,
  captureDemoPageview,
  captureQuickStartView,
  captureMailtoTestInstallCopy,
  captureMailtoTestRun,
  createDemoAnalyticsHooks,
  DEMO_EVENTS,
  GUIDES_VISIT_SOURCES,
  initializeDemoAnalytics,
  observeQuickStartView,
  POSTHOG_PRIVACY_CONFIG,
  sanitizeDemoEvent,
} from './demoAnalytics';

describe('privacy-safe homepage demo analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('disables broad collection, profiles, replay, and durable persistence', () => {
    initializeDemoAnalytics();

    expect(posthog.init).toHaveBeenCalledOnce();
    expect(posthog.init.mock.calls[0]?.[1]).toMatchObject({
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
    });
  });

  it('captures exactly the eleven approved product events', () => {
    const hooks = createDemoAnalyticsHooks();

    captureDemoPageview();
    hooks.onShow();
    hooks.onOpen();
    hooks.onCopy();
    hooks.onClose();
    captureQuickStartView();
    captureInstallCopy();
    captureGuidesDeskView();
    captureGuidesInstallCopy();
    captureMailtoTestRun();
    captureMailtoTestInstallCopy();

    expect(posthog.capture.mock.calls.map(([event]) => event)).toEqual([
      DEMO_EVENTS.pageview,
      DEMO_EVENTS.pickerShown,
      DEMO_EVENTS.providerSelected,
      DEMO_EVENTS.addressCopied,
      DEMO_EVENTS.pickerDismissed,
      DEMO_EVENTS.quickStartViewed,
      DEMO_EVENTS.installCopied,
      DEMO_EVENTS.guidesDeskViewed,
      DEMO_EVENTS.guidesInstallCopied,
      DEMO_EVENTS.mailtoTestRun,
      DEMO_EVENTS.mailtoTestInstallCopied,
    ]);
    expect(new Set(Object.values(DEMO_EVENTS)).size).toBe(11);
  });

  it('records tester actions with fixed fields and no mailto contents', () => {
    captureMailtoTestRun();
    captureMailtoTestInstallCopy();

    expect(posthog.capture.mock.calls).toEqual([
      [DEMO_EVENTS.mailtoTestRun, { page: 'mailto_link_tester', command_position: 'tester' }],
      [
        DEMO_EVENTS.mailtoTestInstallCopied,
        { page: 'mailto_link_tester', command_position: 'tester' },
      ],
    ]);

    for (const event of [DEMO_EVENTS.mailtoTestRun, DEMO_EVENTS.mailtoTestInstallCopied]) {
      const sanitized = sanitizeDemoEvent({
        event,
        properties: {
          token: 'public-project-key',
          distinct_id: 'random-device-id',
          page: 'private-page',
          command_position: 'private-position',
          href: 'mailto:private@example.com?subject=private',
          recipient: 'private@example.com',
          subject: 'private subject',
          body: 'private body',
        },
        uuid: 'random-event-id',
      });

      expect(sanitized?.properties).toEqual({
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        $process_person_profile: false,
        page: 'mailto_link_tester',
        command_position: 'tester',
      });
      expect(JSON.stringify(sanitized)).not.toContain('private@example.com');
    }
  });

  it('captures one quick-start view across repeated viewport crossings', () => {
    let callback: IntersectionObserverCallback = () => undefined;
    const intersectionObserver = {} as IntersectionObserver;
    const observer = {
      disconnect: vi.fn(),
      observe: vi.fn(),
    };
    class MockIntersectionObserver {
      readonly root = null;
      readonly rootMargin = '0px';
      readonly thresholds = [0];

      constructor(nextCallback: IntersectionObserverCallback) {
        callback = nextCallback;
      }

      disconnect = observer.disconnect;
      observe = observer.observe;
      takeRecords = () => [];
      unobserve = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    const element = {} as Element;
    const capture = vi.fn();

    const cleanup = observeQuickStartView(element, capture);
    callback([{ isIntersecting: false } as IntersectionObserverEntry], intersectionObserver);
    callback([{ isIntersecting: true } as IntersectionObserverEntry], intersectionObserver);
    callback([{ isIntersecting: false } as IntersectionObserverEntry], intersectionObserver);
    callback([{ isIntersecting: true } as IntersectionObserverEntry], intersectionObserver);

    expect(observer.observe).toHaveBeenCalledOnce();
    expect(observer.observe).toHaveBeenCalledWith(element);
    expect(capture).toHaveBeenCalledOnce();
    expect(observer.disconnect).toHaveBeenCalledOnce();

    cleanup();
    expect(observer.disconnect).toHaveBeenCalledTimes(2);
  });

  it('records the quick-start view with only fixed page and position properties', () => {
    captureQuickStartView();

    expect(posthog.capture).toHaveBeenCalledOnce();
    expect(posthog.capture).toHaveBeenCalledWith(DEMO_EVENTS.quickStartViewed, {
      page: 'homepage',
      command_position: 'quick_start',
    });

    const sanitized = sanitizeDemoEvent({
      event: DEMO_EVENTS.quickStartViewed,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        $current_url: 'https://example.test/?email=private@example.com',
        page: 'private-page',
        command_position: 'private-position',
        command: 'npm install private-package',
      },
      uuid: 'random-event-id',
    });

    expect(sanitized?.properties).toEqual({
      token: 'public-project-key',
      distinct_id: 'random-device-id',
      $process_person_profile: false,
      page: 'homepage',
      command_position: 'quick_start',
    });
    expect(JSON.stringify(sanitized)).not.toContain('private');
  });

  it('records one install-copy event with only its fixed page and command position', () => {
    captureInstallCopy();

    expect(posthog.capture).toHaveBeenCalledOnce();
    expect(posthog.capture).toHaveBeenCalledWith(DEMO_EVENTS.installCopied, {
      page: 'homepage',
      command_position: 'quick_start',
    });

    const sanitized = sanitizeDemoEvent({
      event: DEMO_EVENTS.installCopied,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        page: 'private-page',
        command_position: 'private-position',
        email: 'private@example.com',
        command: 'npm install private-package',
      },
      uuid: 'random-event-id',
    });

    expect(sanitized?.properties).toEqual({
      token: 'public-project-key',
      distinct_id: 'random-device-id',
      $process_person_profile: false,
      page: 'homepage',
      command_position: 'quick_start',
    });
    expect(JSON.stringify(sanitized)).not.toContain('private');
  });

  it('records the distinct Guides desk install copy with only fixed location properties', () => {
    captureGuidesInstallCopy();

    expect(posthog.capture).toHaveBeenCalledOnce();
    expect(posthog.capture).toHaveBeenCalledWith(DEMO_EVENTS.guidesInstallCopied, {
      page: 'guides',
      command_position: 'guide_desk',
    });

    const sanitized = sanitizeDemoEvent({
      event: DEMO_EVENTS.guidesInstallCopied,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        page: 'guides',
        command_position: 'guide_desk',
        email: 'private@example.com',
        command: 'npm install private-package',
        clipboard: 'private clipboard contents',
      },
      uuid: 'random-event-id',
    });

    expect(sanitized?.properties).toEqual({
      token: 'public-project-key',
      distinct_id: 'random-device-id',
      $process_person_profile: false,
      page: 'guides',
      command_position: 'guide_desk',
    });
    expect(JSON.stringify(sanitized)).not.toContain('private');
  });

  it('records the distinct Guides desk view with one allowed visit source', () => {
    captureGuidesDeskView(GUIDES_VISIT_SOURCES.directInvitation);

    expect(posthog.capture).toHaveBeenCalledOnce();
    expect(posthog.capture).toHaveBeenCalledWith(DEMO_EVENTS.guidesDeskViewed, {
      page: 'guides',
      command_position: 'guide_desk',
      visit_source: 'direct_invitation',
    });

    const sanitized = sanitizeDemoEvent({
      event: DEMO_EVENTS.guidesDeskViewed,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        page: 'private-page',
        command_position: 'private-position',
        visit_source: 'direct_invitation',
        $current_url: 'https://example.test/?email=private@example.com',
      },
      uuid: 'random-event-id',
    });

    expect(sanitized?.properties).toEqual({
      token: 'public-project-key',
      distinct_id: 'random-device-id',
      $process_person_profile: false,
      page: 'guides',
      command_position: 'guide_desk',
      visit_source: 'direct_invitation',
    });
    expect(JSON.stringify(sanitized)).not.toContain('private');
  });

  it('falls back to an unclassified Guides visit when the source is missing or invalid', () => {
    captureGuidesDeskView();

    expect(posthog.capture).toHaveBeenCalledWith(DEMO_EVENTS.guidesDeskViewed, {
      page: 'guides',
      command_position: 'guide_desk',
      visit_source: 'unclassified',
    });

    const sanitized = sanitizeDemoEvent({
      event: DEMO_EVENTS.guidesDeskViewed,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        visit_source: 'private-campaign-name',
      },
      uuid: 'random-event-id',
    });

    expect(sanitized?.properties?.visit_source).toBe('unclassified');
    expect(JSON.stringify(sanitized)).not.toContain('private-campaign-name');
  });

  it('allows only non-identifying event properties and drops every other event', () => {
    const sanitized = sanitizeDemoEvent({
      event: DEMO_EVENTS.providerSelected,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        $current_url: 'https://example.test/?email=private@example.com',
        recipient: 'private@example.com',
        recipient_domain: 'example.com',
        subject: 'private subject',
        body: 'private body',
        provider_url: 'https://mail.example.com/compose?to=private@example.com',
        provider_id: 'private-provider',
      },
      uuid: 'random-event-id',
    });

    expect(sanitized).toEqual({
      uuid: 'random-event-id',
      event: DEMO_EVENTS.providerSelected,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        $process_person_profile: false,
        demo_location: 'homepage_live_demo',
      },
    });

    expect(
      sanitizeDemoEvent({
        uuid: 'random-event-id',
        event: '$pageview',
        properties: { token: 'public-project-key' },
      }),
    ).toBeNull();
    expect(JSON.stringify(sanitized)).not.toContain('private');
  });

  it('passes no lifecycle arguments or mailto contents to capture', () => {
    const capture = vi.fn();
    const hooks = createDemoAnalyticsHooks(capture);

    hooks.onShow();
    hooks.onOpen();
    hooks.onCopy();
    hooks.onClose();

    for (const call of capture.mock.calls) {
      expect(call).toHaveLength(1);
    }
  });

  it('keeps the PostHog event boundary enforced by before_send', () => {
    expect(POSTHOG_PRIVACY_CONFIG.before_send).toBe(sanitizeDemoEvent);
  });
});
