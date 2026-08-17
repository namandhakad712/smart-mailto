import { beforeEach, describe, expect, it, vi } from 'vitest';

const analytics = vi.hoisted(() => ({
  captureGuidesDeskView: vi.fn(),
  captureGuidesInstallCopy: vi.fn(),
  GUIDES_VISIT_SOURCES: {
    directInvitation: 'direct_invitation',
    search: 'search',
    repository: 'repository',
    unclassified: 'unclassified',
  },
}));

vi.mock('./demoAnalytics', () => analytics);

import {
  classifyGuidesVisitSource,
  copyGuidesInstallCommand,
  createGuidesDeskViewCapture,
} from './guidesAnalytics';
import { INSTALL_COMMAND } from './installCommand';

describe('Guides desk analytics boundaries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('captures the Guides desk view only once per page mount', () => {
    const capture = vi.fn();
    const captureOnce = createGuidesDeskViewCapture(capture, () => 'repository');

    captureOnce();
    captureOnce();
    captureOnce();

    expect(capture).toHaveBeenCalledOnce();
    expect(capture).toHaveBeenCalledWith('repository');
  });

  it.each([
    [
      'https://smart-mailto.vercel.app/guides?visit_source=direct_invitation',
      '',
      'direct_invitation',
    ],
    ['https://smart-mailto.vercel.app/guides', 'https://www.google.com/search?q=mailto', 'search'],
    [
      'https://smart-mailto.vercel.app/guides',
      'https://github.com/namandhakad712/smart-mailto',
      'repository',
    ],
    ['https://smart-mailto.vercel.app/guides', '', 'unclassified'],
    ['not-a-url', 'https://example.com/article', 'unclassified'],
  ])(
    'classifies a Guides visit from fixed, non-identifying signals',
    (currentUrl, referrer, expected) => {
      expect(classifyGuidesVisitSource(currentUrl, referrer)).toBe(expected);
    },
  );

  it('ignores an unsupported explicit source and uses available referrer evidence', () => {
    expect(
      classifyGuidesVisitSource(
        'https://smart-mailto.vercel.app/guides?visit_source=private-campaign',
        'https://github.com/namandhakad712/smart-mailto',
      ),
    ).toBe('repository');
  });

  it('captures install intent only after a successful clipboard write', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const capture = vi.fn();

    await copyGuidesInstallCommand(writeText, capture);

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledWith(INSTALL_COMMAND);
    expect(capture).toHaveBeenCalledOnce();
    expect(writeText.mock.invocationCallOrder[0]).toBeLessThan(capture.mock.invocationCallOrder[0]);
  });

  it('does not capture install intent when the clipboard write fails', async () => {
    const error = new Error('clipboard unavailable');
    const writeText = vi.fn().mockRejectedValue(error);
    const capture = vi.fn();

    await expect(copyGuidesInstallCommand(writeText, capture)).rejects.toBe(error);
    expect(capture).not.toHaveBeenCalled();
  });
});
