import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteNotification,
  markRead,
} from '@/lib/builder/notifications/notification-store';
import { NotificationAudienceForbiddenError } from '@/lib/builder/notifications/notification-model';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';
import { DELETE, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/notifications/notification-store', () => ({
  deleteNotification: vi.fn(),
  markRead: vi.fn(),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  resolveUserRole: vi.fn(async () => 'owner'),
}));

const notification = {
  id: 'ntf_1',
  kind: 'publish',
  subject: 'Published',
  body: 'Site published',
  audience: {},
  createdAt: '2026-06-03T00:00:00.000Z',
  readAt: '2026-06-03T00:01:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const deleteNotificationMock = vi.mocked(deleteNotification);
const markReadMock = vi.mocked(markRead);
const resolveUserRoleMock = vi.mocked(resolveUserRole);

function request(method: 'PATCH' | 'DELETE', query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/notifications/ntf_1${query ? `?${query}` : ''}`, {
    method,
  });
}

const params = { params: Promise.resolve({ id: 'ntf_1' }) };

describe('builder notification detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    resolveUserRoleMock.mockResolvedValue('owner');
    markReadMock.mockResolvedValue(notification as never);
    deleteNotificationMock.mockResolvedValue(true as never);
  });

  it('marks notifications read while preserving success response shape', async () => {
    const response = await PATCH(request('PATCH', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, notification });
    expect(markReadMock).toHaveBeenCalledWith(
      'ntf_1',
      { principal: 'admin', role: 'owner' },
    );
  });

  it('returns 403 when a different role targets an owner-only notification', async () => {
    guardMutationMock.mockResolvedValueOnce({ username: 'editor@example.com' } as never);
    resolveUserRoleMock.mockResolvedValueOnce('editor');
    markReadMock.mockRejectedValueOnce(new NotificationAudienceForbiddenError());

    const response = await PATCH(request('PATCH', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({
      ok: false,
      error: 'You do not have permission to access this notification.',
      errorCode: 'notification_forbidden',
    });
    expect(markReadMock).toHaveBeenCalledWith(
      'ntf_1',
      { principal: 'editor@example.com', role: 'editor' },
    );
  });

  it('returns localized missing notification errors on patch', async () => {
    markReadMock.mockResolvedValueOnce(null);

    const response = await PATCH(request('PATCH', 'locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到通知。',
      errorCode: 'notification_not_found',
    });
  });

  it('returns localized patch failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    markReadMock.mockRejectedValueOnce(new Error('patch notification secret leaked'));

    const response = await PATCH(request('PATCH', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '알림 상태를 저장하지 못했습니다.',
      errorCode: 'notification_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('patch notification secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/notifications/[id]] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('deletes notifications while preserving success response shape', async () => {
    const response = await DELETE(request('DELETE', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(deleteNotificationMock).toHaveBeenCalledWith(
      'ntf_1',
      { principal: 'admin', role: 'owner' },
    );
  });

  it('returns 403 when a different role tries to delete a notification', async () => {
    guardMutationMock.mockResolvedValueOnce({ username: 'client@example.com' } as never);
    resolveUserRoleMock.mockResolvedValueOnce('client');
    deleteNotificationMock.mockRejectedValueOnce(new NotificationAudienceForbiddenError());

    const response = await DELETE(request('DELETE', 'locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({
      ok: false,
      error: '您沒有權限存取此通知。',
      errorCode: 'notification_forbidden',
    });
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteNotificationMock.mockRejectedValueOnce(new Error('delete notification secret leaked'));

    const response = await DELETE(request('DELETE', 'locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法刪除通知。',
      errorCode: 'notification_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('delete notification secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/notifications/[id]] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
