import type { Locale } from '@/lib/locales';

export type FunctionsCopy = {
  title: string;
  description: string;
  functionsList: string;
  createFunction: string;
  editFunction: string;
  aiCode: string;
  undoAi: string;
  save: string;
  working: string;
  name: string;
  slug: string;
  enabled: string;
  apiHeading: string;
  apiDescription: string;
  openSdkDocs: string;
  invokeEndpoint: string;
  resultHeading: string;
  runPlaceholder: string;
  logsHeading: string;
  logLevelFilter: string;
  logSearch: string;
  exportLogs: string;
  exportLogsStatus: (count: number) => string;
  noLogs: string;
  logLevelLabels: Record<'all' | 'log' | 'info' | 'warn' | 'error', string>;
  testRun: string;
  delete: string;
  codeBody: string;
  newFunctionStatus: string;
  saveError: string;
  saveSuccess: string;
  undoAiSuccess: string;
  saveBeforeInvoke: string;
  invokeError: string;
  invokeSuccess: (count: number) => string;
  deleteError: string;
  deleteSuccess: string;
  unsavedChanges: string;
  aiApplySuccess: string;
  sandboxNotice: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', FunctionsCopy> = {
  ko: {
    title: '함수 관리',
    description: '저장된 서버리스 함수 코드를 편집하고, 테스트 실행하며, AI 코드 어시스턴트로 설명/수정/최적화 제안을 적용합니다.',
    functionsList: '함수 목록',
    createFunction: '함수 만들기',
    editFunction: '함수 편집',
    aiCode: 'AI 코드',
    undoAi: 'AI 실행 취소',
    save: '저장',
    working: '작업 중...',
    name: '이름',
    slug: '슬러그',
    enabled: '활성화',
    apiHeading: '함수 API',
    apiDescription: '저장된 함수는 보호된 invoke 엔드포인트로 테스트 실행할 수 있습니다. 코드에는 ctx.now()와 로그 헬퍼(ctx.log/info/warn/error)가 제공됩니다.',
    openSdkDocs: 'SDK 문서 열기',
    invokeEndpoint: '호출 엔드포인트',
    resultHeading: '결과',
    runPlaceholder: '함수를 실행하면 반환값이 표시됩니다.',
    logsHeading: '최근 로그',
    logLevelFilter: '로그 레벨 필터',
    logSearch: '로그 검색',
    exportLogs: 'JSON 내보내기',
    exportLogsStatus: (count) => `로그 ${count}개를 내보냈습니다.`,
    noLogs: '표시할 로그가 없습니다.',
    logLevelLabels: {
      all: '전체',
      log: 'LOG',
      info: 'INFO',
      warn: 'WARN',
      error: 'ERROR',
    },
    testRun: '테스트 실행',
    delete: '삭제',
    codeBody: '코드 본문',
    newFunctionStatus: '새 함수를 작성 중입니다.',
    saveError: '함수 저장에 실패했습니다.',
    saveSuccess: '함수를 저장했습니다.',
    undoAiSuccess: 'AI 제안 코드를 되돌렸습니다.',
    saveBeforeInvoke: '먼저 함수를 저장하세요.',
    invokeError: '함수 실행에 실패했습니다.',
    invokeSuccess: (count) => `함수를 실행했습니다. 로그 ${count}개.`,
    deleteError: '함수 삭제에 실패했습니다.',
    deleteSuccess: '함수를 삭제했습니다.',
    unsavedChanges: '저장되지 않은 변경사항',
    aiApplySuccess: 'AI 제안 코드를 적용했습니다. 저장해야 반영됩니다.',
    sandboxNotice: '테스트 실행은 권한이 제한된 worker-vm 샌드박스에서만 동작합니다. 이 데모 영역은 프로덕션급 격리가 아니며, 실제 방문자에게 노출되거나 공개 실행되지 않습니다.',
  },
  'zh-hant': {
    title: '函數管理',
    description: '編輯已儲存的無伺服器函式程式碼、執行測試，並套用 AI 程式助理提供的說明/修正/最佳化建議。',
    functionsList: '函數列表',
    createFunction: '建立函數',
    editFunction: '編輯函數',
    aiCode: 'AI 程式碼',
    undoAi: '復原 AI',
    save: '儲存',
    working: '處理中...',
    name: '名稱',
    slug: '代稱',
    enabled: '啟用',
    apiHeading: '函數 API',
    apiDescription: '已儲存的函式可透過受保護的 invoke 端點進行測試。程式會取得 ctx.now() 與記錄輔助工具（ctx.log/info/warn/error）。',
    openSdkDocs: '開啟 SDK 文件',
    invokeEndpoint: '呼叫端點',
    resultHeading: '結果',
    runPlaceholder: '執行函式後會顯示回傳值。',
    logsHeading: '最近記錄',
    logLevelFilter: '記錄層級篩選',
    logSearch: '搜尋記錄',
    exportLogs: '匯出 JSON',
    exportLogsStatus: (count) => `已匯出 ${count} 筆記錄。`,
    noLogs: '沒有符合條件的記錄。',
    logLevelLabels: {
      all: '全部',
      log: 'LOG',
      info: 'INFO',
      warn: 'WARN',
      error: 'ERROR',
    },
    testRun: '測試執行',
    delete: '刪除',
    codeBody: '程式碼內容',
    newFunctionStatus: '正在建立新函式。',
    saveError: '儲存函式失敗。',
    saveSuccess: '已儲存函式。',
    undoAiSuccess: '已還原 AI 建議程式碼。',
    saveBeforeInvoke: '請先儲存函式。',
    invokeError: '執行函式失敗。',
    invokeSuccess: (count) => `已執行函式。共有 ${count} 筆記錄。`,
    deleteError: '刪除函式失敗。',
    deleteSuccess: '已刪除函式。',
    unsavedChanges: '尚未儲存的變更',
    aiApplySuccess: '已套用 AI 建議程式碼。請儲存後才會生效。',
    sandboxNotice: '測試執行僅在受限的 worker-vm 沙盒中運作。此示範範圍並非生產級隔離，也不會對真實訪客公開執行。',
  },
  en: {
    title: 'Function Management',
    description: 'Edit saved serverless function code, run tests, and apply AI assistant suggestions for explanation, fixes, and optimization.',
    functionsList: 'Functions list',
    createFunction: 'Create function',
    editFunction: 'Edit function',
    aiCode: 'AI code',
    undoAi: 'Undo AI',
    save: 'Save',
    working: 'Working...',
    name: 'Name',
    slug: 'Slug',
    enabled: 'Enabled',
    apiHeading: 'Function API',
    apiDescription: 'Saved functions can be test-run through the guarded invoke endpoint. The code receives ctx.now() and log helpers: ctx.log/info/warn/error.',
    openSdkDocs: 'Open SDK docs',
    invokeEndpoint: 'Invoke endpoint',
    resultHeading: 'Result',
    runPlaceholder: 'Run the function to see the return value.',
    logsHeading: 'Recent logs',
    logLevelFilter: 'Log level filter',
    logSearch: 'Search logs',
    exportLogs: 'Export JSON',
    exportLogsStatus: (count) => `Exported ${count} logs.`,
    noLogs: 'No matching logs.',
    logLevelLabels: {
      all: 'All',
      log: 'LOG',
      info: 'INFO',
      warn: 'WARN',
      error: 'ERROR',
    },
    testRun: 'Test run',
    delete: 'Delete',
    codeBody: 'Code body',
    newFunctionStatus: 'Creating a new function.',
    saveError: 'Failed to save the function.',
    saveSuccess: 'Saved the function.',
    undoAiSuccess: 'Reverted the AI-suggested code.',
    saveBeforeInvoke: 'Save the function first.',
    invokeError: 'Failed to run the function.',
    invokeSuccess: (count) => `Ran the function. ${count} logs.`,
    deleteError: 'Failed to delete the function.',
    deleteSuccess: 'Deleted the function.',
    unsavedChanges: 'Unsaved changes',
    aiApplySuccess: 'Applied the AI-suggested code. Save to persist it.',
    sandboxNotice: 'Test runs execute only in a bounded worker-vm sandbox. This demo boundary is not production-grade, is not a public execution surface, and does not run for real visitors.',
  },
};

export function getFunctionsCopy(locale: Locale): FunctionsCopy {
  return COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? COPY.ko;
}
