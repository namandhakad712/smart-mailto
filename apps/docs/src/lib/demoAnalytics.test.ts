import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const posthog = vi.hoisted(() => ({
  capture: vi.fn(),
  init: vi.fn(),
}));

vi.mock('posthog-js', () => ({ default: posthog }));

import {
  ARRIVAL_SOURCES,
  captureInstallCopy,
  captureGuidesDeskView,
  captureGuidesInstallCopy,
  captureDemoPageview,
  captureQuickStartView,
  captureMailtoTestInstallCopy,
  captureMailtoTestOutcome,
  createMailtoGeneratorAnalytics,
  classifyArrivalSource,
  createDemoAnalyticsHooks,
  createSitePageviewTracker,
  DEMO_EVENTS,
  GUIDES_VISIT_SOURCES,
  initializeDemoAnalytics,
  observeQuickStartView,
  POSTHOG_PRIVACY_CONFIG,
  sanitizePagePath,
  sanitizeReferrerOrigin,
  sanitizeDemoEvent,
  SITE_PAGEVIEW_EVENT,
} from './demoAnalytics';
import { PUBLIC_PAGE_PATHS } from './publicRoutes';

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

  it('captures exactly the fifteen approved product events', () => {
    const hooks = createDemoAnalyticsHooks();
    const generator = createMailtoGeneratorAnalytics();

    captureDemoPageview();
    hooks.onShow();
    hooks.onOpen();
    hooks.onCopy();
    hooks.onClose();
    captureQuickStartView();
    captureInstallCopy();
    captureGuidesDeskView();
    captureGuidesInstallCopy();
    captureMailtoTestOutcome('valid');
    captureMailtoTestOutcome('warning');
    captureMailtoTestOutcome('invalid');
    captureMailtoTestInstallCopy();
    generator.onMeaningfulEdit();
    generator.onCopySucceeded('url');

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
      DEMO_EVENTS.mailtoTestValid,
      DEMO_EVENTS.mailtoTestWarning,
      DEMO_EVENTS.mailtoTestInvalid,
      DEMO_EVENTS.mailtoTestInstallCopied,
      DEMO_EVENTS.mailtoGeneratorGenerated,
      DEMO_EVENTS.mailtoGeneratorCopied,
    ]);
    expect(new Set(Object.values(DEMO_EVENTS)).size).toBe(15);
  });

  it('classifies each fixed arrival source without retaining referrer paths', () => {
    expect(classifyArrivalSource('https://example.test/', '')).toBe(ARRIVAL_SOURCES.direct);
    expect(
      classifyArrivalSource('https://example.test/', 'https://www.google.com/search?q=mail'),
    ).toBe(ARRIVAL_SOURCES.search);
    expect(classifyArrivalSource('https://example.test/', 'https://github.com/org/repo')).toBe(
      ARRIVAL_SOURCES.repository,
    );
    expect(
      classifyArrivalSource('https://example.test/', 'https://www.devtoolsdirectory.com/tools'),
    ).toBe(ARRIVAL_SOURCES.directory);
    expect(classifyArrivalSource('https://example.test/', 'https://example.org/article')).toBe(
      ARRIVAL_SOURCES.other,
    );
    expect(classifyArrivalSource('https://example.test/', 'not a valid referrer')).toBe(
      ARRIVAL_SOURCES.unclassified,
    );
    expect(classifyArrivalSource('https://example.test/?visit_source=repository', '')).toBe(
      ARRIVAL_SOURCES.repository,
    );
    expect(sanitizeReferrerOrigin('https://www.google.com/search?q=private')).toBe(
      'https://www.google.com',
    );
  });

  it('captures one initial view and one view per new client-side path', () => {
    const capture = vi.fn();
    const tracker = createSitePageviewTracker(
      'https://smart-mailto.vercel.app/?visit_source=direct_invitation&email=private@example.com#private',
      'https://private.example.test/path?recipient=private@example.com',
      capture,
    );

    tracker.captureInitial();
    tracker.captureInitial();
    tracker.captureNavigation('https://smart-mailto.vercel.app/?another=private#fragment');
    tracker.captureNavigation('/guides?recipient=private@example.com#subject');
    tracker.captureNavigation('/guides?different=private');
    tracker.captureNavigation('/providers');

    expect(capture.mock.calls).toEqual([
      [
        SITE_PAGEVIEW_EVENT,
        {
          page_path: '/',
          referrer_origin: 'https://private.example.test',
          arrival_source: 'direct',
          controlled_event: true,
        },
      ],
      [
        SITE_PAGEVIEW_EVENT,
        {
          page_path: '/guides',
          referrer_origin: 'https://private.example.test',
          arrival_source: 'direct',
          controlled_event: true,
        },
      ],
      [
        SITE_PAGEVIEW_EVENT,
        {
          page_path: '/providers',
          referrer_origin: 'https://private.example.test',
          arrival_source: 'direct',
          controlled_event: true,
        },
      ],
    ]);
    expect(JSON.stringify(capture.mock.calls)).not.toContain('private@example.com');
    expect(JSON.stringify(capture.mock.calls)).not.toContain('/path');
  });

  it('sanitizes sitewide pageviews to four anonymous fixed fields', () => {
    const sanitized = sanitizeDemoEvent({
      event: SITE_PAGEVIEW_EVENT,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        page_path: '/guides/replace-mailto?recipient=private@example.com#private',
        referrer_origin: 'https://github.com/private/repository?email=private@example.com',
        arrival_source: 'repository',
        controlled_event: true,
        $current_url: 'https://example.test/?email=private@example.com',
        $referrer: 'https://private.example.test/path',
        recipient: 'private@example.com',
        subject: 'private subject',
        body: 'private body',
      },
      uuid: 'random-event-id',
    });

    expect(sanitized).toEqual({
      uuid: 'random-event-id',
      event: SITE_PAGEVIEW_EVENT,
      properties: {
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        $process_person_profile: false,
        page_path: '/guides/replace-mailto',
        referrer_origin: 'https://github.com',
        arrival_source: 'repository',
        controlled_event: true,
      },
    });
    expect(JSON.stringify(sanitized)).not.toContain('private@example.com');
    expect(JSON.stringify(sanitized)).not.toContain('private subject');
    expect(JSON.stringify(sanitized)).not.toContain('private body');
  });

  it('drops invalid pageviews and strips query strings and fragments from paths', () => {
    expect(sanitizePagePath('/spec?recipient=private@example.com#private')).toBe('/spec');
    expect(sanitizePagePath('mailto:private@example.com?subject=private')).toBeNull();
    expect(sanitizePagePath('/private@example.com')).toBeNull();
    expect(
      sanitizeDemoEvent({
        event: SITE_PAGEVIEW_EVENT,
        properties: { page_path: 'mailto:private@example.com' },
        uuid: 'random-event-id',
      }),
    ).toBeNull();
  });

  it('covers all twenty-two public sitemap routes through the shared route registry', () => {
    const capture = vi.fn();
    const tracker = createSitePageviewTracker('https://smart-mailto.vercel.app/', '', capture);

    tracker.captureInitial();
    for (const route of PUBLIC_PAGE_PATHS.slice(1)) tracker.captureNavigation(route);

    expect(PUBLIC_PAGE_PATHS).toHaveLength(22);
    expect(capture.mock.calls.map(([, properties]) => properties.page_path)).toEqual(
      PUBLIC_PAGE_PATHS,
    );
  });

  it('records tester outcomes with fixed names and fields, and ignores empty runs', () => {
    captureMailtoTestOutcome('valid');
    captureMailtoTestOutcome('warning');
    captureMailtoTestOutcome('invalid');
    captureMailtoTestOutcome('empty');
    captureMailtoTestInstallCopy();

    expect(posthog.capture.mock.calls).toEqual([
      [DEMO_EVENTS.mailtoTestValid, { page: 'mailto_link_tester', command_position: 'tester' }],
      [DEMO_EVENTS.mailtoTestWarning, { page: 'mailto_link_tester', command_position: 'tester' }],
      [DEMO_EVENTS.mailtoTestInvalid, { page: 'mailto_link_tester', command_position: 'tester' }],
      [
        DEMO_EVENTS.mailtoTestInstallCopied,
        { page: 'mailto_link_tester', command_position: 'tester' },
      ],
    ]);

    for (const event of [
      DEMO_EVENTS.mailtoTestValid,
      DEMO_EVENTS.mailtoTestWarning,
      DEMO_EVENTS.mailtoTestInvalid,
      DEMO_EVENTS.mailtoTestInstallCopied,
    ]) {
      const sanitized = sanitizeDemoEvent({
        event,
        properties: {
          token: 'public-project-key',
          distinct_id: 'random-device-id',
          page: 'private-page',
          command_position: 'private-position',
          $current_url: 'https://example.test/?mailto=private@example.com',
          $referrer: 'https://private.example.test',
          $set: { email: 'private@example.com' },
          $session_recording_enabled: true,
          href: 'mailto:private@example.com?subject=private',
          recipient: 'private@example.com',
          subject: 'private subject',
          body: 'private body',
          diagnostic_code: 'private-diagnostic',
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

    expect(
      sanitizeDemoEvent({
        event: 'mailto_test_run',
        properties: { token: 'public-project-key' },
        uuid: 'random-event-id',
      }),
    ).toBeNull();
  });

  it('records one meaningful generator edit and successful copies with fixed fields only', () => {
    const generator = createMailtoGeneratorAnalytics({ controlledEvent: true });

    generator.onMeaningfulEdit();
    generator.onMeaningfulEdit();
    generator.onCopySucceeded('url');
    generator.onCopySucceeded('html');

    expect(posthog.capture.mock.calls).toEqual([
      [
        DEMO_EVENTS.mailtoGeneratorGenerated,
        {
          page: 'mailto_link_generator',
          command_position: 'generator',
          controlled_event: true,
        },
      ],
      [
        DEMO_EVENTS.mailtoGeneratorCopied,
        {
          page: 'mailto_link_generator',
          command_position: 'generator',
          controlled_event: true,
          copy_target: 'url',
        },
      ],
      [
        DEMO_EVENTS.mailtoGeneratorCopied,
        {
          page: 'mailto_link_generator',
          command_position: 'generator',
          controlled_event: true,
          copy_target: 'html',
        },
      ],
    ]);

    for (const [event, copyTarget] of [
      [DEMO_EVENTS.mailtoGeneratorGenerated, undefined],
      [DEMO_EVENTS.mailtoGeneratorCopied, 'url'],
      [DEMO_EVENTS.mailtoGeneratorCopied, 'html'],
    ] as const) {
      const sanitized = sanitizeDemoEvent({
        event,
        properties: {
          token: 'public-project-key',
          distinct_id: 'random-device-id',
          controlled_event: true,
          copy_target: copyTarget,
          recipient: 'private@example.com',
          subject: 'private subject',
          body: 'private body',
          link_text: 'private link text',
          generated_url: 'mailto:private@example.com?subject=private',
          generated_html: '<a href="mailto:private@example.com">Private</a>',
        },
        uuid: 'random-event-id',
      });

      expect(sanitized?.properties).toEqual({
        token: 'public-project-key',
        distinct_id: 'random-device-id',
        $process_person_profile: false,
        page: 'mailto_link_generator',
        command_position: 'generator',
        controlled_event: true,
        ...(copyTarget ? { copy_target: copyTarget } : {}),
      });
      expect(JSON.stringify(sanitized)).not.toContain('private');
    }

    expect(
      sanitizeDemoEvent({
        event: DEMO_EVENTS.mailtoGeneratorCopied,
        properties: { copy_target: 'private-target' },
        uuid: 'random-event-id',
      }),
    ).toBeNull();
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
        event: '$pageleave',
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
