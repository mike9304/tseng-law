import type {
  TranslationReleaseApprovalReviewerReport,
} from '@/lib/builder/publish-gate/translation-release-approval-report';
import type {
  TranslationReleaseApprovalSummary,
} from '@/lib/builder/publish-gate/translation-release-approval-model';
import { TRANSLATION_RELEASE_APPROVAL_STATUSES } from '@/lib/builder/publish-gate/translation-release-approval-model';
import type {
  TranslationReleasePolicy,
  TranslationReleasePolicyMode,
} from '@/lib/builder/publish-gate/translation-release-policy';
import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';
import { isLocale } from '@/lib/locales';
import { parseApprovalReport } from './translation-release-settings-report-payload';

export const ROLE_OPTIONS = ['owner', 'admin', 'designer', 'editor', 'client'] as const satisfies readonly BuilderRoleName[];
export const POLICY_MODES = ['acknowledge-other-page-warnings', 'block-other-page-warnings'] as const;

export type TranslationReleaseApprovalCurrentActor = {
  readonly username: string;
};

type ApprovalPayload = {
  readonly approvals: readonly TranslationReleaseApprovalSummary[];
  readonly report: TranslationReleaseApprovalReviewerReport | null;
  readonly currentActor: TranslationReleaseApprovalCurrentActor | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isBuilderRoleName(value: unknown): value is BuilderRoleName {
  return typeof value === 'string' && ROLE_OPTIONS.some((role) => role === value);
}

export function isPolicyMode(value: unknown): value is TranslationReleasePolicyMode {
  return typeof value === 'string' && POLICY_MODES.some((mode) => mode === value);
}

function isApprovalStatus(value: unknown): value is TranslationReleaseApprovalSummary['status'] {
  return typeof value === 'string'
    && TRANSLATION_RELEASE_APPROVAL_STATUSES.some((status) => status === value);
}

export function parsePolicyPayload(payload: unknown): TranslationReleasePolicy | null {
  if (!isRecord(payload) || !isRecord(payload.policy)) return null;
  const { siteId, mode, approvalRequiredForRoles, updatedAt, updatedBy } = payload.policy;
  if (typeof siteId !== 'string' || !isPolicyMode(mode) || typeof updatedAt !== 'string') return null;
  const roles = Array.isArray(approvalRequiredForRoles)
    ? approvalRequiredForRoles.filter(isBuilderRoleName)
    : [];
  return {
    siteId,
    mode,
    approvalRequiredForRoles: roles,
    updatedAt,
    ...(typeof updatedBy === 'string' ? { updatedBy } : {}),
  };
}

function parseApproval(value: unknown): TranslationReleaseApprovalSummary | null {
  if (!isRecord(value)) return null;
  const { id, siteId, pageId, locale, warningFingerprint, requestedBy, requestedRole, requestedAt, status } = value;
  if (
    typeof id !== 'string'
    || typeof siteId !== 'string'
    || typeof pageId !== 'string'
    || typeof locale !== 'string'
    || !isLocale(locale)
    || typeof warningFingerprint !== 'string'
    || typeof requestedBy !== 'string'
    || !isBuilderRoleName(requestedRole)
    || typeof requestedAt !== 'string'
    || !isApprovalStatus(status)
  ) return null;
  return { id, siteId, pageId, locale, warningFingerprint, requestedBy, requestedRole, requestedAt, status };
}

function parseCurrentActor(value: unknown): TranslationReleaseApprovalCurrentActor | null {
  if (!isRecord(value) || typeof value.username !== 'string') return null;
  return { username: value.username };
}

export function parseApprovalPayload(payload: unknown): ApprovalPayload {
  if (!isRecord(payload) || !Array.isArray(payload.approvals)) {
    return { approvals: [], report: null, currentActor: null };
  }
  return {
    approvals: payload.approvals.flatMap((entry) => {
      const approval = parseApproval(entry);
      return approval ? [approval] : [];
    }),
    report: parseApprovalReport(payload.report),
    currentActor: parseCurrentActor(payload.currentActor),
  };
}
