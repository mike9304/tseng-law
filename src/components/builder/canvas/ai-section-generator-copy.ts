import type { AiSectionKind } from '@/lib/builder/ai-generator/section-builder';
import type { Locale } from '@/lib/locales';

export type AiSectionGeneratorCopy = {
  emptyPromptError: string;
  requestFailedError: string;
  callFailedError: string;
  dialogLabel: string;
  title: string;
  closeLabel: string;
  sectionKindLabel: string;
  autoKindLabel: string;
  sectionDescriptionLabel: string;
  promptPlaceholder: string;
  generatingLabel: string;
  regenerateLabel: string;
  generateLabel: string;
  applyToCanvasLabel: string;
  nodeCountLabel: (count: number) => string;
  ctaPreviewLabel: string;
  fallbackNotice: string;
  kindLabels: Record<AiSectionKind, string>;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', AiSectionGeneratorCopy> = {
  ko: {
    emptyPromptError: '섹션 설명을 입력하세요.',
    requestFailedError: '요청에 실패했습니다.',
    callFailedError: 'AI 섹션 생성기 호출에 실패했습니다.',
    dialogLabel: 'AI 섹션 생성기',
    title: 'AI 섹션 생성',
    closeLabel: 'AI 섹션 생성기 닫기',
    sectionKindLabel: '섹션 종류',
    autoKindLabel: '자동 선택',
    sectionDescriptionLabel: '섹션 설명',
    promptPlaceholder: '예: 대만 진출 한국 기업을 위한 법률 자문 사무소의 히어로 섹션. 한국어 상담, 5영업일 이내 답변, 전문성을 강조.',
    generatingLabel: '생성 중...',
    regenerateLabel: '다시 생성',
    generateLabel: '생성',
    applyToCanvasLabel: '캔버스에 삽입',
    nodeCountLabel: (count) => `${count}개 노드`,
    ctaPreviewLabel: 'CTA',
    fallbackNotice: '⚠ OPENAI_API_KEY가 없어 결정적 스텁 내용을 사용했습니다.',
    kindLabels: {
      hero: 'Hero',
      features: 'Features',
      testimonials: 'Testimonials',
      cta: 'Call to action',
      faq: 'FAQ',
    },
  },
  'zh-hant': {
    emptyPromptError: '請輸入區段描述。',
    requestFailedError: '請求失敗。',
    callFailedError: 'AI 區段產生器呼叫失敗。',
    dialogLabel: 'AI 區段產生器',
    title: 'AI 區段產生',
    closeLabel: '關閉 AI 區段產生器',
    sectionKindLabel: '區段類型',
    autoKindLabel: '自動選擇',
    sectionDescriptionLabel: '區段描述',
    promptPlaceholder: '例如：為進軍台灣的韓國企業法律顧問事務所建立首頁主視覺區段。強調韓語諮詢、5 個工作天內回覆與專業度。',
    generatingLabel: '產生中...',
    regenerateLabel: '重新產生',
    generateLabel: '產生',
    applyToCanvasLabel: '插入到畫布',
    nodeCountLabel: (count) => `${count} 個節點`,
    ctaPreviewLabel: 'CTA',
    fallbackNotice: '⚠ 未設定 OPENAI_API_KEY，因此使用決定性 stub 內容。',
    kindLabels: {
      hero: '主視覺',
      features: '功能重點',
      testimonials: '見證',
      cta: '行動呼籲',
      faq: 'FAQ',
    },
  },
  en: {
    emptyPromptError: 'Enter a section description.',
    requestFailedError: 'Request failed.',
    callFailedError: 'AI section generator request failed.',
    dialogLabel: 'AI section generator',
    title: 'Generate AI section',
    closeLabel: 'Close AI section generator',
    sectionKindLabel: 'Section type',
    autoKindLabel: 'Auto select',
    sectionDescriptionLabel: 'Section description',
    promptPlaceholder: 'Example: Hero section for a legal advisory office helping Korean companies enter Taiwan. Emphasize Korean consultation, replies within 5 business days, and expertise.',
    generatingLabel: 'Generating...',
    regenerateLabel: 'Regenerate',
    generateLabel: 'Generate',
    applyToCanvasLabel: 'Insert into canvas',
    nodeCountLabel: (count) => `${count} nodes`,
    ctaPreviewLabel: 'CTA',
    fallbackNotice: '⚠ OPENAI_API_KEY is not set, so deterministic stub content was used.',
    kindLabels: {
      hero: 'Hero',
      features: 'Features grid',
      testimonials: 'Testimonials',
      cta: 'Call to action',
      faq: 'FAQ',
    },
  },
};

export function getAiSectionGeneratorCopy(locale: Locale): AiSectionGeneratorCopy {
  return COPY[locale] ?? COPY.en;
}
