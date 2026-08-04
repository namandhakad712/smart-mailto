import { beforeEach, describe, expect, it, vi } from 'vitest';

const posthog = vi.hoisted(() => ({
  capture: vi.fn(),
  init: vi.fn(),
}));

vi.mock('posthog-js', () => ({ default: posthog }));

import {
  captureInstallCopy,
  captureDemoPageview,
  createDemoAnalyticsHooks,
  DEMO_EVENTS,
  initializeDemoAnalytics,
  POSTHOG_PRIVACY_CONFIG,
  sanitizeDemoEvent,
} from './demoAnalytics';

describe('privacy-safe homepage demo analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('captures exactly the six approved homepage events', () => {
    const hooks = createDemoAnalyticsHooks();

    captureDemoPageview();
    hooks.onShow();
    hooks.onOpen();
    hooks.onCopy();
    hooks.onClose();
    captureInstallCopy();

    expect(posthog.capture.mock.calls.map(([event]) => event)).toEqual([
      DEMO_EVENTS.pageview,
      DEMO_EVENTS.pickerShown,
      DEMO_EVENTS.providerSelected,
      DEMO_EVENTS.addressCopied,
      DEMO_EVENTS.pickerDismissed,
      DEMO_EVENTS.installCopied,
    ]);
    expect(new Set(Object.values(DEMO_EVENTS)).size).toBe(6);
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
      demo_location: 'homepage_live_demo',
      page: 'homepage',
      command_position: 'quick_start',
    });
    expect(JSON.stringify(sanitized)).not.toContain('private');
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
