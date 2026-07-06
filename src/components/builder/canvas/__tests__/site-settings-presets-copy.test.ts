import { describe, expect, it } from 'vitest';
import { getSiteSettingsPresetsCopy } from '../site-settings-presets-copy';

describe('getSiteSettingsPresetsCopy', () => {
  it('localizes preset chrome for ko', () => {
    const copy = getSiteSettingsPresetsCopy('ko');
    expect(copy.sections.componentDesignPresets).toContain('컴포넌트');
    expect(copy.labels.applyMyTheme).toBe('내 테마 적용');
    expect(copy.labels.cancel).toBe('취소');
    expect(copy.labels.myThemePreview).toBe('내 테마');
  });

  it('localizes preset chrome for zh-hant', () => {
    const copy = getSiteSettingsPresetsCopy('zh-hant');
    expect(copy.sections.designTokenBundle).toContain('token');
    expect(copy.labels.applyMyTheme).toBe('套用我的主題');
    expect(copy.labels.cancel).toBe('取消');
    expect(copy.labels.myThemePreview).toBe('我的主題');
  });
});
