import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteMember,
  getMember,
  publicMember,
  updateMemberAdmin,
} from '@/lib/builder/members/members-engine';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import { DELETE, GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin-1' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  deleteMember: vi.fn(),
  getMember: vi.fn(),
  publicMember: vi.fn((member: unknown) => member),
  updateMemberAdmin: vi.fn(),
}));

const member = {
  memberId: 'member-1',
  email: 'member@example.com',
  name: 'Member One',
  phone: '+886-2-1234-5678',
  role: 'free',
  verified: true,
  blocked: false,
  createdAt: '2026-06-03T00:00:00.000Z',
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const deleteMemberMock = vi.mocked(deleteMember);
const getMemberMock = vi.mocked(getMember);
const publicMemberMock = vi.mocked(publicMember);
const updateMemberAdminMock = vi.mocked(updateMemberAdmin);

function request(
  method: 'GET' | 'PATCH' | 'DELETE',
  query = '',
  body: string | unknown = {
    name: 'Member Updated',
    phone: '+886-2-1111-2222',
    role: 'premium',
    verified: true,
    blocked: false,
    locale: 'ko',
  },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/members/member-1${query ? `?${query}` : ''}`, {
    method,
    headers: method === 'PATCH' ? { 'content-type': 'application/json' } : {},
    body: method === 'PATCH' ? typeof body === 'string' ? body : JSON.stringify(body) : undefined,
  });
}

const params = { params: Promise.resolve({ memberId: 'member-1' }) };

describe('builder member detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({ username: 'admin-1' });
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    getMemberMock.mockResolvedValue(member as never);
    updateMemberAdminMock.mockResolvedValue({ ...member, name: 'Member Updated', role: 'premium' } as never);
    deleteMemberMock.mockResolvedValue(undefined as never);
    publicMemberMock.mockImplementation((nextMember) => nextMember as never);
  });

  it('returns members while preserving detail success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, member });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-users',
    );
  });

  it.each([
    ['unauthenticated', 401],
    ['authenticated without permission', 403],
  ])('rejects %s detail GET before loading member data', async (_scenario, status) => {
    const blocked = NextResponse.json({ ok: false }, { status });
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(blocked);

    const response = await GET(request('GET', 'locale=en'), params);

    expect(response).toBe(blocked);
    expect(response.status).toBe(status);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-users',
    );
    expect(getMemberMock).not.toHaveBeenCalled();
    expect(publicMemberMock).not.toHaveBeenCalled();
  });

  it('returns localized missing-member errors', async () => {
    getMemberMock.mockResolvedValueOnce(null);

    const response = await GET(request('GET', 'locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到會員資料。',
      errorCode: 'member_not_found',
    });
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getMemberMock.mockRejectedValueOnce(new Error('member detail secret leaked'));

    const response = await GET(request('GET', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load member details.',
      errorCode: 'member_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('member detail secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/members/[memberId]] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized patch validation errors using the body locale', async () => {
    const response = await PATCH(request('PATCH', '', { role: 'bad', locale: 'zh-hant' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認會員管理請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(updateMemberAdminMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON patch errors using the query locale', async () => {
    const response = await PATCH(request('PATCH', 'locale=en', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the member admin request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns 403 when an authenticated caller lacks manage-users permission on PATCH', async () => {
    guardMutationMock.mockResolvedValueOnce(
      NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 }),
    );

    const response = await PATCH(request('PATCH', 'locale=ko'), params);

    expect(response.status).toBe(403);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-users',
    });
    expect(updateMemberAdminMock).not.toHaveBeenCalled();
  });

  it('updates members while preserving success response shape', async () => {
    const response = await PATCH(request('PATCH', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-users',
    });
    expect(updateMemberAdminMock).toHaveBeenCalledWith('member-1', {
      name: 'Member Updated',
      phone: '+886-2-1111-2222',
      role: 'premium',
      verified: true,
      blocked: false,
    });
    expect(payload).toEqual({ ok: true, member: { ...member, name: 'Member Updated', role: 'premium' } });
  });

  it('returns localized update fallback errors without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    updateMemberAdminMock.mockRejectedValueOnce(new Error('member update secret leaked'));

    const response = await PATCH(request('PATCH', 'locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法儲存會員資料。',
      errorCode: 'member_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('member update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/members/[memberId]] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns 403 when an authenticated caller lacks manage-users permission on DELETE', async () => {
    guardMutationMock.mockResolvedValueOnce(
      NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 }),
    );

    const response = await DELETE(request('DELETE', 'locale=ko'), params);

    expect(response.status).toBe(403);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-users',
    });
    expect(deleteMemberMock).not.toHaveBeenCalled();
  });

  it('deletes members while preserving success response shape', async () => {
    const response = await DELETE(request('DELETE', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-users',
    });
    expect(deleteMemberMock).toHaveBeenCalledWith('member-1');
    expect(payload).toEqual({ ok: true });
  });

  it('returns localized delete fallback errors without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteMemberMock.mockRejectedValueOnce(new Error('member delete secret leaked'));

    const response = await DELETE(request('DELETE', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '회원 삭제를 완료하지 못했습니다.',
      errorCode: 'member_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('member delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/members/[memberId]] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
