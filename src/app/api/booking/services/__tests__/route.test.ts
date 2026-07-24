import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { listServices } from '@/lib/builder/bookings/storage';
import type { BookingService } from '@/lib/builder/bookings/types';
import { GET } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listServices: vi.fn(),
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

const checkRateLimitMock = vi.mocked(checkRateLimit);
const listServicesMock = vi.mocked(listServices);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/booking/services${query ? `?${query}` : ''}`, {
    headers: {
      'x-forwarded-for': '203.0.113.1',
    },
  });
}

describe('/api/booking/services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
    listServicesMock.mockResolvedValue([service] as never);
  });

  it('returns services while preserving success response shape', async () => {
    const response = await GET(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(listServicesMock).toHaveBeenCalledWith(false);
    expect(payload).toEqual({
      services: [{
        ...service,
        displayName: '諮詢',
        displayDescription: '諮詢說明',
      }],
    });
  });

  it('returns localized rate-limit errors with retry headers', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterMs: 3100 } as never);

    const response = await GET(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('4');
    expect(payload).toEqual({
      ok: false,
      error: 'Too many booking requests. Try again shortly.',
      errorCode: 'too_many_requests',
    });
    expect(listServicesMock).not.toHaveBeenCalled();
  });

  it('returns 503 when rate-limit backend is unavailable', async () => {
    checkRateLimitMock.mockResolvedValueOnce({
      allowed: false,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    } as never);

    const response = await GET(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(response.headers.get('Retry-After')).toBeNull();
    expect(payload).toEqual({
      ok: false,
      error: 'Booking protection is temporarily unavailable. Try again shortly.',
      errorCode: 'rate_limit_unavailable',
    });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listServicesMock.mockRejectedValueOnce(new Error('booking services secret leaked'));

    const response = await GET(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '예약 서비스 목록을 불러오지 못했습니다.',
      errorCode: 'booking_services_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('booking services secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[booking/services] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
