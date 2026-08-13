import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCancellationPolicy,
  saveCancellationPolicy,
  timestamped,
} from '@/lib/builder/bookings/storage';
import type { BookingCancellationPolicy } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getCancellationPolicy: vi.fn(async () => null),
  saveCancellationPolicy: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function policy(overrides: Partial<BookingCancellationPolicy> = {}): BookingCancellationPolicy {
  return {
    policyId: 'pol-route-test',
    name: 'Flexible cancellation',
    description: 'Flexible booking changes',
    cancelHoursBefore: 24,
    rescheduleHoursBefore: 12,
    fullRefundHoursBefore: 48,
    partialRefundHoursBefore: 24,
    partialRefundPercent: 50,
    cancellationFeePercent: 10,
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/bookings/cancellation-policies/pol-route-test?locale=${locale}`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
}

function deleteRequest(locale = 'ko'): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/bookings/cancellation-policies/pol-route-test?locale=${locale}`,
    { method: 'DELETE' },
  );
}

describe('/api/builder/bookings/cancellation-policies/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing policies on PATCH', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ isActive: false }, 'en'), {
      params: Promise.resolve({ id: 'pol-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Cancellation policy not found.',
      errorCode: 'policy_not_found',
    });
    expect(saveCancellationPolicy).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid patch payloads', async () => {
    vi.mocked(getCancellationPolicy).mockResolvedValueOnce(policy());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ cancellationFeePercent: 101 }, 'zh-hant'), {
      params: Promise.resolve({ id: 'pol-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認取消政策資料。');
    expect(payload.errorCode).toBe('invalid_policy_payload');
    expect(payload.details).toHaveLength(1);
    expect(saveCancellationPolicy).not.toHaveBeenCalled();
  });

  it('updates cancellation policies with valid patch payloads', async () => {
    const existing = policy();
    vi.mocked(getCancellationPolicy).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ isActive: false }, 'ko'), {
      params: Promise.resolve({ id: 'pol-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.policy).toEqual(expect.objectContaining({
      policyId: 'pol-route-test',
      isActive: false,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }), existing.createdAt);
    expect(saveCancellationPolicy).toHaveBeenCalledWith(payload.policy);
  });

  it('returns localized not-found errors for missing policies on DELETE', async () => {
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('ko'), {
      params: Promise.resolve({ id: 'pol-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '취소 정책을 찾을 수 없습니다.',
      errorCode: 'policy_not_found',
    });
    expect(saveCancellationPolicy).not.toHaveBeenCalled();
  });

  it('soft-deletes existing cancellation policies', async () => {
    const existing = policy();
    vi.mocked(getCancellationPolicy).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('en'), {
      params: Promise.resolve({ id: 'pol-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.policy).toEqual(expect.objectContaining({
      policyId: 'pol-route-test',
      isActive: false,
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }), existing.createdAt);
    expect(saveCancellationPolicy).toHaveBeenCalledWith(payload.policy);
  });
});
