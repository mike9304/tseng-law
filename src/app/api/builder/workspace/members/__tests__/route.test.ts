import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  addMember,
  ensureDefaultAccount,
  listMembers,
} from '@/lib/builder/workspace/workspace-store';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/workspace/workspace-store', () => ({
  addMember: vi.fn(),
  ensureDefaultAccount: vi.fn(),
  listMembers: vi.fn(),
}));

const account = {
  id: 'workspace-1',
  name: 'Workspace',
  ownerEmail: 'owner@example.com',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const member = {
  email: 'owner@example.com',
  accountId: 'workspace-1',
  role: 'owner',
  addedAt: '2026-06-03T00:00:00.000Z',
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const addMemberMock = vi.mocked(addMember);
const ensureDefaultAccountMock = vi.mocked(ensureDefaultAccount);
const listMembersMock = vi.mocked(listMembers);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/members${query ? `?${query}` : ''}`);
}

function postRequest(
  query = '',
  body: string | unknown = { email: 'new@example.com', role: 'viewer', locale: 'ko' },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/members${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder workspace members API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({ username: 'admin' });
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    ensureDefaultAccountMock.mockResolvedValue(account as never);
    listMembersMock.mockResolvedValue([member] as never);
    addMemberMock.mockResolvedValue({ ...member, email: 'new@example.com', role: 'viewer' } as never);
  });

  it('returns workspace members while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(expect.any(NextRequest), 'manage-users');
    expect(payload).toEqual({ ok: true, total: 1, members: [member] });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listMembersMock.mockRejectedValueOnce(new Error('workspace members secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入工作區成員清單。',
      errorCode: 'members_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace members secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/members] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await POST(postRequest('', { email: 'bad', locale: 'zh-hant' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認工作區請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(addMemberMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the workspace request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    addMemberMock.mockRejectedValueOnce(new Error('workspace member create secret leaked'));

    const response = await POST(postRequest('locale=en', {
      email: 'new@example.com',
      role: 'viewer',
      locale: 'en',
    }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to add the workspace member.',
      errorCode: 'member_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace member create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/members] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('creates workspace members while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-users',
    });
    expect(addMemberMock).toHaveBeenCalledWith({
      email: 'new@example.com',
      role: 'viewer',
    });
    expect(payload).toEqual({
      ok: true,
      member: { ...member, email: 'new@example.com', role: 'viewer' },
    });
  });
});
