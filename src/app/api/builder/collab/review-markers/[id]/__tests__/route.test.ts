import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteReviewMarker,
  resolveReviewMarker,
  unresolveReviewMarker,
  updateReviewMarker,
} from '@/lib/builder/collab/review-markers';
import { guardMutation } from '@/lib/builder/security/guard';
import { DELETE, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/collab/review-markers', () => ({
  deleteReviewMarker: vi.fn(),
  isReviewMarkerKind: vi.fn((value: unknown) => (
    value === 'comment' || value === 'todo' || value === 'approval'
  )),
  resolveReviewMarker: vi.fn(),
  sanitizeMarkerText: vi.fn((input: unknown) => {
    if (typeof input !== 'string') return null;
    const trimmed = input.trim();
    return trimmed || null;
  }),
  unresolveReviewMarker: vi.fn(),
  updateReviewMarker: vi.fn(),
}));

const marker = {
  id: 'rmk-1',
  siteId: 'site-1',
  pageId: 'page-1',
  nodeId: 'node-1',
  kind: 'approval',
  text: 'Approved',
  createdBy: 'editor@example.test',
  createdAt: '2026-06-03T00:00:00.000Z',
};

const deleteReviewMarkerMock = vi.mocked(deleteReviewMarker);
const guardMutationMock = vi.mocked(guardMutation);
const resolveReviewMarkerMock = vi.mocked(resolveReviewMarker);
const unresolveReviewMarkerMock = vi.mocked(unresolveReviewMarker);
const updateReviewMarkerMock = vi.mocked(updateReviewMarker);
const params = { params: { id: 'rmk-1' } };

function request(method: string, query = '', body: unknown = { action: 'update', text: 'Approved', kind: 'approval' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/review-markers/rmk-1${query ? `?${query}` : ''}`, {
    method,
    body: method === 'DELETE'
      ? undefined
      : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function selectedSiteRequest(
  method: string,
  query = '',
  body: unknown = { action: 'resolve' },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/review-markers/rmk-1${query ? `?${query}` : ''}`, {
    method,
    headers: {
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site',
    },
    body: method === 'DELETE'
      ? undefined
      : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder collab review marker detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'editor@example.test' } as never);
    resolveReviewMarkerMock.mockResolvedValue(marker as never);
    unresolveReviewMarkerMock.mockResolvedValue(marker as never);
    updateReviewMarkerMock.mockResolvedValue(marker as never);
    deleteReviewMarkerMock.mockResolvedValue(true as never);
  });

  it('updates review markers while preserving success response shape', async () => {
    const response = await PATCH(request('PATCH', 'siteId=site-1&locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(updateReviewMarkerMock).toHaveBeenCalledWith('site-1', 'rmk-1', {
      text: 'Approved',
      kind: 'approval',
    });
    expect(payload).toEqual({ ok: true, marker });
  });

  it('resolves review markers for the selected builder site from the editor referrer', async () => {
    const response = await PATCH(selectedSiteRequest('PATCH', 'locale=ko'), params);

    expect(response.status).toBe(200);
    expect(resolveReviewMarkerMock).toHaveBeenCalledWith('workspace-site', 'rmk-1', 'editor@example.test');
  });

  it('returns localized not-found errors', async () => {
    resolveReviewMarkerMock.mockResolvedValueOnce(null as never);

    const response = await PATCH(request('PATCH', 'siteId=site-1&locale=zh-hant', { action: 'resolve' }), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到審閱標記。',
      errorCode: 'review_marker_not_found',
    });
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteReviewMarkerMock.mockRejectedValueOnce(new Error('delete marker secret leaked'));

    const response = await DELETE(request('DELETE', 'siteId=site-1&locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to delete the review marker.',
      errorCode: 'review_marker_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('delete marker secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/collab/review-markers/:id] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
