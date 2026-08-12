import { describe, expect, it } from 'vitest';
import { INSTALL_COMMAND } from './installCommand';

describe('install command', () => {
  it('pins the current core release', () => {
    expect(INSTALL_COMMAND).toBe('npm install @smart-mailto/core@0.3.0');
  });
});
