import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initSmartMailto, destroySmartMailto, isInitialized, updateConfig } from '../src/init.js';

describe('init module', () => {
  beforeEach(() => {
    destroySmartMailto();
  });

  afterEach(() => {
    destroySmartMailto();
  });

  it('initializes and cleans up correctly', () => {
    expect(isInitialized()).toBe(false);

    const destroy = initSmartMailto({ theme: 'dark' });
    expect(isInitialized()).toBe(true);

    destroy();
    expect(isInitialized()).toBe(false);
  });

  it('warns when initializing twice', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    initSmartMailto();
    initSmartMailto();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[smart-mailto] Already initialized'),
    );

    consoleSpy.mockRestore();
  });

  it('updates config without throwing', () => {
    initSmartMailto({ theme: 'light' });
    expect(() => updateConfig({ theme: 'dark' })).not.toThrow();
  });

  it('fires onShow when a mailto link opens the picker', () => {
    const onShow = vi.fn();
    initSmartMailto({ onShow });

    const anchor = document.createElement('a');
    anchor.href = 'mailto:test@example.com?subject=Hello';
    document.body.appendChild(anchor);

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
    expect(onShow).toHaveBeenCalledWith(
      expect.objectContaining({ to: ['test@example.com'], subject: 'Hello' }),
      expect.any(Array),
    );
    expect(onShow).toHaveBeenCalledTimes(1);

    document.body.removeChild(anchor);
  });

  it('ignores non-mailto links', () => {
    initSmartMailto();

    const anchor = document.createElement('a');
    anchor.href = 'https://example.com';
    document.body.appendChild(anchor);

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(false);

    document.body.removeChild(anchor);
  });
});
