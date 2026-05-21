/**
 * F101 — File-backed branch CRUD + merge/discard.
 *
 * One JSON document per branch under runtime-data/branches/${id}.json.
 * Writes are serialized per-id to avoid lost updates.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { writePageCanvas } from '@/lib/builder/site/persistence';
import {
  type BuilderBranch,
  type BuilderBranchStatus,
  type BuilderBranchPageChange,
} from './branch-model';

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'branches');
}

function fileFor(id: string): string {
  return path.join(rootDir(), `${id}.json`);
}

function makeBranchId(): string {
  return `br_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

const writeQueues = new Map<string, Promise<void>>();

async function withLock<T>(id: string, task: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(id) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  writeQueues.set(id, previous.catch(() => undefined).then(() => current));
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
    if (writeQueues.get(id) === current) writeQueues.delete(id);
  }
}

async function readBranchFile(id: string): Promise<BuilderBranch | null> {
  try {
    const text = await fs.readFile(fileFor(id), 'utf8');
    return JSON.parse(text) as BuilderBranch;
  } catch {
    return null;
  }
}

async function writeBranchFile(branch: BuilderBranch): Promise<void> {
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(fileFor(branch.id), JSON.stringify(branch, null, 2), 'utf8');
}

export interface CreateBranchInput {
  name: string;
  baseRevisionId: string;
  createdBy: string;
}

export async function createBranch(input: CreateBranchInput): Promise<BuilderBranch> {
  const name = input.name?.trim();
  if (!name) throw new Error('branch_name_required');
  const branch: BuilderBranch = {
    id: makeBranchId(),
    name,
    baseRevisionId: input.baseRevisionId,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
    status: 'draft',
    pageChanges: {},
  };
  await withLock(branch.id, () => writeBranchFile(branch));
  return branch;
}

export async function listBranches(filter?: { status?: BuilderBranchStatus }): Promise<BuilderBranch[]> {
  let files: string[];
  try {
    files = await fs.readdir(rootDir());
  } catch {
    return [];
  }
  const branches: BuilderBranch[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const text = await fs.readFile(path.join(rootDir(), file), 'utf8');
      const parsed = JSON.parse(text) as BuilderBranch;
      if (filter?.status && parsed.status !== filter.status) continue;
      branches.push(parsed);
    } catch {
      // skip corrupt file
    }
  }
  branches.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return branches;
}

export async function getBranch(id: string): Promise<BuilderBranch | null> {
  return readBranchFile(id);
}

export async function updateBranchPage(
  id: string,
  pageId: string,
  snapshot: BuilderCanvasDocument,
  basedOn: string,
): Promise<BuilderBranch | null> {
  return withLock(id, async () => {
    const current = await readBranchFile(id);
    if (!current) return null;
    if (current.status !== 'draft') throw new Error('branch_not_editable');
    const change: BuilderBranchPageChange = { snapshot, basedOn };
    const next: BuilderBranch = {
      ...current,
      pageChanges: { ...current.pageChanges, [pageId]: change },
    };
    await writeBranchFile(next);
    return next;
  });
}

export interface MergeBranchOptions {
  /** When true, caller has verified approval requirement satisfied. */
  approved?: boolean;
  /** Site id whose pages will receive the snapshot. Defaults to 'default'. */
  siteId?: string;
  /** Recorded as updatedBy on the receiving page canvases. */
  mergedBy?: string;
  /** If site has requireApproval flag enabled, caller must pass true here. */
  requireApproval?: boolean;
}

export interface MergeBranchResult {
  branch: BuilderBranch;
  appliedPageIds: string[];
}

export async function mergeBranch(
  id: string,
  options: MergeBranchOptions = {},
): Promise<MergeBranchResult | null> {
  const siteId = options.siteId ?? 'default';
  return withLock(id, async () => {
    const current = await readBranchFile(id);
    if (!current) return null;
    if (current.status !== 'draft') throw new Error('branch_not_mergeable');
    if (options.requireApproval && !options.approved) {
      throw new Error('approval_required');
    }
    const appliedPageIds: string[] = [];
    for (const [pageId, change] of Object.entries(current.pageChanges)) {
      await writePageCanvas(siteId, pageId, 'draft', change.snapshot, {
        updatedBy: options.mergedBy ?? current.createdBy,
      });
      appliedPageIds.push(pageId);
    }
    const next: BuilderBranch = {
      ...current,
      status: 'merged',
      mergedAt: new Date().toISOString(),
    };
    await writeBranchFile(next);
    return { branch: next, appliedPageIds };
  });
}

export async function discardBranch(
  id: string,
  reason?: string,
): Promise<BuilderBranch | null> {
  return withLock(id, async () => {
    const current = await readBranchFile(id);
    if (!current) return null;
    if (current.status !== 'draft') return current;
    const next: BuilderBranch = {
      ...current,
      status: 'discarded',
      discardedAt: new Date().toISOString(),
      discardReason: reason?.slice(0, 280),
    };
    await writeBranchFile(next);
    return next;
  });
}

export async function deleteBranchFile(id: string): Promise<boolean> {
  return withLock(id, async () => {
    try {
      await fs.unlink(fileFor(id));
      return true;
    } catch {
      return false;
    }
  });
}