import type { Locale } from '@/lib/locales';

type SdkCopy = {
  title: string;
  intro: string;
  keyTypes: string;
  example: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', SdkCopy> = {
  ko: {
    title: 'Builder SDK',
    intro: '사내 빌더를 위한 프로그래밍 가능한 API 표면입니다. 모든 예시는 서버 컨텍스트(Next.js Route Handler, Server Action, background job)를 가정합니다.',
    keyTypes: '주요 타입',
    example: '예시',
  },
  'zh-hant': {
    title: 'Builder SDK',
    intro: '供內部建構器使用的程式化 API 表面。所有範例都假設在伺服器環境中執行（Next.js Route Handler、Server Action 或背景工作）。',
    keyTypes: '主要型別',
    example: '範例',
  },
  en: {
    title: 'Builder SDK',
    intro: 'Programmatic surface for the in-house builder. All examples assume a server context (Next.js Route Handler, Server Action, or background job).',
    keyTypes: 'Key types',
    example: 'Example',
  },
};

export function getSdkCopy(locale: Locale): SdkCopy {
  return COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? COPY.ko;
}
