import { describe, expect, test } from 'vitest';
import { getTextControlsCopy } from '../text-controls-copy';

describe('text controls copy', () => {
  test('localizes font picker and typography settings labels', () => {
    const ko = getTextControlsCopy('ko');
    const zh = getTextControlsCopy('zh-hant');

    expect(ko.fontPicker.dialogTitle).toBe('글꼴');
    expect(ko.fontPicker.categories.serif).toBe('세리프');
    expect(ko.siteSettingsTypography.typographyScaleHeading).toContain('타이포그래피');
    expect(ko.siteSettingsTypography.themeTextPresetsHeading).toBe('텍스트 프리셋');
    expect(ko.siteSettingsTypography.scalePreviewRows.body).toBe('본문');
    expect(ko.siteSettingsTypography.previewSample).toBe('호정국제 법률사무소');
    expect(ko.brandKit.applyBrandKit).toBe('브랜드 키트 적용');
    expect(ko.brandKit.openAssetLibrary).toBe('브랜드 에셋 열기');
    expect(ko.brandKit.assetLabels.logoLightAssetId).toBe('밝은 로고');
    expect(ko.brandKit.assetLabels.ogImageAssetId).toBe('OG 이미지');
    expect(ko.brandKit.colorLabels.primary).toBe('기본');
    expect(ko.brandKit.colorLabels.background).toBe('배경');
    expect(ko.brandKit.colorAriaLabel('기본')).toBe('기본 색상');
    expect(ko.brandKit.addColor).toBe('색상 추가');
    expect(ko.brandKit.removeColor).toBe('색상 제거');
    expect(ko.brandKit.customColorNameLabel).toBe('이름');
    expect(ko.brandKit.customColorHexLabel).toBe('색상 코드');
    expect(ko.textInspector.shortcutHeading).toBe('리치 텍스트 바로가기');
    expect(ko.textInspector.bulletListFallbackItems).toEqual(['첫 번째 항목', '두 번째 항목', '세 번째 항목']);

    expect(zh.fontPicker.dialogTitle).toBe('字型');
    expect(zh.fontPicker.categories.monospace).toBe('等寬');
    expect(zh.siteSettingsTypography.typographyScaleHeading).toContain('排版');
    expect(zh.siteSettingsTypography.themeTextPresetsHeading).toBe('文字預設');
    expect(zh.siteSettingsTypography.scalePreviewRows.body).toBe('內文');
    expect(zh.siteSettingsTypography.previewSample).toBe('和正國際法律事務所');
    expect(zh.brandKit.warning).toBe('品牌套件變更會套用到整個網站。先在這裡更新，再儲存網站設定才會發佈新的視覺系統。');
    expect(zh.brandKit.logoHeading).toBe('標誌');
    expect(zh.brandKit.logoPreview).toBe('標誌預覽');
    expect(zh.brandKit.applyBrandKit).toBe('套用品牌套件');
    expect(zh.brandKit.openAssetLibrary).toBe('開啟品牌素材');
    expect(zh.brandKit.assetLabels.logoDarkAssetId).toBe('深色標誌');
    expect(zh.brandKit.assetLabels.faviconAssetId).toBe('網站圖示');
    expect(zh.brandKit.assetLabels.ogImageAssetId).toBe('OG 圖片');
    expect(zh.brandKit.colorLabels.secondary).toBe('次要');
    expect(zh.brandKit.colorLabels.text).toBe('文字');
    expect(zh.brandKit.colorAriaLabel('主要')).toBe('主要顏色');
    expect(zh.brandKit.addColor).toBe('新增顏色');
    expect(zh.brandKit.removeColor).toBe('移除顏色');
    expect(zh.brandKit.customColorNameLabel).toBe('名稱');
    expect(zh.brandKit.customColorHexLabel).toBe('色碼');
    expect(zh.textInspector.shortcutHeading).toBe('富文字捷徑');
    expect(zh.textInspector.bulletListFallbackItems).toEqual(['第一個項目', '第二個項目', '第三個項目']);
  });
});
