import type { Locale } from '@/lib/locales';

export interface AiGeneratorCopy {
  title: string;
  description: string;
  badge: string;
}

const AI_GENERATOR_COPY: Record<Locale, AiGeneratorCopy> = {
  ko: {
    title: 'AI 사이트 생성기',
    description:
      '업종, 목표, 페이지, 브랜드 키워드, 제약 조건을 기반으로 사이트맵과 편집 가능한 초기 페이지 초안을 생성합니다.',
    badge: 'F85/F86 첫 번째 단계',
  },
  'zh-hant': {
    title: 'AI 網站生成器',
    description:
      '根據產業、目標、頁面、品牌關鍵字與限制條件，產生網站地圖與可編輯的初始頁面草稿。',
    badge: 'F85/F86 第一階段',
  },
  en: {
    title: 'AI Site Generator',
    description:
      'Generate a sitemap and editable first-page draft from your industry, goals, pages, brand keywords, and constraints.',
    badge: 'F85/F86 first slice',
  },
};

export function getAiGeneratorCopy(locale: Locale): AiGeneratorCopy {
  return AI_GENERATOR_COPY[locale] ?? AI_GENERATOR_COPY.en;
}
