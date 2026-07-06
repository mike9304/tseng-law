import type { Locale } from '@/lib/locales';

type ProviderSmokeFreshness = 'missing' | 'fresh' | 'stale';
type ProviderSmokeReviewerStatus = 'no_history' | 'healthy' | 'needs_attention' | 'stale';
type ProviderSmokeActionItem =
  | 'run_provider_smoke'
  | 'check_scheduled_smoke'
  | 'inspect_failures'
  | 'configure_provider';

function assertProviderSmokeFreshness(value: never): never {
  throw new Error(`Unexpected provider smoke freshness: ${value}`);
}

function assertProviderSmokeReviewerStatus(value: never): never {
  throw new Error(`Unexpected provider smoke reviewer status: ${value}`);
}

function assertProviderSmokeActionItem(value: never): never {
  throw new Error(`Unexpected provider smoke action item: ${value}`);
}

function providerSmokeActionKo(action: ProviderSmokeActionItem): string {
  switch (action) {
    case 'run_provider_smoke':
      return '누락된 제공자 점검 실행';
    case 'check_scheduled_smoke':
      return '예약 점검 확인';
    case 'inspect_failures':
      return '실패 원인 확인';
    case 'configure_provider':
      return '제공자 시크릿 설정';
    default:
      return assertProviderSmokeActionItem(action);
  }
}

function providerSmokeActionZh(action: ProviderSmokeActionItem): string {
  switch (action) {
    case 'run_provider_smoke':
      return '執行缺少的提供者檢查';
    case 'check_scheduled_smoke':
      return '確認排程檢查';
    case 'inspect_failures':
      return '檢查失敗原因';
    case 'configure_provider':
      return '設定提供者密鑰';
    default:
      return assertProviderSmokeActionItem(action);
  }
}

function providerSmokeActionEn(action: ProviderSmokeActionItem): string {
  switch (action) {
    case 'run_provider_smoke':
      return 'run missing provider checks';
    case 'check_scheduled_smoke':
      return 'check scheduled smoke';
    case 'inspect_failures':
      return 'inspect failures';
    case 'configure_provider':
      return 'configure provider secrets';
    default:
      return assertProviderSmokeActionItem(action);
  }
}

export type TranslationCopy = {
  managerTitle: string;
  managerDescription: string;
  managerSourceLocale: string;
  managerStrings: string;
  managerLastSync: string;
  managerAdminLocale: string;
  managerSearchPlaceholder: string;
  managerAllStatuses: string;
  managerMissing: string;
  managerOutdated: string;
  managerTranslated: string;
  managerManual: string;
  managerSyncSources: string;
  managerResetView: string;
  managerShareReview: string;
  managerReviewSummary: string;
  managerVisibleStrings: string;
  managerNoTranslations: string;
  managerAiTranslateMissing: (locale: string, count: number) => string;
  managerNotice: string;
  managerReviewFiltersReset: string;
  managerTranslationSaved: string;
  managerSaveFailed: string;
  managerTranslationUnavailable: string;
  managerSyncFailed: (status: number) => string;
  managerTranslationFailed: string;
  managerBatchUnavailable: string;
  managerBatchFailed: string;
  managerNoReturnedTranslations: string;
  managerBatchCandidates: (count: number) => string;
  managerAiTranslatedBatch: (saved: number, total: number, locale: string) => string;
  managerBatchProgressTitle: string;
  managerBatchProgressTranslating: (locale: string, total: number) => string;
  managerBatchProgressSaving: (saved: number, failed: number, total: number, locale: string) => string;
  managerBatchProviderTelemetry: (
    provider: string,
    mode: string,
    succeeded: number,
    requested: number,
    failed: number,
  ) => string;
  managerBatchProviderStepTelemetry: (
    step: string,
    cached: number,
    sent: number,
    succeeded: number,
    failed: number,
    durationMs?: number,
    partialCharacters?: number,
    chunkCount?: number,
    totalTokens?: number,
    estimatedCostUsd?: number,
  ) => string;
  managerProviderReadinessTitle: string;
  managerProviderReadinessDescription: string;
  managerProviderReadinessLoading: string;
  managerProviderRefresh: string;
  managerProviderConfigured: string;
  managerProviderMissingSecret: string;
  managerProviderSelected: string;
  managerProviderNotSelected: string;
  managerProviderSmokeTest: (provider: string) => string;
  managerProviderSmokeTesting: (provider: string) => string;
  managerProviderSmokePassed: (provider: string, durationMs: number) => string;
  managerProviderSmokeFailed: (provider: string) => string;
  managerProviderSmokeUnconfigured: (provider: string) => string;
  managerProviderSmokeSummaryTitle: string;
  managerProviderSmokeSummaryTotals: (passed: number, failed: number, unconfigured: number, total: number) => string;
  managerProviderSmokeSummaryFreshness: (freshness: ProviderSmokeFreshness, ageMinutes?: number) => string;
  managerProviderSmokeReviewStatus: (status: ProviderSmokeReviewerStatus) => string;
  managerProviderSmokeReviewActions: (actionItems: readonly ProviderSmokeActionItem[]) => string;
  managerProviderSmokeSummaryProvider: (provider: string, status: string, durationMs: number) => string;
  managerProviderSmokeSummaryMissing: (provider: string) => string;
  managerProviderSmokeHistoryTitle: string;
  managerProviderSmokeHistoryEmpty: string;
  managerProviderSmokeHistoryEntry: (
    provider: string,
    status: string,
    sourceLocale: string,
    targetLocale: string,
    durationMs: number,
  ) => string;
  managerProviderReadinessError: string;
  managerProviderCheckStatus: (status: string) => string;
  managerNoMissingOrOutdated: (locale: string) => string;
  managerSourceStringsSynced: string;
  dashboardTitle: string;
  dashboardDescription: string;
  dashboardEntryLink: string;
  dashboardSourcePages: string;
  dashboardTranslationCells: string;
  dashboardPublished: string;
  dashboardDraft: string;
  dashboardNeedsAttention: string;
  dashboardAllLocaleCombinations: string;
  dashboardUpToDateCells: string;
  dashboardDraftOutdatedUntranslated: string;
  dashboardFilter: string;
  dashboardAll: string;
  dashboardReset: string;
  dashboardShare: string;
  dashboardRefresh: string;
  dashboardPageCount: (visible: number, total: number) => string;
  dashboardContent: string;
  dashboardSource: string;
  dashboardTarget: string;
  dashboardReviewMissing: string;
  dashboardReviewOutdated: string;
  dashboardNoMissing: string;
  dashboardNoOutdated: string;
  dashboardReviewSummary: string;
  dashboardReviewLink: string;
  dashboardAllTranslationsReady: string;
  dashboardBeforePublish: (errors: number, warnings: number) => string;
  dashboardSyncFailed: (reason: string) => string;
  dashboardUpdated: string;
  dashboardSyncing: string;
  dashboardMissing: string;
  dashboardOutdated: string;
  dashboardPages: string;
  dashboardTranslations: string;
  dashboardCoverageTitle: string;
  dashboardCoverageDescription: string;
  dashboardCoverageCms: string;
  dashboardCoverageMedia: string;
  dashboardCoverageApps: string;
  dashboardCoverageTotal: string;
  dashboardCoverageReady: string;
  dashboardCoverageLocaleRate: (rate: number) => string;
  editorTitle: string;
  editorDescription: string;
  editorDashboardLink: string;
  editorNoTargetPage: string;
  editorSourceSlug: string;
  editorPerLanguageUrlSlug: string;
  editorSourceSlugLabel: string;
  editorSaving: string;
  editorSave: string;
  editorAutoTranslatePage: string;
  editorRevertAutoTranslate: string;
  editorSavedSlug: (locale: string) => string;
  editorNothingToSave: string;
  editorSaveFailed: string;
  editorUploadFailed: string;
  editorNoImageNodes: string;
  editorPerLanguageImages: string;
  editorSaveImageOverrides: string;
  editorSavingImageOverrides: string;
  editorPreview: (locale: string) => string;
  editorUploadReplacement: string;
  editorSourceSrc: string;
  editorOverrideSrc: (locale: string) => string;
  editorSourceAlt: string;
  editorOverrideAlt: (locale: string) => string;
  editorSourceImage: string;
  editorNothingToTranslate: string;
  editorSavedImageOverrides: (locale: string, count: number) => string;
  editorTarget: (locale: string) => string;
  editorSaveTranslation: string;
  editorSaveTranslationFailed: string;
  editorTranslationFailed: string;
  editorSourceTranslation: (locale: string) => string;
  editorTargetTranslation: (locale: string) => string;
  editorTranslationSaved: string;
  editorAutoTranslateFilled: (filled: number, failed: number) => string;
  editorAutoTranslateReverted: (count: number) => string;
  editorTargetPageMissing: string;
  editorSeoHeading: (targetLocale: string) => string;
  editorPageTextHeading: (count: number) => string;
  editorNoTranslatableNodes: string;
  progressReviewMissing: string;
  progressReviewOutdated: string;
  progressNoMissing: string;
  progressNoOutdated: string;
  progressComplete: (translated: number, total: number) => string;
  progressMissing: (count: number) => string;
  progressOutdated: (count: number) => string;
  progressBeforePublish: string;
  matrixNoEntries: string;
  matrixContent: string;
  matrixSource: string;
  matrixTarget: string;
  cellSave: string;
  cellCancel: string;
  cellAiTranslate: string;
  cellOutdatedTranslation: string;
  cellClickToTranslate: string;
  categoryTreeLabel: string;
  publishReady: string;
  publishUpdated: string;
  publishSyncing: string;
  publishBeforePublish: (errors: number, warnings: number) => string;
  publishMissing: string;
  publishOutdated: string;
  publishBrokenLink: string;
  publishError: string;
  publishWarning: string;
  publishReviewAction: string;
  publishMore: (count: number) => string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', TranslationCopy> = {
  ko: {
    managerTitle: '번역 관리자',
    managerDescription: '다국어 빌더 콘텐츠 번역을 관리합니다.',
    managerSourceLocale: '소스 로케일',
    managerStrings: '문자열',
    managerLastSync: '마지막 동기화',
    managerAdminLocale: '관리자 로케일',
    managerSearchPlaceholder: '소스·타깃·키로 검색 · 예: 회사소개, nav.about',
    managerAllStatuses: '모든 상태',
    managerMissing: '누락',
    managerOutdated: '오래됨',
    managerTranslated: '번역됨',
    managerManual: '수동',
    managerSyncSources: '소스 동기화',
    managerResetView: '보기 초기화',
    managerShareReview: '검토 링크 공유',
    managerReviewSummary: '번역 검토 요약',
    managerVisibleStrings: '표시 중인 문자열',
    managerNoTranslations: '조건에 맞는 번역 항목이 없습니다.',
    managerAiTranslateMissing: (locale, count) => `AI 미번역 - ${locale} (${count})`,
    managerNotice: '인라인 수정은 수동 번역으로 저장됩니다. AI 번역에는 OPENAI_API_KEY가 필요합니다.',
    managerReviewFiltersReset: '검토 필터를 초기화했습니다.',
    managerTranslationSaved: '번역을 저장했습니다.',
    managerSaveFailed: '저장에 실패했습니다.',
    managerTranslationUnavailable: '번역을 가져올 수 없습니다.',
    managerSyncFailed: (status) => `동기화 실패 (${status})`,
    managerTranslationFailed: '번역에 실패했습니다.',
    managerBatchUnavailable: '배치 번역을 사용할 수 없습니다.',
    managerBatchFailed: '배치 번역에 실패했습니다.',
    managerNoReturnedTranslations: '반환된 번역이 없습니다.',
    managerBatchCandidates: (count) => `배치 후보 ${count}`,
    managerAiTranslatedBatch: (saved, total, locale) => `AI 번역 ${saved}/${total} ${locale} 문자열`,
    managerBatchProgressTitle: '배치 번역 진행률',
    managerBatchProgressTranslating: (locale, total) => `${locale} 번역 요청 중 ${total}개`,
    managerBatchProgressSaving: (saved, failed, total, locale) => `${locale} 저장 중 ${saved}/${total} 완료, ${failed} 실패`,
    managerBatchProviderTelemetry: (provider, mode, succeeded, requested, failed) =>
      `제공자 ${provider} · ${mode} · 성공 ${succeeded}/${requested} · 실패 ${failed}`,
    managerBatchProviderStepTelemetry: (step, cached, sent, succeeded, failed, durationMs, partialCharacters, chunkCount, totalTokens, estimatedCostUsd) =>
      `단계 ${step} · 캐시 ${cached} · 요청 ${sent} · 성공 ${succeeded} · 실패 ${failed}${durationMs === undefined ? '' : ` · 응답 ${durationMs}ms`}${partialCharacters === undefined ? '' : ` · 부분 ${partialCharacters}자`}${chunkCount === undefined ? '' : ` · 청크 ${chunkCount}`}${totalTokens === undefined ? '' : ` · 토큰 ${totalTokens}`}${estimatedCostUsd === undefined ? '' : ` · $${estimatedCostUsd.toFixed(6)}`}`,
    managerProviderReadinessTitle: '번역 제공자 점검',
    managerProviderReadinessDescription: '운영 번역에 필요한 제공자 시크릿과 라우터 선택 상태를 확인합니다.',
    managerProviderReadinessLoading: '제공자 설정을 확인하는 중...',
    managerProviderRefresh: '다시 확인',
    managerProviderConfigured: '설정됨',
    managerProviderMissingSecret: '시크릿 없음',
    managerProviderSelected: '선택됨',
    managerProviderNotSelected: '대기',
    managerProviderSmokeTest: (provider) => `${provider} 점검 실행`,
    managerProviderSmokeTesting: (provider) => `${provider} 점검 중...`,
    managerProviderSmokePassed: (provider, durationMs) => `${provider} 점검 통과 · ${durationMs}ms`,
    managerProviderSmokeFailed: (provider) => `${provider} 점검 실패`,
    managerProviderSmokeUnconfigured: (provider) => `${provider} 미설정`,
    managerProviderSmokeSummaryTitle: '점검 리포트',
    managerProviderSmokeSummaryTotals: (passed, failed, unconfigured, total) =>
      `최근 ${total}회 · 통과 ${passed} · 실패 ${failed} · 미설정 ${unconfigured}`,
    managerProviderSmokeSummaryFreshness: (freshness, ageMinutes) => {
      switch (freshness) {
        case 'missing':
          return '점검 기록 없음';
        case 'fresh':
          return `최근 점검 ${ageMinutes ?? 0}분 전 · 정상`;
        case 'stale':
          return `최근 점검 ${ageMinutes ?? 0}분 전 · 오래됨`;
        default:
          return assertProviderSmokeFreshness(freshness);
      }
    },
    managerProviderSmokeReviewStatus: (status) => {
      switch (status) {
        case 'no_history':
          return '검토 상태: 기록 없음';
        case 'healthy':
          return '검토 상태: 정상';
        case 'needs_attention':
          return '검토 상태: 검토 필요';
        case 'stale':
          return '검토 상태: 오래됨';
        default:
          return assertProviderSmokeReviewerStatus(status);
      }
    },
    managerProviderSmokeReviewActions: (actionItems) =>
      actionItems.length > 0 ? `다음 조치: ${actionItems.map(providerSmokeActionKo).join(', ')}` : '다음 조치 없음',
    managerProviderSmokeSummaryProvider: (provider, status, durationMs) =>
      `${provider} 최신 ${status === 'pass' ? '통과' : status === 'unconfigured' ? '미설정' : '실패'} · ${durationMs}ms`,
    managerProviderSmokeSummaryMissing: (provider) => `${provider} 기록 없음`,
    managerProviderSmokeHistoryTitle: '최근 점검',
    managerProviderSmokeHistoryEmpty: '아직 점검 실행 기록이 없습니다.',
    managerProviderSmokeHistoryEntry: (provider, status, sourceLocale, targetLocale, durationMs) =>
      `${provider} · ${status === 'pass' ? '통과' : status === 'unconfigured' ? '미설정' : '실패'} · ${sourceLocale}→${targetLocale} · ${durationMs}ms`,
    managerProviderReadinessError: '번역 제공자 점검 상태를 불러오지 못했습니다.',
    managerProviderCheckStatus: (status) => status === 'pass' ? '통과' : status === 'warn' ? '주의' : '실패',
    managerNoMissingOrOutdated: (locale) => `현재 필터에서 누락/오래된 ${locale} 문자열이 없습니다.`,
    managerSourceStringsSynced: '소스 문자열을 동기화했습니다.',
    dashboardTitle: '번역 대시보드',
    dashboardDescription: '모든 로케일의 페이지별 번역 상태를 확인합니다.',
    dashboardEntryLink: '입구 보기',
    dashboardSourcePages: '소스 페이지',
    dashboardTranslationCells: '번역 셀',
    dashboardPublished: '게시됨',
    dashboardDraft: '초안',
    dashboardNeedsAttention: '주의 필요',
    dashboardAllLocaleCombinations: '모든 로케일 조합',
    dashboardUpToDateCells: '최신 셀',
    dashboardDraftOutdatedUntranslated: '초안, 오래됨, 미번역',
    dashboardFilter: '필터:',
    dashboardAll: '모두',
    dashboardReset: '초기화',
    dashboardShare: '대시보드 공유',
    dashboardRefresh: '대시보드 새로고침',
    dashboardPageCount: (visible, total) => `${visible} / ${total} 페이지`,
    dashboardContent: '콘텐츠',
    dashboardSource: '소스',
    dashboardTarget: '타깃',
    dashboardReviewMissing: '누락 검토',
    dashboardReviewOutdated: '오래됨 검토',
    dashboardNoMissing: '누락 없음',
    dashboardNoOutdated: '오래됨 없음',
    dashboardReviewSummary: '번역 검토 요약',
    dashboardReviewLink: '검토 링크',
    dashboardAllTranslationsReady: '모든 번역이 게시 준비되었습니다.',
    dashboardBeforePublish: (errors, warnings) => `${errors}개 차단${errors > 1 ? ' 항목' : ''}${errors > 0 && warnings > 0 ? ` 및 ${warnings}개 경고` : warnings > 0 ? `, ${warnings}개 경고` : ''} 게시 전`,
    dashboardSyncFailed: (reason) => `동기화 실패: ${reason}`,
    dashboardUpdated: '업데이트됨',
    dashboardSyncing: '동기화 중...',
    dashboardMissing: '누락',
    dashboardOutdated: '오래됨',
    dashboardPages: '페이지',
    dashboardTranslations: '번역',
    dashboardCoverageTitle: '콘텐츠 범위',
    dashboardCoverageDescription: 'CMS, 미디어, 앱 문자열 번역 상태를 함께 확인합니다.',
    dashboardCoverageCms: 'CMS',
    dashboardCoverageMedia: '미디어',
    dashboardCoverageApps: '앱',
    dashboardCoverageTotal: '문자열',
    dashboardCoverageReady: '완료',
    dashboardCoverageLocaleRate: (rate) => `${rate}% 완료`,
    editorTitle: '번역 편집',
    editorDescription: '페이지별 번역을 나란히 편집합니다.',
    editorDashboardLink: '대시보드로 돌아가기',
    editorNoTargetPage: '아직 타깃 페이지가 없습니다.',
    editorSourceSlug: '소스 슬러그',
    editorPerLanguageUrlSlug: '언어별 URL 슬러그',
    editorSourceSlugLabel: '소스 슬러그',
    editorSaving: '저장 중…',
    editorSave: '저장',
    editorAutoTranslatePage: '페이지 자동 번역',
    editorRevertAutoTranslate: '자동 번역 되돌리기',
    editorSavedSlug: (locale) => `${locale} 슬러그를 저장했습니다.`,
    editorNothingToSave: '저장할 내용이 없습니다.',
    editorSaveFailed: '저장에 실패했습니다.',
    editorUploadFailed: '업로드에 실패했습니다.',
    editorNoImageNodes: '이 페이지에는 이미지 노드가 없습니다.',
    editorPerLanguageImages: '언어별 이미지',
    editorSaveImageOverrides: '이미지 덮어쓰기 저장',
    editorSavingImageOverrides: '저장 중…',
    editorPreview: (locale) => `미리보기 (${locale})`,
    editorUploadReplacement: '대체 이미지 업로드',
    editorSourceSrc: '소스 src',
    editorOverrideSrc: (locale) => `덮어쓰기 src (${locale})`,
    editorSourceAlt: '소스 alt',
    editorOverrideAlt: (locale) => `덮어쓰기 alt (${locale})`,
    editorSourceImage: '소스 이미지',
    editorNothingToTranslate: '번역할 내용이 없습니다.',
    editorSavedImageOverrides: (locale, count) => `${locale} 이미지 덮어쓰기 ${count}개를 저장했습니다.`,
    editorTarget: (locale) => `타깃 (${locale})`,
    editorSaveTranslation: '번역 저장',
    editorSaveTranslationFailed: '번역 저장에 실패했습니다.',
    editorTranslationFailed: '번역에 실패했습니다.',
    editorSourceTranslation: (locale) => `소스 (${locale})`,
    editorTargetTranslation: (locale) => `타깃 (${locale})`,
    editorTranslationSaved: '번역을 저장했습니다.',
    editorAutoTranslateFilled: (filled, failed) => failed > 0
      ? `${filled}개 필드를 채웠고 ${failed}개는 실패했습니다. 검토 후 저장하세요.`
      : `${filled}개 필드를 채웠습니다. 검토 후 저장하세요.`,
    editorAutoTranslateReverted: (count) => `자동 번역 ${count}개를 되돌렸습니다.`,
    editorTargetPageMissing: '타깃 페이지가 없어서 노드 저장은 건너뜁니다.',
    editorSeoHeading: (targetLocale) => `SEO (${targetLocale})`,
    editorPageTextHeading: (count) => `페이지 텍스트 (${count}개 번역 노드)`,
    editorNoTranslatableNodes: '이 페이지의 초안 캔버스에서 번역 가능한 텍스트 노드를 찾지 못했습니다.',
    progressReviewMissing: '누락 검토',
    progressReviewOutdated: '오래됨 검토',
    progressNoMissing: '누락 없음',
    progressNoOutdated: '오래됨 없음',
    progressComplete: (translated, total) => `${translated}/${total} 완료`,
    progressMissing: (count) => `${count}개 누락`,
    progressOutdated: (count) => `${count}개 오래됨`,
    progressBeforePublish: '게시 전 확인 필요',
    matrixNoEntries: '현재 필터에 맞는 번역 항목이 없습니다.',
    matrixContent: '콘텐츠',
    matrixSource: '소스',
    matrixTarget: '타깃',
    cellSave: '저장',
    cellCancel: '취소',
    cellAiTranslate: 'AI 번역',
    cellOutdatedTranslation: '오래된 번역',
    cellClickToTranslate: '클릭해서 번역',
    categoryTreeLabel: '번역 카테고리',
    publishReady: '모든 번역이 게시 준비되었습니다.',
    publishUpdated: '업데이트됨',
    publishSyncing: '동기화 중...',
    publishBeforePublish: (errors, warnings) => `${errors}개 차단 항목${errors > 0 ? '' : ''}${errors > 0 && warnings > 0 ? ` 및 ${warnings}개 경고` : warnings > 0 ? `, ${warnings}개 경고` : ''} 게시 전`,
    publishMissing: '누락',
    publishOutdated: '오래됨',
    publishBrokenLink: '깨진 링크',
    publishError: '오류',
    publishWarning: '경고',
    publishReviewAction: '검토',
    publishMore: (count) => `+${count}개 더...`,
  },
  'zh-hant': {
    managerTitle: '翻譯管理',
    managerDescription: '管理多語系建構器內容翻譯。',
    managerSourceLocale: '來源語系',
    managerStrings: '字串',
    managerLastSync: '上次同步',
    managerAdminLocale: '管理員語系',
    managerSearchPlaceholder: '搜尋來源·目標·鍵值 · 例：關於我們, nav.about',
    managerAllStatuses: '所有狀態',
    managerMissing: '缺少',
    managerOutdated: '過期',
    managerTranslated: '已翻譯',
    managerManual: '手動',
    managerSyncSources: '同步來源',
    managerResetView: '重設檢視',
    managerShareReview: '分享審查連結',
    managerReviewSummary: '翻譯審查摘要',
    managerVisibleStrings: '可見字串',
    managerNoTranslations: '沒有符合目前篩選條件的翻譯項目。',
    managerAiTranslateMissing: (locale, count) => `AI 翻譯缺漏 - ${locale} (${count})`,
    managerNotice: '內嵌編輯會以手動翻譯儲存。AI 翻譯需要 OPENAI_API_KEY。',
    managerReviewFiltersReset: '已重設審查篩選條件。',
    managerTranslationSaved: '已儲存翻譯。',
    managerSaveFailed: '儲存失敗。',
    managerTranslationUnavailable: '無法取得翻譯。',
    managerSyncFailed: (status) => `同步失敗 (${status})`,
    managerTranslationFailed: '翻譯失敗。',
    managerBatchUnavailable: '批次翻譯無法使用。',
    managerBatchFailed: '批次翻譯失敗。',
    managerNoReturnedTranslations: '沒有返回任何翻譯。',
    managerBatchCandidates: (count) => `批次候選 ${count}`,
    managerAiTranslatedBatch: (saved, total, locale) => `AI 翻譯 ${saved}/${total} 個 ${locale} 字串`,
    managerBatchProgressTitle: '批次翻譯進度',
    managerBatchProgressTranslating: (locale, total) => `${locale} 翻譯請求中，共 ${total} 個`,
    managerBatchProgressSaving: (saved, failed, total, locale) => `${locale} 儲存中 ${saved}/${total} 完成，${failed} 失敗`,
    managerBatchProviderTelemetry: (provider, mode, succeeded, requested, failed) =>
      `提供者 ${provider} · ${mode} · 成功 ${succeeded}/${requested} · 失敗 ${failed}`,
    managerBatchProviderStepTelemetry: (step, cached, sent, succeeded, failed, durationMs, partialCharacters, chunkCount, totalTokens, estimatedCostUsd) =>
      `階段 ${step} · 快取 ${cached} · 請求 ${sent} · 成功 ${succeeded} · 失敗 ${failed}${durationMs === undefined ? '' : ` · 回應 ${durationMs}ms`}${partialCharacters === undefined ? '' : ` · 片段 ${partialCharacters} 字`}${chunkCount === undefined ? '' : ` · 區塊 ${chunkCount}`}${totalTokens === undefined ? '' : ` · 權杖 ${totalTokens}`}${estimatedCostUsd === undefined ? '' : ` · $${estimatedCostUsd.toFixed(6)}`}`,
    managerProviderReadinessTitle: '翻譯提供者檢查',
    managerProviderReadinessDescription: '檢查正式翻譯所需的提供者密鑰與路由選擇狀態。',
    managerProviderReadinessLoading: '正在檢查提供者設定...',
    managerProviderRefresh: '重新檢查',
    managerProviderConfigured: '已設定',
    managerProviderMissingSecret: '缺少密鑰',
    managerProviderSelected: '已選取',
    managerProviderNotSelected: '待命',
    managerProviderSmokeTest: (provider) => `執行 ${provider} 檢查`,
    managerProviderSmokeTesting: (provider) => `${provider} 檢查中...`,
    managerProviderSmokePassed: (provider, durationMs) => `${provider} 檢查通過 · ${durationMs}ms`,
    managerProviderSmokeFailed: (provider) => `${provider} 檢查失敗`,
    managerProviderSmokeUnconfigured: (provider) => `${provider} 尚未設定`,
    managerProviderSmokeSummaryTitle: '檢查報告',
    managerProviderSmokeSummaryTotals: (passed, failed, unconfigured, total) =>
      `最近 ${total} 次 · 通過 ${passed} · 失敗 ${failed} · 未設定 ${unconfigured}`,
    managerProviderSmokeSummaryFreshness: (freshness, ageMinutes) => {
      switch (freshness) {
        case 'missing':
          return '尚無檢查記錄';
        case 'fresh':
          return `最近檢查 ${ageMinutes ?? 0} 分鐘前 · 正常`;
        case 'stale':
          return `最近檢查 ${ageMinutes ?? 0} 分鐘前 · 過期`;
        default:
          return assertProviderSmokeFreshness(freshness);
      }
    },
    managerProviderSmokeReviewStatus: (status) => {
      switch (status) {
        case 'no_history':
          return '檢查狀態：無記錄';
        case 'healthy':
          return '檢查狀態：正常';
        case 'needs_attention':
          return '檢查狀態：需要檢視';
        case 'stale':
          return '檢查狀態：過期';
        default:
          return assertProviderSmokeReviewerStatus(status);
      }
    },
    managerProviderSmokeReviewActions: (actionItems) =>
      actionItems.length > 0 ? `下一步：${actionItems.map(providerSmokeActionZh).join('、')}` : '下一步：無',
    managerProviderSmokeSummaryProvider: (provider, status, durationMs) =>
      `${provider} 最新${status === 'pass' ? '通過' : status === 'unconfigured' ? '未設定' : '失敗'} · ${durationMs}ms`,
    managerProviderSmokeSummaryMissing: (provider) => `${provider} 無記錄`,
    managerProviderSmokeHistoryTitle: '最近檢查',
    managerProviderSmokeHistoryEmpty: '尚無檢查執行記錄。',
    managerProviderSmokeHistoryEntry: (provider, status, sourceLocale, targetLocale, durationMs) =>
      `${provider} · ${status === 'pass' ? '通過' : status === 'unconfigured' ? '未設定' : '失敗'} · ${sourceLocale}→${targetLocale} · ${durationMs}ms`,
    managerProviderReadinessError: '無法載入翻譯提供者檢查狀態。',
    managerProviderCheckStatus: (status) => status === 'pass' ? '通過' : status === 'warn' ? '注意' : '失敗',
    managerNoMissingOrOutdated: (locale) => `目前篩選下沒有缺少或過期的 ${locale} 字串。`,
    managerSourceStringsSynced: '已同步來源字串。',
    dashboardTitle: '翻譯儀表板',
    dashboardDescription: '檢視所有語系的逐頁翻譯狀態。',
    dashboardEntryLink: '入口檢視',
    dashboardSourcePages: '來源頁面',
    dashboardTranslationCells: '翻譯儲存格',
    dashboardPublished: '已發布',
    dashboardDraft: '草稿',
    dashboardNeedsAttention: '需要注意',
    dashboardAllLocaleCombinations: '所有語系組合',
    dashboardUpToDateCells: '最新儲存格',
    dashboardDraftOutdatedUntranslated: '草稿、過期、未翻譯',
    dashboardFilter: '篩選：',
    dashboardAll: '全部',
    dashboardReset: '重設',
    dashboardShare: '分享儀表板',
    dashboardRefresh: '重新整理儀表板',
    dashboardPageCount: (visible, total) => `${visible} / ${total} 頁面`,
    dashboardContent: '內容',
    dashboardSource: '來源',
    dashboardTarget: '目標',
    dashboardReviewMissing: '審查缺少',
    dashboardReviewOutdated: '審查過期',
    dashboardNoMissing: '沒有缺少',
    dashboardNoOutdated: '沒有過期',
    dashboardReviewSummary: '翻譯審查摘要',
    dashboardReviewLink: '審查連結',
    dashboardAllTranslationsReady: '所有翻譯都已準備好發布。',
    dashboardBeforePublish: (errors, warnings) => `發佈前有 ${errors} 個封鎖項目${errors > 0 && warnings > 0 ? ` 與 ${warnings} 個警告` : warnings > 0 ? `，${warnings} 個警告` : ''}`,
    dashboardSyncFailed: (reason) => `同步失敗：${reason}`,
    dashboardUpdated: '已更新',
    dashboardSyncing: '同步中...',
    dashboardMissing: '缺少',
    dashboardOutdated: '過期',
    dashboardPages: '頁面',
    dashboardTranslations: '翻譯',
    dashboardCoverageTitle: '內容覆蓋範圍',
    dashboardCoverageDescription: '一併檢視 CMS、媒體與應用程式字串的翻譯狀態。',
    dashboardCoverageCms: 'CMS',
    dashboardCoverageMedia: '媒體',
    dashboardCoverageApps: '應用程式',
    dashboardCoverageTotal: '字串',
    dashboardCoverageReady: '完成',
    dashboardCoverageLocaleRate: (rate) => `${rate}% 完成`,
    editorTitle: '編輯翻譯',
    editorDescription: '並排編輯每頁翻譯。',
    editorDashboardLink: '返回儀表板',
    editorNoTargetPage: '尚未有目標頁面。',
    editorSourceSlug: '來源代稱',
    editorPerLanguageUrlSlug: '各語系 URL 代稱',
    editorSourceSlugLabel: '來源代稱',
    editorSaving: '儲存中…',
    editorSave: '儲存',
    editorAutoTranslatePage: '自動翻譯頁面',
    editorRevertAutoTranslate: '還原自動翻譯',
    editorSavedSlug: (locale) => `已儲存 ${locale} 代稱。`,
    editorNothingToSave: '沒有可儲存的內容。',
    editorSaveFailed: '儲存失敗。',
    editorUploadFailed: '上傳失敗。',
    editorNoImageNodes: '此頁面沒有圖片節點。',
    editorPerLanguageImages: '各語系圖片',
    editorSaveImageOverrides: '儲存圖片覆寫',
    editorSavingImageOverrides: '儲存中…',
    editorPreview: (locale) => `預覽 (${locale})`,
    editorUploadReplacement: '上傳替換圖片',
    editorSourceSrc: '來源 src',
    editorOverrideSrc: (locale) => `覆寫 src (${locale})`,
    editorSourceAlt: '來源 alt',
    editorOverrideAlt: (locale) => `覆寫 alt (${locale})`,
    editorSourceImage: '來源圖片',
    editorNothingToTranslate: '沒有可翻譯的內容。',
    editorSavedImageOverrides: (locale, count) => `已儲存 ${locale} ${count} 個圖片覆寫。`,
    editorTarget: (locale) => `目標 (${locale})`,
    editorSaveTranslation: '儲存翻譯',
    editorSaveTranslationFailed: '儲存翻譯失敗。',
    editorTranslationFailed: '翻譯失敗。',
    editorSourceTranslation: (locale) => `來源 (${locale})`,
    editorTargetTranslation: (locale) => `目標 (${locale})`,
    editorTranslationSaved: '已儲存翻譯。',
    editorAutoTranslateFilled: (filled, failed) => failed > 0
      ? `已填入 ${filled} 個欄位，${failed} 個失敗。請審查後儲存。`
      : `已填入 ${filled} 個欄位。請審查後儲存。`,
    editorAutoTranslateReverted: (count) => `已還原 ${count} 個自動翻譯。`,
    editorTargetPageMissing: '目標頁面不存在，將跳過節點儲存。',
    editorSeoHeading: (targetLocale) => `SEO (${targetLocale})`,
    editorPageTextHeading: (count) => `頁面文字（${count} 個可翻譯節點）`,
    editorNoTranslatableNodes: '此頁面草稿畫布中沒有可翻譯的文字節點。',
    progressReviewMissing: '審查缺少',
    progressReviewOutdated: '審查過期',
    progressNoMissing: '沒有缺少',
    progressNoOutdated: '沒有過期',
    progressComplete: (translated, total) => `${translated}/${total} 完成`,
    progressMissing: (count) => `${count} 個缺少`,
    progressOutdated: (count) => `${count} 個過期`,
    progressBeforePublish: '發佈前需要確認',
    matrixNoEntries: '沒有符合目前篩選條件的翻譯項目。',
    matrixContent: '內容',
    matrixSource: '來源',
    matrixTarget: '目標',
    cellSave: '儲存',
    cellCancel: '取消',
    cellAiTranslate: 'AI 翻譯',
    cellOutdatedTranslation: '過期翻譯',
    cellClickToTranslate: '點擊以翻譯',
    categoryTreeLabel: '翻譯分類',
    publishReady: '所有翻譯都已準備好發布。',
    publishUpdated: '已更新',
    publishSyncing: '同步中...',
    publishBeforePublish: (errors, warnings) => `發佈前有 ${errors} 個封鎖項目${warnings > 0 ? `，${warnings} 個警告` : ''}`,
    publishMissing: '缺少',
    publishOutdated: '過期',
    publishBrokenLink: '連結失效',
    publishError: '錯誤',
    publishWarning: '警告',
    publishReviewAction: '審查',
    publishMore: (count) => `還有 ${count} 個...`,
  },
  en: {
    managerTitle: 'Translation Manager',
    managerDescription: 'Manage multilingual builder content translations.',
    managerSourceLocale: 'Source locale',
    managerStrings: 'strings',
    managerLastSync: 'Last sync',
    managerAdminLocale: 'Admin locale',
    managerSearchPlaceholder: 'Search source · target · key · e.g. about, nav.about',
    managerAllStatuses: 'All statuses',
    managerMissing: 'Missing',
    managerOutdated: 'Outdated',
    managerTranslated: 'Translated',
    managerManual: 'Manual',
    managerSyncSources: 'Sync sources',
    managerResetView: 'Reset view',
    managerShareReview: 'Share review link',
    managerReviewSummary: 'Translation review summary',
    managerVisibleStrings: 'visible strings',
    managerNoTranslations: 'No translation entries match the current filters.',
    managerAiTranslateMissing: (locale, count) => `AI translate missing - ${locale} (${count})`,
    managerNotice: 'Inline edits save as manual translations. AI translation requires OPENAI_API_KEY.',
    managerReviewFiltersReset: 'Review filters reset.',
    managerTranslationSaved: 'Translation saved.',
    managerSaveFailed: 'Save failed.',
    managerTranslationUnavailable: 'Translation unavailable.',
    managerSyncFailed: (status) => `sync failed (${status})`,
    managerTranslationFailed: 'Translation failed.',
    managerBatchUnavailable: 'Batch translation unavailable.',
    managerBatchFailed: 'Batch translation failed.',
    managerNoReturnedTranslations: 'No translations were returned.',
    managerBatchCandidates: (count) => `batch ${count}`,
    managerAiTranslatedBatch: (saved, total, locale) => `AI translated ${saved}/${total} ${locale} strings`,
    managerBatchProgressTitle: 'Batch translation progress',
    managerBatchProgressTranslating: (locale, total) => `Requesting ${total} ${locale} translation${total === 1 ? '' : 's'}`,
    managerBatchProgressSaving: (saved, failed, total, locale) => `Saving ${locale} translations: ${saved}/${total} done, ${failed} failed`,
    managerBatchProviderTelemetry: (provider, mode, succeeded, requested, failed) =>
      `Provider ${provider} · ${mode} · success ${succeeded}/${requested} · failed ${failed}`,
    managerBatchProviderStepTelemetry: (step, cached, sent, succeeded, failed, durationMs, partialCharacters, chunkCount, totalTokens, estimatedCostUsd) =>
      `Step ${step} · cache ${cached} · sent ${sent} · success ${succeeded} · failed ${failed}${durationMs === undefined ? '' : ` · response ${durationMs}ms`}${partialCharacters === undefined ? '' : ` · partial ${partialCharacters} chars`}${chunkCount === undefined ? '' : ` · chunks ${chunkCount}`}${totalTokens === undefined ? '' : ` · tokens ${totalTokens}`}${estimatedCostUsd === undefined ? '' : ` · $${estimatedCostUsd.toFixed(6)}`}`,
    managerProviderReadinessTitle: 'Translation provider check',
    managerProviderReadinessDescription: 'Check provider secrets and router selection before running production translation.',
    managerProviderReadinessLoading: 'Checking provider settings...',
    managerProviderRefresh: 'Refresh check',
    managerProviderConfigured: 'Configured',
    managerProviderMissingSecret: 'Missing secret',
    managerProviderSelected: 'Selected',
    managerProviderNotSelected: 'Standby',
    managerProviderSmokeTest: (provider) => `Run ${provider} check`,
    managerProviderSmokeTesting: (provider) => `Checking ${provider}...`,
    managerProviderSmokePassed: (provider, durationMs) => `${provider} check passed · ${durationMs}ms`,
    managerProviderSmokeFailed: (provider) => `${provider} check failed`,
    managerProviderSmokeUnconfigured: (provider) => `${provider} is not configured`,
    managerProviderSmokeSummaryTitle: 'Check report',
    managerProviderSmokeSummaryTotals: (passed, failed, unconfigured, total) =>
      `Recent ${total} check${total === 1 ? '' : 's'} · pass ${passed} · failed ${failed} · not configured ${unconfigured}`,
    managerProviderSmokeSummaryFreshness: (freshness, ageMinutes) => {
      switch (freshness) {
        case 'missing':
          return 'No check records';
        case 'fresh':
          return `Last check ${ageMinutes ?? 0}m ago · current`;
        case 'stale':
          return `Last check ${ageMinutes ?? 0}m ago · stale`;
        default:
          return assertProviderSmokeFreshness(freshness);
      }
    },
    managerProviderSmokeReviewStatus: (status) => {
      switch (status) {
        case 'no_history':
          return 'Review status: no records';
        case 'healthy':
          return 'Review status: healthy';
        case 'needs_attention':
          return 'Review status: needs attention';
        case 'stale':
          return 'Review status: stale';
        default:
          return assertProviderSmokeReviewerStatus(status);
      }
    },
    managerProviderSmokeReviewActions: (actionItems) =>
      actionItems.length > 0 ? `Next action: ${actionItems.map(providerSmokeActionEn).join(', ')}` : 'Next action: none',
    managerProviderSmokeSummaryProvider: (provider, status, durationMs) =>
      `${provider} latest ${status === 'pass' ? 'pass' : status === 'unconfigured' ? 'not configured' : 'failed'} · ${durationMs}ms`,
    managerProviderSmokeSummaryMissing: (provider) => `${provider} no record`,
    managerProviderSmokeHistoryTitle: 'Recent checks',
    managerProviderSmokeHistoryEmpty: 'No provider checks have been run yet.',
    managerProviderSmokeHistoryEntry: (provider, status, sourceLocale, targetLocale, durationMs) =>
      `${provider} · ${status === 'pass' ? 'pass' : status === 'unconfigured' ? 'not configured' : 'failed'} · ${sourceLocale}→${targetLocale} · ${durationMs}ms`,
    managerProviderReadinessError: 'Unable to load translation provider check status.',
    managerProviderCheckStatus: (status) => status === 'pass' ? 'pass' : status === 'warn' ? 'warning' : 'fail',
    managerNoMissingOrOutdated: (locale) => `No missing or outdated ${locale} strings in this filter.`,
    managerSourceStringsSynced: 'Source strings synced.',
    dashboardTitle: 'Translation Dashboard',
    dashboardDescription: 'Per-page translation status across all locales.',
    dashboardEntryLink: 'Entry-level view',
    dashboardSourcePages: 'Source pages',
    dashboardTranslationCells: 'Translation cells',
    dashboardPublished: 'Published',
    dashboardDraft: 'Draft',
    dashboardNeedsAttention: 'Needs attention',
    dashboardAllLocaleCombinations: 'All locale combinations',
    dashboardUpToDateCells: 'Up to date cells',
    dashboardDraftOutdatedUntranslated: 'Draft, outdated, untranslated',
    dashboardFilter: 'Filter:',
    dashboardAll: 'All',
    dashboardReset: 'Reset',
    dashboardShare: 'Share dashboard',
    dashboardRefresh: 'Refresh dashboard',
    dashboardPageCount: (visible, total) => `${visible} / ${total} pages`,
    dashboardContent: 'Content',
    dashboardSource: 'Source',
    dashboardTarget: 'Target',
    dashboardReviewMissing: 'Review missing',
    dashboardReviewOutdated: 'Review outdated',
    dashboardNoMissing: 'No missing',
    dashboardNoOutdated: 'No outdated',
    dashboardReviewSummary: 'Translation review summary',
    dashboardReviewLink: 'Review link',
    dashboardAllTranslationsReady: 'All translations look ready to publish.',
    dashboardBeforePublish: (errors, warnings) => `${errors} blocker${errors > 1 ? 's' : ''}${errors > 0 && warnings > 0 ? ` and ${warnings} warning${warnings > 1 ? 's' : ''}` : warnings > 0 ? ` and ${warnings} warning${warnings > 1 ? 's' : ''}` : ''} before publish`,
    dashboardSyncFailed: (reason) => `sync failed: ${reason}`,
    dashboardUpdated: 'Updated',
    dashboardSyncing: 'syncing...',
    dashboardMissing: 'missing',
    dashboardOutdated: 'outdated',
    dashboardPages: 'pages',
    dashboardTranslations: 'translations',
    dashboardCoverageTitle: 'Content coverage',
    dashboardCoverageDescription: 'Track CMS, media, and app string translation health alongside page status.',
    dashboardCoverageCms: 'CMS',
    dashboardCoverageMedia: 'Media',
    dashboardCoverageApps: 'Apps',
    dashboardCoverageTotal: 'strings',
    dashboardCoverageReady: 'ready',
    dashboardCoverageLocaleRate: (rate) => `${rate}% ready`,
    editorTitle: 'Edit Translation',
    editorDescription: 'Side-by-side per-page translation editor.',
    editorDashboardLink: 'Dashboard',
    editorNoTargetPage: 'Target page does not exist yet.',
    editorSourceSlug: 'Source slug',
    editorPerLanguageUrlSlug: 'Per-language URL slug',
    editorSourceSlugLabel: 'Source slug',
    editorSaving: 'Saving…',
    editorSave: 'Save',
    editorAutoTranslatePage: 'Auto-translate page',
    editorRevertAutoTranslate: 'Revert auto-translate',
    editorSavedSlug: (locale) => `Saved ${locale} slug.`,
    editorNothingToSave: 'Nothing to save.',
    editorSaveFailed: 'Save failed.',
    editorUploadFailed: 'Upload failed.',
    editorNoImageNodes: 'No image nodes on this page.',
    editorPerLanguageImages: 'Per-language images',
    editorSaveImageOverrides: 'Save image overrides',
    editorSavingImageOverrides: 'Saving…',
    editorPreview: (locale) => `Preview (${locale})`,
    editorUploadReplacement: 'Upload replacement',
    editorSourceSrc: 'Source src',
    editorOverrideSrc: (locale) => `Override src (${locale})`,
    editorSourceAlt: 'Source alt',
    editorOverrideAlt: (locale) => `Override alt (${locale})`,
    editorSourceImage: 'Source image',
    editorNothingToTranslate: 'Nothing to translate.',
    editorSavedImageOverrides: (locale, count) => `Saved ${count} image override${count === 1 ? '' : 's'} for ${locale}.`,
    editorTarget: (locale) => `Target (${locale})`,
    editorSaveTranslation: 'Save translation',
    editorSaveTranslationFailed: 'Save translation failed.',
    editorTranslationFailed: 'Translation failed.',
    editorSourceTranslation: (locale) => `Source (${locale})`,
    editorTargetTranslation: (locale) => `Target (${locale})`,
    editorTranslationSaved: 'Translation saved.',
    editorAutoTranslateFilled: (filled, failed) => failed > 0
      ? `Filled ${filled} fields (${failed} failed — review).`
      : `Filled ${filled} fields. Review and save.`,
    editorAutoTranslateReverted: (count) => `Reverted ${count} auto-translated fields.`,
    editorTargetPageMissing: 'Target page does not exist — node saves will be skipped until a target page exists.',
    editorSeoHeading: (targetLocale) => `SEO (${targetLocale})`,
    editorPageTextHeading: (count) => `Page text (${count} translatable nodes)`,
    editorNoTranslatableNodes: 'No translatable text nodes were found in this page\'s draft canvas.',
    progressReviewMissing: 'Review missing',
    progressReviewOutdated: 'Review outdated',
    progressNoMissing: 'No missing',
    progressNoOutdated: 'No outdated',
    progressComplete: (translated, total) => `${translated}/${total} complete`,
    progressMissing: (count) => `${count} missing`,
    progressOutdated: (count) => `${count} outdated`,
    progressBeforePublish: 'before publish',
    matrixNoEntries: 'No translation entries match the current filters.',
    matrixContent: 'Content',
    matrixSource: 'Source',
    matrixTarget: 'Target',
    cellSave: 'Save',
    cellCancel: 'Cancel',
    cellAiTranslate: 'AI translate',
    cellOutdatedTranslation: 'Outdated translation',
    cellClickToTranslate: 'Click to translate',
    categoryTreeLabel: 'Translation categories',
    publishReady: 'All translations look ready to publish.',
    publishUpdated: 'Updated',
    publishSyncing: 'syncing...',
    publishBeforePublish: (errors, warnings) => `${errors} blocker${errors > 1 ? 's' : ''}${errors > 0 && warnings > 0 ? ` and ${warnings} warning${warnings > 1 ? 's' : ''}` : warnings > 0 ? ` and ${warnings} warning${warnings > 1 ? 's' : ''}` : ''} before publish`,
    publishMissing: 'Missing',
    publishOutdated: 'Outdated',
    publishBrokenLink: 'Broken link',
    publishError: 'error',
    publishWarning: 'warning',
    publishReviewAction: 'Review',
    publishMore: (count) => `+${count} more...`,
  },
};

export function getTranslationCopy(locale: Locale): TranslationCopy {
  return COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? COPY.ko;
}
