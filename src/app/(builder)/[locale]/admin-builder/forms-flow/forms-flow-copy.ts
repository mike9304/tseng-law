import type { Locale } from '@/lib/locales';

export interface FormsFlowCopy {
  pageTitle: string;
  pageDescription: string;
  heading: string;
  body: string;
  emptyState: string;
  card: {
    fields: (count: number) => string;
    steps: (count: number) => string;
    conditions: (count: number) => string;
    openInBuilder: string;
  };
}

const COPY: Record<Locale, FormsFlowCopy> = {
  ko: {
    pageTitle: '폼 흐름',
    pageDescription: '빌더 폼, 단계, 조건부 필드를 검토합니다.',
    heading: '폼 흐름',
    body: '드래그 앤 드롭으로 필드를 재정렬하고 단계 분할과 조건부 로직을 적용합니다.',
    emptyState: '초안 페이지에서 폼 노드를 찾지 못했습니다.',
    card: {
      fields: (count) => `${count}개 필드`,
      steps: (count) => `${count}개 단계`,
      conditions: (count) => `${count}개 조건`,
      openInBuilder: '빌더에서 열기',
    },
  },
  'zh-hant': {
    pageTitle: '表單流程',
    pageDescription: '檢視建構器表單、步驟與條件欄位。',
    heading: '表單流程',
    body: '拖放重新排列欄位，並套用步驟分割與條件式邏輯。',
    emptyState: '在草稿頁面中找不到表單節點。',
    card: {
      fields: (count) => `${count} 個欄位`,
      steps: (count) => `${count} 個步驟`,
      conditions: (count) => `${count} 個條件`,
      openInBuilder: '在編輯器中開啟',
    },
  },
  en: {
    pageTitle: 'Forms Flow',
    pageDescription: 'Review builder forms, steps, and conditional fields.',
    heading: 'Forms flow',
    body: 'Reorder form fields and configure multi-step and conditional logic.',
    emptyState: 'No form nodes found in draft pages.',
    card: {
      fields: (count) => `${count} fields`,
      steps: (count) => `${count} steps`,
      conditions: (count) => `${count} conditions`,
      openInBuilder: 'Open in builder',
    },
  },
};

export function getFormsFlowCopy(locale: Locale): FormsFlowCopy {
  return COPY[locale] ?? COPY.en;
}
