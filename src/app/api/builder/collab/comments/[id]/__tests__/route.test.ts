import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  assignComment,
  deleteComment,
  reopenComment,
  resolveComment,
} from '@/lib/builder/collab/comments-store';
import { guardMutation } from '@/lib/builder/security/guard';
import { DELETE, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/collab/comments-store', () => ({
  assignComment: vi.fn(),
  deleteComment: vi.fn(),
  reopenComment: vi.fn(),
  resolveComment: vi.fn(),
}));

const comment = {
  id: 'cmt-1',
  siteId: 'site-1',
  pageId: 'page-1',
  author: 'editor@example.test',
  body: 'Resolved',
  createdAt: '2026-06-03T00:00:00.000Z',
  resolvedAt: '2026-06-03T00:01:00.000Z',
};

const assignCommentMock = vi.mocked(assignComment);
const deleteCommentMock = vi.mocked(deleteComment);
const guardMutationMock = vi.mocked(guardMutation);
const reopenCommentMock = vi.mocked(reopenComment);
const resolveCommentMock = vi.mocked(resolveComment);
const params = { params: Promise.resolve({ id: 'cmt-1' }) };

function request(method: string, query = '', body: unknown = { action: 'resolve' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/comments/cmt-1${query ? `?${query}` : ''}`, {
    method,
    body: method === 'DELETE'
      ? undefined
      : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function selectedSiteRequest(method: string, query = '', body: unknown = { action: 'resolve' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/comments/cmt-1${query ? `?${query}` : ''}`, {
    method,
    headers: {
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site',
    },
    body: method === 'DELETE'
      ? undefined
      : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder collab comment detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'editor@example.test' } as never);
    assignCommentMock.mockResolvedValue(comment as never);
    resolveCommentMock.mockResolvedValue(comment as never);
    reopenCommentMock.mockResolvedValue(comment as never);
    deleteCommentMock.mockResolvedValue(true as never);
  });

  it('updates comments while preserving success response shape', async () => {
    const response = await PATCH(request('PATCH', 'siteId=site-1&pageId=page-1&locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(resolveCommentMock).toHaveBeenCalledWith('site-1', 'page-1', 'cmt-1', 'editor@example.test');
    expect(payload).toEqual({ ok: true, comment });
  });

  it('updates comments for the selected builder site from the editor referrer', async () => {
    const response = await PATCH(selectedSiteRequest('PATCH', 'pageId=page-1&locale=ko'), params);

    expect(response.status).toBe(200);
    expect(resolveCommentMock).toHaveBeenCalledWith('workspace-site', 'page-1', 'cmt-1', 'editor@example.test');
  });

  it('assigns comments while preserving success response shape', async () => {
    const response = await PATCH(
      request('PATCH', 'siteId=site-1&pageId=page-1&locale=ko', {
        action: 'assign',
        assignee: 'reviewer-1',
      }),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(assignCommentMock).toHaveBeenCalledWith('site-1', 'page-1', 'cmt-1', 'reviewer-1');
    expect(payload).toEqual({ ok: true, comment });
  });

  it('returns localized not-found errors', async () => {
    resolveCommentMock.mockResolvedValueOnce(null as never);

    const response = await PATCH(request('PATCH', 'siteId=site-1&pageId=page-1&locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Comment not found.',
      errorCode: 'comment_not_found',
    });
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteCommentMock.mockRejectedValueOnce(new Error('delete comment secret leaked'));

    const response = await DELETE(request('DELETE', 'siteId=site-1&pageId=page-1&locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '댓글을 삭제하지 못했습니다.',
      errorCode: 'comment_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('delete comment secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/collab/comments/:id] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
