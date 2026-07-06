import type { Locale } from '@/lib/locales';

export type PreflightTone = 'ok' | 'warning' | 'blocker';
type PreflightCategory = 'images' | 'links' | 'data' | 'seo' | 'translations' | 'forms' | 'dev';

export interface PublishModalCopy {
  title: string;
  subtitle: (revision: number) => string;
  checking: string;
  preflightTitle: string;
  diffTitle: string;
  diffStatus: {
    loading: string;
    missing: string;
    error: string;
    idle: string;
  };
  diffAdded: string;
  diffRemoved: string;
  diffModified: string;
  diffNoChanges: string;
  diffFallback: string;
  blockersTitle: (count: number) => string;
  warningsTitle: (count: number) => string;
  infosTitle: (count: number) => string;
  warningOverrideReviewTitle: string;
  warningOverridePending: (count: number) => string;
  warningOverrideAcknowledged: (count: number) => string;
  warningOverrideCategoryLabel: (label: string, count: number) => string;
  translationSiteReviewTitle: string;
  translationSiteReviewSummary: (totalCount: number, otherPageCount: number) => string;
  translationSiteReviewCurrentPage: (currentPageCount: number) => string;
  translationSiteReviewBreakdown: (warningCount: number, errorCount: number) => string;
  translationSiteReviewPending: (otherPageCount: number) => string;
  translationSiteReviewAcknowledged: (otherPageCount: number) => string;
  translationSiteReviewAction: string;
  translationSiteReviewAcknowledgeAction: string;
  readyTitle: string;
  scheduleTitle: string;
  scheduleInputAria: string;
  schedulePending: string;
  scheduleCancelPending: string;
  scheduleActionSchedule: string;
  scheduleActionCancel: string;
  scheduleHelp: string;
  scheduleDraftRevisionLabel: string;
  successMessage: string;
  successLink: (slug: string) => string;
  closeButton: string;
  cancelButton: string;
  overrideWarningsButton: string;
  publishButton: string;
  publishingButton: string;
  publishErrorDefault: string;
  scheduleInvalidMessage: string;
  publishDisabledMessage: string;
  publishedRevisionLabel: (revision: number | null | undefined, savedAt?: string) => string;
  scheduledJobStatus: (status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled') => string;
  seoServerCheckUnavailableMessage: string;
  seoServerCheckUnavailableHint: string;
  publishBlockedMessage: string;
  publishStaleMessage: (currentRevision?: number) => string;
  publishSandboxSaveError: string;
  publishNetworkError: string;
  draftMissingPageMessage: string;
  draftConflictMessage: string;
  draftSaveError: string;
  publishedBaselineError: string;
  publishedBaselineMissing: string;
  lastPublishedRevisionError: string;
  publishedRevisionEmpty: string;
  publishDiffNetworkError: string;
  scheduleSaveError: string;
  scheduleSaveNetworkError: string;
  scheduleCancelError: string;
  scheduleCancelNetworkError: string;
  toastPublishSuccess: string;
  toastPublishScheduleSuccess: string;
  toastPublishScheduleCancelled: string;
  toastPublishNetworkError: string;
  toastPublishScheduleNetworkError: string;
  preflight: Record<PreflightCategory, { label: string; detail: string }>;
  itemStatus: (tone: PreflightTone, blockerCount: number, warningCount: number) => string;
  fixButtonLabel: string;
  issueActionLabel: string;
  changedNodesLabel: string;
}

function resolvedLocale(locale: Locale): string {
  return locale === 'zh-hant' ? 'zh-Hant' : locale;
}

export function formatScheduledAt(value: string, locale: Locale): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(resolvedLocale(locale), {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

export function getPublishModalCopy(locale: Locale): PublishModalCopy {
  if (locale === 'zh-hant') {
    return {
      title: '頁面發佈',
      subtitle: (revision) => `將依草稿版本 ${revision} 發佈`,
      checking: '正在檢查是否可發佈...',
      preflightTitle: '自動預檢',
      diffTitle: '草稿對已發佈版本',
      diffStatus: {
        loading: '計算中',
        missing: '首次發佈',
        error: '需要檢查',
        idle: '等待中',
      },
      diffAdded: '+ 新增',
      diffRemoved: '- 刪除',
      diffModified: '~ 變更',
      diffNoChanges: '最後一個已發佈版本與目前草稿相同。',
      diffFallback: '當可取得已發佈基準時，這裡會顯示發佈前差異摘要。',
      blockersTitle: (count) => `阻擋問題 (${count}) — 無法發佈`,
      warningsTitle: (count) => `警告 (${count})`,
      infosTitle: (count) => `提示 (${count})`,
      warningOverrideReviewTitle: '警告覆核',
      warningOverridePending: (count) => `請先檢視 ${count} 個警告。確認後可繼續發佈或排程。`,
      warningOverrideAcknowledged: (count) => `已確認 ${count} 個警告；發佈或排程時會以警告覆核狀態繼續。`,
      warningOverrideCategoryLabel: (label, count) => `${label}: ${count} 個警告`,
      translationSiteReviewTitle: '網站翻譯覆核',
      translationSiteReviewSummary: (totalCount, otherPageCount) =>
        `全站共有 ${totalCount} 個翻譯警告，其中 ${otherPageCount} 個在其他頁面。`,
      translationSiteReviewCurrentPage: (currentPageCount) => `目前頁面：${currentPageCount} 個`,
      translationSiteReviewBreakdown: (warningCount, errorCount) =>
        `警告 ${warningCount} 個 / 錯誤 ${errorCount} 個`,
      translationSiteReviewPending: (otherPageCount) =>
        `請先確認其他頁面的 ${otherPageCount} 個翻譯警告，才能繼續發佈或排程。`,
      translationSiteReviewAcknowledged: (otherPageCount) =>
        `已確認其他頁面的 ${otherPageCount} 個翻譯警告。`,
      translationSiteReviewAction: '檢視全部翻譯',
      translationSiteReviewAcknowledgeAction: '確認其他頁面警告',
      readyTitle: '全部檢查通過 — 可發佈',
      scheduleTitle: '排程發佈',
      scheduleInputAria: '排程發佈時間',
      schedulePending: '排程中...',
      scheduleCancelPending: '取消中...',
      scheduleActionSchedule: '排程',
      scheduleActionCancel: '取消排程',
      scheduleHelp: '排程後會固定草稿版本，時間到後排程執行器會自動發佈。',
      scheduleDraftRevisionLabel: '草稿 v',
      successMessage: '發佈完成！',
      successLink: (slug) => `在 ${slug} 檢視`,
      closeButton: '關閉',
      cancelButton: '取消',
      overrideWarningsButton: '忽略警告並發佈',
      publishButton: '發佈',
      publishingButton: '發佈中...',
      publishErrorDefault: '發佈失敗，請再試一次。',
      scheduleInvalidMessage: '請選擇晚於現在的時間。',
      publishDisabledMessage: '發佈中...',
      publishedRevisionLabel: (revision, savedAt) =>
        `已發佈版本 v${revision ?? '?'}${savedAt ? ` · ${savedAt}` : ''}`,
      scheduledJobStatus: (status) => {
        if (status === 'scheduled') return '已排程';
        if (status === 'publishing') return '發佈中';
        if (status === 'published') return '已發佈';
        if (status === 'failed') return '失敗';
        return '已取消';
      },
      seoServerCheckUnavailableMessage: '無法完成 SEO 標題／描述伺服器檢查。',
      seoServerCheckUnavailableHint: '請在 SEO 面板確認標題、描述、canonical 與 OG 圖片。',
      publishBlockedMessage: '請先修正阻擋問題後再試一次。',
      publishStaleMessage: (currentRevision) =>
        `草稿已在其他分頁變更。請重新整理後再發佈。${typeof currentRevision === 'number' ? ` 目前版本：${currentRevision}。` : ''}`,
      publishSandboxSaveError: '發佈前儲存草稿失敗。',
      publishNetworkError: '發佈時發生網路錯誤。',
      draftMissingPageMessage: '沒有可發佈的頁面。',
      draftConflictMessage: '草稿已在其他分頁變更。請重新整理後再發佈。',
      draftSaveError: '發佈前儲存草稿失敗。',
      publishedBaselineError: '無法載入已發佈基準資訊。',
      publishedBaselineMissing: '尚未有已發佈基準。這次發佈會建立第一個快照。',
      lastPublishedRevisionError: '無法載入最後一個已發佈版本。',
      publishedRevisionEmpty: '已發佈版本文件是空的。',
      publishDiffNetworkError: '計算已發佈差異時發生網路錯誤。',
      scheduleSaveError: '儲存排程發佈失敗。',
      scheduleSaveNetworkError: '儲存排程發佈時發生網路錯誤。',
      scheduleCancelError: '取消排程發佈失敗。',
      scheduleCancelNetworkError: '取消排程發佈時發生網路錯誤。',
      toastPublishSuccess: '已發佈',
      toastPublishScheduleSuccess: '已儲存排程發佈',
      toastPublishScheduleCancelled: '已取消排程發佈',
      toastPublishNetworkError: '發佈時發生網路錯誤。',
      toastPublishScheduleNetworkError: '儲存排程發佈時發生網路錯誤。',
      preflight: {
        images: { label: '圖片', detail: '空白 alt 圖片／空白圖片來源' },
        links: { label: '連結', detail: '空白連結／錯誤 URL／不存在的內部路徑' },
        data: { label: 'CMS 資料', detail: '缺少或不相容的 CMS 欄位綁定' },
        seo: { label: 'SEO', detail: '標題／描述缺漏與建議長度' },
        translations: { label: '翻譯', detail: '缺少／過期翻譯與語言路由' },
        forms: { label: '表單', detail: '表單動作／電子郵件／Webhook 目標' },
        dev: { label: '開發', detail: '程式碼槽與已儲存函式綁定' },
      },
      itemStatus: (tone, blockerCount, warningCount) => {
        if (tone === 'blocker') return `${blockerCount} 個封鎖`;
        if (tone === 'warning') return `${warningCount} 個警告`;
        return '通過';
      },
      fixButtonLabel: '修正問題',
      issueActionLabel: '檢視',
      changedNodesLabel: '草稿 vs 已發佈變更節點',
    };
  }

  if (locale === 'en') {
    return {
      title: 'Publish Page',
      subtitle: (revision) => `Publishing from revision ${revision}`,
      checking: 'Checking publish readiness...',
      preflightTitle: 'Automatic preflight checklist',
      diffTitle: 'Draft vs published',
      diffStatus: {
        loading: 'Calculating',
        missing: 'First publish',
        error: 'Needs review',
        idle: 'Waiting',
      },
      diffAdded: '+ added',
      diffRemoved: '- removed',
      diffModified: '~ changed',
      diffNoChanges: 'The latest published revision matches the current draft.',
      diffFallback: 'The publish-time diff summary will appear when a published baseline is available.',
      blockersTitle: (count) => `Blocking issues (${count}) — publish disabled`,
      warningsTitle: (count) => `Warnings (${count})`,
      infosTitle: (count) => `Info (${count})`,
      warningOverrideReviewTitle: 'Warning review',
      warningOverridePending: (count) => `Review ${count} warning${count === 1 ? '' : 's'}, then acknowledge to continue publishing or scheduling.`,
      warningOverrideAcknowledged: (count) => `${count} warning${count === 1 ? '' : 's'} acknowledged; publish and schedule actions will continue with this review state.`,
      warningOverrideCategoryLabel: (label, count) => `${label}: ${count} warning${count === 1 ? '' : 's'}`,
      translationSiteReviewTitle: 'Site translation review',
      translationSiteReviewSummary: (totalCount, otherPageCount) =>
        `${totalCount} site-wide translation warning${totalCount === 1 ? '' : 's'} found; ${otherPageCount} ${otherPageCount === 1 ? 'is' : 'are'} on other pages.`,
      translationSiteReviewCurrentPage: (currentPageCount) =>
        `Current page: ${currentPageCount}`,
      translationSiteReviewBreakdown: (warningCount, errorCount) =>
        `${warningCount} warning${warningCount === 1 ? '' : 's'} / ${errorCount} error${errorCount === 1 ? '' : 's'}`,
      translationSiteReviewPending: (otherPageCount) =>
        `Acknowledge ${otherPageCount} translation warning${otherPageCount === 1 ? '' : 's'} on other pages to continue publishing or scheduling.`,
      translationSiteReviewAcknowledged: (otherPageCount) =>
        `${otherPageCount} translation warning${otherPageCount === 1 ? '' : 's'} on other pages acknowledged.`,
      translationSiteReviewAction: 'Review all translations',
      translationSiteReviewAcknowledgeAction: 'Acknowledge other-page warnings',
      readyTitle: 'All checks passed — publish ready',
      scheduleTitle: 'Scheduled publish',
      scheduleInputAria: 'Scheduled publish time',
      schedulePending: 'Scheduling...',
      scheduleCancelPending: 'Cancelling...',
    scheduleActionSchedule: 'Schedule',
    scheduleActionCancel: 'Cancel schedule',
    scheduleHelp: 'Scheduling freezes the draft revision and the cron runner publishes once the time arrives.',
    scheduleDraftRevisionLabel: 'draft v',
    successMessage: 'Published successfully!',
      successLink: (slug) => `View on ${slug}`,
      closeButton: 'Close',
      cancelButton: 'Cancel',
      overrideWarningsButton: 'Publish anyway',
      publishButton: 'Publish',
      publishingButton: 'Publishing...',
      publishErrorDefault: 'Publish failed. Please try again.',
      scheduleInvalidMessage: 'Please pick a time later than now.',
      publishDisabledMessage: 'Publishing...',
      publishedRevisionLabel: (revision, savedAt) =>
        `published v${revision ?? '?'}${savedAt ? ` · ${savedAt}` : ''}`,
      scheduledJobStatus: (status) => {
        if (status === 'scheduled') return 'Scheduled';
        if (status === 'publishing') return 'Publishing';
        if (status === 'published') return 'Published';
        if (status === 'failed') return 'Failed';
        return 'Cancelled';
      },
      seoServerCheckUnavailableMessage: 'Could not complete the SEO title/description server check.',
      seoServerCheckUnavailableHint: 'Check title, description, canonical, and OG image in the SEO panel.',
      publishBlockedMessage: 'Fix the blocking issues and try again.',
      publishStaleMessage: (currentRevision) =>
        `Draft changed in another tab. Reload and publish again.${typeof currentRevision === 'number' ? ` Current revision: ${currentRevision}.` : ''}`,
      publishSandboxSaveError: 'Failed to save draft before publish.',
      publishNetworkError: 'A network error occurred while publishing.',
      draftMissingPageMessage: 'There is no page to publish.',
      draftConflictMessage: 'Draft changed in another tab. Reload and publish again.',
      draftSaveError: 'Failed to save draft before publish.',
      publishedBaselineError: 'Could not load published baseline information.',
      publishedBaselineMissing: 'There is no published baseline yet. This publish will create the first snapshot.',
      lastPublishedRevisionError: 'Could not load the last published revision.',
      publishedRevisionEmpty: 'The published revision document is empty.',
      publishDiffNetworkError: 'A network error occurred while calculating the published diff.',
      scheduleSaveError: 'Failed to save the scheduled publish.',
      scheduleSaveNetworkError: 'A network error occurred while saving the scheduled publish.',
      scheduleCancelError: 'Failed to cancel the scheduled publish.',
      scheduleCancelNetworkError: 'A network error occurred while cancelling the scheduled publish.',
      toastPublishSuccess: 'Published',
      toastPublishScheduleSuccess: 'Scheduled publish saved',
      toastPublishScheduleCancelled: 'Scheduled publish cancelled',
      toastPublishNetworkError: 'A network error occurred while publishing.',
      toastPublishScheduleNetworkError: 'A network error occurred while saving the scheduled publish.',
      preflight: {
        images: { label: 'Images', detail: 'empty-alt images / empty image sources' },
        links: { label: 'Links', detail: 'empty links / invalid URLs / missing internal routes' },
        data: { label: 'CMS data', detail: 'missing or incompatible CMS field bindings' },
        seo: { label: 'SEO', detail: 'missing title/description and recommended lengths' },
        translations: { label: 'Translations', detail: 'missing or stale translations and language routes' },
        forms: { label: 'Forms', detail: 'form action / email / webhook targets' },
        dev: { label: 'Developer', detail: 'code slots and saved function bindings' },
      },
      itemStatus: (tone, blockerCount, warningCount) => {
        if (tone === 'blocker') return `${blockerCount} blocker`;
        if (tone === 'warning') return `${warningCount} warning`;
        return 'Passed';
      },
      fixButtonLabel: 'Fix this issue',
      issueActionLabel: 'Review',
      changedNodesLabel: 'Draft vs published changed nodes',
    };
  }

  return {
    title: '페이지 발행',
    subtitle: (revision) => `초안 ${revision} 기준 발행 예정`,
    checking: '발행 가능 여부 확인 중...',
    preflightTitle: '자동 사전 검사',
    diffTitle: '초안 대 발행본',
    diffStatus: {
      loading: '계산 중',
      missing: '첫 발행',
      error: '확인 필요',
      idle: '대기',
    },
    diffAdded: '+ 추가됨',
    diffRemoved: '- 삭제됨',
    diffModified: '~ 변경됨',
    diffNoChanges: '마지막 발행 버전과 현재 초안이 동일합니다.',
    diffFallback: '발행 기준이 준비되면 발행 전 변경 요약이 표시됩니다.',
    blockersTitle: (count) => `차단 문제 (${count}) — 발행 불가`,
    warningsTitle: (count) => `경고 (${count})`,
    infosTitle: (count) => `안내 (${count})`,
    warningOverrideReviewTitle: '경고 검토',
    warningOverridePending: (count) => `경고 ${count}개를 검토한 뒤 계속 발행하거나 예약할 수 있습니다.`,
    warningOverrideAcknowledged: (count) => `경고 ${count}개를 확인했습니다. 발행/예약 발행은 이 검토 상태로 진행됩니다.`,
    warningOverrideCategoryLabel: (label, count) => `${label}: ${count}개 경고`,
    translationSiteReviewTitle: '사이트 번역 검토',
    translationSiteReviewSummary: (totalCount, otherPageCount) =>
      `사이트 전체 번역 경고 ${totalCount}개 중 다른 페이지 경고 ${otherPageCount}개가 있습니다.`,
    translationSiteReviewCurrentPage: (currentPageCount) => `현재 페이지: ${currentPageCount}개`,
    translationSiteReviewBreakdown: (warningCount, errorCount) =>
      `경고 ${warningCount}개 / 오류 ${errorCount}개`,
    translationSiteReviewPending: (otherPageCount) =>
      `다른 페이지 번역 경고 ${otherPageCount}개를 확인해야 발행 또는 예약을 계속할 수 있습니다.`,
    translationSiteReviewAcknowledged: (otherPageCount) =>
      `다른 페이지 번역 경고 ${otherPageCount}개를 확인했습니다.`,
    translationSiteReviewAction: '전체 번역 검토',
    translationSiteReviewAcknowledgeAction: '다른 페이지 경고 확인',
    readyTitle: '모든 검사 통과 — 발행 가능',
    scheduleTitle: '예약 발행',
    scheduleInputAria: '예약 발행 시각',
    schedulePending: '예약 중...',
    scheduleCancelPending: '취소 중...',
    scheduleActionSchedule: '예약',
    scheduleActionCancel: '예약 취소',
    scheduleHelp: '예약 시점의 draft revision이 고정되고, cron runner가 시간이 지나면 자동 발행합니다.',
    scheduleDraftRevisionLabel: '초안 v',
    successMessage: '발행 완료!',
    successLink: (slug) => `${slug} 에서 보기`,
    closeButton: '닫기',
    cancelButton: '취소',
    overrideWarningsButton: '경고 무시하고 발행',
    publishButton: '발행',
    publishingButton: '발행 중...',
    publishErrorDefault: '발행 실패. 다시 시도해 주세요.',
    scheduleInvalidMessage: '현재 이후 시간으로 예약해 주세요.',
    publishDisabledMessage: '발행 중...',
    publishedRevisionLabel: (revision, savedAt) =>
      `발행본 v${revision ?? '?'}${savedAt ? ` · ${savedAt}` : ''}`,
    scheduledJobStatus: (status) => {
      if (status === 'scheduled') return '예약됨';
      if (status === 'publishing') return '발행 중';
      if (status === 'published') return '발행 완료';
      if (status === 'failed') return '실패';
      return '취소됨';
    },
    seoServerCheckUnavailableMessage: 'SEO 제목/설명 서버 검사를 완료하지 못했습니다.',
    seoServerCheckUnavailableHint: 'SEO 패널에서 제목, 설명, canonical, OG 이미지를 확인하세요.',
    publishBlockedMessage: '차단 문제를 수정한 뒤 다시 시도하세요.',
    publishStaleMessage: (currentRevision) =>
      `초안이 다른 탭에서 변경되었습니다. 새로고침 후 다시 발행하세요.${typeof currentRevision === 'number' ? ` 현재 버전: ${currentRevision}.` : ''}`,
    publishSandboxSaveError: '발행 전 초안 저장에 실패했습니다.',
    publishNetworkError: '발행 중 네트워크 오류가 발생했습니다.',
    draftMissingPageMessage: '발행할 페이지가 없습니다.',
    draftConflictMessage: '초안이 다른 탭에서 변경되었습니다. 새로고침 후 다시 발행하세요.',
    draftSaveError: '발행 전 초안 저장에 실패했습니다.',
    publishedBaselineError: '발행 기준 정보를 불러오지 못했습니다.',
    publishedBaselineMissing: '아직 발행 기준이 없습니다. 이번 발행이 첫 스냅샷이 됩니다.',
    lastPublishedRevisionError: '마지막 발행 버전을 불러오지 못했습니다.',
    publishedRevisionEmpty: '발행 버전 문서가 비어 있습니다.',
    publishDiffNetworkError: '발행 차이 계산 중 네트워크 오류가 발생했습니다.',
    scheduleSaveError: '예약 발행 저장에 실패했습니다.',
    scheduleSaveNetworkError: '예약 발행 저장 중 네트워크 오류가 발생했습니다.',
    scheduleCancelError: '예약 발행 취소에 실패했습니다.',
    scheduleCancelNetworkError: '예약 발행 취소 중 네트워크 오류가 발생했습니다.',
    toastPublishSuccess: '발행 완료',
    toastPublishScheduleSuccess: '예약 발행 저장 완료',
    toastPublishScheduleCancelled: '예약 발행 취소 완료',
    toastPublishNetworkError: '발행 중 네트워크 오류가 발생했습니다.',
    toastPublishScheduleNetworkError: '예약 발행 저장 중 네트워크 오류가 발생했습니다.',
    preflight: {
        images: { label: '이미지', detail: '빈 alt 이미지 / 비어 있는 이미지 소스' },
        links: { label: '링크', detail: '빈 링크 / 잘못된 URL / 없는 내부 경로' },
      data: { label: 'CMS 데이터', detail: '누락되었거나 호환되지 않는 CMS 필드 바인딩' },
      seo: { label: 'SEO', detail: '제목/설명 누락 및 권장 길이' },
      translations: { label: '번역', detail: '누락/오래된 번역 및 언어 경로' },
      forms: { label: '양식', detail: '폼 동작 / 이메일 / 웹훅 대상' },
      dev: { label: '개발', detail: '코드 슬롯 / 저장 함수 바인딩' },
    },
    itemStatus: (tone, blockerCount, warningCount) => {
      if (tone === 'blocker') return `${blockerCount}개 차단`;
      if (tone === 'warning') return `${warningCount}개 경고`;
      return '통과';
    },
    fixButtonLabel: '문제 수정',
    issueActionLabel: '검토',
    changedNodesLabel: '초안 vs 발행본 변경 노드',
  };
}
