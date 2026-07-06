import type { Locale } from '@/lib/locales';

export type VersionHistorySource = 'publish' | 'rollback-backup' | 'manual' | 'saved';
type SourceBadgeKey = Exclude<VersionHistorySource, 'saved'>;

export interface VersionHistoryCopy {
  dateLocale: string;
  dialogAriaLabel: string;
  confirmAriaLabel: string;
  confirmQuestion: string;
  confirmWarning: string;
  cancel: string;
  restore: string;
  restoring: string;
  title: string;
  close: string;
  currentDraft: string;
  revisionLabel: (revision: number) => string;
  nodeCountLabel: (count: number) => string;
  draftMetaLabel: (nodeCount: number) => string;
  liveDraftSummary: string;
  loadingRevisions: string;
  noRevisionsTitle: string;
  noRevisionsHint: string;
  changeSummaryLabel: (sourceLabel: string) => string;
  hoverDiffPreview: string;
  selectRevisionPrompt: string;
  loadingRevisionDocument: string;
  revisionDocumentLoadFailed: string;
  addedCount: (count: number) => string;
  removedCount: (count: number) => string;
  modifiedCount: (count: number) => string;
  addedSection: string;
  removedSection: string;
  modifiedSection: string;
  sameAsDraft: string;
  restoreThisVersion: string;
  sourceLabels: Record<VersionHistorySource, string>;
  sourceBadgeLabels: Record<SourceBadgeKey, string>;
}

const COPY: Record<Locale | 'en', VersionHistoryCopy> = {
  ko: {
    dateLocale: 'ko-KR',
    dialogAriaLabel: '버전 히스토리',
    confirmAriaLabel: '리비전 복원 확인',
    confirmQuestion: '이 리비전으로 복원하시겠습니까?',
    confirmWarning: '현재 초안은 자동으로 백업된 후 덮어씌워집니다.',
    cancel: '취소',
    restore: '복원',
    restoring: '복원 중...',
    title: '버전 히스토리',
    close: '닫기',
    currentDraft: '현재 초안',
    revisionLabel: (revision) => `리비전 ${revision}`,
    nodeCountLabel: (count) => `노드 ${count}개`,
    draftMetaLabel: (nodeCount) => `노드 ${nodeCount}개 - 편집 중`,
    liveDraftSummary: '실시간 초안 - 마지막 저장본 기준',
    loadingRevisions: '리비전 로딩 중...',
    noRevisionsTitle: '저장된 리비전이 없습니다.',
    noRevisionsHint: '발행 또는 수동 스냅샷 시 자동 생성됩니다.',
    changeSummaryLabel: (sourceLabel) => `변경 요약 - ${sourceLabel}`,
    hoverDiffPreview: '마우스를 올리면 차이 미리보기',
    selectRevisionPrompt: '좌측에서 리비전을 선택하면 현재 초안과의 차이를 표시합니다.',
    loadingRevisionDocument: '리비전 문서 로딩 중...',
    revisionDocumentLoadFailed: '리비전 문서를 불러오지 못했습니다.',
    addedCount: (count) => `+ 추가됨 ${count}`,
    removedCount: (count) => `- 삭제됨 ${count}`,
    modifiedCount: (count) => `~ 변경됨 ${count}`,
    addedSection: '추가된 노드 (현재에만 존재)',
    removedSection: '제거된 노드 (이 리비전에만 존재)',
    modifiedSection: '변경된 노드',
    sameAsDraft: '현재 초안과 동일합니다.',
    restoreThisVersion: '이 버전으로 복원',
    sourceLabels: {
      publish: '발행 스냅샷',
      'rollback-backup': '롤백 백업',
      manual: '수동 저장',
      saved: '저장된 리비전',
    },
    sourceBadgeLabels: {
      publish: '발행',
      'rollback-backup': '백업',
      manual: '수동',
    },
  },
  'zh-hant': {
    dateLocale: 'zh-Hant-TW',
    dialogAriaLabel: '版本記錄',
    confirmAriaLabel: '確認還原版本',
    confirmQuestion: '要還原到此版本嗎？',
    confirmWarning: '目前草稿會先自動備份，然後由此版本覆蓋。',
    cancel: '取消',
    restore: '還原',
    restoring: '正在還原...',
    title: '版本記錄',
    close: '關閉',
    currentDraft: '目前草稿',
    revisionLabel: (revision) => `修訂 ${revision}`,
    nodeCountLabel: (count) => `節點 ${count} 個`,
    draftMetaLabel: (nodeCount) => `節點 ${nodeCount} 個 - 編輯中`,
    liveDraftSummary: '即時草稿 - 以最後儲存版本為基準',
    loadingRevisions: '正在載入修訂...',
    noRevisionsTitle: '沒有已儲存的修訂。',
    noRevisionsHint: '發佈或手動快照時會自動建立。',
    changeSummaryLabel: (sourceLabel) => `變更摘要 - ${sourceLabel}`,
    hoverDiffPreview: '滑過可看差異預覽',
    selectRevisionPrompt: '從左側選取修訂，即可顯示與目前草稿的差異。',
    loadingRevisionDocument: '正在載入修訂文件...',
    revisionDocumentLoadFailed: '無法載入修訂文件。',
    addedCount: (count) => `+ 新增 ${count}`,
    removedCount: (count) => `- 刪除 ${count}`,
    modifiedCount: (count) => `~ 變更 ${count}`,
    addedSection: '新增的節點（只存在於目前草稿）',
    removedSection: '移除的節點（只存在於此修訂）',
    modifiedSection: '已變更的節點',
    sameAsDraft: '與目前草稿相同。',
    restoreThisVersion: '還原到此版本',
    sourceLabels: {
      publish: '已發佈快照',
      'rollback-backup': '還原備份',
      manual: '手動儲存',
      saved: '已儲存修訂',
    },
    sourceBadgeLabels: {
      publish: '已發佈',
      'rollback-backup': '備份',
      manual: '手動',
    },
  },
  en: {
    dateLocale: 'en-US',
    dialogAriaLabel: 'Version history',
    confirmAriaLabel: 'Confirm revision restore',
    confirmQuestion: 'Restore this revision?',
    confirmWarning: 'The current draft will be backed up automatically before it is overwritten.',
    cancel: 'Cancel',
    restore: 'Restore',
    restoring: 'Restoring...',
    title: 'Version history',
    close: 'Close',
    currentDraft: 'Current draft',
    revisionLabel: (revision) => `revision ${revision}`,
    nodeCountLabel: (count) => `${count} nodes`,
    draftMetaLabel: (nodeCount) => `${nodeCount} nodes - editing`,
    liveDraftSummary: 'Live draft - based on the latest saved version',
    loadingRevisions: 'Loading revisions...',
    noRevisionsTitle: 'No saved revisions.',
    noRevisionsHint: 'They are created automatically when publishing or taking a manual snapshot.',
    changeSummaryLabel: (sourceLabel) => `Change summary - ${sourceLabel}`,
    hoverDiffPreview: 'Hover for diff preview',
    selectRevisionPrompt: 'Select a revision on the left to compare it with the current draft.',
    loadingRevisionDocument: 'Loading revision document...',
    revisionDocumentLoadFailed: 'Could not load the revision document.',
    addedCount: (count) => `+ added ${count}`,
    removedCount: (count) => `- removed ${count}`,
    modifiedCount: (count) => `~ modified ${count}`,
    addedSection: 'Added nodes (current draft only)',
    removedSection: 'Removed nodes (this revision only)',
    modifiedSection: 'Modified nodes',
    sameAsDraft: 'Same as the current draft.',
    restoreThisVersion: 'Restore this version',
    sourceLabels: {
      publish: 'published snapshot',
      'rollback-backup': 'rollback backup',
      manual: 'manual save',
      saved: 'saved revision',
    },
    sourceBadgeLabels: {
      publish: 'published',
      'rollback-backup': 'backup',
      manual: 'manual',
    },
  },
};

export function getVersionHistoryCopy(locale?: Locale | string | null): VersionHistoryCopy {
  if (locale === 'ko') return COPY.ko;
  if (locale === 'zh-hant') return COPY['zh-hant'];
  return COPY.en;
}
