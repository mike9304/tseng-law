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

import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';

export interface BuilderCollabComment {
  id: string;
  siteId: string;
  pageId: string;
  nodeId?: string;
  author: string;
  body: string;
  createdAt: string;
  resolvedAt?: string;
}

interface CommentsFile {
  version: 1;
  comments: BuilderCollabComment[];
}

const MAX_BODY_LEN = 4_000;

const writeQueues = new Map<string, Promise<void>>();

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

async function writeFileAtomic(siteId: string, pageId: string, file: CommentsFile): Promise<void> {
  const target = fileFor(siteId, pageId);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(file), 'utf8');
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

export interface CreateCommentInput {
  siteId: string;
  pageId: string;
  author: string;
  body: string;
  nodeId?: string;
}

export async function createComment(input: CreateCommentInput): Promise<BuilderCollabComment> {
  const siteId = normalizeBuilderSiteId(input.siteId);
  const body = sanitizeCommentBody(input.body);
  if (!body) {
    throw new Error('Comment body must be a non-empty string');
  }
  const comment: BuilderCollabComment = {
    id: generateCommentId(),
    siteId,
    pageId: input.pageId,
    nodeId: input.nodeId,
    author: input.author,
    body,
    createdAt: new Date().toISOString(),
  };
  await withLock(siteId, input.pageId, async () => {
    const file = await readFileSafe(siteId, input.pageId);
    file.comments.push(comment);
    await writeFileAtomic(siteId, input.pageId, file);
  });
  return comment;
}

export async function listComments(
  siteId: string,
  pageId: string,
  includeResolved = false,
): Promise<BuilderCollabComment[]> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const file = await readFileSafe(normalizedSiteId, pageId);
  const items = includeResolved
    ? file.comments
    : file.comments.filter((c) => !c.resolvedAt);
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
): Promise<BuilderCollabComment | null> {
  return patchComment(siteId, pageId, commentId, (comment) => ({
    ...comment,
    resolvedAt: comment.resolvedAt ?? new Date().toISOString(),
  }));
}

export async function reopenComment(
  siteId: string,
  pageId: string,
  commentId: string,
): Promise<BuilderCollabComment | null> {
  return patchComment(siteId, pageId, commentId, (comment) => {
    if (!comment.resolvedAt) return comment;
    const next = { ...comment };
    delete next.resolvedAt;
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