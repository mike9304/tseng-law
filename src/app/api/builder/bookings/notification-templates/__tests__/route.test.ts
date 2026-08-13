import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  createNotificationTemplate,
  listNotificationTemplates,
} from '@/lib/builder/bookings/notification-template-store';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/notification-template-store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/bookings/notification-template-store')>();
  return {
    ...actual,
    listNotificationTemplates: vi.fn(async () => []),
    createNotificationTemplate: vi.fn(async (input) => ({
      ok: true,
      template: {
        id: `${input.eventType}__${input.locale}`,
        ...input,
        isActive: input.isActive ?? true,
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T00:00:00.000Z',
      },
    })),
  };
});

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/bookings/notification-templates', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/notification-templates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized errors for unknown eventType filters', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/notification-templates?eventType=bad&locale=zh-hant'),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-bookings',
    );
    expect(payload.errorCode).toBe('unknown_event_type');
    expect(payload.error).toBe('不支援的通知類型。');
    expect(listNotificationTemplates).not.toHaveBeenCalled();
  });

  it('returns default-locale errors for unsupported locale filters', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/notification-templates?locale=fr'),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: '지원하지 않는 언어입니다.',
      errorCode: 'unknown_locale',
    });
    expect(listNotificationTemplates).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid create payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ locale: 'en', subject: '' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Check the template content.');
    expect(payload.errorCode).toBe('invalid_template_payload');
    expect(payload.details).toHaveLength(3);
    expect(createNotificationTemplate).not.toHaveBeenCalled();
  });

  it('returns localized duplicate-template errors', async () => {
    vi.mocked(createNotificationTemplate).mockResolvedValueOnce({
      ok: false,
      error: 'Template for booking-confirmed (zh-hant) already exists',
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({
      eventType: 'booking-confirmed',
      locale: 'zh-hant',
      subject: '已確認',
      html: '<p>已確認</p>',
      plain: '已確認',
    }));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '相同的通知範本已存在。',
      errorCode: 'duplicate_template',
    });
  });
});
