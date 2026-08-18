import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  listStaff,
  makeStaffId,
  saveStaff,
  timestamped,
} from '@/lib/builder/bookings/storage';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listStaff: vi.fn(async () => []),
  makeStaffId: vi.fn(() => 'staff-route-test'),
  saveStaff: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function validStaffPayload() {
  return {
    name: { ko: '증위명', 'zh-hant': '曾偉銘', en: 'Attorney Tseng' },
    title: { ko: '변호사', 'zh-hant': '律師', en: 'Attorney' },
    bio: { ko: '상담 담당', 'zh-hant': '諮詢負責', en: 'Consultation lead' },
    email: 'staff@example.com',
    photo: '',
    isActive: true,
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/staff?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/staff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('lists staff for authenticated builder admins', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/staff?includeInactive=1'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-bookings',
    );
    expect(payload).toEqual({ staff: [] });
    expect(listStaff).toHaveBeenCalledWith(true);
  });

  it('returns localized errors for invalid create payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ name: { ko: '' } }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認員工資料。');
    expect(payload.errorCode).toBe('invalid_staff_payload');
    expect(payload.details).toHaveLength(3);
    expect(saveStaff).not.toHaveBeenCalled();
  });

  it('creates staff with valid payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest(validStaffPayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.staff).toEqual(expect.objectContaining({
      staffId: 'staff-route-test',
      email: 'staff@example.com',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(makeStaffId).toHaveBeenCalled();
    expect(timestamped).toHaveBeenCalled();
    expect(saveStaff).toHaveBeenCalledWith(payload.staff);
  });
});
