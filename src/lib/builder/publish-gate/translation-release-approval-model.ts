import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';
import type { Locale } from '@/lib/locales';
import type { TranslationSiteWarningSummary } from './translation-site-summary';

export const TRANSLATION_RELEASE_APPROVAL_STATUSES = [
  'pending',
  'approved',
  'rejected',
] as const;

export type TranslationReleaseApprovalStatus =
  (typeof TRANSLATION_RELEASE_APPROVAL_STATUSES)[number];

export interface TranslationReleaseApprovalRequest {
  readonly id: string;
  readonly siteId: string;
  readonly pageId: string;
  readonly locale: Locale;
  readonly warningFingerprint: string;
  readonly summary: TranslationSiteWarningSummary;
  readonly requestedBy: string;
  readonly requestedRole: BuilderRoleName;
  readonly requestedAt: string;
  readonly status: TranslationReleaseApprovalStatus;
  readonly reviewedBy?: string;
  readonly reviewedAt?: string;
  readonly comment?: string;
}

export interface TranslationReleaseApprovalContext {
  readonly siteId: string;
  readonly pageId: string;
  readonly locale: Locale;
  readonly warningFingerprint: string;
}

export interface TranslationReleaseApprovalSummary {
  readonly id: string;
  readonly siteId: string;
  readonly pageId: string;
  readonly locale: Locale;
  readonly warningFingerprint: string;
  readonly requestedBy: string;
  readonly requestedRole: BuilderRoleName;
  readonly requestedAt: string;
  readonly status: TranslationReleaseApprovalStatus;
  readonly reviewedBy?: string;
  readonly reviewedAt?: string;
}

export interface TranslationReleaseApprovalRoleCount {
  readonly role: BuilderRoleName;
  readonly count: number;
}

export function summarizeTranslationReleaseApproval(
  request: TranslationReleaseApprovalRequest,
): TranslationReleaseApprovalSummary {
  return {
    id: request.id,
    siteId: request.siteId,
    pageId: request.pageId,
    locale: request.locale,
    warningFingerprint: request.warningFingerprint,
    requestedBy: request.requestedBy,
    requestedRole: request.requestedRole,
    requestedAt: request.requestedAt,
    status: request.status,
    reviewedBy: request.reviewedBy,
    reviewedAt: request.reviewedAt,
  };
}
