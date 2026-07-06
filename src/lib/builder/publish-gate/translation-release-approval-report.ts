import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';
import {
  summarizeTranslationReleaseApprovalAssignments,
  type TranslationReleaseApprovalReviewerAssignment,
  type TranslationReleaseApprovalReviewerCandidate,
} from './translation-release-approval-assignments';
import type {
  TranslationReleaseApprovalRequest,
  TranslationReleaseApprovalRoleCount,
} from './translation-release-approval-model';

const APPROVAL_ROLE_ORDER = ['owner', 'admin', 'designer', 'editor', 'client'] as const satisfies readonly BuilderRoleName[];
const ESCALATION_THRESHOLD_MINUTES = 24 * 60;

export interface TranslationReleaseApprovalActorReport {
  readonly username: string;
  readonly requestedCount: number;
  readonly pendingRequestedCount: number;
  readonly approvedRequestedCount: number;
  readonly rejectedRequestedCount: number;
  readonly reviewedCount: number;
  readonly approvedDecisionCount: number;
  readonly rejectedDecisionCount: number;
  readonly lastActivityAt?: string;
}

export interface TranslationReleaseApprovalEscalationReport {
  readonly thresholdMinutes: number;
  readonly stalePendingCount: number;
  readonly staleByRole: readonly TranslationReleaseApprovalRoleCount[];
  readonly assignedReviewers: readonly TranslationReleaseApprovalReviewerAssignment[];
  readonly oldestStaleRequestedAt?: string;
  readonly oldestStaleAgeMinutes?: number;
}

export interface TranslationReleaseApprovalReviewerReport {
  readonly totalCount: number;
  readonly pendingCount: number;
  readonly approvedCount: number;
  readonly rejectedCount: number;
  readonly pendingByRole: readonly TranslationReleaseApprovalRoleCount[];
  readonly activityByUser: readonly TranslationReleaseApprovalActorReport[];
  readonly reviewerAssignments: readonly TranslationReleaseApprovalReviewerAssignment[];
  readonly escalation: TranslationReleaseApprovalEscalationReport;
  readonly oldestPendingRequestedAt?: string;
  readonly oldestPendingAgeMinutes?: number;
}

function ageMinutes(now: Date, requestedAt: string): number | undefined {
  const requestedAtMs = Date.parse(requestedAt);
  if (Number.isNaN(requestedAtMs)) return undefined;
  return Math.max(0, Math.floor((now.getTime() - requestedAtMs) / 60_000));
}

function emptyActorReport(username: string): TranslationReleaseApprovalActorReport {
  return {
    username,
    requestedCount: 0,
    pendingRequestedCount: 0,
    approvedRequestedCount: 0,
    rejectedRequestedCount: 0,
    reviewedCount: 0,
    approvedDecisionCount: 0,
    rejectedDecisionCount: 0,
  };
}

function withLastActivity(
  report: TranslationReleaseApprovalActorReport,
  activityAt: string,
): TranslationReleaseApprovalActorReport {
  if (report.lastActivityAt && report.lastActivityAt >= activityAt) return report;
  return { ...report, lastActivityAt: activityAt };
}

function actorReportFor(
  reports: ReadonlyMap<string, TranslationReleaseApprovalActorReport>,
  username: string,
): TranslationReleaseApprovalActorReport {
  return reports.get(username) ?? emptyActorReport(username);
}

function recordRequestActivity(
  reports: Map<string, TranslationReleaseApprovalActorReport>,
  approval: TranslationReleaseApprovalRequest,
): void {
  const current = withLastActivity(actorReportFor(reports, approval.requestedBy), approval.requestedAt);
  const next: TranslationReleaseApprovalActorReport = {
    ...current,
    requestedCount: current.requestedCount + 1,
    pendingRequestedCount: current.pendingRequestedCount + (approval.status === 'pending' ? 1 : 0),
    approvedRequestedCount: current.approvedRequestedCount + (approval.status === 'approved' ? 1 : 0),
    rejectedRequestedCount: current.rejectedRequestedCount + (approval.status === 'rejected' ? 1 : 0),
  };
  reports.set(approval.requestedBy, next);
}

function recordDecisionActivity(
  reports: Map<string, TranslationReleaseApprovalActorReport>,
  approval: TranslationReleaseApprovalRequest,
): void {
  if (!approval.reviewedBy || !approval.reviewedAt) return;
  const current = withLastActivity(actorReportFor(reports, approval.reviewedBy), approval.reviewedAt);
  const next: TranslationReleaseApprovalActorReport = {
    ...current,
    reviewedCount: current.reviewedCount + 1,
    approvedDecisionCount: current.approvedDecisionCount + (approval.status === 'approved' ? 1 : 0),
    rejectedDecisionCount: current.rejectedDecisionCount + (approval.status === 'rejected' ? 1 : 0),
  };
  reports.set(approval.reviewedBy, next);
}

function summarizeActorActivity(
  approvals: readonly TranslationReleaseApprovalRequest[],
): readonly TranslationReleaseApprovalActorReport[] {
  const reports = new Map<string, TranslationReleaseApprovalActorReport>();
  for (const approval of approvals) {
    recordRequestActivity(reports, approval);
    recordDecisionActivity(reports, approval);
  }
  return Array.from(reports.values()).sort((a, b) => a.username.localeCompare(b.username));
}

function roleCounts(counts: ReadonlyMap<BuilderRoleName, number>): readonly TranslationReleaseApprovalRoleCount[] {
  return APPROVAL_ROLE_ORDER.flatMap((role) => {
    const count = counts.get(role) ?? 0;
    return count > 0 ? [{ role, count }] : [];
  });
}

function summarizeEscalation(
  approvals: readonly TranslationReleaseApprovalRequest[],
  now: Date,
  reviewerCandidates: readonly TranslationReleaseApprovalReviewerCandidate[],
): TranslationReleaseApprovalEscalationReport {
  let stalePendingCount = 0;
  let oldestStaleRequestedAt: string | undefined;
  let oldestStaleAgeMinutes: number | undefined;
  const staleByRole = new Map<BuilderRoleName, number>();
  const staleApprovals: TranslationReleaseApprovalRequest[] = [];

  for (const approval of approvals) {
    const pendingAgeMinutes = approval.status === 'pending'
      ? ageMinutes(now, approval.requestedAt)
      : undefined;
    if (pendingAgeMinutes === undefined || pendingAgeMinutes < ESCALATION_THRESHOLD_MINUTES) continue;
    stalePendingCount += 1;
    staleApprovals.push(approval);
    staleByRole.set(approval.requestedRole, (staleByRole.get(approval.requestedRole) ?? 0) + 1);
    if (oldestStaleAgeMinutes === undefined || pendingAgeMinutes > oldestStaleAgeMinutes) {
      oldestStaleAgeMinutes = pendingAgeMinutes;
      oldestStaleRequestedAt = approval.requestedAt;
    }
  }

  return {
    thresholdMinutes: ESCALATION_THRESHOLD_MINUTES,
    stalePendingCount,
    staleByRole: roleCounts(staleByRole),
    assignedReviewers: summarizeTranslationReleaseApprovalAssignments(staleApprovals, reviewerCandidates),
    ...(oldestStaleRequestedAt ? { oldestStaleRequestedAt } : {}),
    ...(oldestStaleAgeMinutes === undefined ? {} : { oldestStaleAgeMinutes }),
  };
}

export function summarizeTranslationReleaseApprovalReviewerReport(
  approvals: readonly TranslationReleaseApprovalRequest[],
  now = new Date(),
  reviewerCandidates: readonly TranslationReleaseApprovalReviewerCandidate[] = [],
): TranslationReleaseApprovalReviewerReport {
  let pendingCount = 0;
  let approvedCount = 0;
  let rejectedCount = 0;
  let oldestPendingRequestedAt: string | undefined;
  const pendingByRole = new Map<BuilderRoleName, number>();

  for (const approval of approvals) {
    if (approval.status === 'pending') {
      pendingCount += 1;
      pendingByRole.set(approval.requestedRole, (pendingByRole.get(approval.requestedRole) ?? 0) + 1);
      if (!oldestPendingRequestedAt || approval.requestedAt < oldestPendingRequestedAt) {
        oldestPendingRequestedAt = approval.requestedAt;
      }
    } else if (approval.status === 'approved') {
      approvedCount += 1;
    } else {
      rejectedCount += 1;
    }
  }

  return {
    totalCount: approvals.length,
    pendingCount,
    approvedCount,
    rejectedCount,
    pendingByRole: roleCounts(pendingByRole),
    activityByUser: summarizeActorActivity(approvals),
    reviewerAssignments: summarizeTranslationReleaseApprovalAssignments(approvals, reviewerCandidates),
    escalation: summarizeEscalation(approvals, now, reviewerCandidates),
    ...(oldestPendingRequestedAt ? { oldestPendingRequestedAt } : {}),
    ...(oldestPendingRequestedAt
      ? { oldestPendingAgeMinutes: ageMinutes(now, oldestPendingRequestedAt) }
      : {}),
  };
}
