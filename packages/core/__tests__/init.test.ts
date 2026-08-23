import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initSmartMailto, destroySmartMailto, isInitialized, updateConfig } from '../src/init.js';
import { savePreference, clearPreference } from '../src/storage.js';

describe('init module', () => {
  beforeEach(() => {
    destroySmartMailto();
    clearPreference();
    vi.restoreAllMocks();
    document.getElementById('__smart-mailto-host__')?.remove();
  });

  afterEach(() => {
    destroySmartMailto();
    document.getElementById('__smart-mailto-host__')?.remove();
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

  it('opens a remembered provider without firing onShow', () => {
    const onShow = vi.fn();
    const onOpen = vi.fn();
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    savePreference('gmail');
    initSmartMailto({ onShow, onOpen });

    const anchor = document.createElement('a');
    anchor.href = 'mailto:test@example.com?subject=Hello';
    document.body.appendChild(anchor);
    anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(open).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onShow).not.toHaveBeenCalled();
    anchor.remove();
  });

  it('shows the picker for a force-picker link', async () => {
    const onShow = vi.fn();
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    savePreference('gmail');
    initSmartMailto({ onShow });

    const anchor = document.createElement('a');
    anchor.href = 'mailto:test@example.com';
    anchor.setAttribute('data-smart-mailto-force-picker', '');
    document.body.appendChild(anchor);
    anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => expect(document.getElementById('__smart-mailto-host__')).not.toBeNull());
    expect(open).not.toHaveBeenCalled();
    expect(onShow).toHaveBeenCalledTimes(1);
    anchor.remove();
  });
});
