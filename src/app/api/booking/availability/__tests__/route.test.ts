import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computeAvailableSlots, type Slot } from '@/lib/builder/bookings/availability';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { GET } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  computeAvailableSlots: vi.fn(),
}));

const slots: Slot[] = [
  {
    startAt: '2026-06-10T01:00:00.000Z',
    endAt: '2026-06-10T02:00:00.000Z',
    staffId: 'staff-1',
    timezone: 'Asia/Seoul',
  },
];

const checkRateLimitMock = vi.mocked(checkRateLimit);
const computeAvailableSlotsMock = vi.mocked(computeAvailableSlots);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/booking/availability${query ? `?${query}` : ''}`, {
    headers: {
      'x-forwarded-for': '203.0.113.3',
    },
  });
}

describe('/api/booking/availability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
    computeAvailableSlotsMock.mockResolvedValue(slots as never);
  });

  it('returns slots while preserving success response shape', async () => {
    const response = await GET(request('serviceId=svc-1&staffId=staff-1&date=2026-06-10&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(computeAvailableSlotsMock).toHaveBeenCalledWith({
      serviceId: 'svc-1',
      staffId: 'staff-1',
      date: '2026-06-10',
    });
    expect(payload).toEqual({ slots });
  });

  it('returns localized rate-limit errors with retry headers', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterMs: 2200 } as never);

    const response = await GET(request('serviceId=svc-1&date=2026-06-10&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('3');
    expect(payload).toEqual({
      ok: false,
      error: 'Too many booking requests. Try again shortly.',
      errorCode: 'too_many_requests',
    });
    expect(computeAvailableSlotsMock).not.toHaveBeenCalled();
  });

  it('returns localized validation errors', async () => {
    const response = await GET(request('serviceId=&date=bad&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認服務與日期。',
      errorCode: 'booking_availability_invalid',
    });
    expect(computeAvailableSlotsMock).not.toHaveBeenCalled();
  });

  it('returns localized availability failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    computeAvailableSlotsMock.mockRejectedValueOnce(new Error('booking availability secret leaked'));

    const response = await GET(request('serviceId=svc-1&date=2026-06-10&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '예약 가능 시간을 불러오지 못했습니다.',
      errorCode: 'booking_availability_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('booking availability secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[booking/availability] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
