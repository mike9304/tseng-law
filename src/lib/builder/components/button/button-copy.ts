import type { Locale } from '@/lib/locales';
import type { ButtonVariantKey } from '@/lib/builder/site/component-variants';

export interface ButtonInspectorCopy {
  defaultLabel: string;
  label: string;
  link: string;
  linkHint: string;
  variant: string;
  htmlTag: string;
  autoTag: (tag: string) => string;
  anchorTag: string;
  buttonTag: string;
  className: string;
  classHint: string;
  variants: Record<ButtonVariantKey, string>;
}

export const BUTTON_LEGACY_DEFAULT_LABEL = '버튼';

const BUTTON_INSPECTOR_COPY: Record<Locale, ButtonInspectorCopy> = {
  ko: {
    defaultLabel: '버튼',
    label: '표시 텍스트',
    link: '링크',
    linkHint: '내부 경로, 앵커, lightbox, http(s), mailto, tel 링크만 저장됩니다.',
    variant: '스타일',
    htmlTag: 'HTML 태그',
    autoTag: (tag) => `자동 (${tag})`,
    anchorTag: 'a (링크)',
    buttonTag: 'button (폼 버튼)',
    className: 'CSS 클래스 (읽기 전용)',
    classHint: '원본 사이트 CSS 연결. 임의 변경 금지 (시각 회귀 위험).',
    variants: {
      'primary-solid': '기본 채움',
      'primary-outline': '기본 윤곽선',
      'primary-ghost': '기본 고스트',
      'primary-link': '기본 링크',
      'secondary-solid': '보조 채움',
      'secondary-outline': '보조 윤곽선',
      'cta-shadow': 'CTA 그림자',
      'cta-arrow': 'CTA 화살표',
    },
  },
  'zh-hant': {
    defaultLabel: '按鈕',
    label: '顯示文字',
    link: '連結',
    linkHint: '只會儲存內部路徑、錨點、lightbox、http(s)、mailto、tel 連結。',
    variant: '樣式',
    htmlTag: 'HTML 標籤',
    autoTag: (tag) => `自動 (${tag})`,
    anchorTag: 'a (連結)',
    buttonTag: 'button (表單按鈕)',
    className: 'CSS 類別（唯讀）',
    classHint: '連接原始網站 CSS。請勿任意變更，以避免視覺回歸。',
    variants: {
      'primary-solid': '主要填色',
      'primary-outline': '主要外框',
      'primary-ghost': '主要淡色',
      'primary-link': '主要連結',
      'secondary-solid': '次要填色',
      'secondary-outline': '次要外框',
      'cta-shadow': 'CTA 陰影',
      'cta-arrow': 'CTA 箭頭',
    },
  },
  en: {
    defaultLabel: 'Button',
    label: 'Label',
    link: 'Link',
    linkHint: 'Only internal paths, anchors, lightbox, http(s), mailto, and tel links are saved.',
    variant: 'Variant',
    htmlTag: 'HTML tag',
    autoTag: (tag) => `Auto (${tag})`,
    anchorTag: 'a (link)',
    buttonTag: 'button (form button)',
    className: 'Class (CSS, read-only)',
    classHint: 'Original site CSS connection. Avoid manual changes to prevent visual regressions.',
    variants: {
      'primary-solid': 'Primary solid',
      'primary-outline': 'Primary outline',
      'primary-ghost': 'Primary ghost',
      'primary-link': 'Primary link',
      'secondary-solid': 'Secondary solid',
      'secondary-outline': 'Secondary outline',
      'cta-shadow': 'CTA shadow',
      'cta-arrow': 'CTA arrow',
    },
  },
};

export function getButtonInspectorCopy(locale?: Locale | string | null): ButtonInspectorCopy {
  if (locale === 'zh-hant') return BUTTON_INSPECTOR_COPY['zh-hant'];
  if (locale === 'en') return BUTTON_INSPECTOR_COPY.en;
  return BUTTON_INSPECTOR_COPY.ko;
}

export function localizedButtonLabel(label: string | undefined, defaultLabel: string): string {
  const current = label ?? '';
  return current === BUTTON_LEGACY_DEFAULT_LABEL ? defaultLabel : current;
}
