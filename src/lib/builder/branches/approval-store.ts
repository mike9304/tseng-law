/**
 * F102 — File-backed approval request CRUD.
 *
 * Reviewer can approve or reject; both transitions are terminal. Pending
 * requests are listed for inbox surfaces.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import {
  type BuilderApprovalRequest,
  type BuilderApprovalStatus,
} from './approval-model';

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'approvals');
}

function fileFor(id: string): string {
  return path.join(rootDir(), `${id}.json`);
}

function makeApprovalId(): string {
  return `apv_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
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

async function readApprovalFile(id: string): Promise<BuilderApprovalRequest | null> {
  try {
    const text = await fs.readFile(fileFor(id), 'utf8');
    return JSON.parse(text) as BuilderApprovalRequest;
  } catch {
    return null;
  }
}

async function writeApprovalFile(req: BuilderApprovalRequest): Promise<void> {
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(fileFor(req.id), JSON.stringify(req, null, 2), 'utf8');
}

export async function requestApproval(input: {
  branchId: string;
  requestedBy: string;
  comment?: string;
}): Promise<BuilderApprovalRequest> {
  if (!input.branchId) throw new Error('branchId_required');
  const req: BuilderApprovalRequest = {
    id: makeApprovalId(),
    branchId: input.branchId,
    requestedBy: input.requestedBy,
    requestedAt: new Date().toISOString(),
    status: 'pending',
    comment: input.comment?.slice(0, 500),
  };
  await withLock(req.id, () => writeApprovalFile(req));
  return req;
}

export async function listApprovals(filter?: {
  branchId?: string;
  status?: BuilderApprovalStatus;
}): Promise<BuilderApprovalRequest[]> {
  let files: string[];
  try {
    files = await fs.readdir(rootDir());
  } catch {
    return [];
  }
  const results: BuilderApprovalRequest[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const text = await fs.readFile(path.join(rootDir(), file), 'utf8');
      const parsed = JSON.parse(text) as BuilderApprovalRequest;
      if (filter?.branchId && parsed.branchId !== filter.branchId) continue;
      if (filter?.status && parsed.status !== filter.status) continue;
      results.push(parsed);
    } catch {
      // skip
    }
  }
  results.sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1));
  return results;
}

export async function getApproval(id: string): Promise<BuilderApprovalRequest | null> {
  return readApprovalFile(id);
}

export async function approveRequest(
  id: string,
  reviewer: string,
  comment?: string,
): Promise<BuilderApprovalRequest | null> {
  return transition(id, 'approved', reviewer, comment);
}

export async function rejectRequest(
  id: string,
  reviewer: string,
  reason?: string,
): Promise<BuilderApprovalRequest | null> {
  return transition(id, 'rejected', reviewer, reason);
}

async function transition(
  id: string,
  next: 'approved' | 'rejected',
  reviewer: string,
  comment?: string,
): Promise<BuilderApprovalRequest | null> {
  return withLock(id, async () => {
    const current = await readApprovalFile(id);
    if (!current) return null;
    if (current.status !== 'pending') throw new Error('approval_already_resolved');
    const updated: BuilderApprovalRequest = {
      ...current,
      status: next,
      reviewedBy: reviewer,
      reviewedAt: new Date().toISOString(),
      comment: comment?.slice(0, 500) ?? current.comment,
    };
    await writeApprovalFile(updated);
    return updated;
  });
}

export async function getLatestApprovalForBranch(
  branchId: string,
): Promise<BuilderApprovalRequest | null> {
  const all = await listApprovals({ branchId });
  return all[0] ?? null;
}