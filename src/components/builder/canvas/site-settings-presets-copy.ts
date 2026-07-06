import type { Locale } from '@/lib/locales';

export interface SiteSettingsPresetsCopy {
  sections: {
    componentDesignPresets: string;
    designTokenBundle: string;
    radiusShadowPresets: string;
    myThemes: string;
    themePresets: string;
  };
  labels: {
    button: string;
    card: string;
    form: string;
    finish: string;
    accent: string;
    radius: string;
    shadow: string;
    savedAt: string;
    myThemePreview: string;
    noSavedThemes: string;
    delete: string;
    cancel: string;
    applyPreset: string;
    applyTheme: string;
    applyMyTheme: string;
    usePreset: (label: string) => string;
    applyComponentPreset: (label: string) => string;
    applyRadiusPreset: (label: string) => string;
    applyShadowPreset: (label: string) => string;
    saveCurrentTheme: string;
    saveCurrentThemeDescription: string;
    saveCurrentThemeButton: string;
    themePresetTitle: (name: string) => string;
    themePresetDescription: string;
    themePresetBody: string;
    pendingPresetTitle: (name: string) => string;
    pendingPresetDescription: string;
    designTokenTitle: string;
    designTokenDescription: string;
    exportDesignTokens: string;
    importDesignTokens: string;
  };
}

const presetsCopy = {
  ko: {
    sections: {
      componentDesignPresets: '컴포넌트 디자인 프리셋 (W179)',
      designTokenBundle: '디자인 토큰 번들',
      radiusShadowPresets: '반경 및 그림자 프리셋',
      myThemes: '내 테마',
      themePresets: '테마 프리셋',
    },
    labels: {
      button: '버튼',
      card: '카드',
      form: '폼',
      finish: '마감',
      accent: '포인트',
      radius: '반경',
      shadow: '그림자',
      savedAt: '저장일',
      myThemePreview: '내 테마',
      noSavedThemes: '저장된 테마가 아직 없습니다.',
      delete: '삭제',
      cancel: '취소',
      applyPreset: '프리셋 적용',
      applyTheme: '적용',
      applyMyTheme: '내 테마 적용',
      usePreset: (label: string) => `${label} 사용`,
      applyComponentPreset: (label: string) => `${label} 프리셋 적용`,
      applyRadiusPreset: (label: string) => `${label} 반경 프리셋 적용`,
      applyShadowPreset: (label: string) => `${label} 그림자 프리셋 적용`,
      saveCurrentTheme: '현재 테마 저장',
      saveCurrentThemeDescription: '현재 색상, 글꼴, 텍스트 프리셋, 반경, 그림자 선택을 재사용 가능한 로컬 테마 프리셋으로 저장합니다.',
      saveCurrentThemeButton: '내 테마로 저장',
      themePresetTitle: (name: string) => name,
      themePresetDescription: '색상, 사이트 글꼴, 반경, 텍스트 프리셋이 함께 바뀝니다.',
      themePresetBody: '안녕하세요',
      pendingPresetTitle: (name: string) => `${name} 을(를) 전체 사이트에 적용할까요?`,
      pendingPresetDescription: '색상, 사이트 글꼴, 반경, 테마 텍스트 프리셋이 바뀝니다. 요소별 원시 오버라이드는 유지됩니다.',
      designTokenTitle: '디자인 토큰 JSON',
      designTokenDescription: '색상, 다크 색상, 글꼴, 타이포그래피 스케일, 텍스트 프리셋, 반경, 그림자 설정을 하나의 디자인 시스템 파일로 함께 이동합니다.',
      exportDesignTokens: '디자인 토큰 내보내기',
      importDesignTokens: '디자인 토큰 가져오기',
    },
  },
  'zh-hant': {
    sections: {
      componentDesignPresets: '元件設計預設（W179）',
      designTokenBundle: '設計 token 套件',
      radiusShadowPresets: '圓角與陰影預設',
      myThemes: '我的主題',
      themePresets: '主題預設',
    },
    labels: {
      button: '按鈕',
      card: '卡片',
      form: '表單',
      finish: '收尾',
      accent: '重點',
      radius: '圓角',
      shadow: '陰影',
      savedAt: '儲存於',
      myThemePreview: '我的主題',
      noSavedThemes: '尚未儲存任何主題。',
      delete: '刪除',
      cancel: '取消',
      applyPreset: '套用預設',
      applyTheme: '套用',
      applyMyTheme: '套用我的主題',
      usePreset: (label: string) => `使用 ${label}`,
      applyComponentPreset: (label: string) => `套用 ${label} 預設`,
      applyRadiusPreset: (label: string) => `套用 ${label} 圓角預設`,
      applyShadowPreset: (label: string) => `套用 ${label} 陰影預設`,
      saveCurrentTheme: '儲存目前主題',
      saveCurrentThemeDescription: '將目前的色彩、字體、文字預設、圓角與陰影選擇儲存為可重複使用的本機主題預設。',
      saveCurrentThemeButton: '儲存為我的主題',
      themePresetTitle: (name: string) => name,
      themePresetDescription: '色彩、網站字體、圓角與文字預設會一起變更。',
      themePresetBody: '你好',
      pendingPresetTitle: (name: string) => `要將 ${name} 套用到整個網站嗎？`,
      pendingPresetDescription: '色彩、網站字體、圓角與主題文字預設會被取代。元素層級的原始覆寫會保持不變。',
      designTokenTitle: '設計 token JSON',
      designTokenDescription: '色彩、深色模式色彩、字體、版面比例、文字預設、圓角與陰影設定會一起作為單一設計系統檔案移動。',
      exportDesignTokens: '匯出設計 token',
      importDesignTokens: '匯入設計 token',
    },
  },
  en: {
    sections: {
      componentDesignPresets: 'Component design presets (W179)',
      designTokenBundle: 'Design token bundle',
      radiusShadowPresets: 'Radius & shadow presets',
      myThemes: 'My Themes',
      themePresets: 'Theme presets',
    },
    labels: {
      button: 'Button',
      card: 'Card',
      form: 'Form',
      finish: 'Finish',
      accent: 'Accent',
      radius: 'Radius',
      shadow: 'Shadow',
      savedAt: 'Saved',
      myThemePreview: 'My Theme',
      noSavedThemes: 'No saved themes yet.',
      delete: 'Delete',
      cancel: 'Cancel',
      applyPreset: 'Apply preset',
      applyTheme: 'Apply',
      applyMyTheme: 'Apply My Theme',
      usePreset: (label: string) => `Use ${label}`,
      applyComponentPreset: (label: string) => `Apply ${label} preset`,
      applyRadiusPreset: (label: string) => `Apply ${label} radius preset`,
      applyShadowPreset: (label: string) => `Apply ${label} shadow preset`,
      saveCurrentTheme: 'Save current theme',
      saveCurrentThemeDescription: 'Store the current colors, fonts, text presets, radius, and shadow choices as a reusable local theme preset.',
      saveCurrentThemeButton: 'Save as My Theme',
      themePresetTitle: (name: string) => name,
      themePresetDescription: 'Colors, site fonts, radii, and theme text presets change together.',
      themePresetBody: 'Hello',
      pendingPresetTitle: (name: string) => `Apply ${name} to the whole site?`,
      pendingPresetDescription: 'Colors, site fonts, radii, and theme text presets will be replaced. Element-level raw overrides stay unchanged.',
      designTokenTitle: 'Theme token JSON',
      designTokenDescription: 'Colors, dark colors, fonts, typography scale, text presets, radii, and shadow settings move together as one design system file.',
      exportDesignTokens: 'Export design tokens',
      importDesignTokens: 'Import design tokens',
    },
  },
} as const;

export function getSiteSettingsPresetsCopy(locale: Locale): SiteSettingsPresetsCopy {
  return presetsCopy[locale as keyof typeof presetsCopy] ?? presetsCopy.en;
}
