import type { ThemeBindingIndicator } from '@/lib/builder/site/theme-bindings';
import type { StyleOriginKind } from '@/lib/builder/site/style-origin';
import type { Locale } from '@/lib/locales';

export type StyleTabCopy = {
  styleSourceTitle: string;
  styleSourceLegend: string;
  styleSourceRows: {
    background: string;
    border: string;
    radius: string;
    shadow: string;
    opacity: string;
    hover: string;
    variant: string;
  };
  originLabels: Record<StyleOriginKind, string>;
  originHint: (hint?: string) => string | undefined;
  buttonVariantLabel: string;
  buttonVariantBadge: Record<ThemeBindingIndicator['tone'], Pick<ThemeBindingIndicator, 'label' | 'title'>>;
  sections: {
    background: string;
    border: string;
    shadow: string;
  };
  borderColorLabel: string;
  borderWidthLabel: string;
  borderStyleLabel: string;
  borderStyleOptions: {
    solid: string;
    dashed: string;
  };
  radiusLabel: string;
  opacityLabel: string;
  shadowXLabel: string;
  shadowYLabel: string;
  blurLabel: string;
  spreadLabel: string;
  shadowColorLabel: string;
  hoverStateLabel: string;
  hoverStateAriaLabel: string;
  hoverAdjustmentsLabel: string;
  hoverBackgroundLabel: string;
  hoverBorderColorLabel: string;
  scaleLabel: string;
  yMoveLabel: string;
  hoverShadowColorLabel: string;
  transitionMsLabel: string;
  numberValueAriaLabel: (label: string) => string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', StyleTabCopy> = {
  ko: {
    styleSourceTitle: '스타일 소스',
    styleSourceLegend: '테마 / 변형 / 직접 입력',
    styleSourceRows: {
      background: '배경',
      border: '테두리',
      radius: '모서리',
      shadow: '그림자',
      opacity: '투명도',
      hover: '호버',
      variant: '변형',
    },
    originLabels: {
      theme: '테마',
      variant: '변형',
      manual: '직접 입력',
      default: '기본값',
    },
    originHint: (hint) => {
      if (!hint) return undefined;
      if (hint === '사용자 직접 입력') return '사용자 직접 입력';
      if (hint === '기본값') return '기본값';
      if (hint.startsWith('variant: ')) return `변형: ${hint.slice('variant: '.length)}`;
      return hint;
    },
    buttonVariantLabel: '버튼 변형',
    buttonVariantBadge: {
      linked: {
        label: '변형 연결됨',
        title: '이 버튼의 시각 스타일이 선택된 변형을 따릅니다.',
      },
      detached: {
        label: '분리됨',
        title: '이 요소는 변형 대신 고정 스타일 값을 사용합니다.',
      },
      custom: {
        label: '변형 + 직접 수정',
        title: '변형에 배경, 테두리, 그림자 또는 투명도 직접 수정값이 더해졌습니다.',
      },
    },
    sections: {
      background: '배경',
      border: '테두리',
      shadow: '그림자',
    },
    borderColorLabel: '테두리 색상',
    borderWidthLabel: '테두리 두께',
    borderStyleLabel: '테두리 스타일',
    borderStyleOptions: {
      solid: '실선',
      dashed: '파선',
    },
    radiusLabel: '모서리 반경',
    opacityLabel: '투명도',
    shadowXLabel: '그림자 X',
    shadowYLabel: '그림자 Y',
    blurLabel: '흐림',
    spreadLabel: '확산',
    shadowColorLabel: '그림자 색상',
    hoverStateLabel: '호버 상태',
    hoverStateAriaLabel: '호버 상태',
    hoverAdjustmentsLabel: '호버 조정',
    hoverBackgroundLabel: '호버 배경',
    hoverBorderColorLabel: '호버 테두리 색상',
    scaleLabel: '크기',
    yMoveLabel: 'Y 이동',
    hoverShadowColorLabel: '호버 그림자 색상',
    transitionMsLabel: '전환 시간(ms)',
    numberValueAriaLabel: (label) => `${label} 값`,
  },
  'zh-hant': {
    styleSourceTitle: '樣式來源',
    styleSourceLegend: '主題 / 變體 / 手動',
    styleSourceRows: {
      background: '背景',
      border: '邊框',
      radius: '圓角',
      shadow: '陰影',
      opacity: '不透明度',
      hover: '懸停',
      variant: '變體',
    },
    originLabels: {
      theme: '主題',
      variant: '變體',
      manual: '手動',
      default: '預設',
    },
    originHint: (hint) => {
      if (!hint) return undefined;
      if (hint === '사용자 직접 입력') return '使用者手動輸入';
      if (hint === '기본값') return '預設值';
      if (hint.startsWith('variant: ')) return `變體：${hint.slice('variant: '.length)}`;
      return hint;
    },
    buttonVariantLabel: '按鈕變體',
    buttonVariantBadge: {
      linked: {
        label: '已連結變體',
        title: '此按鈕的視覺樣式由所選變體控制。',
      },
      detached: {
        label: '已分離',
        title: '此元素使用固定樣式值，而非變體。',
      },
      custom: {
        label: '變體 + 手動覆寫',
        title: '變體加上此分頁中的背景、邊框、陰影或不透明度覆寫。',
      },
    },
    sections: {
      background: '背景',
      border: '邊框',
      shadow: '陰影',
    },
    borderColorLabel: '邊框顏色',
    borderWidthLabel: '邊框寬度',
    borderStyleLabel: '邊框樣式',
    borderStyleOptions: {
      solid: '實線',
      dashed: '虛線',
    },
    radiusLabel: '圓角半徑',
    opacityLabel: '不透明度',
    shadowXLabel: '陰影 X',
    shadowYLabel: '陰影 Y',
    blurLabel: '模糊',
    spreadLabel: '擴散',
    shadowColorLabel: '陰影顏色',
    hoverStateLabel: '懸停狀態',
    hoverStateAriaLabel: '懸停狀態',
    hoverAdjustmentsLabel: '懸停調整',
    hoverBackgroundLabel: '懸停背景',
    hoverBorderColorLabel: '懸停邊框顏色',
    scaleLabel: '縮放',
    yMoveLabel: 'Y 位移',
    hoverShadowColorLabel: '懸停陰影顏色',
    transitionMsLabel: '轉場時間 (ms)',
    numberValueAriaLabel: (label) => `${label} 值`,
  },
  en: {
    styleSourceTitle: 'Style sources',
    styleSourceLegend: 'Theme / Variant / Manual',
    styleSourceRows: {
      background: 'Background',
      border: 'Border',
      radius: 'Radius',
      shadow: 'Shadow',
      opacity: 'Opacity',
      hover: 'Hover',
      variant: 'Variant',
    },
    originLabels: {
      theme: 'Theme',
      variant: 'Variant',
      manual: 'Manual',
      default: 'Default',
    },
    originHint: (hint) => {
      if (!hint) return undefined;
      if (hint === '사용자 직접 입력') return 'Manual input';
      if (hint === '기본값') return 'Default value';
      return hint;
    },
    buttonVariantLabel: 'Button variant',
    buttonVariantBadge: {
      linked: {
        label: 'Variant linked',
        title: 'The selected variant is driving this button visual style.',
      },
      detached: {
        label: 'Detached',
        title: 'This element uses fixed style values instead of a variant.',
      },
      custom: {
        label: 'Variant + custom override',
        title: 'The variant is combined with custom background, border, shadow, or opacity values from this tab.',
      },
    },
    sections: {
      background: 'Background',
      border: 'Border',
      shadow: 'Shadow',
    },
    borderColorLabel: 'Border color',
    borderWidthLabel: 'Border width',
    borderStyleLabel: 'Border style',
    borderStyleOptions: {
      solid: 'Solid',
      dashed: 'Dashed',
    },
    radiusLabel: 'Radius',
    opacityLabel: 'Opacity',
    shadowXLabel: 'Shadow X',
    shadowYLabel: 'Shadow Y',
    blurLabel: 'Blur',
    spreadLabel: 'Spread',
    shadowColorLabel: 'Shadow color',
    hoverStateLabel: 'Hover state',
    hoverStateAriaLabel: 'Hover state',
    hoverAdjustmentsLabel: 'Hover adjustments',
    hoverBackgroundLabel: 'Hover background',
    hoverBorderColorLabel: 'Hover border color',
    scaleLabel: 'Scale',
    yMoveLabel: 'Y move',
    hoverShadowColorLabel: 'Hover shadow color',
    transitionMsLabel: 'Transition ms',
    numberValueAriaLabel: (label) => `${label} value`,
  },
};

export function getStyleTabCopy(locale: Locale): StyleTabCopy {
  return COPY[locale] ?? COPY.en;
}
