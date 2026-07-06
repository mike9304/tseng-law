import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  createMember,
  listMembers,
  publicMember,
} from '@/lib/builder/members/members-engine';
import { guardMutation } from '@/lib/builder/security/guard';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  createMember: vi.fn(),
  listMembers: vi.fn(),
  publicMember: vi.fn((member: unknown) => member),
}));

const freeMember = {
  memberId: 'member-free',
  email: 'free@example.com',
  name: 'Free Member',
  role: 'free',
  verified: true,
  blocked: false,
  createdAt: '2026-06-01T00:00:00.000Z',
};

const premiumMember = {
  memberId: 'member-premium',
  email: 'premium@example.com',
  name: 'Premium Member',
  role: 'premium',
  verified: true,
  blocked: false,
  createdAt: '2026-06-03T00:00:00.000Z',
};

const createInput = {
  email: 'new@example.com',
  name: 'New Member',
  password: 'password123',
  role: 'premium',
  verified: true,
  locale: 'ko',
};

const createdMember = {
  memberId: 'member-new',
  email: 'new@example.com',
  name: 'New Member',
  role: 'premium',
  verified: true,
  blocked: false,
  createdAt: '2026-06-03T00:00:00.000Z',
};

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const createMemberMock = vi.mocked(createMember);
const listMembersMock = vi.mocked(listMembers);
const publicMemberMock = vi.mocked(publicMember);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/members${query ? `?${query}` : ''}`);
}

function postRequest(query = '', body: string | unknown = createInput): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/members${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder members API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    listMembersMock.mockResolvedValue([freeMember, premiumMember] as never);
    createMemberMock.mockResolvedValue(createdMember as never);
    publicMemberMock.mockImplementation((member) => member as never);
  });

  it('returns members while preserving the filtered success response shape', async () => {
    const response = await GET(getRequest('locale=en&role=premium'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, total: 1, members: [premiumMember] });
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listMembersMock.mockRejectedValueOnce(new Error('member storage secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入會員清單。',
      errorCode: 'members_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('member storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/members] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await POST(postRequest('', {
      email: 'bad',
      name: '',
      password: 'short',
      role: 'free',
      locale: 'zh-hant',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認會員管理請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(createMemberMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the member admin request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized duplicate-email errors without leaking engine messages', async () => {
    createMemberMock.mockRejectedValueOnce(new Error('이미 가입된 이메일입니다.'));

    const response = await POST(postRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: 'That email is already registered.',
      errorCode: 'duplicate_email',
    });
    expect(JSON.stringify(payload)).not.toContain('이미 가입된 이메일입니다.');
  });

  it('creates members while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(createMemberMock).toHaveBeenCalledWith({
      email: 'new@example.com',
      name: 'New Member',
      password: 'password123',
      role: 'premium',
      verified: true,
    });
    expect(payload).toEqual({ ok: true, member: createdMember });
  });
});
