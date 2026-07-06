import type { Locale } from '@/lib/locales';

export type ContentTabCopy = {
  missingInspectorMessage: (nodeKind: string) => string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', ContentTabCopy> = {
  ko: {
    missingInspectorMessage: (nodeKind) => `${nodeKind}은 아직 콘텐츠 인스펙터가 연결되지 않았습니다.`,
  },
  'zh-hant': {
    missingInspectorMessage: (nodeKind) => `${nodeKind} 尚未連接內容檢查器。`,
  },
  en: {
    missingInspectorMessage: (nodeKind) => `${nodeKind} does not have a content inspector connected yet.`,
  },
};

export function getContentTabCopy(locale: Locale): ContentTabCopy {
  return COPY[locale] ?? COPY.en;
}
