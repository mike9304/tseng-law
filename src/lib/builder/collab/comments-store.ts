/**
 * F97 — Canvas comments store (first slice).
 *
 * File-backed JSON under runtime-data/collab/comments/${siteId}/${pageId}.json
 * Mirrors the inline read/write pattern from builder/site/persistence.ts.
 * Each (siteId, pageId) gets a write-mutex to prevent racy double-writes
 * when multiple collaborators post simultaneously.
 *
 * Type name `BuilderCollabComment` deliberately avoids the
 * `CanvasComment` export already on collab-engine.ts.
 *
 * TODO(later): switch to Vercel Blob backend with the same isBlobBackend()
 * predicate used elsewhere in the builder.
 */

import { readFile, writeFile, mkdir, rename, rm } from 'fs/promises';
import path from 'path';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { reopenCommentRows, resolveCommentRows } from '@/lib/builder/collab/comments-store-rows';

export interface BuilderCollabComment {
  id: string;
  siteId: string;
  pageId: string;
  nodeId?: string;
  parentId?: string;
  assignee?: string;
  author: string;
  body: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface CommentsFile {
  version: 1;
  comments: BuilderCollabComment[];
}

const MAX_BODY_LEN = 4_000;
const MAX_ASSIGNEE_LEN = 80;

const writeQueues = new Map<string, Promise<void>>();

export class CommentParentNotFoundError extends Error {
  readonly parentId: string;

  constructor(parentId: string) { super(`Comment parent not found: ${parentId}`); this.name = 'CommentParentNotFoundError'; this.parentId = parentId; }
}

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'collab', 'comments');
}

function fileFor(siteId: string, pageId: string): string {
  return path.join(rootDir(), normalizeBuilderSiteId(siteId), `${pageId}.json`);
}

function queueKey(siteId: string, pageId: string): string {
  return `${normalizeBuilderSiteId(siteId)}:${pageId}`;
}

async function withLock<T>(siteId: string, pageId: string, task: () => Promise<T>): Promise<T> {
  const key = queueKey(siteId, pageId);
  const previous = writeQueues.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.catch(() => undefined).then(() => current);
  writeQueues.set(key, queued);

  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
    if (writeQueues.get(key) === queued) writeQueues.delete(key);
  }
}

async function readFileSafe(siteId: string, pageId: string): Promise<CommentsFile> {
  try {
    const text = await readFile(fileFor(siteId, pageId), 'utf8');
    const parsed = JSON.parse(text) as Partial<CommentsFile>;
    if (parsed && Array.isArray(parsed.comments)) {
      return { version: 1, comments: parsed.comments as BuilderCollabComment[] };
    }
  } catch { /* file missing or invalid → empty */ }
  return { version: 1, comments: [] };
}

// temp-write + rename so a crash mid-write can never leave a truncated
// destination; rename(2) is atomic on the same filesystem.
async function writeFileAtomic(siteId: string, pageId: string, file: CommentsFile): Promise<void> {
  const target = fileFor(siteId, pageId);
  await mkdir(path.dirname(target), { recursive: true });
  const tmpPath = `${target}.tmp-${process.pid}-${Math.random().toString(36).slice(2)}`;
  try {
    await writeFile(tmpPath, JSON.stringify(file), 'utf8');
    await rename(tmpPath, target);
  } catch (error) {
    await rm(tmpPath, { force: true }).catch(() => {});
    throw error;
  }
}

function generateCommentId(): string {
  return `cmt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sanitizeCommentBody(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_BODY_LEN) return trimmed.slice(0, MAX_BODY_LEN);
  return trimmed;
}

function sanitizeAssignee(input: string | undefined): string | undefined {
  const trimmed = input?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_ASSIGNEE_LEN);
}

export interface CreateCommentInput {
  siteId: string;
  pageId: string;
  author: string;
  body: string;
  nodeId?: string;
  parentId?: string;
  assignee?: string;
}

export interface ListCommentsOptions {
  includeResolved?: boolean;
  assignee?: string;
}

export async function createComment(input: CreateCommentInput): Promise<BuilderCollabComment> {
  const siteId = normalizeBuilderSiteId(input.siteId);
  const body = sanitizeCommentBody(input.body);
  if (!body) {
    throw new Error('Comment body must be a non-empty string');
  }
  return withLock(siteId, input.pageId, async () => {
    const file = await readFileSafe(siteId, input.pageId);
    if (input.parentId && !file.comments.some((comment) => comment.id === input.parentId)) {
      throw new CommentParentNotFoundError(input.parentId);
    }
    const assignee = sanitizeAssignee(input.assignee);
    const comment: BuilderCollabComment = {
      id: generateCommentId(),
      siteId,
      pageId: input.pageId,
      nodeId: input.nodeId,
      parentId: input.parentId,
      assignee,
      author: input.author,
      body,
      createdAt: new Date().toISOString(),
    };
    file.comments.push(comment);
    await writeFileAtomic(siteId, input.pageId, file);
    return comment;
  });
}

export async function listComments(
  siteId: string,
  pageId: string,
  options: ListCommentsOptions = {},
): Promise<BuilderCollabComment[]> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const file = await readFileSafe(normalizedSiteId, pageId);
  const assignee = sanitizeAssignee(options.assignee);
  const visibleItems = options.includeResolved
    ? file.comments
    : file.comments.filter((c) => !c.resolvedAt);
  const items = assignee
    ? visibleItems.filter((comment) => comment.assignee === assignee)
    : visibleItems;
  // Newest first — UI orders threads by recency.
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function patchComment(
  siteId: string,
  pageId: string,
  commentId: string,
  patch: (comment: BuilderCollabComment) => BuilderCollabComment,
): Promise<BuilderCollabComment | null> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  let updated: BuilderCollabComment | null = null;
  await withLock(normalizedSiteId, pageId, async () => {
    const file = await readFileSafe(normalizedSiteId, pageId);
    const idx = file.comments.findIndex((c) => c.id === commentId);
    if (idx < 0) return;
    const next = patch(file.comments[idx]);
    file.comments[idx] = next;
    await writeFileAtomic(normalizedSiteId, pageId, file);
    updated = next;
  });
  return updated;
}

export async function resolveComment(
  siteId: string,
  pageId: string,
  commentId: string,
  by?: string,
): Promise<BuilderCollabComment | null> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  let updated: BuilderCollabComment | null = null;
  await withLock(normalizedSiteId, pageId, async () => {
    const file = await readFileSafe(normalizedSiteId, pageId);
    const patch = resolveCommentRows(file.comments, commentId, by);
    if (!patch.updated) return;
    file.comments = patch.comments;
    updated = patch.updated;
    await writeFileAtomic(normalizedSiteId, pageId, file);
  });
  return updated;
}

export async function reopenComment(
  siteId: string,
  pageId: string,
  commentId: string,
): Promise<BuilderCollabComment | null> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  let updated: BuilderCollabComment | null = null;
  await withLock(normalizedSiteId, pageId, async () => {
    const file = await readFileSafe(normalizedSiteId, pageId);
    const patch = reopenCommentRows(file.comments, commentId);
    if (!patch.updated) return;
    file.comments = patch.comments;
    updated = patch.updated;
    await writeFileAtomic(normalizedSiteId, pageId, file);
  });
  return updated;
}

export async function assignComment(
  siteId: string,
  pageId: string,
  commentId: string,
  assignee?: string,
): Promise<BuilderCollabComment | null> {
  const nextAssignee = sanitizeAssignee(assignee);
  return patchComment(siteId, pageId, commentId, (comment) => {
    const next = { ...comment };
    if (nextAssignee) next.assignee = nextAssignee;
    else delete next.assignee;
    return next;
  });
}

export async function deleteComment(
  siteId: string,
  pageId: string,
  commentId: string,
): Promise<boolean> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  let deleted = false;
  await withLock(normalizedSiteId, pageId, async () => {
    const file = await readFileSafe(normalizedSiteId, pageId);
    const before = file.comments.length;
    file.comments = file.comments.filter((c) => c.id !== commentId);
    if (file.comments.length !== before) {
      await writeFileAtomic(normalizedSiteId, pageId, file);
      deleted = true;
    }
  });
  return deleted;
}
