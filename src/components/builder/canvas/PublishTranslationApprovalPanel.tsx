import type { TranslationReleaseApprovalRequirement } from '@/lib/builder/publish-gate/translation-release-approval';
import type { Locale } from '@/lib/locales';
import type { TranslationReleaseApprovalRequestState } from './useTranslationReleaseApprovalRequest';
import styles from './PublishModal.module.css';

interface PublishTranslationApprovalPanelProps {
  readonly requirement: TranslationReleaseApprovalRequirement | null;
  readonly locale: Locale;
  readonly requestState: TranslationReleaseApprovalRequestState;
  readonly onRequestApproval: () => void;
}

function copyForLocale(locale: Locale): {
  readonly title: string;
  readonly required: (role: string, count: number) => string;
  readonly pending: (role: string, count: number) => string;
  readonly approved: (role: string) => string;
  readonly hint: string;
  readonly error: string;
  readonly request: string;
  readonly requesting: string;
} {
  if (locale === 'zh-hant') {
    return {
      title: '翻譯發佈核准',
      required: (role, count) => `${role} 角色需先取得核准，才能在其他頁面仍有 ${count} 個翻譯警告時發佈。`,
      pending: (role, count) => `${role} 角色的核准要求正在等待中；其他頁面仍有 ${count} 個翻譯警告。`,
      approved: (role) => `${role} 角色的翻譯發佈已核准。`,
      hint: '核准會鎖定目前翻譯警告快照；警告變更後需重新要求核准。',
      error: '無法建立核准要求。',
      request: '要求核准',
      requesting: '要求中...',
    };
  }
  if (locale === 'en') {
    return {
      title: 'Translation release approval',
      required: (role, count) =>
        `${role} must request approval before publishing with ${count} other-page translation warning${count === 1 ? '' : 's'}.`,
      pending: (role, count) =>
        `${role} approval is pending while ${count} other-page translation warning${count === 1 ? '' : 's'} remain.`,
      approved: (role) => `Translation release is approved for ${role}.`,
      hint: 'Approval is tied to the current warning snapshot; changed warnings require a new approval.',
      error: 'Could not create the approval request.',
      request: 'Request approval',
      requesting: 'Requesting...',
    };
  }
  return {
    title: '번역 릴리스 승인',
    required: (role, count) =>
      `${role} 역할은 다른 페이지 번역 경고 ${count}개가 남아 있을 때 발행 전 승인이 필요합니다.`,
    pending: (role, count) =>
      `${role} 역할의 승인 요청이 대기 중입니다. 다른 페이지 번역 경고 ${count}개가 남아 있습니다.`,
    approved: (role) => `${role} 역할의 번역 릴리스가 승인되었습니다.`,
    hint: '승인은 현재 번역 경고 스냅샷에만 적용됩니다. 경고가 바뀌면 다시 승인해야 합니다.',
    error: '승인 요청을 만들지 못했습니다.',
    request: '승인 요청',
    requesting: '요청 중...',
  };
}

export function PublishTranslationApprovalPanel({
  requirement,
  locale,
  requestState,
  onRequestApproval,
}: PublishTranslationApprovalPanelProps): JSX.Element | null {
  if (!requirement || requirement.state === 'not-required') return null;
  const copy = copyForLocale(locale);
  const otherPageCount = requirement.summary.otherPageCount;
  const canRequest = requirement.state === 'required' && requestState !== 'pending';

  return (
    <div
      className={styles.publishDiffPanel}
      data-builder-publish-translation-release-approval={requirement.state}
      data-builder-publish-translation-release-approval-role={requirement.role}
      data-builder-publish-translation-release-approval-other={otherPageCount}
      aria-live="polite"
    >
      <div className={styles.checklistLabel}>
        <span>{copy.title}</span>
        <span className={styles.checklistStatus}>
          {requirement.role}
        </span>
      </div>
      <div className={styles.checklistDetail}>
        {requirement.state === 'approved'
          ? copy.approved(requirement.role)
          : requirement.state === 'pending'
            ? copy.pending(requirement.role, otherPageCount)
            : copy.required(requirement.role, otherPageCount)}
      </div>
      <div className={styles.checklistDetail}>
        {copy.hint}
      </div>
      {requestState === 'error' ? (
        <div className={styles.checklistDetail} data-tone="blocker">
          {copy.error}
        </div>
      ) : null}
      {requirement.state === 'required' ? (
        <div className={styles.publishDiffStatRow}>
          <button
            type="button"
            className={styles.fixButton}
            data-builder-publish-translation-release-approval-request="true"
            disabled={!canRequest}
            onClick={onRequestApproval}
          >
            {requestState === 'pending' ? copy.requesting : copy.request}
          </button>
        </div>
      ) : null}
    </div>
  );
}
