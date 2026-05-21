import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import {
  CURSOR_TTL_MS,
  __resetPresenceCursorsForTests,
  clearCursor,
  listActiveCursors,
  setCursor,
} from '@/lib/builder/collab/presence-cursors';
import { colorForUsername } from '@/lib/builder/collab/presence-store';

let tempRoot: string;
let originalCwd: () => string;

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), 'collab-cursors-'));
  originalCwd = process.cwd;
  process.cwd = () => tempRoot;
  __resetPresenceCursorsForTests();
});

afterEach(async () => {
  process.cwd = originalCwd;
  __resetPresenceCursorsForTests();
  await rm(tempRoot, { recursive: true, force: true });
});

describe('presence-cursors', () => {
  it('sets a cursor and lists it back with deterministic color', async () => {
    const now = 1_000_000;
    const cursor = await setCursor(
      { siteId: 'default', userId: 'alice', pageId: 'home', x: 120, y: 240 },
      now,
    );
    expect(cursor.color).toBe(colorForUsername('alice'));
    expect(cursor.label).toBe('alice');
    expect(cursor.updatedAt).toBe(now);

    const list = await listActiveCursors('default', 'home', now + 100);
    expect(list).toHaveLength(1);
    expect(list[0].userId).toBe('alice');
  });

  it('upserts the same userId rather than appending', async () => {
    const t0 = 2_000_000;
    await setCursor({ siteId: 'default', userId: 'alice', pageId: 'home', x: 1, y: 2 }, t0);
    await setCursor(
      { siteId: 'default', userId: 'alice', pageId: 'home', x: 99, y: 88, nodeId: 'n-3' },
      t0 + 1_000,
    );
    const list = await listActiveCursors('default', 'home', t0 + 1_500);
    expect(list).toHaveLength(1);
    expect(list[0].x).toBe(99);
    expect(list[0].y).toBe(88);
    expect(list[0].nodeId).toBe('n-3');
    expect(list[0].updatedAt).toBe(t0 + 1_000);
  });

  it('prunes cursors past the TTL window', async () => {
    const t0 = 3_000_000;
    await setCursor({ siteId: 'default', userId: 'old', pageId: 'home', x: 0, y: 0 }, t0);
    await setCursor(
      { siteId: 'default', userId: 'fresh', pageId: 'home', x: 0, y: 0 },
      t0 + CURSOR_TTL_MS - 5,
    );

    const later = t0 + CURSOR_TTL_MS + 10;
    const list = await listActiveCursors('default', 'home', later);
    expect(list.map((c) => c.userId)).toEqual(['fresh']);
  });

  it('clears a cursor for a specific user', async () => {
    const t0 = 4_000_000;
    await setCursor({ siteId: 'default', userId: 'alice', pageId: 'home', x: 0, y: 0 }, t0);
    await setCursor({ siteId: 'default', userId: 'bob', pageId: 'home', x: 0, y: 0 }, t0 + 1);

    const removed = await clearCursor('alice', 'home', 'default', t0 + 5);
    expect(removed).toBe(true);
    const list = await listActiveCursors('default', 'home', t0 + 5);
    expect(list.map((c) => c.userId)).toEqual(['bob']);

    expect(await clearCursor('alice', 'home', 'default', t0 + 5)).toBe(false);
  });

  it('isolates cursors per (siteId, pageId)', async () => {
    const t0 = 5_000_000;
    await setCursor({ siteId: 'site-a', userId: 'alice', pageId: 'home', x: 0, y: 0 }, t0);
    await setCursor({ siteId: 'site-a', userId: 'alice', pageId: 'about', x: 0, y: 0 }, t0);
    await setCursor({ siteId: 'site-b', userId: 'alice', pageId: 'home', x: 0, y: 0 }, t0);

    expect(await listActiveCursors('site-a', 'home', t0 + 100)).toHaveLength(1);
    expect(await listActiveCursors('site-a', 'about', t0 + 100)).toHaveLength(1);
    expect(await listActiveCursors('site-b', 'home', t0 + 100)).toHaveLength(1);
    expect(await listActiveCursors('site-c', 'home', t0 + 100)).toEqual([]);
  });

  it('clamps coordinates and rejects invalid userId', async () => {
    await expect(
      setCursor({ siteId: 'default', userId: '   ', pageId: 'home', x: 0, y: 0 }),
    ).rejects.toThrow();

    const c = await setCursor({
      siteId: 'default',
      userId: 'alice',
      pageId: 'home',
      x: Number.POSITIVE_INFINITY,
      y: Number.NEGATIVE_INFINITY,
    });
    expect(Number.isFinite(c.x)).toBe(true);
    expect(Number.isFinite(c.y)).toBe(true);
  });
});