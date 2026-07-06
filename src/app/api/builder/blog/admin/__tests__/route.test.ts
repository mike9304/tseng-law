import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readNativeBlogAdminModel } from '@/lib/builder/blog/admin-storage';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { GET } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/blog/admin-storage', () => ({
  readNativeBlogAdminModel: vi.fn(),
}));

const model = {
  locale: 'ko',
  posts: [],
  categories: [],
  authors: [],
  stats: {
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
  },
};

const readNativeBlogAdminModelMock = vi.mocked(readNativeBlogAdminModel);
const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/blog/admin${query ? `?${query}` : ''}`);
}

describe('builder blog admin API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    readNativeBlogAdminModelMock.mockResolvedValue(model as never);
  });

  it('returns the admin model while preserving success response shape', async () => {
    const response = await GET(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(readNativeBlogAdminModelMock).toHaveBeenCalledWith('ko');
    expect(payload).toEqual({ ok: true, model });
  });

  it('returns localized validation errors', async () => {
    const response = await GET(request('locale=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '블로그 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(readNativeBlogAdminModelMock).not.toHaveBeenCalled();
  });

  it('returns localized admin load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    readNativeBlogAdminModelMock.mockRejectedValueOnce(new Error('blog admin secret leaked'));

    const response = await GET(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入部落格管理模型。',
      errorCode: 'blog_admin_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('blog admin secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/blog/admin] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
