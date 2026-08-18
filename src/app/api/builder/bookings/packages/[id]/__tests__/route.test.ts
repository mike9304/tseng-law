import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getPackage,
  savePackage,
  timestamped,
} from '@/lib/builder/bookings/storage';
import type { BookingPackage } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getPackage: vi.fn(async () => null),
  savePackage: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function bookingPackage(overrides: Partial<BookingPackage> = {}): BookingPackage {
  return {
    packageId: 'pkg-route-test',
    name: { ko: '상담 패키지', 'zh-hant': '諮詢方案', en: 'Consultation package' },
    description: { ko: '패키지', 'zh-hant': '方案', en: 'Package' },
    eligibleServiceIds: ['svc-1'],
    credits: 3,
    validityDays: 90,
    priceAmount: 300000,
    priceCurrency: 'TWD',
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/packages/pkg-route-test?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/packages/pkg-route-test?locale=${locale}`, {
    method: 'DELETE',
  });
}

describe('/api/builder/bookings/packages/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing packages on PATCH', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ credits: 4 }, 'en'), {
      params: Promise.resolve({ id: 'pkg-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Booking package not found.',
      errorCode: 'package_not_found',
    });
    expect(savePackage).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid patch payloads', async () => {
    vi.mocked(getPackage).mockResolvedValueOnce(bookingPackage());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ credits: 0 }, 'zh-hant'), {
      params: Promise.resolve({ id: 'pkg-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認方案資料。');
    expect(payload.errorCode).toBe('invalid_package_payload');
    expect(payload.details).toHaveLength(1);
    expect(savePackage).not.toHaveBeenCalled();
  });

  it('updates packages with valid patch payloads', async () => {
    const existing = bookingPackage();
    vi.mocked(getPackage).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ credits: 4 }, 'ko'), {
      params: Promise.resolve({ id: 'pkg-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.package).toEqual(expect.objectContaining({
      packageId: 'pkg-route-test',
      credits: 4,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ credits: 4 }), existing.createdAt);
    expect(savePackage).toHaveBeenCalledWith(payload.package);
  });

  it('returns localized not-found errors for missing packages on DELETE', async () => {
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('ko'), {
      params: Promise.resolve({ id: 'pkg-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '예약 패키지를 찾을 수 없습니다.',
      errorCode: 'package_not_found',
    });
    expect(savePackage).not.toHaveBeenCalled();
  });

  it('soft-deletes existing packages', async () => {
    const existing = bookingPackage();
    vi.mocked(getPackage).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('en'), {
      params: Promise.resolve({ id: 'pkg-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.package).toEqual(expect.objectContaining({
      packageId: 'pkg-route-test',
      isActive: false,
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }), existing.createdAt);
    expect(savePackage).toHaveBeenCalledWith(payload.package);
  });
});
