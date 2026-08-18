import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  deleteNotificationTemplate,
  getNotificationTemplate,
  updateNotificationTemplate,
} from '@/lib/builder/bookings/notification-template-store';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/notification-template-store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/bookings/notification-template-store')>();
  return {
    ...actual,
    getNotificationTemplate: vi.fn(async () => null),
    updateNotificationTemplate: vi.fn(async () => ({ ok: false, error: 'Template not found' })),
    deleteNotificationTemplate: vi.fn(async () => ({ ok: false, error: 'Template not found' })),
  };
});

function patchRequest(body: unknown, locale = 'en'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/notification-templates/booking-confirmed__en?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/notification-templates/booking-confirmed__en?locale=${locale}`, {
    method: 'DELETE',
  });
}

describe('/api/builder/bookings/notification-templates/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors on GET', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/notification-templates/booking-confirmed__en?locale=zh-hant'),
      { params: Promise.resolve({ id: 'booking-confirmed__en' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-bookings',
    );
    expect(payload).toEqual({
      error: '找不到通知範本。',
      errorCode: 'template_not_found',
    });
    expect(getNotificationTemplate).toHaveBeenCalledWith('booking-confirmed__en');
  });

  it('returns localized invalid-patch errors', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ subject: '' }), {
      params: Promise.resolve({ id: 'booking-confirmed__en' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Check the template update.');
    expect(payload.errorCode).toBe('invalid_template_patch');
    expect(payload.details).toHaveLength(1);
    expect(updateNotificationTemplate).not.toHaveBeenCalled();
  });

  it('returns localized not-found errors on PATCH when the store update fails', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ subject: 'Updated' }, 'zh-hant'), {
      params: Promise.resolve({ id: 'booking-confirmed__en' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '找不到通知範本。',
      errorCode: 'template_not_found',
    });
  });

  it('returns localized not-found errors on DELETE when the store delete fails', async () => {
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('ko'), {
      params: Promise.resolve({ id: 'booking-confirmed__en' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '알림 템플릿을 찾을 수 없습니다.',
      errorCode: 'template_not_found',
    });
    expect(deleteNotificationTemplate).toHaveBeenCalledWith('booking-confirmed__en');
  });
});
