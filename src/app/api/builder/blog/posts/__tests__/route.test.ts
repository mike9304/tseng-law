import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  listAllBlogPosts,
  listBlogPosts,
} from '@/lib/builder/blog/column-adapter';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/blog/column-adapter', () => ({
  listAllBlogPosts: vi.fn(),
  listBlogPosts: vi.fn(),
}));

const publishedPost = {
  postId: 'published-post',
  slug: 'published-post',
  locale: 'ko',
  title: 'Published post',
  excerpt: 'Published excerpt',
  bodyHtml: '<p>Published body</p>',
  bodyMarkdown: 'Published body',
  author: { name: 'Author One' },
  category: 'general',
  tags: ['company'],
  readingTimeMinutes: 1,
  publishedAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
  featured: true,
};

const draftPost = {
  ...publishedPost,
  postId: 'draft-post',
  slug: 'draft-post',
  title: 'Draft post',
  featured: false,
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const listAllBlogPostsMock = vi.mocked(listAllBlogPosts);
const listBlogPostsMock = vi.mocked(listBlogPosts);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/blog/posts${query ? `?${query}` : ''}`);
}

describe('builder blog posts API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'editor@example.test',
      permission: 'edit-blog',
    });
    listBlogPostsMock.mockResolvedValue([publishedPost] as never);
    listAllBlogPostsMock.mockResolvedValue([publishedPost, draftPost] as never);
  });

  it('returns published posts while preserving success response shape', async () => {
    const response = await GET(request('locale=ko&sort=newest&limit=9'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(listBlogPostsMock).toHaveBeenCalledWith('ko');
    expect(guardBuilderReadWithPermissionMock).not.toHaveBeenCalled();
    expect(payload).toEqual({
      ok: true,
      locale: 'ko',
      total: 1,
      posts: [publishedPost],
    });
  });

  it('requires builder read auth before returning all posts', async () => {
    const response = await GET(request('locale=ko&scope=all&limit=100'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'edit-blog',
    );
    expect(listAllBlogPostsMock).toHaveBeenCalledWith('ko');
    expect(payload).toEqual({
      ok: true,
      locale: 'ko',
      total: 2,
      posts: [publishedPost, draftPost],
    });
  });

  it('returns guard responses for unauthorized all-post requests', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }),
    );

    const response = await GET(request('locale=ko&scope=all'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({ ok: false, error: 'unauthorized' });
    expect(listAllBlogPostsMock).not.toHaveBeenCalled();
  });

  it('short-circuits missing edit-blog permission before reading draft posts', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-blog' }, { status: 403 }),
    );

    const requestWithDraftScope = request('locale=ko&scope=all');
    const response = await GET(requestWithDraftScope);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing permission: edit-blog',
    });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      requestWithDraftScope,
      'edit-blog',
    );
    expect(listAllBlogPostsMock).not.toHaveBeenCalled();
    expect(listBlogPostsMock).not.toHaveBeenCalled();
  });

  it('returns localized validation errors', async () => {
    const response = await GET(request('locale=zh-hant&sort=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認部落格請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listBlogPostsMock).not.toHaveBeenCalled();
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listBlogPostsMock.mockRejectedValueOnce(new Error('blog posts secret leaked'));

    const response = await GET(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load blog posts.',
      errorCode: 'blog_posts_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('blog posts secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/blog/posts] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
