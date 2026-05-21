/**
 * F97 — Comments threading (depth slice).
 *
 * Pure functions that operate on a flat list of comments and project them
 * into a tree of root threads and ordered replies. Mention parsing extracts
 * `@username` tokens from comment bodies.
 *
 * IMPORTANT: This module does NOT reach into `comments-store.ts` — it works
 * on its own `ThreadedComment` shape (a superset of `BuilderCollabComment`
 * with `parentId?` and `resolvedBy?`). Persistence helpers in comments-store
 * remain authoritative for storage; this module only transforms what's
 * already in memory. Callers are expected to do their own writes after
 * calling `resolveThread` / `unresolveThread`.
 */

import type { BuilderCollabComment } from '@/lib/builder/collab/comments-store';

export interface ThreadedComment extends BuilderCollabComment {
  parentId?: string;
  resolvedBy?: string;
}

export interface CommentThread {
  root: ThreadedComment;
  replies: ThreadedComment[];
}

const MENTION_REGEX = /@([A-Za-z][\w.-]{0,30})/g;

/**
 * Extract unique `@username` mentions from a body. Returns lowercased,
 * deduplicated, sorted usernames (leading `@` stripped). Allowed characters
 * after the leading letter: word chars, `-`, `.`.
 */
export function parseMentions(body: string): string[] {
  if (typeof body !== 'string' || !body) return [];
  const found = new Set<string>();
  MENTION_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MENTION_REGEX.exec(body)) !== null) {
    found.add(match[1].toLowerCase());
  }
  return [...found].sort();
}

/**
 * Build a forest of comment threads. Roots are comments without `parentId`;
 * replies attach to their root by following `parentId` transitively (a reply
 * to a reply is still attached to the original root).
 *
 * - Orphan replies (parent missing) are surfaced as their own roots so the
 *   UI never silently drops a comment.
 * - Roots are sorted oldest-first by `createdAt` so newest-discussion lives
 *   at the bottom; this matches how the UI lays out review feeds.
 * - Each thread's replies are sorted oldest-first internally.
 */
export function buildCommentThreads(comments: ThreadedComment[]): CommentThread[] {
  const byId = new Map<string, ThreadedComment>();
  for (const c of comments) {
    if (c && typeof c.id === 'string') byId.set(c.id, c);
  }

  // Resolve transitive parent → root mapping with a memo so we don't repeat
  // work for deep chains. Cycles fall back to treating the cycle starter as
  // its own root.
  const rootCache = new Map<string, string>();
  function findRootId(id: string, visited = new Set<string>()): string {
    if (rootCache.has(id)) return rootCache.get(id) as string;
    if (visited.has(id)) return id;
    visited.add(id);
    const comment = byId.get(id);
    if (!comment || !comment.parentId || !byId.has(comment.parentId)) {
      rootCache.set(id, id);
      return id;
    }
    const rootId = findRootId(comment.parentId, visited);
    rootCache.set(id, rootId);
    return rootId;
  }

  const buckets = new Map<string, ThreadedComment[]>();
  for (const c of comments) {
    if (!c || typeof c.id !== 'string') continue;
    const rootId = findRootId(c.id);
    const bucket = buckets.get(rootId) ?? [];
    bucket.push(c);
    buckets.set(rootId, bucket);
  }

  const threads: CommentThread[] = [];
  for (const [rootId, items] of buckets) {
    const root = byId.get(rootId);
    if (!root) continue;
    const replies = items.filter((c) => c.id !== rootId);
    replies.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    threads.push({ root, replies });
  }

  threads.sort((a, b) => a.root.createdAt.localeCompare(b.root.createdAt));
  return threads;
}

/**
 * Mark a thread (root + all replies) as resolved. Returns a NEW array with
 * patched copies; original input is not mutated. Resolution stamps
 * `resolvedAt` (only if not already set) and `resolvedBy`. The threadId is
 * the root comment id; if no root with that id exists, the input is
 * returned unchanged.
 */
export function resolveThread(
  comments: ThreadedComment[],
  threadId: string,
  by: string,
  now: string = new Date().toISOString(),
): ThreadedComment[] {
  if (!threadId || !comments.some((c) => c.id === threadId && !c.parentId)) {
    return comments;
  }
  const threads = buildCommentThreads(comments);
  const target = threads.find((t) => t.root.id === threadId);
  if (!target) return comments;
  const idsToResolve = new Set<string>([target.root.id, ...target.replies.map((r) => r.id)]);
  return comments.map((c) => {
    if (!idsToResolve.has(c.id)) return c;
    return {
      ...c,
      resolvedAt: c.resolvedAt ?? now,
      resolvedBy: c.resolvedBy ?? by,
    };
  });
}

/**
 * Inverse of `resolveThread`: clears `resolvedAt` and `resolvedBy` on the
 * thread root and all replies.
 */
export function unresolveThread(
  comments: ThreadedComment[],
  threadId: string,
): ThreadedComment[] {
  if (!threadId || !comments.some((c) => c.id === threadId && !c.parentId)) {
    return comments;
  }
  const threads = buildCommentThreads(comments);
  const target = threads.find((t) => t.root.id === threadId);
  if (!target) return comments;
  const idsToReopen = new Set<string>([target.root.id, ...target.replies.map((r) => r.id)]);
  return comments.map((c) => {
    if (!idsToReopen.has(c.id)) return c;
    const next: ThreadedComment = { ...c };
    delete next.resolvedAt;
    delete next.resolvedBy;
    return next;
  });
}

/**
 * Convenience predicate: a thread is "resolved" only when the root carries
 * a `resolvedAt`. Replies inherit resolved state for filtering purposes.
 */
export function isThreadResolved(thread: CommentThread): boolean {
  return Boolean(thread.root.resolvedAt);
}