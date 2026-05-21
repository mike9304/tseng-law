/**
 * F102 — Approval request model.
 *
 * One approval doc per request, persisted under
 * runtime-data/approvals/${id}.json. A branch may collect multiple requests
 * over its lifetime — `getLatestApprovalForBranch` returns the most recent.
 */

export type BuilderApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface BuilderApprovalRequest {
  id: string;
  branchId: string;
  requestedBy: string;
  requestedAt: string;
  status: BuilderApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: string;
}

export interface BuilderApprovalSummary {
  id: string;
  branchId: string;
  status: BuilderApprovalStatus;
  requestedAt: string;
  reviewedAt?: string;
}

export function summarizeApproval(req: BuilderApprovalRequest): BuilderApprovalSummary {
  return {
    id: req.id,
    branchId: req.branchId,
    status: req.status,
    requestedAt: req.requestedAt,
    reviewedAt: req.reviewedAt,
  };
}