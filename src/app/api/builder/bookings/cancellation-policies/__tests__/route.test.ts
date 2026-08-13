import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  listCancellationPolicies,
  makeCancellationPolicyId,
  saveCancellationPolicy,
  timestamped,
} from '@/lib/builder/bookings/storage';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listCancellationPolicies: vi.fn(async () => []),
  makeCancellationPolicyId: vi.fn(() => 'pol-route-test'),
  saveCancellationPolicy: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function validPolicyPayload() {
  return {
    name: 'Flexible cancellation',
    description: 'Flexible booking changes',
    cancelHoursBefore: 24,
    rescheduleHoursBefore: 12,
    fullRefundHoursBefore: 48,
    partialRefundHoursBefore: 24,
    partialRefundPercent: 50,
    cancellationFeePercent: 10,
    isActive: true,
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/cancellation-policies?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/cancellation-policies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('lists cancellation policies for authenticated builder admins', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/cancellation-policies?includeInactive=1'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-bookings',
    );
    expect(payload).toEqual({ policies: [] });
    expect(listCancellationPolicies).toHaveBeenCalledWith(true);
  });

  it('returns localized errors for invalid create payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({
      name: '',
      cancelHoursBefore: -1,
      partialRefundPercent: 101,
    }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認取消政策資料。');
    expect(payload.errorCode).toBe('invalid_policy_payload');
    expect(payload.details).toHaveLength(3);
    expect(saveCancellationPolicy).not.toHaveBeenCalled();
  });

  it('creates cancellation policies with valid payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest(validPolicyPayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.policy).toEqual(expect.objectContaining({
      policyId: 'pol-route-test',
      name: 'Flexible cancellation',
      cancelHoursBefore: 24,
      rescheduleHoursBefore: 12,
      fullRefundHoursBefore: 48,
      partialRefundHoursBefore: 24,
      partialRefundPercent: 50,
      cancellationFeePercent: 10,
      isActive: true,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(makeCancellationPolicyId).toHaveBeenCalled();
    expect(timestamped).toHaveBeenCalled();
    expect(saveCancellationPolicy).toHaveBeenCalledWith(payload.policy);
  });
});
