import type { TranslationReleasePolicyMode } from '@/lib/builder/publish-gate/translation-release-policy';
import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';
import type { Locale } from '@/lib/locales';

export type TranslationReleaseSettingsCopy = {
  readonly heading: string;
  readonly description: string;
  readonly modeLabel: string;
  readonly save: string;
  readonly saved: string;
  readonly loading: string;
  readonly loadError: string;
  readonly saveError: string;
  readonly queueHeading: string;
  readonly queueEmpty: string;
  readonly approve: string;
  readonly reject: string;
  readonly selfReviewDisabled: string;
  readonly approved: string;
  readonly rejected: string;
  readonly refresh: string;
  readonly reportTotals: (pending: number, approved: number, rejected: number) => string;
  readonly reportRoleCount: (role: string, count: number) => string;
  readonly reportNoPendingRoles: string;
  readonly reportUserActivity: (
    username: string,
    requested: number,
    reviewed: number,
    approved: number,
    rejected: number,
  ) => string;
  readonly reportNoUserActivity: string;
  readonly reportReviewerAssignments: (assignments: string) => string;
  readonly reportReviewerAssignment: (username: string, role: string, count: number) => string;
  readonly reportNoReviewerAssignments: string;
  readonly reportEscalation: (stale: number, thresholdHours: number, roles: string) => string;
  readonly reportNoStaleRoles: string;
  readonly roleLabels: Record<BuilderRoleName, string>;
  readonly modeLabels: Record<TranslationReleasePolicyMode, string>;
};

const COPY: Record<Locale, TranslationReleaseSettingsCopy> = {
  ko: {
    heading: '번역 릴리스 승인',
    description: '다른 페이지 번역 경고가 남아 있을 때 어떤 역할이 추가 승인을 받아야 하는지 관리합니다.',
    modeLabel: '조직 정책',
    save: '저장',
    saved: '저장됨',
    loading: '불러오는 중',
    loadError: '승인 설정을 불러오지 못했습니다.',
    saveError: '승인 설정을 저장하지 못했습니다.',
    queueHeading: '대기 중인 승인 요청',
    queueEmpty: '대기 중인 승인 요청이 없습니다.',
    approve: '승인',
    reject: '거절',
    selfReviewDisabled: '본인 요청은 다른 담당자가 검토해야 합니다.',
    approved: '승인됨',
    rejected: '거절됨',
    refresh: '새로고침',
    reportTotals: (pending, approved, rejected) => `대기 ${pending} · 승인 ${approved} · 거절 ${rejected}`,
    reportRoleCount: (role, count) => `${role} ${count}`,
    reportNoPendingRoles: '대기 역할 없음',
    reportUserActivity: (username, requested, reviewed, approved, rejected) =>
      `${username} 요청 ${requested} · 검토 ${reviewed} · 승인 ${approved}/거절 ${rejected}`,
    reportNoUserActivity: '사용자 활동 없음',
    reportReviewerAssignments: (assignments) => `담당 ${assignments}`,
    reportReviewerAssignment: (username, role, count) => `${username} ${role} ${count}`,
    reportNoReviewerAssignments: '없음',
    reportEscalation: (stale, thresholdHours, roles) => `지연 ${stale} · 기준 ${thresholdHours}h · ${roles}`,
    reportNoStaleRoles: '지연 역할 없음',
    roleLabels: {
      owner: 'Owner',
      admin: 'Admin',
      designer: 'Designer',
      editor: 'Editor',
      client: 'Client',
    },
    modeLabels: {
      'acknowledge-other-page-warnings': '경고 확인 후 진행',
      'block-other-page-warnings': '다른 페이지 경고가 있으면 차단',
    },
  },
  'zh-hant': {
    heading: '翻譯發佈核准',
    description: '管理其他頁面仍有翻譯警告時，哪些角色需要額外核准。',
    modeLabel: '組織政策',
    save: '儲存',
    saved: '已儲存',
    loading: '載入中',
    loadError: '無法載入核准設定。',
    saveError: '無法儲存核准設定。',
    queueHeading: '待處理核准',
    queueEmpty: '目前沒有待處理核准。',
    approve: '核准',
    reject: '退回',
    selfReviewDisabled: '自己的請求必須由其他負責人審核。',
    approved: '已核准',
    rejected: '已退回',
    refresh: '重新整理',
    reportTotals: (pending, approved, rejected) => `待處理 ${pending} · 已核准 ${approved} · 已退回 ${rejected}`,
    reportRoleCount: (role, count) => `${role} ${count}`,
    reportNoPendingRoles: '沒有待處理角色',
    reportUserActivity: (username, requested, reviewed, approved, rejected) =>
      `${username} 請求 ${requested} · 審核 ${reviewed} · 核准 ${approved}/退回 ${rejected}`,
    reportNoUserActivity: '沒有使用者活動',
    reportReviewerAssignments: (assignments) => `負責 ${assignments}`,
    reportReviewerAssignment: (username, role, count) => `${username} ${role} ${count}`,
    reportNoReviewerAssignments: '無',
    reportEscalation: (stale, thresholdHours, roles) => `逾期 ${stale} · 門檻 ${thresholdHours}h · ${roles}`,
    reportNoStaleRoles: '沒有逾期角色',
    roleLabels: {
      owner: 'Owner',
      admin: 'Admin',
      designer: 'Designer',
      editor: 'Editor',
      client: 'Client',
    },
    modeLabels: {
      'acknowledge-other-page-warnings': '確認警告後可繼續',
      'block-other-page-warnings': '有其他頁面警告時封鎖',
    },
  },
  en: {
    heading: 'Translation Release Approval',
    description: 'Manage which roles need approval when other pages still have translation warnings.',
    modeLabel: 'Organization policy',
    save: 'Save',
    saved: 'Saved',
    loading: 'Loading',
    loadError: 'Could not load approval settings.',
    saveError: 'Could not save approval settings.',
    queueHeading: 'Pending approval requests',
    queueEmpty: 'No pending approval requests.',
    approve: 'Approve',
    reject: 'Reject',
    selfReviewDisabled: 'Requests you opened must be reviewed by another reviewer.',
    approved: 'Approved',
    rejected: 'Rejected',
    refresh: 'Refresh',
    reportTotals: (pending, approved, rejected) => `Pending ${pending} · Approved ${approved} · Rejected ${rejected}`,
    reportRoleCount: (role, count) => `${role} ${count}`,
    reportNoPendingRoles: 'No pending roles',
    reportUserActivity: (username, requested, reviewed, approved, rejected) =>
      `${username} requested ${requested} · reviewed ${reviewed} · approved ${approved}/rejected ${rejected}`,
    reportNoUserActivity: 'No user activity',
    reportReviewerAssignments: (assignments) => `Assigned ${assignments}`,
    reportReviewerAssignment: (username, role, count) => `${username} ${role} ${count}`,
    reportNoReviewerAssignments: 'none',
    reportEscalation: (stale, thresholdHours, roles) => `Stale ${stale} · ${thresholdHours}h threshold · ${roles}`,
    reportNoStaleRoles: 'No stale roles',
    roleLabels: {
      owner: 'Owner',
      admin: 'Admin',
      designer: 'Designer',
      editor: 'Editor',
      client: 'Client',
    },
    modeLabels: {
      'acknowledge-other-page-warnings': 'Proceed after acknowledging warnings',
      'block-other-page-warnings': 'Block when other pages have warnings',
    },
  },
};

export function getTranslationReleaseSettingsCopy(
  locale: Locale,
): TranslationReleaseSettingsCopy {
  return COPY[locale];
}
