import type {
  TextAssistantAction,
  TextAssistantTargetLocale,
  TextAssistantTone,
} from '@/lib/builder/ai-generator/text-assistant';

export type AiTextAssistantCopy = {
  emptySourceError: string;
  requestFailedError: string;
  callFailedError: string;
  callExceptionError: string;
  dialogLabel: string;
  title: string;
  closeLabel: string;
  actionGroupLabel: string;
  actionLabels: Record<TextAssistantAction, string>;
  targetLocaleLabel: string;
  localeLabels: Record<TextAssistantTargetLocale, string>;
  toneLabel: string;
  toneSelectLabel: string;
  toneLabels: Record<TextAssistantTone, string>;
  customPromptLabel: string;
  customPromptPlaceholder: string;
  generatingLabel: string;
  regenerateLabel: string;
  generateLabel: string;
  previousResultLabel: string;
  nextResultLabel: string;
  noResultsLabel: string;
  showResultLabel: string;
  showOriginalLabel: string;
  originalLabel: string;
  resetLabel: string;
  applyLabel: string;
  characterCountLabel: (count: number) => string;
  describeAction: (input: {
    action: TextAssistantAction;
    targetLocale?: TextAssistantTargetLocale;
    tone?: TextAssistantTone;
  }) => string;
};

const COPY: Record<TextAssistantTargetLocale, AiTextAssistantCopy> = {
  ko: {
    emptySourceError: 'AI 어시스턴트는 빈 텍스트에서 실행할 수 없습니다.',
    requestFailedError: '요청에 실패했습니다.',
    callFailedError: 'AI 텍스트 어시스턴트 호출에 실패했습니다.',
    callExceptionError: 'AI 텍스트 어시스턴트 호출 중 오류가 발생했습니다.',
    dialogLabel: 'AI 텍스트 어시스턴트',
    title: 'AI 텍스트 어시스턴트',
    closeLabel: 'AI 어시스턴트 닫기',
    actionGroupLabel: 'AI 액션',
    actionLabels: {
      rewrite: '다시 쓰기',
      expand: '확장',
      shorten: '줄이기',
      translate: '번역',
      tone: '톤',
    },
    targetLocaleLabel: '번역 대상 언어',
    localeLabels: {
      ko: '한국어',
      'zh-hant': '繁體中文',
      en: 'English',
    },
    toneLabel: '톤',
    toneSelectLabel: '톤 선택',
    toneLabels: {
      formal: '격식 있게',
      casual: '캐주얼',
      persuasive: '설득형',
      concise: '간결하게',
      warm: '따뜻하게',
      authoritative: '전문가답게',
    },
    customPromptLabel: '추가 지시 (선택)',
    customPromptPlaceholder: '예: 변호사 사무실 톤, 5문장 이내, 클릭 유도 표현 포함',
    generatingLabel: '생성 중...',
    regenerateLabel: '다시 생성',
    generateLabel: '생성',
    previousResultLabel: '이전 결과',
    nextResultLabel: '다음 결과',
    noResultsLabel: '결과 없음',
    showResultLabel: '결과 보기',
    showOriginalLabel: '원본 보기',
    originalLabel: '원본',
    resetLabel: '초기화',
    applyLabel: '적용',
    characterCountLabel: (count) => `${count}자`,
    describeAction: (input) => {
      if (input.action === 'translate') {
        return input.targetLocale ? `번역 -> ${COPY.ko.localeLabels[input.targetLocale]}` : COPY.ko.actionLabels.translate;
      }
      if (input.action === 'tone') {
        return input.tone ? `톤 -> ${COPY.ko.toneLabels[input.tone]}` : COPY.ko.actionLabels.tone;
      }
      return COPY.ko.actionLabels[input.action];
    },
  },
  'zh-hant': {
    emptySourceError: 'AI 助手無法處理空白文字。',
    requestFailedError: '請求失敗。',
    callFailedError: 'AI 文字助手呼叫失敗。',
    callExceptionError: '呼叫 AI 文字助手時發生錯誤。',
    dialogLabel: 'AI 文字助手',
    title: 'AI 文字助手',
    closeLabel: '關閉 AI 助手',
    actionGroupLabel: 'AI 動作',
    actionLabels: {
      rewrite: '重寫',
      expand: '擴寫',
      shorten: '縮短',
      translate: '翻譯',
      tone: '語氣',
    },
    targetLocaleLabel: '翻譯目標語言',
    localeLabels: {
      ko: '한국어',
      'zh-hant': '繁體中文',
      en: 'English',
    },
    toneLabel: '語氣',
    toneSelectLabel: '選擇語氣',
    toneLabels: {
      formal: '正式',
      casual: '自然',
      persuasive: '具說服力',
      concise: '精簡',
      warm: '溫暖',
      authoritative: '專業權威',
    },
    customPromptLabel: '補充指示（選填）',
    customPromptPlaceholder: '例如：法律事務所語氣、5 句以內、包含行動呼籲',
    generatingLabel: '產生中...',
    regenerateLabel: '重新產生',
    generateLabel: '產生',
    previousResultLabel: '上一個結果',
    nextResultLabel: '下一個結果',
    noResultsLabel: '沒有結果',
    showResultLabel: '查看結果',
    showOriginalLabel: '查看原文',
    originalLabel: '原文',
    resetLabel: '重設',
    applyLabel: '套用',
    characterCountLabel: (count) => `${count} 字`,
    describeAction: (input) => {
      if (input.action === 'translate') {
        return input.targetLocale ? `翻譯 -> ${COPY['zh-hant'].localeLabels[input.targetLocale]}` : COPY['zh-hant'].actionLabels.translate;
      }
      if (input.action === 'tone') {
        return input.tone ? `語氣 -> ${COPY['zh-hant'].toneLabels[input.tone]}` : COPY['zh-hant'].actionLabels.tone;
      }
      return COPY['zh-hant'].actionLabels[input.action];
    },
  },
  en: {
    emptySourceError: 'AI assistant cannot run on empty text.',
    requestFailedError: 'Request failed.',
    callFailedError: 'AI text assistant request failed.',
    callExceptionError: 'An error occurred while calling the AI text assistant.',
    dialogLabel: 'AI text assistant',
    title: 'AI text assistant',
    closeLabel: 'Close AI assistant',
    actionGroupLabel: 'AI action',
    actionLabels: {
      rewrite: 'Rewrite',
      expand: 'Expand',
      shorten: 'Shorten',
      translate: 'Translate',
      tone: 'Tone',
    },
    targetLocaleLabel: 'Target language',
    localeLabels: {
      ko: 'Korean',
      'zh-hant': 'Traditional Chinese',
      en: 'English',
    },
    toneLabel: 'Tone',
    toneSelectLabel: 'Choose tone',
    toneLabels: {
      formal: 'Formal',
      casual: 'Casual',
      persuasive: 'Persuasive',
      concise: 'Concise',
      warm: 'Warm',
      authoritative: 'Authoritative',
    },
    customPromptLabel: 'Additional guidance (optional)',
    customPromptPlaceholder: 'Example: legal office tone, 5 sentences or fewer, include a call to action',
    generatingLabel: 'Generating...',
    regenerateLabel: 'Regenerate',
    generateLabel: 'Generate',
    previousResultLabel: 'Previous result',
    nextResultLabel: 'Next result',
    noResultsLabel: 'No results',
    showResultLabel: 'Show result',
    showOriginalLabel: 'Show original',
    originalLabel: 'Original',
    resetLabel: 'Reset',
    applyLabel: 'Apply',
    characterCountLabel: (count) => `${count} chars`,
    describeAction: (input) => {
      if (input.action === 'translate') {
        return input.targetLocale ? `Translate -> ${COPY.en.localeLabels[input.targetLocale]}` : COPY.en.actionLabels.translate;
      }
      if (input.action === 'tone') {
        return input.tone ? `Tone -> ${COPY.en.toneLabels[input.tone]}` : COPY.en.actionLabels.tone;
      }
      return COPY.en.actionLabels[input.action];
    },
  },
};

export function getAiTextAssistantCopy(locale: TextAssistantTargetLocale): AiTextAssistantCopy {
  return COPY[locale] ?? COPY.en;
}
