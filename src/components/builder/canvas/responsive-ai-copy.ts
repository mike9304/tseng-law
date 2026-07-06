import type {
  ResponsiveSuggestion,
  ResponsiveTargetViewport,
} from '@/lib/builder/ai-generator/responsive-rules';
import type { Locale } from '@/lib/locales';

type ResponsiveSuggestionReason = ResponsiveSuggestion['reason'];
type ResponsiveSuggestionState = 'pending' | 'applied' | 'discarded';

export type ResponsiveAiCopy = {
  requestFailedError: string;
  callFailedError: string;
  dialogLabel: string;
  title: (viewport: ResponsiveTargetViewport) => string;
  closeLabel: string;
  viewportLabels: Record<ResponsiveTargetViewport, string>;
  reasonLabels: Record<ResponsiveSuggestionReason, string>;
  intro: (viewport: ResponsiveTargetViewport) => string;
  analyzingLabel: string;
  reanalyzeLabel: string;
  analyzeLabel: string;
  applyAllLabel: (count: number) => string;
  previewAllLabel: (count: number) => string;
  previewLabel: string;
  cancelPreviewLabel: string;
  undoLastLabel: string;
  undoLastDisabledLabel: string;
  appliedCountLabel: (count: number) => string;
  emptySuggestionsLabel: string;
  nodePrefix: string;
  applyLabel: string;
  discardLabel: string;
  stateLabels: Record<Exclude<ResponsiveSuggestionState, 'pending'>, string>;
};

const safeLineFor = (viewport: ResponsiveTargetViewport) => (viewport === 'mobile' ? '360px' : '720px');

const COPY: Record<'ko' | 'zh-hant' | 'en', ResponsiveAiCopy> = {
  ko: {
    requestFailedError: '요청에 실패했습니다.',
    callFailedError: '반응형 어시스턴트 호출에 실패했습니다.',
    dialogLabel: '반응형 AI 어시스턴트',
    title: (viewport) => `반응형 AI (${COPY.ko.viewportLabels[viewport]})`,
    closeLabel: '반응형 어시스턴트 닫기',
    viewportLabels: {
      mobile: '모바일',
      tablet: '태블릿',
    },
    reasonLabels: {
      'text-overflows-viewport': '폭 초과 텍스트 축소',
      'font-too-large': '큰 글꼴 축소',
      'node-overflows-viewport': '화면 밖 요소 위치 보정',
      'side-by-side-stack': '좌우 컨테이너 세로 정렬',
    },
    intro: (viewport) => `현재 페이지에서 ${COPY.ko.viewportLabels[viewport]} 안전선(${safeLineFor(viewport)})을 넘는 요소를 찾아 보정 제안을 만듭니다. 각 제안을 개별 또는 일괄 적용할 수 있습니다.`,
    analyzingLabel: '분석 중...',
    reanalyzeLabel: '다시 분석',
    analyzeLabel: '분석 시작',
    applyAllLabel: (count) => `전체 적용 (${count})`,
    previewAllLabel: (count) => `전체 미리보기 (${count})`,
    previewLabel: '미리보기',
    cancelPreviewLabel: '미리보기 취소',
    undoLastLabel: '마지막 적용 취소',
    undoLastDisabledLabel: '되돌릴 반응형 적용 내역이 없습니다',
    appliedCountLabel: (count) => `${count}개 적용됨`,
    emptySuggestionsLabel: '제안이 없습니다. 모바일 안전선을 잘 지키고 있어요.',
    nodePrefix: 'node',
    applyLabel: '적용',
    discardLabel: '제외',
    stateLabels: {
      applied: '적용됨',
      discarded: '제외됨',
    },
  },
  'zh-hant': {
    requestFailedError: '請求失敗。',
    callFailedError: '反應式助手呼叫失敗。',
    dialogLabel: '反應式 AI 助手',
    title: (viewport) => `反應式 AI（${COPY['zh-hant'].viewportLabels[viewport]}）`,
    closeLabel: '關閉反應式助手',
    viewportLabels: {
      mobile: '手機',
      tablet: '平板',
    },
    reasonLabels: {
      'text-overflows-viewport': '縮小超出寬度的文字',
      'font-too-large': '縮小過大的字體',
      'node-overflows-viewport': '修正超出版面的元素位置',
      'side-by-side-stack': '將左右容器改為垂直排列',
    },
    intro: (viewport) => `在目前頁面尋找超過${COPY['zh-hant'].viewportLabels[viewport]}安全線（${safeLineFor(viewport)}）的元素，並產生修正建議。你可以逐一套用或批次套用。`,
    analyzingLabel: '分析中...',
    reanalyzeLabel: '重新分析',
    analyzeLabel: '開始分析',
    applyAllLabel: (count) => `全部套用（${count}）`,
    previewAllLabel: (count) => `全部預覽（${count}）`,
    previewLabel: '預覽',
    cancelPreviewLabel: '取消預覽',
    undoLastLabel: '復原上次套用',
    undoLastDisabledLabel: '沒有可復原的響應式套用記錄',
    appliedCountLabel: (count) => `已套用 ${count} 個`,
    emptySuggestionsLabel: '沒有建議。目前版面符合手機安全線。',
    nodePrefix: 'node',
    applyLabel: '套用',
    discardLabel: '排除',
    stateLabels: {
      applied: '已套用',
      discarded: '已排除',
    },
  },
  en: {
    requestFailedError: 'Request failed.',
    callFailedError: 'Responsive assistant request failed.',
    dialogLabel: 'Responsive AI assistant',
    title: (viewport) => `Responsive AI (${COPY.en.viewportLabels[viewport]})`,
    closeLabel: 'Close responsive assistant',
    viewportLabels: {
      mobile: 'mobile',
      tablet: 'tablet',
    },
    reasonLabels: {
      'text-overflows-viewport': 'Shrink overflowing text',
      'font-too-large': 'Reduce oversized font',
      'node-overflows-viewport': 'Move element inside viewport',
      'side-by-side-stack': 'Stack side-by-side containers',
    },
    intro: (viewport) => `Find elements that cross the ${COPY.en.viewportLabels[viewport]} safe line (${safeLineFor(viewport)}) on this page and generate correction suggestions. You can apply each suggestion individually or in bulk.`,
    analyzingLabel: 'Analyzing...',
    reanalyzeLabel: 'Analyze again',
    analyzeLabel: 'Start analysis',
    applyAllLabel: (count) => `Apply all (${count})`,
    previewAllLabel: (count) => `Preview all (${count})`,
    previewLabel: 'Preview',
    cancelPreviewLabel: 'Cancel preview',
    undoLastLabel: 'Undo last apply',
    undoLastDisabledLabel: 'No responsive apply step is available to undo',
    appliedCountLabel: (count) => `${count} applied`,
    emptySuggestionsLabel: 'No suggestions. The layout is staying inside the mobile safe line.',
    nodePrefix: 'node',
    applyLabel: 'Apply',
    discardLabel: 'Dismiss',
    stateLabels: {
      applied: 'Applied',
      discarded: 'Dismissed',
    },
  },
};

export function getResponsiveAiCopy(locale: Locale): ResponsiveAiCopy {
  return COPY[locale] ?? COPY.en;
}
