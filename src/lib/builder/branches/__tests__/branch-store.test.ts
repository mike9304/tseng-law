import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

const ORIGINAL_CWD = process.cwd();
let tmpRoot = '';

beforeEach(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'branch-test-'));
  process.chdir(tmpRoot);
  delete process.env.BLOB_READ_WRITE_TOKEN;
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  await fs.rm(tmpRoot, { recursive: true, force: true });
});

function fakeDoc(slug: string): BuilderCanvasDocument {
  return {
    schemaVersion: 1,
    locale: 'ko',
    slug,
    nodes: [],
    updatedAt: new Date().toISOString(),
  } as unknown as BuilderCanvasDocument;
}

describe('branch-store', () => {
  it('creates a branch and lists it', async () => {
    const { createBranch, listBranches } = await import('@/lib/builder/branches/branch-store');
    const branch = await createBranch({ name: 'feature-x', baseRevisionId: 'rev-1', createdBy: 'admin' });
    expect(branch.status).toBe('draft');
    expect(branch.id).toMatch(/^br_/);
    const list = await listBranches();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('feature-x');
  });

  it('updates a branch page snapshot', async () => {
    const { createBranch, updateBranchPage, getBranch } = await import('@/lib/builder/branches/branch-store');
    const branch = await createBranch({ name: 'a', baseRevisionId: 'r', createdBy: 'admin' });
    const updated = await updateBranchPage(branch.id, 'page-1', fakeDoc('home'), 'r');
    expect(updated?.pageChanges['page-1']?.basedOn).toBe('r');
    const reloaded = await getBranch(branch.id);
    expect(Object.keys(reloaded?.pageChanges ?? {})).toEqual(['page-1']);
  });

  it('rejects edits to a non-draft branch', async () => {
    const { createBranch, discardBranch, updateBranchPage } = await import('@/lib/builder/branches/branch-store');
    const branch = await createBranch({ name: 'a', baseRevisionId: 'r', createdBy: 'admin' });
    await discardBranch(branch.id);
    await expect(updateBranchPage(branch.id, 'p', fakeDoc('x'), 'r')).rejects.toThrow('branch_not_editable');
  });

  it.skip('merges by writing per-page draft canvases', async () => {
    const writeMock = (await import('@/lib/builder/site/persistence')) as unknown as {
      writePageCanvas: (...args: unknown[]) => Promise<void>;
    };
    const calls: Array<{ pageId: string }> = [];
    const originalWrite = writeMock.writePageCanvas;
    writeMock.writePageCanvas = (async (
      _siteId: string,
      pageId: string,
    ) => {
      calls.push({ pageId });
    }) as typeof originalWrite;
    try {
      const { createBranch, updateBranchPage, mergeBranch, getBranch } = await import('@/lib/builder/branches/branch-store');
      const branch = await createBranch({ name: 'm', baseRevisionId: 'r', createdBy: 'admin' });
      await updateBranchPage(branch.id, 'page-1', fakeDoc('a'), 'r');
      await updateBranchPage(branch.id, 'page-2', fakeDoc('b'), 'r');
      const result = await mergeBranch(branch.id, { siteId: 'default', mergedBy: 'admin' });
      expect(result?.appliedPageIds.sort()).toEqual(['page-1', 'page-2']);
      const reloaded = await getBranch(branch.id);
      expect(reloaded?.status).toBe('merged');
      expect(reloaded?.mergedAt).toBeTruthy();
      expect(calls.map((c) => c.pageId).sort()).toEqual(['page-1', 'page-2']);
    } finally {
      writeMock.writePageCanvas = originalWrite;
    }
  });

  it('blocks merge when requireApproval is set and not approved', async () => {
    const { createBranch, mergeBranch } = await import('@/lib/builder/branches/branch-store');
    const branch = await createBranch({ name: 'gated', baseRevisionId: 'r', createdBy: 'admin' });
    await expect(
      mergeBranch(branch.id, { requireApproval: true, approved: false }),
    ).rejects.toThrow('approval_required');
  });

  it('discards a branch with a reason', async () => {
    const { createBranch, discardBranch } = await import('@/lib/builder/branches/branch-store');
    const branch = await createBranch({ name: 'd', baseRevisionId: 'r', createdBy: 'admin' });
    const discarded = await discardBranch(branch.id, 'no longer needed');
    expect(discarded?.status).toBe('discarded');
    expect(discarded?.discardReason).toBe('no longer needed');
  });
});