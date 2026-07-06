import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordSecurityUserEvent } from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import {
  removeUserRole,
  upsertUserRole,
} from '@/lib/builder/security/user-role-store';
import { DELETE, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'owner', permission: 'manage-roles' })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordSecurityUserEvent: vi.fn(),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  userHasPermission: vi.fn(),
}));

vi.mock('@/lib/builder/security/user-role-store', () => ({
  BUILDER_ROLE_NAMES: ['owner', 'admin', 'designer', 'editor', 'client'],
  removeUserRole: vi.fn(),
  upsertUserRole: vi.fn(),
}));

const updatedUserRecord = {
  username: 'designer@example.com',
  role: 'editor',
  addedAt: '2026-06-03T00:00:00.000Z',
  addedBy: 'owner',
};

const params = { params: { username: 'designer%40example.com' } };

const guardMutationMock = vi.mocked(guardMutation);
const removeUserRoleMock = vi.mocked(removeUserRole);
const upsertUserRoleMock = vi.mocked(upsertUserRole);
const userHasPermissionMock = vi.mocked(userHasPermission);
const recordSecurityUserEventMock = vi.mocked(recordSecurityUserEvent);

function patchRequest(query = '', body: string | unknown = { role: 'editor', locale: 'ko' }): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/security/users/designer%40example.com${query ? `?${query}` : ''}`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    },
  );
}

function deleteRequest(query = ''): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/security/users/designer%40example.com${query ? `?${query}` : ''}`,
    { method: 'DELETE' },
  );
}

describe('builder security user detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'owner', permission: 'manage-roles' } as never);
    removeUserRoleMock.mockResolvedValue(true as never);
    upsertUserRoleMock.mockResolvedValue(updatedUserRecord as never);
    userHasPermissionMock.mockResolvedValue(true as never);
  });

  it('updates user roles while preserving success response shape', async () => {
    const response = await PATCH(patchRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(upsertUserRoleMock).toHaveBeenCalledWith({
      username: 'designer@example.com',
      role: 'editor',
      addedBy: 'owner',
    });
    expect(recordSecurityUserEventMock).toHaveBeenCalledWith({
      request: expect.any(NextRequest),
      type: 'updated',
      username: 'designer@example.com',
      role: 'editor',
    });
    expect(payload).toEqual({ ok: true, user: updatedUserRecord });
  });

  it('returns localized patch validation errors using the body locale', async () => {
    const response = await PATCH(patchRequest('', { role: 'bad', locale: 'zh-hant' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認使用者權限請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(upsertUserRoleMock).not.toHaveBeenCalled();
    expect(recordSecurityUserEventMock).not.toHaveBeenCalled();
  });

  it('returns localized patch invalid JSON errors using the query locale', async () => {
    const response = await PATCH(patchRequest('locale=en', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the user permissions request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized missing role-management permission errors on patch', async () => {
    userHasPermissionMock.mockResolvedValueOnce(false as never);

    const response = await PATCH(patchRequest('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({
      ok: false,
      error: '역할 관리 권한이 필요합니다.',
      errorCode: 'missing_manage_roles_permission',
    });
    expect(upsertUserRoleMock).not.toHaveBeenCalled();
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    upsertUserRoleMock.mockRejectedValueOnce(new Error('update user role secret leaked'));

    const response = await PATCH(patchRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to save user permissions.',
      errorCode: 'user_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('update user role secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/security/users/[username]] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('deletes user roles while preserving success response shape', async () => {
    const response = await DELETE(deleteRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(removeUserRoleMock).toHaveBeenCalledWith('designer@example.com');
    expect(recordSecurityUserEventMock).toHaveBeenCalledWith({
      request: expect.any(NextRequest),
      type: 'removed',
      username: 'designer@example.com',
    });
  });

  it('returns localized missing users on delete', async () => {
    removeUserRoleMock.mockResolvedValueOnce(false as never);

    const response = await DELETE(deleteRequest('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到使用者權限。',
      errorCode: 'user_not_found',
    });
  });

  it('returns localized missing role-management permission errors on delete', async () => {
    userHasPermissionMock.mockResolvedValueOnce(false as never);

    const response = await DELETE(deleteRequest('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({
      ok: false,
      error: '需要角色管理權限。',
      errorCode: 'missing_manage_roles_permission',
    });
    expect(removeUserRoleMock).not.toHaveBeenCalled();
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    removeUserRoleMock.mockRejectedValueOnce(new Error('delete user role secret leaked'));

    const response = await DELETE(deleteRequest('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '사용자 권한을 삭제하지 못했습니다.',
      errorCode: 'user_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('delete user role secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/security/users/[username]] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
