import { describe, it, expect } from 'vitest';
import { ICONS } from '../src/icons.js';

describe('icons module', () => {
  it('exports ICONS dictionary containing valid SVG strings', () => {
    expect(ICONS).toBeDefined();
    expect(typeof ICONS).toBe('object');
    expect(Object.keys(ICONS).length).toBeGreaterThan(10);
  });

  it('contains valid SVG markup for major providers', () => {
    const requiredIcons = ['gmail', 'outlook', 'yahoo', 'protonmail', 'icloud', 'native', 'copy'];

    for (const iconKey of requiredIcons) {
      expect(ICONS[iconKey]).toBeDefined();
      expect(ICONS[iconKey]).toContain('<svg');
      expect(ICONS[iconKey]).toContain('</svg>');
    }
  });
});
