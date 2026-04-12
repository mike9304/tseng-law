/**
 * Phase 10 — Collaboration & Review engine.
 *
 * COL-01: Comment/annotation model
 * COL-02: Review request workflow
 * COL-03: Change notification system
 * COL-04: Single-editor lock (MVP, before CRDT)
 * COL-05: Activity feed
 * COL-06: Role-based permissions
 */

import { get, put } from '@vercel/blob';

// ─── Comments ─────────────────────────────────────────────────────

export interface CanvasComment {
  id: string;
  pageId: string;
  nodeId?: string;
  position: { x: number; y: number };
  author: string;
  text: string;
  resolved: boolean;
  createdAt: string;
  replies: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
}

const COMMENTS_PREFIX = 'builder-collab/comments/';

export async function loadComments(pageId: string): Promise<CanvasComment[]> {
  try {
    const result = await get(`${COMMENTS_PREFIX}${pageId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as CanvasComment[];
    }
  } catch { /* empty */ }
  return [];
}

export async function saveComments(pageId: string, comments: CanvasComment[]): Promise<void> {
  await put(`${COMMENTS_PREFIX}${pageId}.json`, JSON.stringify(comments), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function addComment(
  pageId: string,
  comment: Omit<CanvasComment, 'id' | 'createdAt' | 'resolved' | 'replies'>,
): Promise<CanvasComment> {
  const comments = await loadComments(pageId);
  const newComment: CanvasComment = {
    ...comment,
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    resolved: false,
    createdAt: new Date().toISOString(),
    replies: [],
  };
  comments.push(newComment);
  await saveComments(pageId, comments);
  return newComment;
}

export async function resolveComment(pageId: string, commentId: string): Promise<void> {
  const comments = await loadComments(pageId);
  const comment = comments.find((c) => c.id === commentId);
  if (comment) {
    comment.resolved = true;
    await saveComments(pageId, comments);
  }
}

export async function addReply(
  pageId: string,
  commentId: string,
  author: string,
  text: string,
): Promise<void> {
  const comments = await loadComments(pageId);
  const comment = comments.find((c) => c.id === commentId);
  if (comment) {
    comment.replies.push({
      id: `reply-${Date.now()}`,
      author,
      text,
      createdAt: new Date().toISOString(),
    });
    await saveComments(pageId, comments);
  }
}

// ─── Editor Lock ──────────────────────────────────────────────────

export interface EditorLock {
  lockedBy: string;
  lockedAt: string;
  expiresAt: string;
  pageId: string;
}

const LOCK_PREFIX = 'builder-collab/locks/';
const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function acquireLock(pageId: string, userId: string): Promise<EditorLock | null> {
  const existing = await getLock(pageId);
  if (existing && existing.lockedBy !== userId && new Date(existing.expiresAt) > new Date()) {
    return null; // locked by someone else
  }
  const lock: EditorLock = {
    lockedBy: userId,
    lockedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + LOCK_DURATION_MS).toISOString(),
    pageId,
  };
  await put(`${LOCK_PREFIX}${pageId}.json`, JSON.stringify(lock), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
  return lock;
}

export async function getLock(pageId: string): Promise<EditorLock | null> {
  try {
    const result = await get(`${LOCK_PREFIX}${pageId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as EditorLock;
    }
  } catch { /* empty */ }
  return null;
}

export async function renewLock(pageId: string, userId: string): Promise<boolean> {
  const lock = await getLock(pageId);
  if (!lock || lock.lockedBy !== userId) return false;
  lock.expiresAt = new Date(Date.now() + LOCK_DURATION_MS).toISOString();
  await put(`${LOCK_PREFIX}${pageId}.json`, JSON.stringify(lock), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
  return true;
}

// ─── Activity Feed ────────────────────────────────────────────────

export interface ActivityEvent {
  id: string;
  type: 'edit' | 'publish' | 'comment' | 'review' | 'rollback';
  actor: string;
  pageId?: string;
  description: string;
  timestamp: string;
}

const ACTIVITY_PREFIX = 'builder-collab/activity/';

export async function logActivity(event: Omit<ActivityEvent, 'id' | 'timestamp'>): Promise<void> {
  const dateKey = new Date().toISOString().slice(0, 10);
  let events: ActivityEvent[] = [];
  try {
    const result = await get(`${ACTIVITY_PREFIX}${dateKey}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      events = JSON.parse(await new Response(result.stream).text()) as ActivityEvent[];
    }
  } catch { /* empty */ }
  events.push({
    ...event,
    id: `activity-${Date.now()}`,
    timestamp: new Date().toISOString(),
  });
  await put(`${ACTIVITY_PREFIX}${dateKey}.json`, JSON.stringify(events), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

// ─── Roles ────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'editor' | 'reviewer' | 'viewer';

export interface SiteUser {
  userId: string;
  email: string;
  role: UserRole;
  addedAt: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  owner: ['edit', 'publish', 'delete', 'manage-users', 'settings', 'review', 'comment'],
  editor: ['edit', 'publish', 'review', 'comment'],
  reviewer: ['review', 'comment'],
  viewer: ['comment'],
};

export function hasPermission(role: UserRole, action: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) || false;
}
