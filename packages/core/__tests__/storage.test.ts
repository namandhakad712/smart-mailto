import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  savePreference,
  loadPreference,
  clearPreference,
  isStorageAvailable,
  DEFAULT_STORAGE_KEY,
} from '../src/storage.js';

describe('storage module', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('saves, loads, and clears preferences with default key', () => {
    savePreference('gmail');
    expect(loadPreference()).toBe('gmail');

    clearPreference();
    expect(loadPreference()).toBeNull();
  });

  it('saves, loads, and clears preferences with custom key', () => {
    const customKey = 'my-custom-key';
    savePreference('protonmail', customKey);
    expect(loadPreference(customKey)).toBe('protonmail');
    expect(loadPreference(DEFAULT_STORAGE_KEY)).toBeNull();

    clearPreference(customKey);
    expect(loadPreference(customKey)).toBeNull();
  });

  it('returns true for isStorageAvailable in working environment', () => {
    expect(isStorageAvailable()).toBe(true);
  });

  it('handles localStorage errors gracefully when storage throws', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('AccessDenied');
    });
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('AccessDenied');
    });

    expect(() => savePreference('outlook')).not.toThrow();
    expect(loadPreference()).toBeNull();
    expect(() => clearPreference()).not.toThrow();
    expect(isStorageAvailable()).toBe(false);

    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });
});
