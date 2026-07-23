import posthog from 'posthog-js';

posthog.init('phc_qCtuutcc4o9VsAZd9jJpWsLMMBcuh6BvCStvqRpT3NZK', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30',
  capture_pageview: true,
  autocapture: false,
  disable_session_recording: true,
  person_profiles: 'identified_only',
});
