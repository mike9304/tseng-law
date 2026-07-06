import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  heartbeat,
  listActive,
} from '@/lib/builder/collab/presence-store';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => null),
  guardMutation: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/collab/presence-store', () => ({
  heartbeat: vi.fn(),
  listActive: vi.fn(),
}));

const entry = {
  sessionId: 'session-1',
  username: 'editor@example.test',
  color: 'hsl(20, 65%, 48%)',
  lastSeenAt: Date.UTC(2026, 5, 3, 0, 0, 0),
  nodeId: 'node-1',
};

const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const guardMutationMock = vi.mocked(guardMutation);
const heartbeatMock = vi.mocked(heartbeat);
const listActiveMock = vi.mocked(listActive);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/presence${query ? `?${query}` : ''}`);
}

function postRequest(
  query = '',
  body: unknown = { siteId: 'site-1', pageId: 'page-1', sessionId: 'session-1', nodeId: 'node-1' },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/collab/presence${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function postSelectedSiteRequest(
  body: unknown = { siteId: 'default', pageId: 'page-1', sessionId: 'session-1', nodeId: 'node-1' },
): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/collab/presence', {
    method: 'POST',
    headers: {
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder collab presence API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue(null as never);
    guardMutationMock.mockResolvedValue({ username: 'editor@example.test' } as never);
    heartbeatMock.mockReturnValue(entry as never);
    listActiveMock.mockReturnValue([entry] as never);
  });

  it('returns active editors while preserving success response shape', async () => {
    const response = await GET(getRequest('siteId=site-1&pageId=page-1&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(listActiveMock).toHaveBeenCalledWith('site-1', 'page-1');
    expect(payload).toEqual({
      ok: true,
      active: [{ ...entry, lastSeenAt: '2026-06-03T00:00:00.000Z' }],
    });
  });

  it('records presence for the selected builder site when clients send the legacy default site', async () => {
    const response = await POST(postSelectedSiteRequest());

    expect(response.status).toBe(200);
    expect(heartbeatMock).toHaveBeenCalledWith('workspace-site', 'page-1', 'session-1', {
      username: 'editor@example.test',
      nodeId: 'node-1',
    });
    expect(listActiveMock).toHaveBeenCalledWith('workspace-site', 'page-1');
  });

  it('returns localized validation errors', async () => {
    const response = await POST(postRequest('locale=zh-hant', { siteId: 'site-1', pageId: 'page-1' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認協作請求。',
      errorCode: 'invalid_request',
    });
    expect(heartbeatMock).not.toHaveBeenCalled();
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    heartbeatMock.mockImplementationOnce(() => {
      throw new Error('presence secret leaked');
    });

    const response = await POST(postRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to save presence status.',
      errorCode: 'presence_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('presence secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/collab/presence] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
