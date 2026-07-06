import type { CheckResult } from '@/lib/builder/publish-gate/gate-runner';
import type { TranslationReleaseApprovalRequirement } from '@/lib/builder/publish-gate/translation-release-approval';
import type { TranslationReleasePolicy } from '@/lib/builder/publish-gate/translation-release-policy';
import type { TranslationSiteWarningSummary } from '@/lib/builder/publish-gate/translation-site-summary';
import type { Locale } from '@/lib/locales';
import {
  CheckListItem,
  type PreflightItem,
} from './PublishModalPreflight';
import { getPublishModalCopy } from './publish-copy';
import { PublishTranslationApprovalPanel } from './PublishTranslationApprovalPanel';
import { PublishTranslationPolicyPanel } from './PublishTranslationPolicyPanel';
import type { TranslationReleaseApprovalRequestState } from './useTranslationReleaseApprovalRequest';
import styles from './PublishModal.module.css';

export interface PublishIssueGroups {
  readonly blockers: readonly CheckResult[];
  readonly warnings: readonly CheckResult[];
  readonly infos: readonly CheckResult[];
}

interface PublishWarningOverrideReviewProps {
  readonly warnings: readonly CheckResult[];
  readonly preflightItems: readonly PreflightItem[];
  readonly locale: Locale;
  readonly overrideWarnings: boolean;
}

interface PublishTranslationSiteReviewProps {
  readonly summary: TranslationSiteWarningSummary | null;
  readonly locale: Locale;
  readonly acknowledged: boolean;
  readonly onAcknowledge: () => void;
}

export function PublishWarningOverrideReview({
  warnings,
  preflightItems,
  locale,
  overrideWarnings,
}: PublishWarningOverrideReviewProps): JSX.Element | null {
  if (warnings.length === 0) return null;

  const copy = getPublishModalCopy(locale);
  const status = overrideWarnings ? 'acknowledged' : 'pending';
  const categoryItems = preflightItems.filter((item) => item.warningCount > 0);

  return (
    <div
      className={styles.publishDiffPanel}
      data-builder-publish-warning-override-review={status}
      data-builder-publish-warning-override-count={warnings.length}
      data-builder-publish-warning-override-categories={categoryItems
        .map((item) => `${item.key}:${item.warningCount}`)
        .join(',')}
      aria-live="polite"
    >
      <div className={styles.checklistLabel}>
        <span>{copy.warningOverrideReviewTitle}</span>
        <span className={styles.checklistStatus}>
          {warnings.length}
        </span>
      </div>
      <div className={styles.checklistDetail}>
        {overrideWarnings
          ? copy.warningOverrideAcknowledged(warnings.length)
          : copy.warningOverridePending(warnings.length)}
      </div>
      {categoryItems.length > 0 ? (
        <div className={styles.publishDiffStatRow}>
          {categoryItems.map((item) => (
            <span
              key={item.key}
              className={styles.publishDiffStat}
              data-tone="modified"
              data-builder-publish-warning-override-category={item.key}
            >
              {copy.warningOverrideCategoryLabel(item.label, item.warningCount)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PublishTranslationSiteReview({
  summary,
  locale,
  acknowledged,
  onAcknowledge,
}: PublishTranslationSiteReviewProps): JSX.Element | null {
  if (!summary || summary.totalCount === 0) return null;

  const copy = getPublishModalCopy(locale);
  const requiresAcknowledgement = summary.otherPageCount > 0;
  const reviewState = requiresAcknowledgement
    ? acknowledged ? 'acknowledged' : 'pending'
    : 'not-required';

  return (
    <div
      className={styles.publishDiffPanel}
      data-builder-publish-site-translation-review="true"
      data-builder-publish-site-translation-review-state={reviewState}
      data-builder-publish-site-translation-acknowledged={acknowledged ? 'true' : 'false'}
      data-builder-publish-site-translation-total={summary.totalCount}
      data-builder-publish-site-translation-current={summary.currentPageCount}
      data-builder-publish-site-translation-other={summary.otherPageCount}
      data-builder-publish-site-translation-errors={summary.errorCount}
      aria-live="polite"
    >
      <div className={styles.checklistLabel}>
        <span>{copy.translationSiteReviewTitle}</span>
        <span className={styles.checklistStatus}>
          {summary.totalCount}
        </span>
      </div>
      <div className={styles.checklistDetail}>
        {copy.translationSiteReviewSummary(summary.totalCount, summary.otherPageCount)}
      </div>
      {requiresAcknowledgement ? (
        <div className={styles.checklistDetail}>
          {acknowledged
            ? copy.translationSiteReviewAcknowledged(summary.otherPageCount)
            : copy.translationSiteReviewPending(summary.otherPageCount)}
        </div>
      ) : null}
      <div className={styles.publishDiffStatRow}>
        <span className={styles.publishDiffStat} data-tone="modified">
          {copy.translationSiteReviewCurrentPage(summary.currentPageCount)}
        </span>
        <span className={styles.publishDiffStat} data-tone="removed">
          {copy.translationSiteReviewBreakdown(summary.warningCount, summary.errorCount)}
        </span>
        <a
          href={summary.reviewHref}
          className={styles.fixButton}
          data-builder-publish-site-translation-action="true"
        >
          {copy.translationSiteReviewAction}
        </a>
        {requiresAcknowledgement && !acknowledged ? (
          <button
            type="button"
            className={styles.fixButton}
            data-builder-publish-site-translation-acknowledge="true"
            onClick={onAcknowledge}
          >
            {copy.translationSiteReviewAcknowledgeAction}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function PublishModalIssues({
  grouped,
  preflightItems,
  locale,
  overrideWarnings,
  translationSiteWarnings,
  translationReleasePolicy,
  translationReleaseApproval,
  translationReleaseApprovalRequestState,
  translationSiteWarningsAcknowledged,
  onAcknowledgeTranslationSiteWarnings,
  onRequestTranslationReleaseApproval,
  onFix,
}: {
  readonly grouped: PublishIssueGroups;
  readonly preflightItems: readonly PreflightItem[];
  readonly locale: Locale;
  readonly overrideWarnings: boolean;
  readonly translationSiteWarnings: TranslationSiteWarningSummary | null;
  readonly translationReleasePolicy: TranslationReleasePolicy | null;
  readonly translationReleaseApproval: TranslationReleaseApprovalRequirement | null;
  readonly translationReleaseApprovalRequestState: TranslationReleaseApprovalRequestState;
  readonly translationSiteWarningsAcknowledged: boolean;
  readonly onAcknowledgeTranslationSiteWarnings: () => void;
  readonly onRequestTranslationReleaseApproval: () => void;
  readonly onFix: (nodeId: string) => void;
}): JSX.Element {
  const copy = getPublishModalCopy(locale);

  return (
    <>
      {grouped.blockers.length > 0 ? (
        <>
          <p className={styles.sectionTitle} data-tone="blocker">
            {copy.blockersTitle(grouped.blockers.length)}
          </p>
          <ul className={styles.issueList}>
            {grouped.blockers.map((result) => (
              <CheckListItem key={result.id} result={result} locale={locale} onFix={onFix} />
            ))}
          </ul>
        </>
      ) : null}

      {grouped.warnings.length > 0 ? (
        <>
          <p className={styles.sectionTitle} data-tone="warning">
            {copy.warningsTitle(grouped.warnings.length)}
          </p>
          <ul className={styles.issueList}>
            {grouped.warnings.map((result) => (
              <CheckListItem key={result.id} result={result} locale={locale} onFix={onFix} />
            ))}
          </ul>
          {grouped.blockers.length === 0 ? (
            <PublishWarningOverrideReview
              warnings={grouped.warnings}
              preflightItems={preflightItems}
              locale={locale}
              overrideWarnings={overrideWarnings}
            />
          ) : null}
        </>
      ) : null}

      <PublishTranslationSiteReview
        summary={translationSiteWarnings}
        locale={locale}
        acknowledged={translationSiteWarningsAcknowledged}
        onAcknowledge={onAcknowledgeTranslationSiteWarnings}
      />

      <PublishTranslationPolicyPanel
        policy={translationReleasePolicy}
        summary={translationSiteWarnings}
        locale={locale}
      />

      <PublishTranslationApprovalPanel
        requirement={translationReleaseApproval}
        locale={locale}
        requestState={translationReleaseApprovalRequestState}
        onRequestApproval={onRequestTranslationReleaseApproval}
      />

      {grouped.infos.length > 0 ? (
        <>
          <p className={styles.sectionTitle} data-tone="info">
            {copy.infosTitle(grouped.infos.length)}
          </p>
          <ul className={styles.issueList}>
            {grouped.infos.map((result) => (
              <CheckListItem key={result.id} result={result} locale={locale} onFix={onFix} />
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}
