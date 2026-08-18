import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getService,
  saveService,
  slugify,
  timestamped,
} from '@/lib/builder/bookings/storage';
import type { BookingService } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(async () => null),
  saveService: vi.fn(async () => undefined),
  slugify: vi.fn((value: string) => value.toLowerCase().replace(/\s+/g, '-')),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function service(overrides: Partial<BookingService> = {}): BookingService {
  return {
    serviceId: 'svc-route-test',
    slug: 'initial-consultation',
    name: { ko: '초기 상담', 'zh-hant': '初步諮詢', en: 'Initial consultation' },
    description: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
    durationMinutes: 30,
    priceTwd: 0,
    category: 'consultation',
    staffIds: [],
    requiredResourceIds: [],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    maxParticipants: 1,
    slotStepMinutes: 30,
    isActive: true,
    paymentMode: 'free',
    priceCurrency: 'TWD',
    meetingMode: 'in-person',
    reminderOffsetsHours: [24],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/services/svc-route-test?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/services/svc-route-test?locale=${locale}`, {
    method: 'DELETE',
  });
}

describe('/api/builder/bookings/services/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing services on PATCH', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: { ko: '수정' } }, 'en'), {
      params: Promise.resolve({ id: 'svc-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Booking service not found.',
      errorCode: 'service_not_found',
    });
    expect(saveService).not.toHaveBeenCalled();
  });

  it('returns localized errors for non-object patch payloads', async () => {
    vi.mocked(getService).mockResolvedValueOnce(service());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest(null, 'zh-hant'), {
      params: Promise.resolve({ id: 'svc-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: '請確認服務內容。',
      errorCode: 'invalid_service_payload',
      details: ['需要物件格式的請求內容。'],
    });
    expect(saveService).not.toHaveBeenCalled();
  });

  it('updates services with valid patch payloads', async () => {
    const existing = service();
    vi.mocked(getService).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ durationMinutes: 45 }, 'ko'), {
      params: Promise.resolve({ id: 'svc-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.service).toEqual(expect.objectContaining({
      serviceId: 'svc-route-test',
      durationMinutes: 45,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(slugify).not.toHaveBeenCalled();
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ durationMinutes: 45 }), existing.createdAt);
    expect(saveService).toHaveBeenCalledWith(payload.service);
  });

  it('clears collect-later fields when a paid pay-later service is switched to free', async () => {
    const existing = service({
      paymentMode: 'paid',
      priceAmount: 9000,
      collectPaymentLater: true,
    });
    vi.mocked(getService).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ paymentMode: 'free' }, 'ko'), {
      params: Promise.resolve({ id: 'svc-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.service).toEqual(expect.objectContaining({
      paymentMode: 'free',
      collectPaymentLater: false,
    }));
    expect(payload.service).not.toHaveProperty('priceAmount');
    expect(payload.service).not.toHaveProperty('depositAmount');
    expect(saveService).toHaveBeenCalledWith(payload.service);
  });

  it('clears old deposit fields when a paid deposit service is switched to collect later', async () => {
    const existing = service({
      paymentMode: 'paid',
      priceAmount: 9000,
      depositAmount: 1500,
      collectPaymentLater: false,
    });
    vi.mocked(getService).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ collectPaymentLater: true }, 'ko'), {
      params: Promise.resolve({ id: 'svc-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.service).toEqual(expect.objectContaining({
      paymentMode: 'paid',
      priceAmount: 9000,
      collectPaymentLater: true,
    }));
    expect(payload.service).not.toHaveProperty('depositAmount');
    expect(saveService).toHaveBeenCalledWith(payload.service);
  });

  it('returns localized not-found errors for missing services on DELETE', async () => {
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('ko'), {
      params: Promise.resolve({ id: 'svc-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '예약 서비스를 찾을 수 없습니다.',
      errorCode: 'service_not_found',
    });
    expect(saveService).not.toHaveBeenCalled();
  });

  it('soft-deletes existing services', async () => {
    const existing = service();
    vi.mocked(getService).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('en'), {
      params: Promise.resolve({ id: 'svc-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.service).toEqual(expect.objectContaining({
      serviceId: 'svc-route-test',
      isActive: false,
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }), existing.createdAt);
    expect(saveService).toHaveBeenCalledWith(payload.service);
  });
});
