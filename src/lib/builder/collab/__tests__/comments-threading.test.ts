import { describe, expect, it } from 'vitest';
import {
  buildCommentThreads,
  isThreadResolved,
  parseMentions,
  resolveThread,
  unresolveThread,
  type ThreadedComment,
} from '@/lib/builder/collab/comments-threading';

function mk(
  id: string,
  createdAt: string,
  overrides: Partial<ThreadedComment> = {},
): ThreadedComment {
  return {
    id,
    siteId: 'default',
    pageId: 'home',
    author: 'alice',
    body: `body-${id}`,
    createdAt,
    ...overrides,
  };
}

describe('comments-threading: parseMentions', () => {
  it('extracts unique mentions, sorted, lowercased', () => {
    const out = parseMentions('hello @Alice and @bob, @alice again, @charlie-1');
    expect(out).toEqual(['alice', 'bob', 'charlie-1']);
  });

  it('returns empty array for no mentions or non-string input', () => {
    expect(parseMentions('plain text')).toEqual([]);
    expect(parseMentions('')).toEqual([]);
    expect(parseMentions(undefined as unknown as string)).toEqual([]);
  });

  it('does not match an @ followed by a digit (must start with a letter)', () => {
    expect(parseMentions('order #@1234 ping @bob')).toEqual(['bob']);
  });

  it('caps mention length and ignores too-long handles tail', () => {
    const huge = 'x'.repeat(40);
    const out = parseMentions(`@a${huge}`);
    expect(out).toHaveLength(1);
    expect(out[0].length).toBeLessThanOrEqual(31);
  });
});

describe('comments-threading: buildCommentThreads', () => {
  it('groups replies under their root by parentId', () => {
    const comments: ThreadedComment[] = [
      mk('r1', '2026-01-01T00:00:00Z'),
      mk('r1-a', '2026-01-01T00:01:00Z', { parentId: 'r1' }),
      mk('r1-b', '2026-01-01T00:02:00Z', { parentId: 'r1' }),
      mk('r2', '2026-01-02T00:00:00Z'),
    ];
    const threads = buildCommentThreads(comments);
    expect(threads).toHaveLength(2);
    expect(threads[0].root.id).toBe('r1');
    expect(threads[0].replies.map((r) => r.id)).toEqual(['r1-a', 'r1-b']);
    expect(threads[1].root.id).toBe('r2');
    expect(threads[1].replies).toHaveLength(0);
  });

  it('flattens reply-of-reply under the original root', () => {
    const comments: ThreadedComment[] = [
      mk('r1', '2026-01-01T00:00:00Z'),
      mk('r1-a', '2026-01-01T00:01:00Z', { parentId: 'r1' }),
      mk('r1-a-1', '2026-01-01T00:02:00Z', { parentId: 'r1-a' }),
    ];
    const threads = buildCommentThreads(comments);
    expect(threads).toHaveLength(1);
    expect(threads[0].root.id).toBe('r1');
    expect(threads[0].replies.map((r) => r.id)).toEqual(['r1-a', 'r1-a-1']);
  });

  it('treats orphan reply (missing parent) as its own root', () => {
    const comments: ThreadedComment[] = [
      mk('r1', '2026-01-01T00:00:00Z'),
      mk('orphan', '2026-01-01T00:05:00Z', { parentId: 'missing-parent' }),
    ];
    const threads = buildCommentThreads(comments);
    expect(threads).toHaveLength(2);
    const orphan = threads.find((t) => t.root.id === 'orphan');
    expect(orphan).toBeDefined();
  });

  it('handles a cycle without infinite-looping', () => {
    const comments: ThreadedComment[] = [
      mk('a', '2026-01-01T00:00:00Z', { parentId: 'b' }),
      mk('b', '2026-01-01T00:01:00Z', { parentId: 'a' }),
    ];
    const threads = buildCommentThreads(comments);
    expect(threads.length).toBeGreaterThan(0);
    expect(threads.length).toBeLessThanOrEqual(2);
  });
});

describe('comments-threading: resolve / unresolve', () => {
  const seed: ThreadedComment[] = [
    mk('r1', '2026-01-01T00:00:00Z'),
    mk('r1-a', '2026-01-01T00:01:00Z', { parentId: 'r1' }),
    mk('r2', '2026-01-02T00:00:00Z'),
  ];

  it('resolves root + all replies in a thread', () => {
    const out = resolveThread(seed, 'r1', 'reviewer-1', '2026-02-01T00:00:00Z');
    const r1 = out.find((c) => c.id === 'r1');
    const r1a = out.find((c) => c.id === 'r1-a');
    const r2 = out.find((c) => c.id === 'r2');
    expect(r1?.resolvedAt).toBe('2026-02-01T00:00:00Z');
    expect(r1?.resolvedBy).toBe('reviewer-1');
    expect(r1a?.resolvedAt).toBe('2026-02-01T00:00:00Z');
    expect(r2?.resolvedAt).toBeUndefined();
  });

  it('does not overwrite existing resolvedAt or resolvedBy', () => {
    const pre = seed.map((c): ThreadedComment =>
      c.id === 'r1' ? { ...c, resolvedAt: '2026-01-15T00:00:00Z', resolvedBy: 'someone' } : c,
    );
    const out = resolveThread(pre, 'r1', 'reviewer-2', '2026-02-01T00:00:00Z');
    const r1 = out.find((c) => c.id === 'r1');
    expect(r1?.resolvedAt).toBe('2026-01-15T00:00:00Z');
    expect(r1?.resolvedBy).toBe('someone');
  });

  it('unresolveThread clears the markers from the thread only', () => {
    const resolved = resolveThread(seed, 'r1', 'reviewer-1', '2026-02-01T00:00:00Z');
    const reopened = unresolveThread(resolved, 'r1');
    const r1 = reopened.find((c) => c.id === 'r1');
    const r1a = reopened.find((c) => c.id === 'r1-a');
    expect(r1?.resolvedAt).toBeUndefined();
    expect(r1?.resolvedBy).toBeUndefined();
    expect(r1a?.resolvedAt).toBeUndefined();
  });

  it('isThreadResolved reflects root resolved state', () => {
    const resolved = resolveThread(seed, 'r1', 'me', '2026-02-01T00:00:00Z');
    const [thread1, thread2] = buildCommentThreads(resolved);
    expect(isThreadResolved(thread1)).toBe(true);
    expect(isThreadResolved(thread2)).toBe(false);
  });

  it('returns input unchanged for an unknown threadId', () => {
    const out = resolveThread(seed, 'nonexistent', 'me', '2026-02-01T00:00:00Z');
    expect(out).toBe(seed);
  });

  it('refuses to resolve a non-root threadId', () => {
    // r1-a has a parentId so it is a reply, not a thread root.
    const out = resolveThread(seed, 'r1-a', 'me', '2026-02-01T00:00:00Z');
    expect(out).toBe(seed);
  });
});