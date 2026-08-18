import { NextRequest, NextResponse } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  createNotification,
  listNotifications,
  markAllRead,
} from '@/lib/builder/notifications/notification-store';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';
import { GET, POST, PUT } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/notifications/notification-store', () => ({
  createNotification: vi.fn(),
  listNotifications: vi.fn(),
  markAllRead: vi.fn(),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  resolveUserRole: vi.fn(async () => 'owner'),
}));

const notification = {
  id: 'ntf_1',
  kind: 'order',
  subject: 'New order',
  body: 'Order #1001',
  audience: {},
  createdAt: '2026-06-03T00:00:00.000Z',
};

const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const guardMutationMock = vi.mocked(guardMutation);
const createNotificationMock = vi.mocked(createNotification);
const listNotificationsMock = vi.mocked(listNotifications);
const markAllReadMock = vi.mocked(markAllRead);
const resolveUserRoleMock = vi.mocked(resolveUserRole);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/notifications${query ? `?${query}` : ''}`);
}

function internalPostRequest(query = '', body: string | unknown = {
  kind: 'order',
  subject: 'New order',
  body: 'Order #1001',
  locale: 'ko',
}, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/notifications${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-internal-source': 'test-notification-secret',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function publicPostRequest(query = '', headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/notifications${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ kind: 'order', subject: 'New order' }),
  });
}

function putRequest(query = '', body: string | unknown = { kind: 'order', locale: 'ko' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/notifications${query ? `?${query}` : ''}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder notifications API', () => {
  beforeEach(() => {
    vi.stubEnv('BUILDER_INTERNAL_NOTIFY_SECRET', 'test-notification-secret');
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue({ username: 'admin' });
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    resolveUserRoleMock.mockResolvedValue('owner');
    listNotificationsMock.mockResolvedValue([notification] as never);
    createNotificationMock.mockResolvedValue(notification as never);
    markAllReadMock.mockResolvedValue(3 as never);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns notifications while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en&kind=order&unreadOnly=1&limit=20'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, notifications: [notification], total: 1, unread: 1 });
    expect(guardBuilderReadMock).toHaveBeenCalledWith(expect.any(NextRequest));
    expect(guardMutationMock).not.toHaveBeenCalled();
    expect(listNotificationsMock).toHaveBeenCalledWith({
      kind: 'order',
      unreadOnly: true,
      audienceScope: { principal: 'admin', role: 'owner' },
      limit: 20,
    });
  });

  it('returns 401 before resolving an audience for unauthenticated requests', async () => {
    guardBuilderReadMock.mockReturnValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    );

    const response = await GET(getRequest('locale=en'));

    expect(response.status).toBe(401);
    expect(resolveUserRoleMock).not.toHaveBeenCalled();
    expect(listNotificationsMock).not.toHaveBeenCalled();
  });

  it('scopes lists to the authenticated principal and exact current role', async () => {
    guardBuilderReadMock.mockReturnValueOnce({ username: 'editor@example.com' });
    resolveUserRoleMock.mockResolvedValueOnce('editor');

    const response = await GET(getRequest('locale=en'));

    expect(response.status).toBe(200);
    expect(listNotificationsMock).toHaveBeenCalledWith(expect.objectContaining({
      audienceScope: { principal: 'editor@example.com', role: 'editor' },
    }));
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listNotificationsMock.mockRejectedValueOnce(new Error('notification storage secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入通知。',
      errorCode: 'notifications_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('notification storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/notifications] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized internal-only errors', async () => {
    const response = await POST(publicPostRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({
      ok: false,
      error: '只允許內部通知請求。',
      errorCode: 'internal_only',
    });
    expect(createNotificationMock).not.toHaveBeenCalled();
  });

  it('fails closed when the internal notification secret is not configured', async () => {
    vi.stubEnv('BUILDER_INTERNAL_NOTIFY_SECRET', '');

    const response = await POST(internalPostRequest());

    expect(response.status).toBe(403);
    expect(createNotificationMock).not.toHaveBeenCalled();
  });

  it('rejects missing or wrong internal-source secrets even for same-origin requests', async () => {
    const sameOriginHeaders = {
      host: 'law.example.test',
      origin: 'https://law.example.test',
      referer: 'https://law.example.test/ko/admin-builder',
    };

    const missingSecret = await POST(publicPostRequest('', sameOriginHeaders));
    const wrongSecret = await POST(publicPostRequest('', {
      ...sameOriginHeaders,
      'x-internal-source': 'wrong-secret',
    }));

    expect(missingSecret.status).toBe(403);
    expect(wrongSecret.status).toBe(403);
    expect(createNotificationMock).not.toHaveBeenCalled();
  });

  it('rejects an attacker Origin containing the legitimate host as a substring', async () => {
    const response = await POST(publicPostRequest('', {
      host: 'law.example.test',
      origin: 'https://law.example.test.evil.example',
      referer: 'https://law.example.test.evil.example/forged',
    }));

    expect(response.status).toBe(403);
    expect(createNotificationMock).not.toHaveBeenCalled();
  });

  it('requires an application/json content type', async () => {
    const response = await POST(internalPostRequest('locale=en', {
      kind: 'order',
      subject: 'New order',
    }, {
      'content-type': 'text/plain',
    }));
    const payload = await response.json();

    expect(response.status).toBe(415);
    expect(payload).toEqual({
      ok: false,
      error: 'Notification requests must use JSON.',
      errorCode: 'invalid_content_type',
    });
    expect(createNotificationMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await POST(internalPostRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the notification request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized invalid-kind errors using the body locale', async () => {
    const response = await POST(internalPostRequest('', { kind: 'bad', subject: 'Hello', locale: 'zh-hant' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認通知類型。',
      errorCode: 'invalid_kind',
    });
  });

  it('returns localized subject-required errors', async () => {
    const response = await POST(internalPostRequest('locale=ko', { kind: 'order', subject: '' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '알림 제목을 입력해 주세요.',
      errorCode: 'subject_required',
    });
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    '//evil.example/path',
    '/%2F%2Fevil.example/path',
    '/%252F%252Fevil.example/path',
    '/%255cevil.example/path',
    'https://evil.example/path',
  ])('rejects unsafe notification link %s', async (link) => {
    const response = await POST(internalPostRequest('locale=ko', {
      kind: 'order',
      subject: 'New order',
      link,
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '알림 링크는 사이트 내부 경로만 사용할 수 있습니다.',
      errorCode: 'invalid_link',
    });
    expect(createNotificationMock).not.toHaveBeenCalled();
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createNotificationMock.mockRejectedValueOnce(new Error('notification create secret leaked'));

    const response = await POST(internalPostRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to create the notification.',
      errorCode: 'notification_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('notification create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/notifications] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('creates notifications while preserving success response shape', async () => {
    const response = await POST(internalPostRequest('locale=ko', {
      kind: 'order',
      subject: 'New order',
      body: 'Order #1001',
      locale: 'ko',
      link: '/ko/admin-builder/translations?sourceLocale=ko&category=pages#review',
    }));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(createNotificationMock).toHaveBeenCalledWith({
      kind: 'order',
      subject: 'New order',
      body: 'Order #1001',
      audience: {},
      link: '/ko/admin-builder/translations?sourceLocale=ko&category=pages#review',
    });
    expect(payload).toEqual({ ok: true, notification });
  });

  it('marks notifications read while preserving success response shape', async () => {
    const response = await PUT(putRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, updated: 3 });
    expect(markAllReadMock).toHaveBeenCalledWith({
      kind: 'order',
      audienceScope: { principal: 'admin', role: 'owner' },
    });
  });

  it('scopes bulk mark-read to the authenticated principal audience', async () => {
    guardMutationMock.mockResolvedValueOnce({ username: 'editor@example.com' } as never);
    resolveUserRoleMock.mockResolvedValueOnce('editor');

    const response = await PUT(putRequest('locale=en'));

    expect(response.status).toBe(200);
    expect(markAllReadMock).toHaveBeenCalledWith({
      kind: 'order',
      audienceScope: { principal: 'editor@example.com', role: 'editor' },
    });
  });

  it('preserves a 403 mutation guard response before accessing the inbox', async () => {
    guardMutationMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-pages' }, { status: 403 }) as never,
    );

    const response = await PUT(putRequest('locale=en'));

    expect(response.status).toBe(403);
    expect(resolveUserRoleMock).not.toHaveBeenCalled();
    expect(markAllReadMock).not.toHaveBeenCalled();
  });

  it('returns localized mark-all-read failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    markAllReadMock.mockRejectedValueOnce(new Error('mark all secret leaked'));

    const response = await PUT(putRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法儲存通知狀態。',
      errorCode: 'notification_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('mark all secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/notifications] PUT failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
