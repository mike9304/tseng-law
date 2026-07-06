import type { TranslationReleaseApprovalRequest } from '@/lib/builder/publish-gate/translation-release-approval-model';
import { hasRoleAccess } from '@/lib/builder/security/role-permissions';
import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';

const ASSIGNMENT_ROLE_RANK: Record<BuilderRoleName, number> = {
  owner: 0,
  admin: 1,
  designer: 2,
  editor: 3,
  client: 4,
};

export interface TranslationReleaseApprovalReviewerCandidate {
  readonly username: string;
  readonly role: BuilderRoleName;
}

export interface TranslationReleaseApprovalReviewerAssignment {
  readonly username: string;
  readonly role: BuilderRoleName;
  readonly assignedCount: number;
  readonly requestedRoles: readonly BuilderRoleName[];
}

function reviewerKey(username: string): string {
  return username.trim().toLowerCase();
}

function sameReviewer(a: string, b: string): boolean {
  return reviewerKey(a) === reviewerKey(b);
}

function compareCandidate(
  a: TranslationReleaseApprovalReviewerCandidate,
  b: TranslationReleaseApprovalReviewerCandidate,
): number {
  const roleDiff = ASSIGNMENT_ROLE_RANK[a.role] - ASSIGNMENT_ROLE_RANK[b.role];
  return roleDiff === 0 ? a.username.localeCompare(b.username) : roleDiff;
}

function compareAssignment(
  a: TranslationReleaseApprovalReviewerAssignment,
  b: TranslationReleaseApprovalReviewerAssignment,
): number {
  const roleDiff = ASSIGNMENT_ROLE_RANK[a.role] - ASSIGNMENT_ROLE_RANK[b.role];
  return roleDiff === 0 ? a.username.localeCompare(b.username) : roleDiff;
}

function eligibleReviewers(
  candidates: readonly TranslationReleaseApprovalReviewerCandidate[],
): readonly TranslationReleaseApprovalReviewerCandidate[] {
  const seen = new Set<string>();
  const eligible: TranslationReleaseApprovalReviewerCandidate[] = [];
  for (const candidate of candidates) {
    const key = reviewerKey(candidate.username);
    if (!key || seen.has(key) || !hasRoleAccess(candidate.role, 'settings')) continue;
    seen.add(key);
    eligible.push(candidate);
  }
  return eligible.sort(compareCandidate);
}

function mergeRequestedRole(
  roles: readonly BuilderRoleName[],
  role: BuilderRoleName,
): readonly BuilderRoleName[] {
  if (roles.some((existing) => existing === role)) return roles;
  return [...roles, role].sort((a, b) => ASSIGNMENT_ROLE_RANK[a] - ASSIGNMENT_ROLE_RANK[b]);
}

function withAssignedApproval(
  current: TranslationReleaseApprovalReviewerAssignment | undefined,
  candidate: TranslationReleaseApprovalReviewerCandidate,
  requestedRole: BuilderRoleName,
): TranslationReleaseApprovalReviewerAssignment {
  return {
    username: candidate.username,
    role: candidate.role,
    assignedCount: (current?.assignedCount ?? 0) + 1,
    requestedRoles: mergeRequestedRole(current?.requestedRoles ?? [], requestedRole),
  };
}

export function summarizeTranslationReleaseApprovalAssignments(
  approvals: readonly TranslationReleaseApprovalRequest[],
  candidates: readonly TranslationReleaseApprovalReviewerCandidate[],
): readonly TranslationReleaseApprovalReviewerAssignment[] {
  const reviewers = eligibleReviewers(candidates);
  const assignments = new Map<string, TranslationReleaseApprovalReviewerAssignment>();

  for (const approval of approvals) {
    if (approval.status !== 'pending') continue;
    for (const candidate of reviewers) {
      if (sameReviewer(candidate.username, approval.requestedBy)) continue;
      const key = reviewerKey(candidate.username);
      assignments.set(
        key,
        withAssignedApproval(assignments.get(key), candidate, approval.requestedRole),
      );
    }
  }

  return Array.from(assignments.values()).sort(compareAssignment);
}
