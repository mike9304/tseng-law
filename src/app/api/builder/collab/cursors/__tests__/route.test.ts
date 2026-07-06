import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  listActiveCursors,
  setCursor,
} from '@/lib/builder/collab/presence-cursors';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => null),
  guardMutation: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/collab/presence-cursors', () => ({
  listActiveCursors: vi.fn(),
  setCursor: vi.fn(),
}));

const cursor = {
  userId: 'editor@example.test',
  pageId: 'page-1',
  x: 42,
  y: 64,
  color: 'hsl(10, 65%, 48%)',
  label: 'Editor',
  updatedAt: Date.UTC(2026, 5, 3, 0, 0, 0),
};

const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const guardMutationMock = vi.mocked(guardMutation);
const listActiveCursorsMock = vi.mocked(listActiveCursors);
const setCursorMock = vi.mocked(setCursor);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/cursors${query ? `?${query}` : ''}`);
}

function postRequest(query = '', body: unknown = { siteId: 'site-1', pageId: 'page-1', x: 42, y: 64 }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/cursors${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function postSelectedSiteRequest(
  body: unknown = { siteId: 'default', pageId: 'page-1', x: 42, y: 64 },
): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/collab/cursors', {
    method: 'POST',
    headers: {
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder collab cursors API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue(null as never);
    guardMutationMock.mockResolvedValue({ username: 'editor@example.test' } as never);
    listActiveCursorsMock.mockResolvedValue([cursor] as never);
    setCursorMock.mockResolvedValue(cursor as never);
  });

  it('returns projected cursors while preserving success response shape', async () => {
    const response = await GET(getRequest('siteId=site-1&pageId=page-1&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(listActiveCursorsMock).toHaveBeenCalledWith('site-1', 'page-1');
    expect(payload).toEqual({
      ok: true,
      cursors: [{ ...cursor, updatedAt: '2026-06-03T00:00:00.000Z' }],
    });
  });

  it('records cursors for the selected builder site when clients send the legacy default site', async () => {
    const response = await POST(postSelectedSiteRequest());

    expect(response.status).toBe(200);
    expect(setCursorMock).toHaveBeenCalledWith({
      siteId: 'workspace-site',
      userId: 'editor@example.test',
      pageId: 'page-1',
      x: 42,
      y: 64,
      nodeId: undefined,
      label: undefined,
    });
    expect(listActiveCursorsMock).toHaveBeenCalledWith('workspace-site', 'page-1');
  });

  it('returns localized validation errors', async () => {
    const response = await POST(postRequest('locale=zh-hant', { siteId: 'site-1', pageId: 'page-1', x: 'bad', y: 64 }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認協作請求。',
      errorCode: 'invalid_request',
    });
    expect(setCursorMock).not.toHaveBeenCalled();
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    setCursorMock.mockRejectedValueOnce(new Error('cursor secret leaked'));

    const response = await POST(postRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to save cursor position.',
      errorCode: 'cursor_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('cursor secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/collab/cursors] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
