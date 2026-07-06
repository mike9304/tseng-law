import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CommentParentNotFoundError,
  createComment,
  listComments,
} from '@/lib/builder/collab/comments-store';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => null),
  guardMutation: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/collab/comments-store', () => ({
  CommentParentNotFoundError: class CommentParentNotFoundError extends Error {
    readonly parentId: string;

    constructor(parentId: string) {
      super(`Comment parent not found: ${parentId}`);
      this.name = 'CommentParentNotFoundError';
      this.parentId = parentId;
    }
  },
  createComment: vi.fn(),
  listComments: vi.fn(),
  sanitizeCommentBody: vi.fn((input: unknown) => {
    if (typeof input !== 'string') return null;
    const trimmed = input.trim();
    return trimmed || null;
  }),
}));

const comment = {
  id: 'cmt-1',
  siteId: 'site-1',
  pageId: 'page-1',
  author: 'editor@example.test',
  body: 'Looks good',
  createdAt: '2026-06-03T00:00:00.000Z',
};

const createCommentMock = vi.mocked(createComment);
const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const guardMutationMock = vi.mocked(guardMutation);
const listCommentsMock = vi.mocked(listComments);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/comments${query ? `?${query}` : ''}`);
}

function postRequest(query = '', body: unknown = { siteId: 'site-1', pageId: 'page-1', body: 'Looks good' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/comments${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function getSelectedSiteRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/comments${query ? `?${query}` : ''}`, {
    headers: {
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site',
    },
  });
}

function postSelectedSiteRequest(
  body: unknown = { siteId: 'default', pageId: 'page-1', body: 'Looks good' },
): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/collab/comments', {
    method: 'POST',
    headers: {
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder collab comments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue(null as never);
    guardMutationMock.mockResolvedValue({ username: 'editor@example.test' } as never);
    listCommentsMock.mockResolvedValue([comment] as never);
    createCommentMock.mockResolvedValue(comment as never);
  });

  it('returns comments while preserving success response shape', async () => {
    const response = await GET(getRequest('siteId=site-1&pageId=page-1&includeResolved=1&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(listCommentsMock).toHaveBeenCalledWith('site-1', 'page-1', {
      includeResolved: true,
      assignee: undefined,
    });
    expect(payload).toEqual({ ok: true, comments: [comment] });
  });

  it('lists comments for the selected builder site from the editor referrer', async () => {
    const response = await GET(getSelectedSiteRequest('pageId=page-1&locale=ko'));

    expect(response.status).toBe(200);
    expect(listCommentsMock).toHaveBeenCalledWith('workspace-site', 'page-1', {
      includeResolved: false,
      assignee: undefined,
    });
  });

  it('filters comments by assignee when requested', async () => {
    const response = await GET(getRequest('siteId=site-1&pageId=page-1&assignee=reviewer-1&locale=ko'));

    expect(response.status).toBe(200);
    expect(listCommentsMock).toHaveBeenCalledWith('site-1', 'page-1', {
      includeResolved: false,
      assignee: 'reviewer-1',
    });
  });

  it('creates comments for the selected builder site when clients send the legacy default site', async () => {
    const response = await POST(postSelectedSiteRequest());

    expect(response.status).toBe(200);
    expect(createCommentMock).toHaveBeenCalledWith({
      siteId: 'workspace-site',
      pageId: 'page-1',
      author: 'editor@example.test',
      body: 'Looks good',
      nodeId: undefined,
      parentId: undefined,
      assignee: undefined,
    });
  });

  it('returns localized validation errors', async () => {
    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認協作請求。',
      errorCode: 'invalid_request',
    });
    expect(listCommentsMock).not.toHaveBeenCalled();
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createCommentMock.mockRejectedValueOnce(new Error('comment secret leaked'));

    const response = await POST(postRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to create the comment.',
      errorCode: 'comment_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('comment secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/collab/comments] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized parent lookup failures for dangling replies', async () => {
    createCommentMock.mockRejectedValueOnce(new CommentParentNotFoundError('missing-parent') as never);

    const response = await POST(postRequest('locale=en', {
      siteId: 'site-1',
      pageId: 'page-1',
      body: 'Reply',
      parentId: 'missing-parent',
    }));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Comment not found.',
      errorCode: 'comment_not_found',
    });
  });
});
