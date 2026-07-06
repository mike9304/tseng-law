import type {
  TranslationReleaseApprovalReviewerAssignment,
} from '@/lib/builder/publish-gate/translation-release-approval-assignments';
import type {
  TranslationReleaseApprovalActorReport,
  TranslationReleaseApprovalEscalationReport,
  TranslationReleaseApprovalReviewerReport,
} from '@/lib/builder/publish-gate/translation-release-approval-report';
import type {
  TranslationReleaseApprovalRoleCount,
} from '@/lib/builder/publish-gate/translation-release-approval-model';
import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';

const REPORT_ROLE_OPTIONS = ['owner', 'admin', 'designer', 'editor', 'client'] as const satisfies readonly BuilderRoleName[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBuilderRoleName(value: unknown): value is BuilderRoleName {
  return typeof value === 'string' && REPORT_ROLE_OPTIONS.some((role) => role === value);
}

function parseRoleCount(value: unknown): TranslationReleaseApprovalRoleCount | null {
  if (!isRecord(value)) return null;
  const { role, count } = value;
  if (!isBuilderRoleName(role) || typeof count !== 'number' || !Number.isInteger(count) || count < 0) return null;
  return { role, count };
}

function parseNonnegativeInteger(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) return null;
  return value;
}

function parseActorReport(value: unknown): TranslationReleaseApprovalActorReport | null {
  if (!isRecord(value)) return null;
  const {
    username,
    requestedCount,
    pendingRequestedCount,
    approvedRequestedCount,
    rejectedRequestedCount,
    reviewedCount,
    approvedDecisionCount,
    rejectedDecisionCount,
    lastActivityAt,
  } = value;
  const parsedRequestedCount = parseNonnegativeInteger(requestedCount);
  const parsedPendingRequestedCount = parseNonnegativeInteger(pendingRequestedCount);
  const parsedApprovedRequestedCount = parseNonnegativeInteger(approvedRequestedCount);
  const parsedRejectedRequestedCount = parseNonnegativeInteger(rejectedRequestedCount);
  const parsedReviewedCount = parseNonnegativeInteger(reviewedCount);
  const parsedApprovedDecisionCount = parseNonnegativeInteger(approvedDecisionCount);
  const parsedRejectedDecisionCount = parseNonnegativeInteger(rejectedDecisionCount);
  if (
    typeof username !== 'string'
    || parsedRequestedCount === null
    || parsedPendingRequestedCount === null
    || parsedApprovedRequestedCount === null
    || parsedRejectedRequestedCount === null
    || parsedReviewedCount === null
    || parsedApprovedDecisionCount === null
    || parsedRejectedDecisionCount === null
  ) return null;
  return {
    username,
    requestedCount: parsedRequestedCount,
    pendingRequestedCount: parsedPendingRequestedCount,
    approvedRequestedCount: parsedApprovedRequestedCount,
    rejectedRequestedCount: parsedRejectedRequestedCount,
    reviewedCount: parsedReviewedCount,
    approvedDecisionCount: parsedApprovedDecisionCount,
    rejectedDecisionCount: parsedRejectedDecisionCount,
    ...(typeof lastActivityAt === 'string' ? { lastActivityAt } : {}),
  };
}

function parseReviewerAssignment(value: unknown): TranslationReleaseApprovalReviewerAssignment | null {
  if (!isRecord(value)) return null;
  const { username, role, assignedCount, requestedRoles } = value;
  const parsedAssignedCount = parseNonnegativeInteger(assignedCount);
  if (
    typeof username !== 'string'
    || !isBuilderRoleName(role)
    || parsedAssignedCount === null
    || !Array.isArray(requestedRoles)
  ) return null;
  return {
    username,
    role,
    assignedCount: parsedAssignedCount,
    requestedRoles: requestedRoles.filter(isBuilderRoleName),
  };
}

function parseEscalationReport(value: unknown): TranslationReleaseApprovalEscalationReport | null {
  if (!isRecord(value)) return null;
  const {
    thresholdMinutes,
    stalePendingCount,
    staleByRole,
    assignedReviewers,
    oldestStaleRequestedAt,
    oldestStaleAgeMinutes,
  } = value;
  const parsedThresholdMinutes = parseNonnegativeInteger(thresholdMinutes);
  const parsedStalePendingCount = parseNonnegativeInteger(stalePendingCount);
  if (
    parsedThresholdMinutes === null
    || parsedStalePendingCount === null
    || !Array.isArray(staleByRole)
  ) return null;
  return {
    thresholdMinutes: parsedThresholdMinutes,
    stalePendingCount: parsedStalePendingCount,
    staleByRole: staleByRole.flatMap((entry) => {
      const parsed = parseRoleCount(entry);
      return parsed ? [parsed] : [];
    }),
    assignedReviewers: Array.isArray(assignedReviewers)
      ? assignedReviewers.flatMap((entry) => {
        const parsed = parseReviewerAssignment(entry);
        return parsed ? [parsed] : [];
      })
      : [],
    ...(typeof oldestStaleRequestedAt === 'string' ? { oldestStaleRequestedAt } : {}),
    ...(typeof oldestStaleAgeMinutes === 'number' ? { oldestStaleAgeMinutes } : {}),
  };
}

export function parseApprovalReport(value: unknown): TranslationReleaseApprovalReviewerReport | null {
  if (!isRecord(value)) return null;
  const {
    totalCount,
    pendingCount,
    approvedCount,
    rejectedCount,
    pendingByRole,
    activityByUser,
    reviewerAssignments,
    escalation,
    oldestPendingRequestedAt,
    oldestPendingAgeMinutes,
  } = value;
  const parsedEscalation = parseEscalationReport(escalation);
  if (
    typeof totalCount !== 'number'
    || typeof pendingCount !== 'number'
    || typeof approvedCount !== 'number'
    || typeof rejectedCount !== 'number'
    || !Array.isArray(pendingByRole)
    || !Array.isArray(activityByUser)
    || !parsedEscalation
  ) return null;
  return {
    totalCount,
    pendingCount,
    approvedCount,
    rejectedCount,
    pendingByRole: pendingByRole.flatMap((entry) => {
      const parsed = parseRoleCount(entry);
      return parsed ? [parsed] : [];
    }),
    activityByUser: activityByUser.flatMap((entry) => {
      const parsed = parseActorReport(entry);
      return parsed ? [parsed] : [];
    }),
    reviewerAssignments: Array.isArray(reviewerAssignments)
      ? reviewerAssignments.flatMap((entry) => {
        const parsed = parseReviewerAssignment(entry);
        return parsed ? [parsed] : [];
      })
      : [],
    escalation: parsedEscalation,
    ...(typeof oldestPendingRequestedAt === 'string' ? { oldestPendingRequestedAt } : {}),
    ...(typeof oldestPendingAgeMinutes === 'number' ? { oldestPendingAgeMinutes } : {}),
  };
}
