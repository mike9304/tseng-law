import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import {
  __resetReviewMarkersForTests,
  createReviewMarker,
  deleteReviewMarker,
  getReviewMarker,
  isReviewMarkerKind,
  listReviewMarkers,
  resolveReviewMarker,
  sanitizeMarkerText,
  unresolveReviewMarker,
  updateReviewMarker,
} from '@/lib/builder/collab/review-markers';

let tempRoot: string;
let originalCwd: () => string;

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), 'collab-review-markers-'));
  originalCwd = process.cwd;
  process.cwd = () => tempRoot;
  __resetReviewMarkersForTests();
});

afterEach(async () => {
  process.cwd = originalCwd;
  __resetReviewMarkersForTests();
  await rm(tempRoot, { recursive: true, force: true });
});

describe('review-markers: create and list', () => {
  it('creates a marker and reads it back via list and get', async () => {
    const marker = await createReviewMarker({
      siteId: 'default',
      pageId: 'home',
      nodeId: 'node-1',
      kind: 'todo',
      text: 'Fix this copy',
      createdBy: 'alice',
    });
    expect(marker.id).toMatch(/^rmk-/);
    expect(marker.resolvedAt).toBeUndefined();

    const list = await listReviewMarkers('default');
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(marker.id);

    const fetched = await getReviewMarker('default', marker.id);
    expect(fetched?.text).toBe('Fix this copy');
  });

  it('filters by pageId, nodeId, kind, and resolved state', async () => {
    await createReviewMarker({
      siteId: 'default',
      pageId: 'home',
      nodeId: 'n-1',
      kind: 'comment',
      text: 'a',
      createdBy: 'alice',
    });
    await createReviewMarker({
      siteId: 'default',
      pageId: 'home',
      nodeId: 'n-2',
      kind: 'todo',
      text: 'b',
      createdBy: 'alice',
    });
    const approval = await createReviewMarker({
      siteId: 'default',
      pageId: 'about',
      nodeId: 'n-3',
      kind: 'approval',
      text: 'c',
      createdBy: 'alice',
    });

    expect((await listReviewMarkers('default', { pageId: 'home' })).length).toBe(2);
    expect((await listReviewMarkers('default', { nodeId: 'n-1' })).length).toBe(1);
    expect((await listReviewMarkers('default', { kind: 'approval' }))[0].id).toBe(approval.id);

    await resolveReviewMarker('default', approval.id, 'reviewer');
    expect(await listReviewMarkers('default', { pageId: 'about' })).toHaveLength(0);
    expect(
      await listReviewMarkers('default', { pageId: 'about', includeResolved: true }),
    ).toHaveLength(1);
  });

  it('isolates markers per site', async () => {
    await createReviewMarker({
      siteId: 'site-a',
      pageId: 'home',
      nodeId: 'n-1',
      kind: 'comment',
      text: 'a',
      createdBy: 'alice',
    });
    await createReviewMarker({
      siteId: 'site-b',
      pageId: 'home',
      nodeId: 'n-1',
      kind: 'comment',
      text: 'b',
      createdBy: 'alice',
    });
    expect(await listReviewMarkers('site-a')).toHaveLength(1);
    expect(await listReviewMarkers('site-b')).toHaveLength(1);
    expect(await listReviewMarkers('site-c')).toHaveLength(0);
  });
});

describe('review-markers: update, resolve, delete', () => {
  it('updates text and kind, preserving createdAt and createdBy', async () => {
    const created = await createReviewMarker({
      siteId: 'default',
      pageId: 'home',
      nodeId: 'n-1',
      kind: 'comment',
      text: 'orig',
      createdBy: 'alice',
    });
    const updated = await updateReviewMarker('default', created.id, {
      text: 'edited',
      kind: 'todo',
    });
    expect(updated?.text).toBe('edited');
    expect(updated?.kind).toBe('todo');
    expect(updated?.createdAt).toBe(created.createdAt);
    expect(updated?.createdBy).toBe('alice');
  });

  it('resolves and reopens a marker', async () => {
    const m = await createReviewMarker({
      siteId: 'default',
      pageId: 'home',
      nodeId: 'n-1',
      kind: 'todo',
      text: 'check this',
      createdBy: 'alice',
    });
    const resolved = await resolveReviewMarker('default', m.id, 'bob');
    expect(resolved?.resolvedAt).toBeDefined();
    expect(resolved?.resolvedBy).toBe('bob');

    const reopened = await unresolveReviewMarker('default', m.id);
    expect(reopened?.resolvedAt).toBeUndefined();
    expect(reopened?.resolvedBy).toBeUndefined();
  });

  it('deletes a marker and returns false for unknown id on the second call', async () => {
    const m = await createReviewMarker({
      siteId: 'default',
      pageId: 'home',
      nodeId: 'n-1',
      kind: 'comment',
      text: 'gone',
      createdBy: 'alice',
    });
    expect(await deleteReviewMarker('default', m.id)).toBe(true);
    expect(await deleteReviewMarker('default', m.id)).toBe(false);
  });

  it('rejects invalid input on create', async () => {
    await expect(
      createReviewMarker({
        siteId: 'default',
        pageId: '',
        nodeId: 'n',
        kind: 'todo',
        text: 'x',
        createdBy: 'alice',
      }),
    ).rejects.toThrow();

    await expect(
      createReviewMarker({
        siteId: 'default',
        pageId: 'home',
        nodeId: 'n',
        kind: 'todo',
        text: '   ',
        createdBy: 'alice',
      }),
    ).rejects.toThrow();

    await expect(
      createReviewMarker({
        siteId: 'default',
        pageId: 'home',
        nodeId: 'n',
        // @ts-expect-error invalid kind for runtime test
        kind: 'oops',
        text: 'x',
        createdBy: 'alice',
      }),
    ).rejects.toThrow();
  });

  it('exposes guard helpers', () => {
    expect(isReviewMarkerKind('comment')).toBe(true);
    expect(isReviewMarkerKind('todo')).toBe(true);
    expect(isReviewMarkerKind('approval')).toBe(true);
    expect(isReviewMarkerKind('hmm')).toBe(false);
    expect(sanitizeMarkerText('  hello  ')).toBe('hello');
    expect(sanitizeMarkerText('')).toBeNull();
  });
});