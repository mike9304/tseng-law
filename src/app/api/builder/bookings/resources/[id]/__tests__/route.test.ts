import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getResource,
  saveResource,
  timestamped,
} from '@/lib/builder/bookings/storage';
import type { BookingResource, DayOfWeek } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getResource: vi.fn(async () => null),
  saveResource: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

const emptyWeekly = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
} satisfies Record<DayOfWeek, []>;

function resource(overrides: Partial<BookingResource> = {}): BookingResource {
  return {
    resourceId: 'res-route-test',
    name: { ko: '회의실 A', 'zh-hant': '會議室 A', en: 'Room A' },
    description: { ko: '상담실', 'zh-hant': '諮詢室', en: 'Consultation room' },
    location: 'Taipei',
    capacity: 2,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    weekly: emptyWeekly,
    timezone: 'Asia/Taipei',
    blockedDates: [],
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/resources/res-route-test?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/resources/res-route-test?locale=${locale}`, {
    method: 'DELETE',
  });
}

describe('/api/builder/bookings/resources/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing resources on PATCH', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ location: 'Seoul' }, 'en'), {
      params: { id: 'res-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Booking resource not found.',
      errorCode: 'resource_not_found',
    });
    expect(saveResource).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid patch payloads', async () => {
    vi.mocked(getResource).mockResolvedValueOnce(resource());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ capacity: 0 }, 'zh-hant'), {
      params: { id: 'res-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認資源資料。');
    expect(payload.errorCode).toBe('invalid_resource_payload');
    expect(payload.details).toHaveLength(1);
    expect(saveResource).not.toHaveBeenCalled();
  });

  it('updates resources with valid patch payloads', async () => {
    const existing = resource();
    vi.mocked(getResource).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ location: 'Seoul' }, 'ko'), {
      params: { id: 'res-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.resource).toEqual(expect.objectContaining({
      resourceId: 'res-route-test',
      location: 'Seoul',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ location: 'Seoul' }), existing.createdAt);
    expect(saveResource).toHaveBeenCalledWith(payload.resource);
  });

  it('returns localized not-found errors for missing resources on DELETE', async () => {
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('ko'), {
      params: { id: 'res-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '예약 자원을 찾을 수 없습니다.',
      errorCode: 'resource_not_found',
    });
    expect(saveResource).not.toHaveBeenCalled();
  });

  it('soft-deletes existing resources', async () => {
    const existing = resource();
    vi.mocked(getResource).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('en'), {
      params: { id: 'res-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.resource).toEqual(expect.objectContaining({
      resourceId: 'res-route-test',
      isActive: false,
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }), existing.createdAt);
    expect(saveResource).toHaveBeenCalledWith(payload.resource);
  });
});
