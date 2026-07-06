import { resolveThread, unresolveThread } from '@/lib/builder/collab/comments-threading';
import type { BuilderCollabComment } from '@/lib/builder/collab/comments-store';

export interface CommentRowsPatch {
  readonly comments: BuilderCollabComment[];
  readonly updated: BuilderCollabComment | null;
}

export function resolveCommentRows(
  comments: BuilderCollabComment[],
  commentId: string,
  by?: string,
  now: string = new Date().toISOString(),
): CommentRowsPatch {
  const target = comments.find((comment) => comment.id === commentId);
  if (!target) return { comments, updated: null };
  const nextComments = target.parentId
    ? comments.map((comment) => (comment.id === commentId ? {
      ...comment,
      resolvedAt: comment.resolvedAt ?? now,
      resolvedBy: comment.resolvedBy ?? by,
    } : comment))
    : resolveThread(comments, commentId, by ?? target.author, now);
  return {
    comments: nextComments,
    updated: nextComments.find((comment) => comment.id === commentId) ?? null,
  };
}

export function reopenCommentRows(
  comments: BuilderCollabComment[],
  commentId: string,
): CommentRowsPatch {
  const target = comments.find((comment) => comment.id === commentId);
  if (!target) return { comments, updated: null };
  const nextComments = target.parentId
    ? comments.map((comment) => {
      if (comment.id !== commentId) return comment;
      const next = { ...comment };
      delete next.resolvedAt;
      delete next.resolvedBy;
      return next;
    })
    : unresolveThread(comments, commentId);
  return {
    comments: nextComments,
    updated: nextComments.find((comment) => comment.id === commentId) ?? null,
  };
}
