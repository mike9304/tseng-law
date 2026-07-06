import type { BuilderServiceFeatureCardCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type ServiceFeatureCardVariant = BuilderServiceFeatureCardCanvasNode['content']['variant'];

export interface ServiceFeatureCardCopy {
  defaults: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  inspector: {
    icon: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    variant: string;
    variants: Record<ServiceFeatureCardVariant, string>;
  };
}

export const SERVICE_FEATURE_CARD_LEGACY_DEFAULTS = {
  title: '기업 자문',
  description: '회사 설립부터 분쟁 해결까지 한·대 양국 기준으로 검토합니다.',
  ctaLabel: '자세히',
  ctaHref: '/ko/services/corporate',
} as const;

const serviceFeatureCardCopy: Record<Locale, ServiceFeatureCardCopy> = {
  ko: {
    defaults: {
      title: '기업 자문',
      description: '회사 설립부터 분쟁 해결까지 한·대 양국 기준으로 검토합니다.',
      ctaLabel: '자세히',
      ctaHref: '/ko/services/corporate',
    },
    inspector: {
      icon: '아이콘',
      title: '제목',
      description: '설명',
      ctaLabel: 'CTA 라벨',
      ctaHref: 'CTA 링크',
      variant: '스타일',
      variants: {
        minimal: '미니멀',
        card: '카드',
        gradient: '그라데이션',
      },
    },
  },
  'zh-hant': {
    defaults: {
      title: '企業顧問',
      description: '從公司設立到爭議解決，依韓台兩地標準進行檢視。',
      ctaLabel: '了解更多',
      ctaHref: '/zh-hant/services/corporate',
    },
    inspector: {
      icon: '圖示',
      title: '標題',
      description: '描述',
      ctaLabel: 'CTA 標籤',
      ctaHref: 'CTA 連結',
      variant: '樣式',
      variants: {
        minimal: '極簡',
        card: '卡片',
        gradient: '漸層',
      },
    },
  },
  en: {
    defaults: {
      title: 'Corporate advisory',
      description: 'From company formation to dispute resolution, reviewed across Korea and Taiwan standards.',
      ctaLabel: 'Learn more',
      ctaHref: '/en/services/corporate',
    },
    inspector: {
      icon: 'Icon',
      title: 'Title',
      description: 'Description',
      ctaLabel: 'CTA label',
      ctaHref: 'CTA href',
      variant: 'Style',
      variants: {
        minimal: 'Minimal',
        card: 'Card',
        gradient: 'Gradient',
      },
    },
  },
};

export function getServiceFeatureCardCopy(locale: Locale): ServiceFeatureCardCopy {
  return serviceFeatureCardCopy[locale] ?? serviceFeatureCardCopy.en;
}

export function localizedServiceFeatureCardText(
  value: string | undefined,
  localized: string,
  legacyDefault: string,
): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}
