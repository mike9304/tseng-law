import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordSecurityUserEvent } from '@/lib/builder/audit/record';
import { BUILDER_PERMISSIONS } from '@/lib/builder/security/permissions';
import { rolePermissionMatrix } from '@/lib/builder/security/role-permissions';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import {
  listUserRoles,
  upsertUserRole,
} from '@/lib/builder/security/user-role-store';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'owner',
    permission: 'manage-roles',
  })),
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
  listUserRoles: vi.fn(),
  upsertUserRole: vi.fn(),
}));

const roleNames = ['owner', 'admin', 'designer', 'editor', 'client'] as const;

const userRecord = {
  username: 'designer@example.com',
  role: 'designer',
  addedAt: '2026-06-03T00:00:00.000Z',
  addedBy: 'owner',
};

const createInput = {
  username: 'designer@example.com',
  role: 'designer',
  locale: 'ko',
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const listUserRolesMock = vi.mocked(listUserRoles);
const upsertUserRoleMock = vi.mocked(upsertUserRole);
const userHasPermissionMock = vi.mocked(userHasPermission);
const recordSecurityUserEventMock = vi.mocked(recordSecurityUserEvent);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/security/users${query ? `?${query}` : ''}`);
}

function postRequest(query = '', body: string | unknown = createInput): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/security/users${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder security users API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'owner',
      permission: 'manage-roles',
    });
    guardMutationMock.mockResolvedValue({ username: 'owner', permission: 'manage-roles' } as never);
    listUserRolesMock.mockResolvedValue([userRecord] as never);
    upsertUserRoleMock.mockResolvedValue(userRecord as never);
    userHasPermissionMock.mockResolvedValue(true as never);
  });

  it('returns user roles while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      total: 1,
      users: [userRecord],
      roles: roleNames,
      permissions: BUILDER_PERMISSIONS,
      matrix: rolePermissionMatrix(BUILDER_PERMISSIONS),
    });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-roles',
    );
  });

  it.each([
    ['unauthenticated', 401],
    ['authenticated without permission', 403],
  ])('returns %s denial without reading user-role data', async (_label, status) => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'missing_permission' }, { status }),
    );

    const response = await GET(getRequest('locale=en'));

    expect(response.status).toBe(status);
    expect(listUserRolesMock).not.toHaveBeenCalled();
    expect(upsertUserRoleMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listUserRolesMock.mockRejectedValueOnce(new Error('user role storage secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入使用者權限清單。',
      errorCode: 'users_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('user role storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/security/users] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await POST(postRequest('', {
      username: '',
      role: 'designer',
      locale: 'zh-hant',
    }));
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

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the user permissions request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized missing role-management permission errors', async () => {
    userHasPermissionMock.mockResolvedValueOnce(false as never);

    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({
      ok: false,
      error: '역할 관리 권한이 필요합니다.',
      errorCode: 'missing_manage_roles_permission',
    });
    expect(upsertUserRoleMock).not.toHaveBeenCalled();
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    upsertUserRoleMock.mockRejectedValueOnce(new Error('create user role secret leaked'));

    const response = await POST(postRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to add user permissions.',
      errorCode: 'user_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('create user role secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/security/users] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('creates user roles while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(upsertUserRoleMock).toHaveBeenCalledWith({
      username: 'designer@example.com',
      role: 'designer',
      addedBy: 'owner',
    });
    expect(recordSecurityUserEventMock).toHaveBeenCalledWith({
      request: expect.any(NextRequest),
      type: 'created',
      username: 'designer@example.com',
      role: 'designer',
    });
    expect(payload).toEqual({ ok: true, user: userRecord });
  });
});
