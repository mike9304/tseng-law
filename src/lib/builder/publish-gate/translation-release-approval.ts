import type { CheckResult, PublishCheckSuite } from './check-types';
import type {
  TranslationReleaseApprovalSummary,
} from './translation-release-approval-model';
import { summarizeTranslationReleaseApproval } from './translation-release-approval-model';
import { getLatestTranslationReleaseApprovalForContext } from './translation-release-approval-store';
import type { TranslationReleasePolicy } from './translation-release-policy-store';
import type { TranslationSiteWarningSummary } from './translation-site-summary';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';
import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';
import type { Locale } from '@/lib/locales';

export type TranslationReleaseApprovalRequirement =
  | {
      readonly state: 'not-required';
      readonly role: BuilderRoleName;
      readonly policy: TranslationReleasePolicy;
    }
  | {
      readonly state: 'required';
      readonly role: BuilderRoleName;
      readonly policy: TranslationReleasePolicy;
      readonly summary: TranslationSiteWarningSummary;
      readonly result: CheckResult;
    }
  | {
      readonly state: 'pending';
      readonly role: BuilderRoleName;
      readonly policy: TranslationReleasePolicy;
      readonly summary: TranslationSiteWarningSummary;
      readonly approval: TranslationReleaseApprovalSummary;
      readonly result: CheckResult;
    }
  | {
      readonly state: 'approved';
      readonly role: BuilderRoleName;
      readonly policy: TranslationReleasePolicy;
      readonly summary: TranslationSiteWarningSummary;
      readonly approval: TranslationReleaseApprovalSummary;
    };

function approvalCopy(locale: Locale, state: 'required' | 'pending'): {
  readonly message: (role: BuilderRoleName, count: number) => string;
  readonly hint: string;
  readonly action: string;
} {
  if (locale === 'zh-hant') {
    return {
      message: (role, count) =>
        state === 'pending'
          ? `${role} 角色的翻譯發佈核准仍在等待中，其他頁面有 ${count} 個翻譯警告。`
          : `${role} 角色需要翻譯發佈核准，才能在其他頁面仍有 ${count} 個翻譯警告時發佈。`,
      hint: '請等待擁有者或管理員核准此翻譯發佈要求。',
      action: '檢視全部翻譯',
    };
  }
  if (locale === 'en') {
    return {
      message: (role, count) =>
        state === 'pending'
          ? `Translation release approval for the ${role} role is still pending while ${count} other-page warning${count === 1 ? '' : 's'} remain.`
          : `The ${role} role requires translation release approval before publishing with ${count} other-page warning${count === 1 ? '' : 's'}.`,
      hint: 'Wait for an owner or admin to approve this translation release request.',
      action: 'Review all translations',
    };
  }
  return {
    message: (role, count) =>
      state === 'pending'
        ? `${role} 역할의 번역 릴리스 승인이 아직 대기 중입니다. 다른 페이지 번역 경고 ${count}개가 남아 있습니다.`
        : `${role} 역할은 다른 페이지 번역 경고 ${count}개가 남아 있을 때 번역 릴리스 승인이 필요합니다.`,
    hint: '소유자 또는 관리자가 이 번역 릴리스 요청을 승인할 때까지 기다리세요.',
    action: '전체 번역 검토',
  };
}

export function buildTranslationReleaseApprovalBlocker(input: {
  readonly locale: Locale;
  readonly role: BuilderRoleName;
  readonly state: 'required' | 'pending';
  readonly summary: TranslationSiteWarningSummary;
}): CheckResult {
  const copy = approvalCopy(input.locale, input.state);
  return {
    id: input.state === 'pending'
      ? 'translation-release-approval-pending'
      : 'translation-release-approval-required',
    severity: 'blocker',
    category: 'translations',
    message: copy.message(input.role, input.summary.otherPageCount),
    fixHint: copy.hint,
    action: {
      href: input.summary.reviewHref,
      label: copy.action,
    },
  };
}

export async function evaluateTranslationReleaseApprovalRequirement(input: {
  readonly siteId: string;
  readonly pageId: string;
  readonly locale: Locale;
  readonly actorUsername: string;
  readonly policy: TranslationReleasePolicy;
  readonly summary?: TranslationSiteWarningSummary;
}): Promise<TranslationReleaseApprovalRequirement> {
  const role = await resolveUserRole(input.actorUsername);
  const approvalApplies =
    input.policy.mode === 'acknowledge-other-page-warnings'
    && input.policy.approvalRequiredForRoles.includes(role)
    && (input.summary?.otherPageCount ?? 0) > 0;

  if (!approvalApplies || !input.summary) {
    return { state: 'not-required', role, policy: input.policy };
  }

  const latest = await getLatestTranslationReleaseApprovalForContext({
    siteId: input.policy.siteId,
    pageId: input.pageId,
    locale: input.locale,
    warningFingerprint: input.summary.warningFingerprint,
  });

  if (latest?.status === 'approved') {
    return {
      state: 'approved',
      role,
      policy: input.policy,
      summary: input.summary,
      approval: summarizeTranslationReleaseApproval(latest),
    };
  }

  if (latest?.status === 'pending') {
    return {
      state: 'pending',
      role,
      policy: input.policy,
      summary: input.summary,
      approval: summarizeTranslationReleaseApproval(latest),
      result: buildTranslationReleaseApprovalBlocker({
        locale: input.locale,
        role,
        state: 'pending',
        summary: input.summary,
      }),
    };
  }

  return {
    state: 'required',
    role,
    policy: input.policy,
    summary: input.summary,
    result: buildTranslationReleaseApprovalBlocker({
      locale: input.locale,
      role,
      state: 'required',
      summary: input.summary,
    }),
  };
}

export function applyTranslationReleaseApprovalToSuite(
  suite: PublishCheckSuite,
  requirement: TranslationReleaseApprovalRequirement,
): PublishCheckSuite {
  if (
    requirement.state !== 'required'
    && requirement.state !== 'pending'
  ) {
    return suite;
  }
  if (suite.results.some((result) => result.id === requirement.result.id)) return suite;
  const results = [...suite.results, requirement.result];
  return {
    ...suite,
    results,
    hasBlocker: true,
    blockerCount: suite.blockerCount + 1,
  };
}

export type { TranslationReleaseApprovalSummary };
