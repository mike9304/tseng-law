'use client';

import type {
  TranslationReleaseApprovalReviewerReport,
} from '@/lib/builder/publish-gate/translation-release-approval-report';
import styles from './SiteSettingsAdvancedTab.module.css';
import type { TranslationReleaseSettingsCopy } from './translation-release-settings-copy';

export function TranslationReleaseReviewerReport({
  copy,
  report,
}: {
  readonly copy: TranslationReleaseSettingsCopy;
  readonly report: TranslationReleaseApprovalReviewerReport | null;
}) {
  if (!report) return null;

  const roleReport = report.pendingByRole.length > 0
    ? report.pendingByRole
      .map((entry) => copy.reportRoleCount(copy.roleLabels[entry.role], entry.count))
      .join(' · ')
    : copy.reportNoPendingRoles;
  const userReport = report.activityByUser.length > 0
    ? report.activityByUser
      .map((entry) => copy.reportUserActivity(
        entry.username,
        entry.requestedCount,
        entry.reviewedCount,
        entry.approvedDecisionCount,
        entry.rejectedDecisionCount,
      ))
      .join(' · ')
    : copy.reportNoUserActivity;
  const staleRoleReport = report.escalation.staleByRole.length > 0
    ? report.escalation.staleByRole
      .map((entry) => copy.reportRoleCount(copy.roleLabels[entry.role], entry.count))
      .join(' · ')
    : copy.reportNoStaleRoles;
  const assignmentReport = report.reviewerAssignments.length > 0
    ? report.reviewerAssignments
      .map((entry) => copy.reportReviewerAssignment(
        entry.username,
        copy.roleLabels[entry.role],
        entry.assignedCount,
      ))
      .join(' · ')
    : copy.reportNoReviewerAssignments;

  return (
    <div className={styles.approvalReport} data-builder-translation-release-report="true">
      <span>{copy.reportTotals(report.pendingCount, report.approvedCount, report.rejectedCount)}</span>
      <span>{roleReport}</span>
      <span data-builder-translation-release-activity-report="true">{userReport}</span>
      <span data-builder-translation-release-assignment-report="true">
        {copy.reportReviewerAssignments(assignmentReport)}
      </span>
      <span data-builder-translation-release-escalation-report="true">
        {copy.reportEscalation(
          report.escalation.stalePendingCount,
          Math.round(report.escalation.thresholdMinutes / 60),
          staleRoleReport,
        )}
      </span>
    </div>
  );
}
