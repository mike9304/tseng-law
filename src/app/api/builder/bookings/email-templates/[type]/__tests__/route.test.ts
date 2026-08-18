import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { upsertBookingEmailTemplate } from '@/lib/builder/bookings/email-templates';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/email-templates', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/bookings/email-templates')>();
  return {
    ...actual,
    upsertBookingEmailTemplate: vi.fn(async (
      type: Parameters<typeof actual.upsertBookingEmailTemplate>[0],
      input: Parameters<typeof actual.upsertBookingEmailTemplate>[1],
    ) => ({
      templateId: type,
      type,
      ...input,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-01T00:00:00.000Z',
    })),
  };
});

function patchRequest(type: string, body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/bookings/email-templates/${type}?locale=${locale}`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
}

describe('/api/builder/bookings/email-templates/[type]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized errors for unknown template types', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest('unknown', { subject: 'Subject', body: 'Body' }, 'zh-hant'), {
      params: Promise.resolve({ type: 'unknown' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '不支援的預約電子郵件範本。',
      errorCode: 'unknown_template_type',
    });
    expect(upsertBookingEmailTemplate).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid template payloads', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest('customer-confirmation', { subject: '', body: '' }, 'en'), {
      params: Promise.resolve({ type: 'customer-confirmation' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Check the email template content.');
    expect(payload.errorCode).toBe('invalid_template_payload');
    expect(payload.details).toHaveLength(2);
    expect(upsertBookingEmailTemplate).not.toHaveBeenCalled();
  });

  it('uses the default locale for invalid template payloads when locale is omitted', async () => {
    const route = await import('../route');
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/bookings/email-templates/customer-reminder', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(null),
      }),
      { params: Promise.resolve({ type: 'customer-reminder' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('이메일 템플릿 내용을 확인해 주세요.');
    expect(payload.errorCode).toBe('invalid_template_payload');
    expect(upsertBookingEmailTemplate).not.toHaveBeenCalled();
  });

  it('upserts valid booking email template payloads', async () => {
    const route = await import('../route');
    const response = await route.PATCH(
      patchRequest('customer-confirmation', {
        subject: 'Confirmed {{serviceName}}',
        body: 'Hello {{customerName}}',
        isActive: true,
      }),
      { params: Promise.resolve({ type: 'customer-confirmation' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.template).toEqual(expect.objectContaining({
      type: 'customer-confirmation',
      subject: 'Confirmed {{serviceName}}',
      body: 'Hello {{customerName}}',
      isActive: true,
    }));
    expect(upsertBookingEmailTemplate).toHaveBeenCalledWith('customer-confirmation', {
      subject: 'Confirmed {{serviceName}}',
      body: 'Hello {{customerName}}',
      isActive: true,
    });
  });
});
