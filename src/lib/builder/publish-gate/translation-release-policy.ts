import { defaultLocale, type Locale } from '@/lib/locales';
import type { CheckResult, PublishCheckSuite } from './check-types';
import type { TranslationSiteReviewInput } from './translation-policy-review';
import {
  buildTranslationSiteWarningSummary,
  type TranslationSiteWarningSummary,
} from './translation-site-summary';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  readTranslationReleasePolicy,
  type TranslationReleasePolicy,
} from './translation-release-policy-store';
import { evaluateTranslationReleaseApprovalRequirement } from './translation-release-approval';

export type TranslationReleasePolicyPublishDecision =
  | {
      readonly status: 'allowed';
      readonly policy: TranslationReleasePolicy;
      readonly summary?: TranslationSiteWarningSummary;
    }
  | {
      readonly status: 'blocked';
      readonly policy: TranslationReleasePolicy;
      readonly summary: TranslationSiteWarningSummary;
      readonly result: CheckResult;
    };

export {
  readTranslationReleasePolicy,
  translationReleasePolicyPayloadSchema,
  TRANSLATION_RELEASE_POLICY_MODES,
  writeTranslationReleasePolicy,
  type TranslationReleasePolicy,
  type TranslationReleasePolicyMode,
  type TranslationReleasePolicyWriteInput,
} from './translation-release-policy-store';

function policyCopy(locale: Locale): {
  readonly message: (count: number) => string;
  readonly hint: string;
  readonly action: string;
} {
  if (locale === 'zh-hant') {
    return {
      message: (count) => `組織翻譯發佈政策封鎖了 ${count} 個其他頁面的翻譯警告。`,
      hint: '請先在 Translation Manager 修正其他頁面的缺漏或過期翻譯。',
      action: '檢視全部翻譯',
    };
  }
  if (locale === 'en') {
    return {
      message: (count) =>
        `Organization translation release policy blocks ${count} translation warning${count === 1 ? '' : 's'} on other pages.`,
      hint: 'Resolve missing or stale translations on other pages in Translation Manager first.',
      action: 'Review all translations',
    };
  }
  return {
    message: (count) => `조직 번역 릴리스 정책이 다른 페이지 번역 경고 ${count}개를 차단합니다.`,
    hint: 'Translation Manager에서 다른 페이지의 누락/오래된 번역을 먼저 해결하세요.',
    action: '전체 번역 검토',
  };
}

export function buildTranslationReleasePolicyBlocker(
  policy: TranslationReleasePolicy,
  summary: TranslationSiteWarningSummary,
  locale: Locale,
): CheckResult | null {
  if (policy.mode !== 'block-other-page-warnings' || summary.otherPageCount <= 0) return null;
  const copy = policyCopy(locale);
  return {
    id: 'translation-release-policy-other-pages',
    severity: 'blocker',
    category: 'translations',
    message: copy.message(summary.otherPageCount),
    fixHint: copy.hint,
    action: {
      href: summary.reviewHref,
      label: copy.action,
    },
  };
}

export function applyTranslationReleasePolicyToSuite(
  suite: PublishCheckSuite,
  policy: TranslationReleasePolicy,
  summary: TranslationSiteWarningSummary,
  locale: Locale,
): PublishCheckSuite {
  const blocker = buildTranslationReleasePolicyBlocker(policy, summary, locale);
  if (!blocker || suite.results.some((result) => result.id === blocker.id)) return suite;
  const results = [...suite.results, blocker];
  return {
    ...suite,
    results,
    hasBlocker: true,
    blockerCount: suite.blockerCount + 1,
  };
}

function summaryFromReview(review: TranslationSiteReviewInput): TranslationSiteWarningSummary {
  return {
    sourceLocale: review.sourceLocale,
    syncedAt: review.syncedAt,
    totalCount: review.totalCount,
    currentPageCount: review.currentPageCount,
    otherPageCount: review.otherPageCount,
    warningCount: review.warningCount,
    errorCount: review.errorCount,
    reviewHref: review.reviewHref,
    warningFingerprint: review.warningFingerprint
      ?? `legacy:${review.totalCount}:${review.currentPageCount}:${review.otherPageCount}:${review.warningCount}:${review.errorCount}`,
  };
}

async function resolvePublishSummary(input: {
  readonly siteId: string;
  readonly pageId: string;
  readonly locale: Locale;
  readonly review?: TranslationSiteReviewInput;
  readonly requiresStableFingerprint: boolean;
}): Promise<TranslationSiteWarningSummary> {
  if (input.review?.warningFingerprint || !input.requiresStableFingerprint) {
    return input.review
      ? summaryFromReview(input.review)
      : buildTranslationSiteWarningSummary(
        await readSiteDocument(input.siteId, input.locale),
        input.pageId,
        defaultLocale,
      );
  }

  return buildTranslationSiteWarningSummary(
    await readSiteDocument(input.siteId, input.locale),
    input.pageId,
    defaultLocale,
  );
}

export async function evaluateTranslationReleasePolicyForPublish(input: {
  readonly siteId: string;
  readonly pageId: string;
  readonly locale: Locale;
  readonly actorUsername?: string;
  readonly review?: TranslationSiteReviewInput;
}): Promise<TranslationReleasePolicyPublishDecision> {
  const policy = await readTranslationReleasePolicy(input.siteId);
  const requiresApproval = !!input.actorUsername && policy.approvalRequiredForRoles.length > 0;
  if (policy.mode !== 'block-other-page-warnings' && !requiresApproval) {
    return { status: 'allowed', policy };
  }

  const summary = await resolvePublishSummary({
    siteId: input.siteId,
    pageId: input.pageId,
    locale: input.locale,
    review: input.review,
    requiresStableFingerprint: requiresApproval,
  });
  const policyBlocker = buildTranslationReleasePolicyBlocker(policy, summary, input.locale);
  if (policyBlocker) return { status: 'blocked', policy, summary, result: policyBlocker };

  if (input.actorUsername) {
    const approval = await evaluateTranslationReleaseApprovalRequirement({
      siteId: input.siteId,
      pageId: input.pageId,
      locale: input.locale,
      actorUsername: input.actorUsername,
      policy,
      summary,
    });
    if (approval.state === 'required' || approval.state === 'pending') {
      return { status: 'blocked', policy, summary, result: approval.result };
    }
  }

  return { status: 'allowed', policy, summary };
}

export function buildTranslationReleasePolicyBlockedPayload(result: CheckResult): {
  readonly ok: false;
  readonly error: 'translation_release_policy_blocked' | 'translation_release_approval_required';
  readonly errorCode: 'translation_release_policy_blocked' | 'translation_release_approval_required';
  readonly errorMessage: string;
  readonly blocker: CheckResult;
} {
  const errorCode = result.id.startsWith('translation-release-approval-')
    ? 'translation_release_approval_required'
    : 'translation_release_policy_blocked';
  return {
    ok: false,
    error: errorCode,
    errorCode,
    errorMessage: result.message,
    blocker: result,
  };
}
