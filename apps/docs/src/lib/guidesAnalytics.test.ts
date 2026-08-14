import { beforeEach, describe, expect, it, vi } from 'vitest';

const analytics = vi.hoisted(() => ({
  captureGuidesDeskView: vi.fn(),
  captureGuidesInstallCopy: vi.fn(),
}));

vi.mock('./demoAnalytics', () => analytics);

import { copyGuidesInstallCommand, createGuidesDeskViewCapture } from './guidesAnalytics';
import { INSTALL_COMMAND } from './installCommand';

describe('Guides desk analytics boundaries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('captures the Guides desk view only once per page mount', () => {
    const capture = vi.fn();
    const captureOnce = createGuidesDeskViewCapture(capture);

    captureOnce();
    captureOnce();
    captureOnce();

    expect(capture).toHaveBeenCalledOnce();
    expect(capture).toHaveBeenCalledWith();
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
