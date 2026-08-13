import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readNativeBlogAdminModel } from '@/lib/builder/blog/admin-storage';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'edit-blog',
  })),
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
const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/blog/admin${query ? `?${query}` : ''}`);
}

describe('builder blog admin API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'edit-blog',
    });
    readNativeBlogAdminModelMock.mockResolvedValue(model as never);
  });

  it('returns the admin model while preserving success response shape', async () => {
    const req = request('locale=ko');
    const response = await GET(req);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-blog');
    expect(readNativeBlogAdminModelMock).toHaveBeenCalledWith('ko');
    expect(payload).toEqual({ ok: true, model });
  });

  it('short-circuits a missing edit-blog permission with 403', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-blog' }, { status: 403 }),
    );

    const req = request('locale=ko');
    const response = await GET(req);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-blog');
    expect(readNativeBlogAdminModelMock).not.toHaveBeenCalled();
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
