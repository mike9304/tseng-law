import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCustomerBookingPortal } from '@/lib/builder/bookings/customer-portal';
import {
  MEMBER_SESSION_COOKIE,
  getMemberPortalEmails,
  validateSession,
} from '@/lib/builder/members/members-engine';
import { GET } from '../route';

vi.mock('@/lib/builder/bookings/customer-portal', () => ({
  getCustomerBookingPortal: vi.fn(),
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  MEMBER_SESSION_COOKIE: 'builder_member_session',
  getMemberPortalEmails: vi.fn(() => ['member@example.com', 'old@example.com']),
  validateSession: vi.fn(),
}));

const member = {
  memberId: 'member-1',
  email: 'member@example.com',
  name: 'Member One',
  role: 'free',
  verified: true,
  blocked: false,
  createdAt: '2026-06-03T00:00:00.000Z',
};

const booking = {
  bookingId: 'booking-1',
  serviceName: 'Consultation',
  managePath: '/ko/bookings/manage/token-secret',
};

const getCustomerBookingPortalMock = vi.mocked(getCustomerBookingPortal);
const getMemberPortalEmailsMock = vi.mocked(getMemberPortalEmails);
const validateSessionMock = vi.mocked(validateSession);

function request(query = '', cookie = `${MEMBER_SESSION_COOKIE}=session-1`): NextRequest {
  return new NextRequest(`https://law.example.test/api/members/bookings${query ? `?${query}` : ''}`, {
    headers: cookie ? { cookie } : {},
  });
}

describe('members bookings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    validateSessionMock.mockResolvedValue(member as never);
    getMemberPortalEmailsMock.mockReturnValue(['member@example.com', 'old@example.com'] as never);
    getCustomerBookingPortalMock.mockResolvedValue({
      email: 'member@example.com',
      upcoming: [booking],
      past: [{ ...booking, bookingId: 'booking-past' }],
    } as never);
  });

  it('returns localized unauthenticated errors', async () => {
    validateSessionMock.mockResolvedValueOnce(null);

    const response = await GET(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({
      ok: false,
      error: '需要登入。',
      errorCode: 'not_authenticated',
    });
  });

  it('returns safe booking DTOs while preserving response shape', async () => {
    const response = await GET(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      email: 'member@example.com',
      upcoming: [{ bookingId: 'booking-1', serviceName: 'Consultation' }],
      past: [{ bookingId: 'booking-past', serviceName: 'Consultation' }],
      counts: { upcoming: 1, past: 1 },
    });
    expect(JSON.stringify(payload)).not.toContain('token-secret');
    expect(getCustomerBookingPortalMock).toHaveBeenCalledWith(
      'member@example.com',
      'en',
      undefined,
      ['member@example.com', 'old@example.com'],
    );
  });

  it('returns localized booking-load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getCustomerBookingPortalMock.mockRejectedValueOnce(new Error('booking portal secret leaked'));

    const response = await GET(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '회원 예약 정보를 불러오지 못했습니다.',
      errorCode: 'member_bookings_failed',
    });
    expect(payload.error).not.toContain('booking portal secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[members/bookings] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
