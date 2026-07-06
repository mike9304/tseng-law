import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getPackage,
  listPackageCredits,
  makePackageCreditId,
  savePackageCredit,
  timestamped,
} from '@/lib/builder/bookings/storage';
import type { BookingPackage } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  normalizePackageEmail: vi.fn((email: string) => email.trim().toLowerCase()),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getPackage: vi.fn(async () => null),
  listPackageCredits: vi.fn(async () => []),
  makePackageCreditId: vi.fn(() => 'pc-route-test'),
  savePackageCredit: vi.fn(async () => undefined),
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

function validCreditPayload() {
  return {
    packageId: 'pkg-route-test',
    customerEmail: ' CLIENT@EXAMPLE.COM ',
    customerName: 'Client',
    totalCredits: 5,
    expiresAt: '2026-12-01T00:00:00.000Z',
    note: 'Manual grant',
    status: 'active',
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/package-credits?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/package-credits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireBuilderAdminAuth).mockReturnValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('lists package credits for authenticated builder admins', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest(
        'https://law.example.test/api/builder/bookings/package-credits?customerEmail=client@example.com&packageId=pkg-route-test&includeInactive=1',
      ),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ credits: [] });
    expect(listPackageCredits).toHaveBeenCalledWith({
      customerEmail: 'client@example.com',
      packageId: 'pkg-route-test',
      includeInactive: true,
    });
  });

  it('returns localized errors for invalid create payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({
      packageId: '',
      customerEmail: 'not-an-email',
      totalCredits: 0,
      expiresAt: 'not-a-date',
    }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認客戶點數資料。');
    expect(payload.errorCode).toBe('invalid_credit_payload');
    expect(payload.details).toHaveLength(3);
    expect(savePackageCredit).not.toHaveBeenCalled();
  });

  it('returns localized errors when the selected package is missing', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest(validCreditPayload(), 'ko'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '예약 패키지를 찾을 수 없습니다.',
      errorCode: 'package_not_found',
    });
    expect(savePackageCredit).not.toHaveBeenCalled();
  });

  it('creates package credits with valid payloads', async () => {
    vi.mocked(getPackage).mockResolvedValueOnce(bookingPackage({ credits: 4 }));
    const route = await import('../route');
    const response = await route.POST(postRequest(validCreditPayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.credit).toEqual(expect.objectContaining({
      creditId: 'pc-route-test',
      packageId: 'pkg-route-test',
      customerEmail: 'client@example.com',
      totalCredits: 5,
      remainingCredits: 5,
      expiresAt: '2026-12-01T00:00:00.000Z',
      status: 'active',
      note: 'Manual grant',
      redemptions: [],
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(makePackageCreditId).toHaveBeenCalled();
    expect(timestamped).toHaveBeenCalled();
    expect(savePackageCredit).toHaveBeenCalledWith(payload.credit);
  });
});
