import type { WcagLevel } from '@/lib/builder/site/theme/contrast';
import type { ThemeColorToken } from '@/lib/builder/site/theme';
import type { ThemeBindingTone } from '@/lib/builder/site/theme-bindings';
import type { Locale } from '@/lib/locales';

export type ColorPickerCopy = {
  dialogAriaLabel: string;
  title: string;
  description: string;
  themePaletteLabel: string;
  paletteLabel: string;
  recentLabel: string;
  nativeColorAriaLabel: string;
  customColorPlaceholder: string;
  eyeDropperLabel: string;
  eyeDropperPickTitle: string;
  eyeDropperUnavailableTitle: string;
  eyeDropperError: string;
  contrastAgainstTitle: (backgroundHex: string) => string;
  contrastUnavailableLabel: string;
  wcagLevelLabels: Record<WcagLevel, string>;
  themeColorLabels: Record<ThemeColorToken, string>;
  colorBindingBadge: Record<Extract<ThemeBindingTone, 'linked' | 'detached'>, {
    label: string;
    title: (tokenLabel?: string) => string;
  }>;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', ColorPickerCopy> = {
  ko: {
    dialogAriaLabel: '고급 색상 선택기',
    title: '색상',
    description: '테마 연결, 고정 색상, 최근 색상, WCAG 대비 확인',
    themePaletteLabel: '테마 팔레트',
    paletteLabel: '팔레트',
    recentLabel: '최근 색상',
    nativeColorAriaLabel: '기본 색상 값',
    customColorPlaceholder: '#123b63 또는 hsl(211 70% 40%)',
    eyeDropperLabel: '스포이드',
    eyeDropperPickTitle: '화면에서 색상 선택',
    eyeDropperUnavailableTitle: '이 브라우저에서는 스포이드를 사용할 수 없습니다',
    eyeDropperError: '스포이드가 취소되었거나 사용할 수 없습니다.',
    contrastAgainstTitle: (backgroundHex) => `배경 ${backgroundHex} 대비`,
    contrastUnavailableLabel: '대비 n/a',
    wcagLevelLabels: {
      fail: '불합격',
      AA: 'AA',
      AAA: 'AAA',
    },
    themeColorLabels: {
      primary: '기본',
      secondary: '보조',
      accent: '강조',
      background: '배경',
      text: '텍스트',
      muted: '옅은 배경',
    },
    colorBindingBadge: {
      linked: {
        label: '테마 연결됨',
        title: (tokenLabel) => `${tokenLabel ?? '선택된'} 테마 색상 토큰을 사용합니다.`,
      },
      detached: {
        label: '분리됨',
        title: () => '테마 토큰 대신 고정 색상 값을 사용합니다.',
      },
    },
  },
  'zh-hant': {
    dialogAriaLabel: '進階顏色選擇器',
    title: '顏色',
    description: '主題連結、固定色彩、最近使用與 WCAG 對比檢查',
    themePaletteLabel: '主題調色盤',
    paletteLabel: '調色盤',
    recentLabel: '最近使用',
    nativeColorAriaLabel: '原生顏色值',
    customColorPlaceholder: '#123b63 或 hsl(211 70% 40%)',
    eyeDropperLabel: '取色器',
    eyeDropperPickTitle: '從畫面選取顏色',
    eyeDropperUnavailableTitle: '此瀏覽器無法使用取色器',
    eyeDropperError: '取色器已取消或無法使用。',
    contrastAgainstTitle: (backgroundHex) => `相對於 ${backgroundHex} 的對比`,
    contrastUnavailableLabel: '對比 n/a',
    wcagLevelLabels: {
      fail: '未通過',
      AA: 'AA',
      AAA: 'AAA',
    },
    themeColorLabels: {
      primary: '主要',
      secondary: '次要',
      accent: '強調',
      background: '背景',
      text: '文字',
      muted: '淡色',
    },
    colorBindingBadge: {
      linked: {
        label: '已連結主題',
        title: (tokenLabel) => `使用 ${tokenLabel ?? '所選'} 主題色彩權杖。`,
      },
      detached: {
        label: '已分離',
        title: () => '使用固定色彩值，而非主題權杖。',
      },
    },
  },
  en: {
    dialogAriaLabel: 'Advanced color picker',
    title: 'Color',
    description: 'Theme-linked, detached, recent, and WCAG checks',
    themePaletteLabel: 'Theme palette',
    paletteLabel: 'Palette',
    recentLabel: 'Recent',
    nativeColorAriaLabel: 'Native color value',
    customColorPlaceholder: '#123b63 or hsl(211 70% 40%)',
    eyeDropperLabel: 'EyeDropper',
    eyeDropperPickTitle: 'Pick a color from the screen',
    eyeDropperUnavailableTitle: 'EyeDropper is unavailable in this browser',
    eyeDropperError: 'EyeDropper cancelled or unavailable.',
    contrastAgainstTitle: (backgroundHex) => `Against ${backgroundHex}`,
    contrastUnavailableLabel: 'Contrast n/a',
    wcagLevelLabels: {
      fail: 'fail',
      AA: 'AA',
      AAA: 'AAA',
    },
    themeColorLabels: {
      primary: 'Primary',
      secondary: 'Secondary',
      accent: 'Accent',
      background: 'Background',
      text: 'Text',
      muted: 'Muted',
    },
    colorBindingBadge: {
      linked: {
        label: 'Theme linked',
        title: (tokenLabel) => `Uses the ${tokenLabel ?? 'selected'} theme color token.`,
      },
      detached: {
        label: 'Detached',
        title: () => 'Uses a fixed color value instead of a theme token.',
      },
    },
  },
};

export function getColorPickerCopy(locale: Locale): ColorPickerCopy {
  return COPY[locale] ?? COPY.en;
}
