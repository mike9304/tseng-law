import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  ensureDefaultAccount,
  listMembers,
  listWorkspaceSites,
  updateAccountName,
} from '@/lib/builder/workspace/workspace-store';
import { GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/workspace/workspace-store', () => ({
  ensureDefaultAccount: vi.fn(),
  listMembers: vi.fn(),
  listWorkspaceSites: vi.fn(),
  updateAccountName: vi.fn(),
}));

const account = {
  id: 'workspace-1',
  name: 'Workspace',
  ownerEmail: 'owner@example.com',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const site = {
  siteId: 'main',
  name: 'Main',
  accountId: 'workspace-1',
  role: 'owner',
  createdAt: '2026-06-03T00:00:00.000Z',
};

const member = {
  email: 'owner@example.com',
  accountId: 'workspace-1',
  role: 'owner',
  addedAt: '2026-06-03T00:00:00.000Z',
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const ensureDefaultAccountMock = vi.mocked(ensureDefaultAccount);
const listMembersMock = vi.mocked(listMembers);
const listWorkspaceSitesMock = vi.mocked(listWorkspaceSites);
const updateAccountNameMock = vi.mocked(updateAccountName);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/account${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: string | unknown = { name: 'Workspace Updated', locale: 'ko' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/account${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder workspace account API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({ username: 'admin' });
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    ensureDefaultAccountMock.mockResolvedValue(account as never);
    listWorkspaceSitesMock.mockResolvedValue([site] as never);
    listMembersMock.mockResolvedValue([member] as never);
    updateAccountNameMock.mockResolvedValue({ ...account, name: 'Workspace Updated' } as never);
  });

  it('returns account overview while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(expect.any(NextRequest), 'settings');
    expect(payload).toEqual({
      ok: true,
      account,
      siteCount: 1,
      memberCount: 1,
      sites: [site],
    });
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    ensureDefaultAccountMock.mockRejectedValueOnce(new Error('workspace account secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入工作區帳號。',
      errorCode: 'account_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace account secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/account] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await PATCH(patchRequest('', { name: '', locale: 'zh-hant' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'settings',
    });
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認工作區請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(updateAccountNameMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await PATCH(patchRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the workspace request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    updateAccountNameMock.mockRejectedValueOnce(new Error('workspace update secret leaked'));

    const response = await PATCH(patchRequest('locale=en', { name: 'Workspace Updated', locale: 'en' }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to save the workspace account.',
      errorCode: 'account_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/account] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
