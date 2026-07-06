import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createReviewMarker,
  listReviewMarkers,
} from '@/lib/builder/collab/review-markers';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => null),
  guardMutation: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/collab/review-markers', () => ({
  createReviewMarker: vi.fn(),
  isReviewMarkerKind: vi.fn((value: unknown) => (
    value === 'comment' || value === 'todo' || value === 'approval'
  )),
  listReviewMarkers: vi.fn(),
  sanitizeMarkerText: vi.fn((input: unknown) => {
    if (typeof input !== 'string') return null;
    const trimmed = input.trim();
    return trimmed || null;
  }),
}));

const marker = {
  id: 'rmk-1',
  siteId: 'site-1',
  pageId: 'page-1',
  nodeId: 'node-1',
  kind: 'todo',
  text: 'Review this section',
  createdBy: 'editor@example.test',
  createdAt: '2026-06-03T00:00:00.000Z',
};

const createReviewMarkerMock = vi.mocked(createReviewMarker);
const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const guardMutationMock = vi.mocked(guardMutation);
const listReviewMarkersMock = vi.mocked(listReviewMarkers);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/review-markers${query ? `?${query}` : ''}`);
}

function getSelectedSiteRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/review-markers${query ? `?${query}` : ''}`, {
    headers: {
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site',
    },
  });
}

function postRequest(
  query = '',
  body: unknown = {
    siteId: 'site-1',
    pageId: 'page-1',
    nodeId: 'node-1',
    kind: 'todo',
    text: 'Review this section',
  },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/review-markers${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder collab review markers API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue(null as never);
    guardMutationMock.mockResolvedValue({ username: 'editor@example.test' } as never);
    listReviewMarkersMock.mockResolvedValue([marker] as never);
    createReviewMarkerMock.mockResolvedValue(marker as never);
  });

  it('returns review markers while preserving success response shape', async () => {
    const response = await GET(getRequest('siteId=site-1&pageId=page-1&nodeId=node-1&kind=todo&includeResolved=1&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(listReviewMarkersMock).toHaveBeenCalledWith('site-1', {
      pageId: 'page-1',
      nodeId: 'node-1',
      kind: 'todo',
      includeResolved: true,
    });
    expect(payload).toEqual({ ok: true, markers: [marker] });
  });

  it('returns review markers for the selected builder site from the editor referrer', async () => {
    const response = await GET(getSelectedSiteRequest('pageId=page-1&locale=ko'));

    expect(response.status).toBe(200);
    expect(listReviewMarkersMock).toHaveBeenCalledWith('workspace-site', {
      pageId: 'page-1',
      nodeId: undefined,
      kind: undefined,
      includeResolved: false,
    });
  });

  it('returns localized validation errors', async () => {
    const response = await POST(postRequest('locale=zh-hant', {
      siteId: 'site-1',
      pageId: 'page-1',
      nodeId: 'node-1',
      kind: 'bad',
      text: 'Review this section',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認協作請求。',
      errorCode: 'invalid_request',
    });
    expect(createReviewMarkerMock).not.toHaveBeenCalled();
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createReviewMarkerMock.mockRejectedValueOnce(new Error('marker secret leaked'));

    const response = await POST(postRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to create the review marker.',
      errorCode: 'review_marker_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('marker secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/collab/review-markers] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
