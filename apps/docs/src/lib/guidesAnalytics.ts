import {
  captureGuidesDeskView,
  captureGuidesInstallCopy,
  GUIDES_VISIT_SOURCES,
  type GuidesVisitSource,
} from './demoAnalytics';
import { INSTALL_COMMAND } from './installCommand';

type Capture = () => void;
type ViewCapture = (source: GuidesVisitSource) => void;
type VisitSourceResolver = () => GuidesVisitSource;
type ClipboardWrite = (text: string) => Promise<void>;

const SEARCH_HOST_PATTERNS = [
  /(^|\.)bing\.com$/,
  /(^|\.)duckduckgo\.com$/,
  /(^|\.)ecosia\.org$/,
  /(^|\.)search\.brave\.com$/,
  /(^|\.)search\.yahoo\.[a-z.]+$/,
  /(^|\.)google\.[a-z.]+$/,
] as const;

function readUrl(value: string): URL | null {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function classifyGuidesVisitSource(currentUrl: string, referrer: string): GuidesVisitSource {
  const explicitSource = readUrl(currentUrl)?.searchParams.get('visit_source');
  if (
    explicitSource &&
    Object.values(GUIDES_VISIT_SOURCES).includes(explicitSource as GuidesVisitSource)
  ) {
    return explicitSource as GuidesVisitSource;
  }

  const referrerHost = readUrl(referrer)?.hostname.toLowerCase();
  if (!referrerHost) return GUIDES_VISIT_SOURCES.unclassified;

  if (referrerHost === 'github.com' || referrerHost.endsWith('.github.com')) {
    return GUIDES_VISIT_SOURCES.repository;
  }

  if (SEARCH_HOST_PATTERNS.some(pattern => pattern.test(referrerHost))) {
    return GUIDES_VISIT_SOURCES.search;
  }

  return GUIDES_VISIT_SOURCES.unclassified;
}

export function resolveGuidesVisitSource(): GuidesVisitSource {
  if (typeof window === 'undefined') return GUIDES_VISIT_SOURCES.unclassified;

  return classifyGuidesVisitSource(window.location.href, document.referrer);
}

export function createGuidesDeskViewCapture(
  capture: ViewCapture = captureGuidesDeskView,
  resolveSource: VisitSourceResolver = resolveGuidesVisitSource,
): Capture {
  let captured = false;

  return () => {
    if (captured) return;

    captured = true;
    capture(resolveSource());
  };
}

export async function copyGuidesInstallCommand(
  writeText: ClipboardWrite,
  capture: Capture = captureGuidesInstallCopy,
): Promise<void> {
  await writeText(INSTALL_COMMAND);
  capture();
}
