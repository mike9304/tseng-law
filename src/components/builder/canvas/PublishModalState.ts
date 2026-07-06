import type { PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import type { TranslationSiteWarningSummary } from '@/lib/builder/publish-gate/translation-site-summary';
import type { TranslationSiteReviewInput } from '@/lib/builder/publish-gate/translation-policy-review';
import type { PublishIssueGroups } from './PublishModalIssues';
import type { PublishState } from './PublishModalTypes';

export interface PublishSubmitState {
  readonly canSubmitPublish: boolean;
  readonly hasWarningsOnly: boolean;
}

export function groupPublishCheckResults(
  suite: PublishCheckSuite | null,
): PublishIssueGroups {
  if (!suite) return { blockers: [], warnings: [], infos: [] };

  return {
    blockers: suite.results.filter((result) => result.severity === 'blocker'),
    warnings: suite.results.filter((result) => result.severity === 'warning'),
    infos: suite.results.filter((result) => result.severity === 'info'),
  };
}

export function buildPublishSubmitState(opts: {
  readonly suite: PublishCheckSuite | null;
  readonly publishState: PublishState;
  readonly overrideWarnings: boolean;
  readonly translationSiteWarnings: TranslationSiteWarningSummary | null;
  readonly translationSiteWarningsAcknowledged: boolean;
}): PublishSubmitState {
  const canPublish = !!opts.suite && !opts.suite.hasBlocker && opts.publishState === 'ready';
  const hasWarningsOnly = !!opts.suite && !opts.suite.hasBlocker && opts.suite.warningCount > 0;
  const requiresTranslationSiteReview = (opts.translationSiteWarnings?.otherPageCount ?? 0) > 0;
  const translationSiteReviewReady =
    !requiresTranslationSiteReview || opts.translationSiteWarningsAcknowledged;

  return {
    canSubmitPublish:
      canPublish
      && ((opts.suite?.warningCount ?? 0) === 0 || opts.overrideWarnings)
      && translationSiteReviewReady,
    hasWarningsOnly,
  };
}

export function buildTranslationSiteReviewInput(
  summary: TranslationSiteWarningSummary | null,
  acknowledged: boolean,
): TranslationSiteReviewInput | undefined {
  if (!summary || summary.otherPageCount <= 0 || !acknowledged) return undefined;

  return {
    sourceLocale: summary.sourceLocale,
    syncedAt: summary.syncedAt,
    totalCount: summary.totalCount,
    currentPageCount: summary.currentPageCount,
    otherPageCount: summary.otherPageCount,
    warningCount: summary.warningCount,
    errorCount: summary.errorCount,
    reviewHref: summary.reviewHref,
    warningFingerprint: summary.warningFingerprint,
  };
}
