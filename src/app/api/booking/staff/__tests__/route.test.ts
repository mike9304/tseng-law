import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getService, listStaff } from '@/lib/builder/bookings/storage';
import type { BookingService, Staff } from '@/lib/builder/bookings/types';
import { GET } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(),
  listStaff: vi.fn(),
}));

const service: BookingService = {
  serviceId: 'svc-1',
  slug: 'consult',
  name: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
  description: { ko: '상담 설명', 'zh-hant': '諮詢說明', en: 'Consultation details' },
  durationMinutes: 60,
  staffIds: ['staff-1'],
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const staff: Staff[] = [
  {
    staffId: 'staff-1',
    name: { ko: '김변호사', 'zh-hant': '金律師', en: 'Attorney Kim' },
    title: { ko: '파트너', 'zh-hant': '合夥人', en: 'Partner' },
    bio: { ko: '소개', 'zh-hant': '介紹', en: 'Bio' },
    isActive: true,
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
  },
  {
    staffId: 'staff-2',
    name: { ko: '이변호사', 'zh-hant': '李律師', en: 'Attorney Lee' },
    title: { ko: '어소시에이트', 'zh-hant': '律師', en: 'Associate' },
    isActive: true,
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
  },
];

const checkRateLimitMock = vi.mocked(checkRateLimit);
const getServiceMock = vi.mocked(getService);
const listStaffMock = vi.mocked(listStaff);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/booking/staff${query ? `?${query}` : ''}`, {
    headers: {
      'x-forwarded-for': '203.0.113.2',
    },
  });
}

describe('/api/booking/staff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
    getServiceMock.mockResolvedValue(service as never);
    listStaffMock.mockResolvedValue(staff as never);
  });

  it('returns filtered staff while preserving success response shape', async () => {
    const response = await GET(request('serviceId=svc-1&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(getServiceMock).toHaveBeenCalledWith('svc-1');
    expect(listStaffMock).toHaveBeenCalledWith(false);
    expect(payload).toEqual({
      staff: [{
        ...staff[0],
        displayName: 'Attorney Kim',
        displayTitle: 'Partner',
        displayBio: 'Bio',
      }],
    });
  });

  it('returns localized rate-limit errors with retry headers', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterMs: 1000 } as never);

    const response = await GET(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('1');
    expect(payload).toEqual({
      ok: false,
      error: '預約請求過多，請稍後再試。',
      errorCode: 'too_many_requests',
    });
    expect(listStaffMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listStaffMock.mockRejectedValueOnce(new Error('booking staff secret leaked'));

    const response = await GET(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '예약 담당자 목록을 불러오지 못했습니다.',
      errorCode: 'booking_staff_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('booking staff secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[booking/staff] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
