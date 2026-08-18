import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CommentParentNotFoundError,
  createComment,
  listComments,
} from '@/lib/builder/collab/comments-store';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { validateCsrf } from '@/lib/builder/security/csrf';
import {
  resolveReviewTarget,
  verifyReviewToken,
} from '@/lib/builder/security/review-tokens';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'editor@example.test' })),
  guardMutation: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/security/csrf', () => ({
  validateCsrf: vi.fn(() => null),
}));

vi.mock('@/lib/builder/security/review-tokens', () => ({
  resolveReviewTarget: vi.fn(),
  verifyReviewToken: vi.fn(),
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
const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const listCommentsMock = vi.mocked(listComments);
const resolveReviewTargetMock = vi.mocked(resolveReviewTarget);
const validateCsrfMock = vi.mocked(validateCsrf);
const verifyReviewTokenMock = vi.mocked(verifyReviewToken);

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

function reviewPostRequest(fields: Record<string, string> = {}): NextRequest {
  const body = new URLSearchParams({
    reviewToken: 'review-token',
    body: 'Client feedback',
    ...fields,
  });
  return new NextRequest('https://law.example.test/api/builder/collab/comments', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://law.example.test',
    },
    body: body.toString(),
  });
}

describe('builder collab comments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'editor@example.test',
      permission: 'view-cms',
    });
    guardMutationMock.mockResolvedValue({ username: 'editor@example.test' } as never);
    listCommentsMock.mockResolvedValue([comment] as never);
    createCommentMock.mockResolvedValue(comment as never);
    validateCsrfMock.mockReturnValue(null);
    verifyReviewTokenMock.mockResolvedValue({
      id: 'rev-1',
      branchOrPageId: 'published-page-1',
      audienceRole: 'client',
      createdBy: 'admin@example.test',
      expiresAt: '2026-07-31T00:00:00.000Z',
    });
    resolveReviewTargetMock.mockResolvedValue({
      siteId: 'tseng-law-main-site',
      pageId: 'published-page-1',
      publicPath: '/ko/review-target',
    });
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
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-cms',
    );
  });

  it('short-circuits missing view-cms permission before listing comments', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: view-cms' }, { status: 403 }),
    );

    const request = getRequest('siteId=site-1&pageId=page-1&locale=ko');
    const response = await GET(request);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing permission: view-cms',
    });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(request, 'view-cms');
    expect(listCommentsMock).not.toHaveBeenCalled();
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

  it('creates a review comment only on its persisted published target', async () => {
    const response = await POST(reviewPostRequest({
      siteId: 'attacker-site',
      pageId: 'attacker-page',
      author: 'Administrator',
      nodeId: 'attacker-node',
      parentId: 'attacker-parent',
      assignee: 'attacker-assignee',
    }));

    expect(response.status).toBe(200);
    expect(verifyReviewTokenMock).toHaveBeenCalledWith('review-token');
    expect(resolveReviewTargetMock).toHaveBeenCalledWith(expect.objectContaining({
      branchOrPageId: 'published-page-1',
      audienceRole: 'client',
    }));
    expect(guardMutationMock).not.toHaveBeenCalled();
    expect(createCommentMock).toHaveBeenCalledWith({
      siteId: 'tseng-law-main-site',
      pageId: 'published-page-1',
      author: 'Client reviewer',
      body: 'Client feedback',
    });
  });

  it('returns a controlled 401 when public review-token verification fails', async () => {
    verifyReviewTokenMock.mockResolvedValueOnce(null);

    const response = await POST(reviewPostRequest());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'Invalid review session.',
      errorCode: 'review_token_invalid',
    });
    expect(createCommentMock).not.toHaveBeenCalled();
  });

  it('fails closed when the persisted target is no longer public', async () => {
    resolveReviewTargetMock.mockResolvedValueOnce(null);

    const response = await POST(reviewPostRequest());

    expect(response.status).toBe(401);
    expect(createCommentMock).not.toHaveBeenCalled();
  });

  it('enforces CSRF before parsing a public review form', async () => {
    validateCsrfMock.mockReturnValueOnce(
      NextResponse.json({ ok: false, error: 'csrf_origin_mismatch' }, { status: 403 }),
    );

    const response = await POST(reviewPostRequest());

    expect(response.status).toBe(403);
    expect(verifyReviewTokenMock).not.toHaveBeenCalled();
    expect(createCommentMock).not.toHaveBeenCalled();
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
