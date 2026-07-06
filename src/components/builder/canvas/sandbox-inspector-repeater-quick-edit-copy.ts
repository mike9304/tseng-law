import type { Locale } from '@/lib/locales';

export type SandboxInspectorRepeaterQuickEditCopy = {
  sectionLabel: string;
  serviceTitle: (itemNumber: number) => string;
  serviceNotice: string;
  serviceTitleLabel: string;
  serviceDescriptionLabel: string;
  serviceDetailLinkLabel: string;
  faqTitle: (itemNumber: number) => string;
  faqNotice: string;
  faqQuestionLabel: string;
  faqAnswerLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', SandboxInspectorRepeaterQuickEditCopy> = {
  ko: {
    sectionLabel: '리피터',
    serviceTitle: (itemNumber) => `서비스 항목 ${itemNumber}`,
    serviceNotice: '이 카드의 제목과 본문을 한 번에 수정합니다. 변경 내용은 선택한 노드들과 함께 저장됩니다.',
    serviceTitleLabel: '제목',
    serviceDescriptionLabel: '설명',
    serviceDetailLinkLabel: '상세 링크',
    faqTitle: (itemNumber) => `FAQ 항목 ${itemNumber}`,
    faqNotice: '이 FAQ 항목의 질문과 답변을 한 번에 수정합니다. 변경 내용은 선택한 노드들과 함께 저장됩니다.',
    faqQuestionLabel: '질문',
    faqAnswerLabel: '답변',
  },
  'zh-hant': {
    sectionLabel: '重複器',
    serviceTitle: (itemNumber) => `服務項目 ${itemNumber}`,
    serviceNotice: '一次編輯此卡片的標題與內文。變更會與選取的節點一起儲存。',
    serviceTitleLabel: '標題',
    serviceDescriptionLabel: '說明',
    serviceDetailLinkLabel: '詳細連結',
    faqTitle: (itemNumber) => `FAQ 項目 ${itemNumber}`,
    faqNotice: '一次編輯此 FAQ 項目的問題與答案。變更會與選取的節點一起儲存。',
    faqQuestionLabel: '問題',
    faqAnswerLabel: '答案',
  },
  en: {
    sectionLabel: 'Repeater',
    serviceTitle: (itemNumber) => `Service item ${itemNumber}`,
    serviceNotice: 'Edit this card title and body together. Changes are saved with the selected nodes.',
    serviceTitleLabel: 'Title',
    serviceDescriptionLabel: 'Description',
    serviceDetailLinkLabel: 'Detail link',
    faqTitle: (itemNumber) => `FAQ item ${itemNumber}`,
    faqNotice: 'Edit this FAQ item question and answer together. Changes are saved with the selected nodes.',
    faqQuestionLabel: 'Question',
    faqAnswerLabel: 'Answer',
  },
};

export function getSandboxInspectorRepeaterQuickEditCopy(locale: Locale): SandboxInspectorRepeaterQuickEditCopy {
  return COPY[locale] ?? COPY.en;
}
