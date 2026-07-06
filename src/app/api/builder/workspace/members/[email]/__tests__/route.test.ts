import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  removeMember,
  updateMemberRole,
} from '@/lib/builder/workspace/workspace-store';
import { DELETE, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/workspace/workspace-store', () => ({
  removeMember: vi.fn(),
  updateMemberRole: vi.fn(),
}));

const member = {
  email: 'member@example.com',
  accountId: 'workspace-1',
  role: 'editor',
  addedAt: '2026-06-03T00:00:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const removeMemberMock = vi.mocked(removeMember);
const updateMemberRoleMock = vi.mocked(updateMemberRole);

function request(
  method: 'PATCH' | 'DELETE',
  query = '',
  body: string | unknown = { role: 'viewer', locale: 'ko' },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/members/member%40example.com${query ? `?${query}` : ''}`, {
    method,
    headers: method === 'PATCH' ? { 'content-type': 'application/json' } : {},
    body: method === 'PATCH' ? typeof body === 'string' ? body : JSON.stringify(body) : undefined,
  });
}

const params = { params: { email: 'member%40example.com' } };

describe('builder workspace member detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    updateMemberRoleMock.mockResolvedValue({ ...member, role: 'viewer' } as never);
    removeMemberMock.mockResolvedValue(true as never);
  });

  it('updates member roles while preserving success response shape', async () => {
    const response = await PATCH(request('PATCH', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-users',
    });
    expect(updateMemberRoleMock).toHaveBeenCalledWith('member@example.com', 'viewer');
    expect(payload).toEqual({ ok: true, member: { ...member, role: 'viewer' } });
  });

  it('returns localized missing-member errors on role updates', async () => {
    updateMemberRoleMock.mockResolvedValueOnce(null as never);

    const response = await PATCH(request('PATCH', 'locale=zh-hant', {
      role: 'viewer',
      locale: 'zh-hant',
    }), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到工作區成員。',
      errorCode: 'member_not_found',
    });
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await PATCH(request('PATCH', '', { role: 'bad', locale: 'zh-hant' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認工作區請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(updateMemberRoleMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await PATCH(request('PATCH', 'locale=en', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the workspace request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized owner protection errors without leaking store messages', async () => {
    updateMemberRoleMock.mockRejectedValueOnce(new Error('Cannot demote the only owner.'));

    const response = await PATCH(request('PATCH', 'locale=en', { role: 'viewer', locale: 'en' }), params);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: 'A workspace must keep at least one owner.',
      errorCode: 'owner_role_required',
    });
    expect(JSON.stringify(payload)).not.toContain('Cannot demote the only owner.');
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    updateMemberRoleMock.mockRejectedValueOnce(new Error('workspace member update secret leaked'));

    const response = await PATCH(request('PATCH', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '작업 공간 구성원 역할을 저장하지 못했습니다.',
      errorCode: 'member_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace member update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/members/:email] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('deletes members while preserving success response shape', async () => {
    const response = await DELETE(request('DELETE', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-users',
    });
    expect(removeMemberMock).toHaveBeenCalledWith('member@example.com');
    expect(payload).toEqual({ ok: true });
  });

  it('returns localized missing-member errors on deletes', async () => {
    removeMemberMock.mockResolvedValueOnce(false as never);

    const response = await DELETE(request('DELETE', 'locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到工作區成員。',
      errorCode: 'member_not_found',
    });
  });

  it('returns localized owner protection errors on deletes', async () => {
    removeMemberMock.mockRejectedValueOnce(new Error('Cannot remove the only owner.'));

    const response = await DELETE(request('DELETE', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: 'A workspace must keep at least one owner.',
      errorCode: 'owner_role_required',
    });
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    removeMemberMock.mockRejectedValueOnce(new Error('workspace member delete secret leaked'));

    const response = await DELETE(request('DELETE', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to remove the workspace member.',
      errorCode: 'member_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace member delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/members/:email] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
