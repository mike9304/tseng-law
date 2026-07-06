import type { Locale } from '@/lib/locales';

type StatusBarDensity = 'compact' | 'cozy' | 'comfortable';
type StatusBarThemeMode = 'light' | 'dark';
type StatusBarSaveState = 'idle' | 'saving' | 'saved' | 'error';

export type SandboxStatusBarCopy = {
  footerAriaLabel: string;
  viewportLabel: string;
  selectionCountLabel: (count: number) => string;
  saveStateLabels: Record<StatusBarSaveState, string>;
  densityAriaLabel: string;
  densityLabels: Record<StatusBarDensity, string>;
  themeModeLabels: Record<StatusBarThemeMode, string>;
  shortcutsLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', SandboxStatusBarCopy> = {
  ko: {
    footerAriaLabel: '편집기 상태',
    viewportLabel: '뷰포트',
    selectionCountLabel: (count) => `${count}개 선택됨`,
    saveStateLabels: {
      idle: '',
      saving: '저장 중...',
      saved: '저장됨',
      error: '저장 실패',
    },
    densityAriaLabel: '편집기 밀도',
    densityLabels: {
      compact: '좁게',
      cozy: '보통',
      comfortable: '넓게',
    },
    themeModeLabels: {
      light: '라이트',
      dark: '다크',
    },
    shortcutsLabel: '단축키: ?',
  },
  'zh-hant': {
    footerAriaLabel: '編輯器狀態',
    viewportLabel: '視窗',
    selectionCountLabel: (count) => `已選取 ${count} 個`,
    saveStateLabels: {
      idle: '',
      saving: '儲存中...',
      saved: '已儲存',
      error: '儲存失敗',
    },
    densityAriaLabel: '編輯器密度',
    densityLabels: {
      compact: '緊湊',
      cozy: '標準',
      comfortable: '寬鬆',
    },
    themeModeLabels: {
      light: '淺色',
      dark: '深色',
    },
    shortcutsLabel: '快捷鍵: ?',
  },
  en: {
    footerAriaLabel: 'Editor status',
    viewportLabel: 'Viewport',
    selectionCountLabel: (count) => `${count} selected`,
    saveStateLabels: {
      idle: '',
      saving: 'Saving...',
      saved: 'Saved',
      error: 'Save failed',
    },
    densityAriaLabel: 'Editor density',
    densityLabels: {
      compact: 'Compact',
      cozy: 'Cozy',
      comfortable: 'Comfortable',
    },
    themeModeLabels: {
      light: 'Light',
      dark: 'Dark',
    },
    shortcutsLabel: 'Shortcuts: ?',
  },
};

export function getSandboxStatusBarCopy(locale: Locale): SandboxStatusBarCopy {
  return COPY[locale] ?? COPY.en;
}
