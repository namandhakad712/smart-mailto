import { getAllProviders } from '../../packages/core/src/providers.js';
import type { MailtoParams } from '../../packages/core/src/types.js';

export const DEFAULT_BATCH_SIZE = 8;
export const DEFAULT_TIMEOUT_MS = 10_000;

const TEST_PARAMS: MailtoParams = {
  to: ['test@example.com'],
  subject: 'smart-mailto provider health check',
  body: 'Provider health check',
};

export type ValidationClassification =
  | 'healthy'
  | 'login-required'
  | 'bot-protected'
  | 'fallback-only'
  | 'unreachable';

export interface ProviderTarget {
  id: string;
  name: string;
  url: string | null;
  fallbackOnly: boolean;
}

export interface ValidationResult {
  ok: boolean;
  classification: ValidationClassification;
  status: number | null;
  url: string | null;
  finalUrl: string | null;
  durationMs: number;
  error?: string;
}

export interface RunValidationOptions {
  batchSize?: number;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  onResult?: (id: string, result: ValidationResult) => void;
}

export type ValidationReport = Record<string, ValidationResult>;

export function buildProviderTargets(): ProviderTarget[] {
  return getAllProviders()
    .filter(provider => !provider.isNative && !provider.isCopy)
    .map(provider => {
      const builtUrl = provider.buildUrl(TEST_PARAMS);
      const fallbackOnly = provider.fallbackOnly === true || builtUrl === '#';

      return {
        id: provider.id,
        name: provider.name,
        url: fallbackOnly ? null : builtUrl,
        fallbackOnly,
      };
    });
}

function matchesUrlMarker(url: string, markers: RegExp): boolean {
  try {
    const parsed = new URL(url);
    return markers.test(`${parsed.hostname}${parsed.pathname}${parsed.search}`);
  } catch {
    return markers.test(url);
  }
}

export function classifyResponse(
  status: number,
  finalUrl: string,
): Exclude<ValidationClassification, 'fallback-only'> {
  if (
    status === 403 ||
    status === 429 ||
    status === 449 ||
    matchesUrlMarker(finalUrl, /captcha|challenge|checkpoint|blocked|access[-_/]?denied/i)
  ) {
    return 'bot-protected';
  }

  if (
    status === 401 ||
    (status >= 200 &&
      status < 400 &&
      matchesUrlMarker(finalUrl, /login|logowanie|sign[-_]?in|accounts?|oauth|authorize|identity/i))
  ) {
    return 'login-required';
  }

  return status >= 200 && status < 400 ? 'healthy' : 'unreachable';
}

export async function validateTarget(
  target: ProviderTarget,
  options: Pick<RunValidationOptions, 'fetchImpl' | 'timeoutMs'> = {},
): Promise<ValidationResult> {
  const startedAt = Date.now();

  if (target.fallbackOnly || target.url === null) {
    return {
      ok: true,
      classification: 'fallback-only',
      status: null,
      url: null,
      finalUrl: null,
      durationMs: Date.now() - startedAt,
    };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  try {
    const response = await fetchImpl(target.url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'User-Agent': 'smart-mailto-validator/1.0 (https://github.com/namandhakad712/smart-mailto)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const classification = classifyResponse(response.status, response.url || target.url);

    await response.body?.cancel().catch(() => undefined);

    return {
      ok: classification !== 'unreachable',
      classification,
      status: response.status,
      url: target.url,
      finalUrl: response.url || target.url,
      durationMs: Date.now() - startedAt,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      classification: 'unreachable',
      status: null,
      url: target.url,
      finalUrl: target.url,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function runValidation(
  targets = buildProviderTargets(),
  options: RunValidationOptions = {},
): Promise<ValidationReport> {
  const batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new Error('batchSize must be a positive integer');
  }

  const report: ValidationReport = {};

  for (let index = 0; index < targets.length; index += batchSize) {
    const batch = targets.slice(index, index + batchSize);
    const results = await Promise.all(batch.map(target => validateTarget(target, options)));

    batch.forEach((target, resultIndex) => {
      const result = results[resultIndex]!;
      report[target.id] = result;
      options.onResult?.(target.id, result);
    });
  }

  return report;
}

export function summarizeResults(
  report: ValidationReport,
): Record<ValidationClassification, number> {
  const summary: Record<ValidationClassification, number> = {
    healthy: 0,
    'login-required': 0,
    'bot-protected': 0,
    'fallback-only': 0,
    unreachable: 0,
  };

  for (const result of Object.values(report)) {
    summary[result.classification] += 1;
  }

  return summary;
}
