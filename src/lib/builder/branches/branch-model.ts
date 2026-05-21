/**
 * F101 — Branch / variant model.
 *
 * A branch is a draft snapshot of one or more page canvases that can be
 * iterated on without touching the live draft. Merging copies each
 * snapshot back into the page's draft canvas.
 *
 * Storage: per-id file under runtime-data/branches/${id}.json (file-only;
 * no blob backend for v1).
 */

import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export type BuilderBranchStatus = 'draft' | 'merged' | 'discarded';

export interface BuilderBranchPageChange {
  /** Snapshot of the page canvas as edited inside the branch. */
  snapshot: BuilderCanvasDocument;
  /** Revision id (or any opaque ref) the snapshot was forked from. */
  basedOn: string;
}

export interface BuilderBranch {
  id: string;
  name: string;
  /** Revision id of the main draft when the branch was created. */
  baseRevisionId: string;
  createdAt: string;
  createdBy: string;
  status: BuilderBranchStatus;
  mergedAt?: string;
  discardedAt?: string;
  /** Optional reviewer comment captured on discard. */
  discardReason?: string;
  /** Per-page snapshot map. Keyed by pageId. */
  pageChanges: Record<string, BuilderBranchPageChange>;
}

export interface BuilderBranchSummary {
  id: string;
  name: string;
  status: BuilderBranchStatus;
  createdAt: string;
  createdBy: string;
  mergedAt?: string;
  baseRevisionId: string;
  pageCount: number;
}

export function summarizeBranch(branch: BuilderBranch): BuilderBranchSummary {
  return {
    id: branch.id,
    name: branch.name,
    status: branch.status,
    createdAt: branch.createdAt,
    createdBy: branch.createdBy,
    mergedAt: branch.mergedAt,
    baseRevisionId: branch.baseRevisionId,
    pageCount: Object.keys(branch.pageChanges ?? {}).length,
  };
}