import type { Locale } from '@/lib/locales';
import type { CodeAssistantAction } from '@/lib/builder/ai-generator/code-assistant';

type Copy = {
  title: string;
  closeLabel: string;
  actionGroupLabel: string;
  actionLabels: Record<CodeAssistantAction, string>;
  contextLabel: string;
  contextPlaceholder: string;
  errorNoCode: string;
  errorRequestFailed: string;
  errorNoHunks: string;
  running: string;
  rerun: string;
  run: string;
  current: string;
  suggested: string;
  diff: string;
  diffSummaryNone: string;
  diffSummary: (additions: number, removals: number) => string;
  noDiffAvailable: string;
  linesLabel: (count: number) => string;
  selectedDiffLabel: string;
  hunkLabel: (index: number, oldStart: number, added: number, removed: number) => string;
  hunksSummary: (selected: number, total: number) => string;
  applySelected: string;
  applySuggested: string;
  noChanges: string;
  resultLabels: Record<CodeAssistantAction, string>;
  testRun: string;
  delete: string;
  codeBody: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', Copy> = {
  ko: {
    title: 'AI 코드 어시스턴트',
    closeLabel: 'AI 코드 어시스턴트 닫기',
    actionGroupLabel: 'AI 코드 액션',
    actionLabels: {
      explain: '설명',
      fix: '버그 수정',
      optimize: '최적화',
      comment: '주석 추가',
    },
    contextLabel: '추가 컨텍스트 (선택)',
    contextPlaceholder: '예: 이 함수는 /api/builder/dev/functions/now/invoke 에서 호출됩니다.',
    errorNoCode: '함수 본문이 비어 있습니다.',
    errorRequestFailed: '요청에 실패했습니다.',
    errorNoHunks: '적용할 조각을 선택하거나 최신 코드 기준으로 다시 실행하세요.',
    running: '분석 중...',
    rerun: '다시 실행',
    run: '실행',
    current: '현재',
    suggested: '제안',
    diff: '차이',
    diffSummaryNone: '코드 변경 없음.',
    diffSummary: (additions, removals) => `${additions}개 추가 / ${removals}개 제거`,
    noDiffAvailable: '사용할 diff가 없습니다.',
    linesLabel: (count) => `${count}줄`,
    selectedDiffLabel: '적용할 변경 조각',
    hunkLabel: (index, oldStart, added, removed) => `조각 ${index} · 줄 ${oldStart} · +${added} / -${removed}`,
    hunksSummary: (selected, total) => `${selected}/${total}개의 변경 조각 선택됨`,
    applySelected: '선택한 조각 적용',
    applySuggested: '제안 코드 적용',
    noChanges: '적용할 코드 변경이 없습니다.',
    resultLabels: {
      explain: '설명 결과',
      fix: '수정 결과',
      optimize: '최적화 결과',
      comment: '주석 결과',
    },
    testRun: '테스트 실행',
    delete: '삭제',
    codeBody: '코드 본문',
  },
  'zh-hant': {
    title: 'AI 程式助理',
    closeLabel: '關閉 AI 程式助理',
    actionGroupLabel: 'AI 程式操作',
    actionLabels: {
      explain: '說明',
      fix: '修正錯誤',
      optimize: '最佳化',
      comment: '加註解',
    },
    contextLabel: '額外背景（選填）',
    contextPlaceholder: '例如：此函式會在 /api/builder/dev/functions/now/invoke 之後被呼叫。',
    errorNoCode: '函式內容是空的。',
    errorRequestFailed: '請求失敗。',
    errorNoHunks: '請先選取要套用的區塊，或重新以最新程式碼執行。',
    running: '分析中...',
    rerun: '重新執行',
    run: '執行',
    current: '目前',
    suggested: '建議',
    diff: '差異',
    diffSummaryNone: '沒有程式碼變更。',
    diffSummary: (additions, removals) => `${additions} 個加入 / ${removals} 個移除`,
    noDiffAvailable: '沒有可用的 diff。',
    linesLabel: (count) => `${count} 行`,
    selectedDiffLabel: '要套用的變更區塊',
    hunkLabel: (index, oldStart, added, removed) => `區塊 ${index} · 第 ${oldStart} 行 · +${added} / -${removed}`,
    hunksSummary: (selected, total) => `已選取 ${selected}/${total} 個變更區塊`,
    applySelected: '套用已選區塊',
    applySuggested: '套用建議程式碼',
    noChanges: '沒有可套用的程式碼變更。',
    resultLabels: {
      explain: '說明結果',
      fix: '修正結果',
      optimize: '最佳化結果',
      comment: '註解結果',
    },
    testRun: '測試執行',
    delete: '刪除',
    codeBody: '程式碼內容',
  },
  en: {
    title: 'AI Code Assistant',
    closeLabel: 'Close AI code assistant',
    actionGroupLabel: 'AI code actions',
    actionLabels: {
      explain: 'Explain',
      fix: 'Fix bugs',
      optimize: 'Optimize',
      comment: 'Add comments',
    },
    contextLabel: 'Additional context (optional)',
    contextPlaceholder: 'Example: this function is invoked from /api/builder/dev/functions/now/invoke.',
    errorNoCode: 'The function body is empty.',
    errorRequestFailed: 'Request failed.',
    errorNoHunks: 'Select a hunk to apply or run again against the latest code.',
    running: 'Analyzing...',
    rerun: 'Run again',
    run: 'Run',
    current: 'Current',
    suggested: 'Suggested',
    diff: 'Diff',
    diffSummaryNone: 'No code changes.',
    diffSummary: (additions, removals) => `${additions} added / ${removals} removed`,
    noDiffAvailable: 'No diff available.',
    linesLabel: (count) => `${count} lines`,
    selectedDiffLabel: 'Selected diff hunk',
    hunkLabel: (index, oldStart, added, removed) => `Hunk ${index} · line ${oldStart} · +${added} / -${removed}`,
    hunksSummary: (selected, total) => `${selected}/${total} hunks selected`,
    applySelected: 'Apply selected hunks',
    applySuggested: 'Apply suggested code',
    noChanges: 'There are no code changes to apply.',
    resultLabels: {
      explain: 'Explanation',
      fix: 'Bug fixes',
      optimize: 'Optimization',
      comment: 'Commented code',
    },
    testRun: 'Test run',
    delete: 'Delete',
    codeBody: 'Code body',
  },
};

export function getCodeAssistantCopy(locale: Locale): Copy {
  return COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? COPY.ko;
}
