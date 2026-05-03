import { describe, expect, it } from 'vitest';

import {
  contrastRatio,
  hexToRgb,
  normalizeHexColor,
  relativeLuminance,
  wcagLevel,
} from '@/lib/builder/site/theme/contrast';

describe('theme contrast utilities', () => {
  it('normalizes shorthand and long hex values', () => {
    expect(normalizeHexColor('#ABC')).toBe('#aabbcc');
    expect(normalizeHexColor('#123456')).toBe('#123456');
  });

  it('rejects unsupported color formats', () => {
    expect(normalizeHexColor('red')).toBeNull();
    expect(hexToRgb('rgb(0 0 0)')).toBeNull();
  });

  it('converts hex colors to RGB channels', () => {
    expect(hexToRgb('#123456')).toEqual({ r: 18, g: 52, b: 86 });
  });

  it('calculates canonical black and white luminance', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
  });

  it('calculates black on white as 21:1 contrast', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 2);
  });

  it('classifies AAA, AA, and fail levels', () => {
    expect(wcagLevel(contrastRatio('#000000', '#ffffff'))).toBe('AAA');
    expect(wcagLevel(contrastRatio('#666666', '#ffffff'))).toBe('AA');
    expect(wcagLevel(contrastRatio('#888888', '#ffffff'))).toBe('fail');
  });

  it('uses the large-text AA threshold', () => {
    expect(wcagLevel(contrastRatio('#777777', '#ffffff'), true)).toBe('AA');
  });
});
