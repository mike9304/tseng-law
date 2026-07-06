import type { PublishCheckSuite, CheckResult } from '@/lib/builder/publish-gate/gate-runner';
import type { TranslationReleaseApprovalRequirement } from '@/lib/builder/publish-gate/translation-release-approval';
import type { TranslationReleasePolicy } from '@/lib/builder/publish-gate/translation-release-policy';
import type { TranslationSiteWarningSummary } from '@/lib/builder/publish-gate/translation-site-summary';

export interface PublishChecksResponse {
  readonly ok: boolean;
  readonly suite?: PublishCheckSuite;
  readonly translationSiteWarnings?: TranslationSiteWarningSummary;
  readonly translationReleasePolicy?: TranslationReleasePolicy;
  readonly translationReleaseApproval?: TranslationReleaseApprovalRequirement;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCheckResult(value: unknown): value is CheckResult {
  if (!isObjectRecord(value)) return false;
  return (
    typeof value.id === 'string'
    && (
      value.severity === 'blocker'
      || value.severity === 'warning'
      || value.severity === 'info'
    )
    && typeof value.category === 'string'
    && typeof value.message === 'string'
  );
}

function isPublishCheckSuite(value: unknown): value is PublishCheckSuite {
  if (!isObjectRecord(value)) return false;
  return (
    Array.isArray(value.results)
    && value.results.every(isCheckResult)
    && typeof value.hasBlocker === 'boolean'
    && typeof value.warningCount === 'number'
    && typeof value.blockerCount === 'number'
    && typeof value.infoCount === 'number'
    && typeof value.checkedAt === 'string'
  );
}

function isTranslationSiteWarningSummary(
  value: unknown,
): value is TranslationSiteWarningSummary {
  if (!isObjectRecord(value)) return false;
  return (
    typeof value.sourceLocale === 'string'
    && typeof value.syncedAt === 'string'
    && typeof value.totalCount === 'number'
    && typeof value.currentPageCount === 'number'
    && typeof value.otherPageCount === 'number'
    && typeof value.warningCount === 'number'
    && typeof value.errorCount === 'number'
    && typeof value.reviewHref === 'string'
    && typeof value.warningFingerprint === 'string'
  );
}

function isTranslationReleasePolicy(value: unknown): value is TranslationReleasePolicy {
  if (!isObjectRecord(value)) return false;
  return (
    typeof value.siteId === 'string'
    && (
      value.mode === 'acknowledge-other-page-warnings'
      || value.mode === 'block-other-page-warnings'
    )
    && Array.isArray(value.approvalRequiredForRoles)
    && value.approvalRequiredForRoles.every((role) => typeof role === 'string')
    && typeof value.updatedAt === 'string'
    && (
      value.updatedBy === undefined
      || typeof value.updatedBy === 'string'
    )
  );
}

function isApprovalSummary(value: unknown): boolean {
  if (!isObjectRecord(value)) return false;
  return (
    typeof value.id === 'string'
    && typeof value.siteId === 'string'
    && typeof value.pageId === 'string'
    && typeof value.locale === 'string'
    && typeof value.warningFingerprint === 'string'
    && typeof value.requestedBy === 'string'
    && typeof value.requestedRole === 'string'
    && typeof value.requestedAt === 'string'
    && (
      value.status === 'pending'
      || value.status === 'approved'
      || value.status === 'rejected'
    )
  );
}

function isTranslationReleaseApproval(
  value: unknown,
): value is TranslationReleaseApprovalRequirement {
  if (!isObjectRecord(value) || typeof value.role !== 'string') return false;
  if (!isTranslationReleasePolicy(value.policy)) return false;
  if (value.state === 'not-required') return true;
  if (!isTranslationSiteWarningSummary(value.summary)) return false;
  if (value.state === 'approved') return isApprovalSummary(value.approval);
  if (value.state === 'required') return isCheckResult(value.result);
  if (value.state === 'pending') {
    return isApprovalSummary(value.approval) && isCheckResult(value.result);
  }
  return false;
}

export function parsePublishChecksResponse(value: unknown): PublishChecksResponse | null {
  if (!isObjectRecord(value) || typeof value.ok !== 'boolean') return null;
  if (!value.ok || !isPublishCheckSuite(value.suite)) return { ok: false };
  return {
    ok: true,
    suite: value.suite,
    translationSiteWarnings: isTranslationSiteWarningSummary(value.translationSiteWarnings)
      ? value.translationSiteWarnings
      : undefined,
    translationReleasePolicy: isTranslationReleasePolicy(value.translationReleasePolicy)
      ? value.translationReleasePolicy
      : undefined,
    translationReleaseApproval: isTranslationReleaseApproval(value.translationReleaseApproval)
      ? value.translationReleaseApproval
      : undefined,
  };
}
