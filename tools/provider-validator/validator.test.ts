import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildProviderTargets,
  classifyResponse,
  runValidation,
  summarizeResults,
  type ProviderTarget,
} from './validator.js';

interface ProviderSourceEntry {
  id: string;
  fallbackOnly?: boolean;
  isNative?: boolean;
  isCopy?: boolean;
}

test('validation targets stay in parity with every webmail provider in the source registry', async () => {
  const sourceUrl = new URL('../provider-generator/data/providers.json', import.meta.url);
  const source = JSON.parse(await readFile(sourceUrl, 'utf8')) as {
    providers: ProviderSourceEntry[];
  };
  const expectedWebmailProviders = source.providers.filter(
    provider => !provider.isNative && !provider.isCopy,
  );
  const targets = buildProviderTargets();

  assert.deepEqual(
    targets.map(provider => provider.id),
    expectedWebmailProviders.map(provider => provider.id),
  );
  assert.equal(targets.length, expectedWebmailProviders.length);
  assert.ok(targets.every(provider => provider.id !== 'native' && provider.id !== 'copy'));
});

test('fallback-only webmail providers remain covered without making network requests', async () => {
  const targets = buildProviderTargets();
  const fallbackTargets = targets.filter(provider => provider.fallbackOnly);
  let requestCount = 0;

  const report = await runValidation(fallbackTargets, {
    fetchImpl: async () => {
      requestCount += 1;
      return new Response();
    },
  });

  assert.ok(fallbackTargets.length > 0);
  assert.equal(requestCount, 0);
  assert.ok(Object.values(report).every(result => result.classification === 'fallback-only'));
});

test('response classification separates login and bot protection from unreachable endpoints', () => {
  assert.equal(classifyResponse(200, 'https://accounts.google.com/signin'), 'login-required');
  assert.equal(classifyResponse(401, 'https://mail.example.com/compose'), 'login-required');
  assert.equal(classifyResponse(200, 'https://mail.example.com/captcha'), 'bot-protected');
  assert.equal(classifyResponse(403, 'https://mail.example.com/compose'), 'bot-protected');
  assert.equal(classifyResponse(429, 'https://mail.example.com/compose'), 'bot-protected');
  assert.equal(classifyResponse(200, 'https://mail.example.com/compose'), 'healthy');
  assert.equal(classifyResponse(404, 'https://mail.example.com/compose'), 'unreachable');
  assert.equal(classifyResponse(503, 'https://mail.example.com/compose'), 'unreachable');
});

test('validation preserves the configured concurrency batch size', async () => {
  const targets: ProviderTarget[] = Array.from({ length: 5 }, (_, index) => ({
    id: `provider-${index}`,
    name: `Provider ${index}`,
    url: `https://mail${index}.example.com/compose`,
    fallbackOnly: false,
  }));
  let activeRequests = 0;
  let maxActiveRequests = 0;

  const report = await runValidation(targets, {
    batchSize: 2,
    fetchImpl: async input => {
      activeRequests += 1;
      maxActiveRequests = Math.max(maxActiveRequests, activeRequests);
      await new Promise(resolve => setTimeout(resolve, 5));
      activeRequests -= 1;
      return new Response('', { status: 200, statusText: String(input) });
    },
  });

  assert.equal(Object.keys(report).length, targets.length);
  assert.equal(maxActiveRequests, 2);
});

test('only genuinely unreachable destinations count as failures', () => {
  const summary = summarizeResults({
    healthy: {
      ok: true,
      classification: 'healthy',
      status: 200,
      url: 'https://mail.example.com/compose',
      finalUrl: 'https://mail.example.com/compose',
      durationMs: 1,
    },
    login: {
      ok: true,
      classification: 'login-required',
      status: 200,
      url: 'https://mail.example.com/compose',
      finalUrl: 'https://mail.example.com/login',
      durationMs: 1,
    },
    blocked: {
      ok: true,
      classification: 'bot-protected',
      status: 403,
      url: 'https://mail.example.com/compose',
      finalUrl: 'https://mail.example.com/compose',
      durationMs: 1,
    },
    fallback: {
      ok: true,
      classification: 'fallback-only',
      status: null,
      url: null,
      finalUrl: null,
      durationMs: 0,
    },
    broken: {
      ok: false,
      classification: 'unreachable',
      status: 404,
      url: 'https://mail.example.com/compose',
      finalUrl: 'https://mail.example.com/compose',
      durationMs: 1,
    },
  });

  assert.deepEqual(summary, {
    healthy: 1,
    'login-required': 1,
    'bot-protected': 1,
    'fallback-only': 1,
    unreachable: 1,
  });
});
