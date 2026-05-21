import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const ORIGINAL_CWD = process.cwd();
let tmpRoot = '';

beforeEach(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'approval-test-'));
  process.chdir(tmpRoot);
  delete process.env.BLOB_READ_WRITE_TOKEN;
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('approval-store', () => {
  it('requests an approval in pending state', async () => {
    const { requestApproval } = await import('@/lib/builder/branches/approval-store');
    const req = await requestApproval({ branchId: 'br1', requestedBy: 'alice', comment: 'please review' });
    expect(req.status).toBe('pending');
    expect(req.branchId).toBe('br1');
    expect(req.comment).toBe('please review');
  });

  it('lists approvals filtered by branch and status', async () => {
    const { requestApproval, listApprovals, approveRequest } = await import('@/lib/builder/branches/approval-store');
    const a = await requestApproval({ branchId: 'br1', requestedBy: 'alice' });
    await requestApproval({ branchId: 'br2', requestedBy: 'alice' });
    await approveRequest(a.id, 'bob');

    const all = await listApprovals();
    expect(all).toHaveLength(2);

    const onlyBr1 = await listApprovals({ branchId: 'br1' });
    expect(onlyBr1.map((r) => r.id)).toEqual([a.id]);

    const pending = await listApprovals({ status: 'pending' });
    expect(pending.map((r) => r.branchId)).toEqual(['br2']);
  });

  it('approves a pending request', async () => {
    const { requestApproval, approveRequest } = await import('@/lib/builder/branches/approval-store');
    const req = await requestApproval({ branchId: 'br1', requestedBy: 'alice' });
    const approved = await approveRequest(req.id, 'bob', 'lgtm');
    expect(approved?.status).toBe('approved');
    expect(approved?.reviewedBy).toBe('bob');
    expect(approved?.comment).toBe('lgtm');
  });

  it('rejects a pending request', async () => {
    const { requestApproval, rejectRequest } = await import('@/lib/builder/branches/approval-store');
    const req = await requestApproval({ branchId: 'br1', requestedBy: 'alice' });
    const rejected = await rejectRequest(req.id, 'bob', 'needs work');
    expect(rejected?.status).toBe('rejected');
    expect(rejected?.comment).toBe('needs work');
  });

  it('refuses to re-decide a resolved request', async () => {
    const { requestApproval, approveRequest, rejectRequest } = await import('@/lib/builder/branches/approval-store');
    const req = await requestApproval({ branchId: 'br1', requestedBy: 'alice' });
    await approveRequest(req.id, 'bob');
    await expect(rejectRequest(req.id, 'bob')).rejects.toThrow('approval_already_resolved');
  });

  it('returns the latest approval for a branch', async () => {
    const { requestApproval, getLatestApprovalForBranch } = await import('@/lib/builder/branches/approval-store');
    await requestApproval({ branchId: 'br1', requestedBy: 'alice' });
    await new Promise((r) => setTimeout(r, 5));
    const second = await requestApproval({ branchId: 'br1', requestedBy: 'alice' });
    const latest = await getLatestApprovalForBranch('br1');
    expect(latest?.id).toBe(second.id);
  });
});