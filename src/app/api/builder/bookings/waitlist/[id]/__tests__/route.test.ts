import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getWaitlistEntry,
  saveWaitlistEntry,
  timestamped,
} from '@/lib/builder/bookings/storage';
import type { BookingWaitlistEntry } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getWaitlistEntry: vi.fn(async () => null),
  saveWaitlistEntry: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function waitlistEntry(overrides: Partial<BookingWaitlistEntry> = {}): BookingWaitlistEntry {
  return {
    waitlistId: 'wl-route-test',
    serviceId: 'svc-route-test',
    staffId: 'staff-route-test',
    requestedDate: '2099-01-05',
    customer: {
      name: 'Client',
      email: 'client@example.com',
      locale: 'ko',
    },
    status: 'active',
    source: 'web',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/waitlist/wl-route-test?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/waitlist/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing waitlist entries', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'contacted' }, 'en'), {
      params: Promise.resolve({ id: 'wl-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Waitlist entry not found.',
      errorCode: 'waitlist_not_found',
    });
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid waitlist payloads', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'promoted' }, 'zh-hant'), {
      params: Promise.resolve({ id: 'wl-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認候補名單資料。');
    expect(payload.errorCode).toBe('invalid_waitlist_payload');
    expect(payload.details).toHaveLength(1);
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it('returns localized errors when promoted waitlist entries are edited', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry({ status: 'promoted' }));
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'closed' }, 'ko'), {
      params: Promise.resolve({ id: 'wl-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '이미 예약으로 승격된 대기 목록은 수정할 수 없습니다.',
      errorCode: 'waitlist_already_promoted',
    });
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });

  it('updates waitlist entries with valid patch payloads', async () => {
    const existing = waitlistEntry();
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'contacted' }, 'ko'), {
      params: Promise.resolve({ id: 'wl-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.waitlist).toEqual(expect.objectContaining({
      waitlistId: 'wl-route-test',
      status: 'contacted',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ status: 'contacted' }), existing.createdAt);
    expect(saveWaitlistEntry).toHaveBeenCalledWith(payload.waitlist);
  });
});
