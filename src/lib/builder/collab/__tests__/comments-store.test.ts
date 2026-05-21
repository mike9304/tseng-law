import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import {
  createComment,
  deleteComment,
  listComments,
  reopenComment,
  resolveComment,
  sanitizeCommentBody,
} from '@/lib/builder/collab/comments-store';

let tempRoot: string;
let originalCwd: () => string;

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), 'collab-comments-'));
  originalCwd = process.cwd;
  // Redirect runtime-data into the temp dir so file writes don't leak.
  process.cwd = () => tempRoot;
});

afterEach(async () => {
  process.cwd = originalCwd;
  await rm(tempRoot, { recursive: true, force: true });
});

describe('comments-store', () => {
  it('creates and lists comments (unresolved first slice)', async () => {
    await createComment({
      siteId: 'default',
      pageId: 'home',
      author: 'alice',
      body: 'First',
    });
    await createComment({
      siteId: 'default',
      pageId: 'home',
      author: 'bob',
      body: 'Second',
      nodeId: 'node-1',
    });

    const list = await listComments('default', 'home');
    expect(list).toHaveLength(2);
    expect(list[0].body).toBe('Second'); // newest first
    expect(list[0].nodeId).toBe('node-1');
    expect(list.every((c) => !c.resolvedAt)).toBe(true);
  });

  it('isolates threads per (siteId, pageId)', async () => {
    await createComment({ siteId: 'default', pageId: 'home', author: 'a', body: 'home' });
    await createComment({ siteId: 'default', pageId: 'about', author: 'a', body: 'about' });
    await createComment({ siteId: 'second', pageId: 'home', author: 'a', body: 'other' });

    expect(await listComments('default', 'home')).toHaveLength(1);
    expect(await listComments('default', 'about')).toHaveLength(1);
    expect(await listComments('second', 'home')).toHaveLength(1);
    expect(await listComments('default', 'never')).toHaveLength(0);
  });

  it('resolves, reopens, and filters resolved by default', async () => {
    const created = await createComment({
      siteId: 'default',
      pageId: 'home',
      author: 'alice',
      body: 'fix this',
    });
    const resolved = await resolveComment('default', 'home', created.id);
    expect(resolved?.resolvedAt).toBeDefined();

    expect(await listComments('default', 'home')).toHaveLength(0);
    const withResolved = await listComments('default', 'home', true);
    expect(withResolved).toHaveLength(1);
    expect(withResolved[0].resolvedAt).toBeDefined();

    const reopened = await reopenComment('default', 'home', created.id);
    expect(reopened?.resolvedAt).toBeUndefined();
    expect(await listComments('default', 'home')).toHaveLength(1);
  });

  it('deletes comments and rejects unknown ids', async () => {
    const created = await createComment({
      siteId: 'default',
      pageId: 'home',
      author: 'alice',
      body: 'gone',
    });
    expect(await deleteComment('default', 'home', created.id)).toBe(true);
    expect(await deleteComment('default', 'home', created.id)).toBe(false);
    expect(await listComments('default', 'home', true)).toHaveLength(0);
  });

  it('rejects empty bodies and trims input', async () => {
    expect(sanitizeCommentBody('  ')).toBeNull();
    expect(sanitizeCommentBody('  hello  ')).toBe('hello');
    await expect(
      createComment({ siteId: 'default', pageId: 'home', author: 'a', body: '  ' }),
    ).rejects.toThrow();
  });
});