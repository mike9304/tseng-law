import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getPackageCredit,
  savePackageCredit,
  timestamped,
} from '@/lib/builder/bookings/storage';
import type { BookingPackageCredit } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getPackageCredit: vi.fn(async () => null),
  savePackageCredit: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function credit(overrides: Partial<BookingPackageCredit> = {}): BookingPackageCredit {
  return {
    creditId: 'pc-route-test',
    packageId: 'pkg-route-test',
    customerEmail: 'client@example.com',
    customerName: 'Client',
    totalCredits: 3,
    remainingCredits: 2,
    expiresAt: '2026-12-01T00:00:00.000Z',
    status: 'active',
    note: 'Manual grant',
    redemptions: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/package-credits/pc-route-test?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/package-credits/pc-route-test?locale=${locale}`, {
    method: 'DELETE',
  });
}

describe('/api/builder/bookings/package-credits/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing credits on PATCH', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ remainingCredits: 1 }, 'en'), {
      params: { id: 'pc-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Customer credit not found.',
      errorCode: 'credit_not_found',
    });
    expect(savePackageCredit).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid patch payloads', async () => {
    vi.mocked(getPackageCredit).mockResolvedValueOnce(credit());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ totalCredits: 0, expiresAt: 'not-a-date' }, 'zh-hant'), {
      params: { id: 'pc-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認客戶點數資料。');
    expect(payload.errorCode).toBe('invalid_credit_payload');
    expect(payload.details).toHaveLength(2);
    expect(savePackageCredit).not.toHaveBeenCalled();
  });

  it('updates package credits with valid patch payloads', async () => {
    const existing = credit();
    vi.mocked(getPackageCredit).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ totalCredits: 2, remainingCredits: 5 }, 'ko'), {
      params: { id: 'pc-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.credit).toEqual(expect.objectContaining({
      creditId: 'pc-route-test',
      totalCredits: 2,
      remainingCredits: 2,
      status: 'active',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(timestamped).toHaveBeenCalledWith(
      expect.objectContaining({ totalCredits: 2, remainingCredits: 2 }),
      existing.createdAt,
    );
    expect(savePackageCredit).toHaveBeenCalledWith(payload.credit);
  });

  it('returns localized not-found errors for missing credits on DELETE', async () => {
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('ko'), {
      params: { id: 'pc-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '고객 크레딧을 찾을 수 없습니다.',
      errorCode: 'credit_not_found',
    });
    expect(savePackageCredit).not.toHaveBeenCalled();
  });

  it('revokes existing package credits', async () => {
    const existing = credit();
    vi.mocked(getPackageCredit).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('en'), {
      params: { id: 'pc-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.credit).toEqual(expect.objectContaining({
      creditId: 'pc-route-test',
      status: 'revoked',
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ status: 'revoked' }), existing.createdAt);
    expect(savePackageCredit).toHaveBeenCalledWith(payload.credit);
  });
});
