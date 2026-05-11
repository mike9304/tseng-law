import { describe, expect, test } from 'vitest';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { classifyStyleOrigin } from '@/lib/builder/site/style-origin';

describe('M23 style origin classifier', () => {
  test('labels theme token-resolved values as theme driven', () => {
    expect(classifyStyleOrigin({
      value: DEFAULT_THEME.colors.primary,
      theme: DEFAULT_THEME,
    })).toEqual({
      kind: 'theme',
      hint: 'theme.colors.primary',
    });
  });

  test('labels named component variants before falling back to default', () => {
    expect(classifyStyleOrigin({
      value: undefined,
      theme: DEFAULT_THEME,
      variantKey: 'primary',
    })).toEqual({
      kind: 'variant',
      hint: 'variant: primary',
    });
  });

  test('manual overrides win over theme and variant matches', () => {
    expect(classifyStyleOrigin({
      value: DEFAULT_THEME.colors.primary,
      theme: DEFAULT_THEME,
      variantKey: 'primary',
      manualOverride: true,
    })).toEqual({
      kind: 'manual',
      hint: '사용자 직접 입력',
    });
  });
});
