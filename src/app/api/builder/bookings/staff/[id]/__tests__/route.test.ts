import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getStaff,
  saveStaff,
  timestamped,
} from '@/lib/builder/bookings/storage';
import type { Staff } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getStaff: vi.fn(async () => null),
  saveStaff: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function staff(overrides: Partial<Staff> = {}): Staff {
  return {
    staffId: 'staff-route-test',
    name: { ko: '증위명', 'zh-hant': '曾偉銘', en: 'Attorney Tseng' },
    title: { ko: '변호사', 'zh-hant': '律師', en: 'Attorney' },
    bio: { ko: '상담 담당', 'zh-hant': '諮詢負責', en: 'Consultation lead' },
    email: 'staff@example.com',
    photo: '',
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/staff/staff-route-test?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/staff/staff-route-test?locale=${locale}`, {
    method: 'DELETE',
  });
}

describe('/api/builder/bookings/staff/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing staff on PATCH', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ email: 'next@example.com' }, 'en'), {
      params: { id: 'staff-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Booking staff member not found.',
      errorCode: 'staff_not_found',
    });
    expect(saveStaff).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid patch payloads', async () => {
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ email: 'not-email' }, 'zh-hant'), {
      params: { id: 'staff-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認員工資料。');
    expect(payload.errorCode).toBe('invalid_staff_payload');
    expect(payload.details).toHaveLength(1);
    expect(saveStaff).not.toHaveBeenCalled();
  });

  it('updates staff with valid patch payloads', async () => {
    const existing = staff();
    vi.mocked(getStaff).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ email: 'updated@example.com' }, 'ko'), {
      params: { id: 'staff-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.staff).toEqual(expect.objectContaining({
      staffId: 'staff-route-test',
      email: 'updated@example.com',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ email: 'updated@example.com' }), existing.createdAt);
    expect(saveStaff).toHaveBeenCalledWith(payload.staff);
  });

  it('returns localized not-found errors for missing staff on DELETE', async () => {
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('ko'), {
      params: { id: 'staff-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '예약 담당자를 찾을 수 없습니다.',
      errorCode: 'staff_not_found',
    });
    expect(saveStaff).not.toHaveBeenCalled();
  });

  it('soft-deletes existing staff', async () => {
    const existing = staff();
    vi.mocked(getStaff).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('en'), {
      params: { id: 'staff-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.staff).toEqual(expect.objectContaining({
      staffId: 'staff-route-test',
      isActive: false,
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }), existing.createdAt);
    expect(saveStaff).toHaveBeenCalledWith(payload.staff);
  });
});
