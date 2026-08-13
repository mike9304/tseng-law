import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { markBookingBillingDocumentEmailed } from '@/lib/builder/bookings/billing-documents';
import { sendBookingBillingDocument } from '@/lib/builder/bookings/notifications';
import { getService, getStaff, listBookings } from '@/lib/builder/bookings/storage';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import type { Booking, BookingBillingDocument } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/bookings/billing-documents', () => ({
  markBookingBillingDocumentEmailed: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingBillingDocument: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(),
  getStaff: vi.fn(),
  listBookings: vi.fn(),
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember: vi.fn(),
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  getMemberPortalEmails: vi.fn(),
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 5, retryAfterMs: 0 })),
}));

function billingDocument(overrides: Partial<BookingBillingDocument> = {}): BookingBillingDocument {
  return {
    documentId: 'bdoc-member-email',
    type: 'invoice',
    number: 'INV-2026-002',
    status: 'issued',
    currency: 'TWD',
    amount: 5000,
    refundedAmount: 0,
    balanceDue: 5000,
    recipientEmail: 'member@example.com',
    recipientName: 'Member',
    actor: 'admin',
    issuedAt: '2026-05-02T00:00:00.000Z',
    ...overrides,
  };
}

function booking(document = billingDocument()): Booking {
  return {
    bookingId: 'bk-member-email',
    serviceId: 'svc-member-email',
    staffId: 'staff-member-email',
    customer: { name: 'Member', email: 'member@example.com', locale: 'ko' },
    startAt: '2099-01-05T01:00:00.000Z',
    endAt: '2099-01-05T01:30:00.000Z',
    status: 'confirmed',
    source: 'admin',
    reminders: [],
    paymentStatus: 'paid',
    paymentAmount: 5000,
    paymentCurrency: 'TWD',
    billingDocuments: [document],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
}

const params = Promise.resolve({
  locale: 'ko',
  bookingId: 'bk-member-email',
  documentId: 'bdoc-member-email',
});

function request(origin: string | null = 'https://tseng-law.com'): NextRequest {
  const headers: Record<string, string> = {};
  if (origin !== null) headers.origin = origin;

  return new NextRequest(
    'https://tseng-law.com/ko/account/bookings/bk-member-email/documents/bdoc-member-email/email',
    { method: 'POST', headers },
  );
}

describe('member booking document email route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurrentSiteMember).mockResolvedValue({ memberId: 'member-1' } as never);
    vi.mocked(getMemberPortalEmails).mockReturnValue(['member@example.com']);
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 5,
      retryAfterMs: 0,
    });
    vi.mocked(getService).mockResolvedValue(null);
    vi.mocked(getStaff).mockResolvedValue(null);
  });

  it('rejects missing and cross-origin requests before session or email side effects', async () => {
    const route = await import('../route');
    const missing = await route.POST(request(null), { params });
    const crossOrigin = await route.POST(request('https://attacker.example'), { params });

    expect(missing.status).toBe(403);
    expect(crossOrigin.status).toBe(403);
    await expect(crossOrigin.json()).resolves.toMatchObject({
      error: 'csrf_origin_mismatch',
      code: 'csrf_origin_mismatch',
    });
    expect(getCurrentSiteMember).not.toHaveBeenCalled();
    expect(listBookings).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendBookingBillingDocument).not.toHaveBeenCalled();
    expect(markBookingBillingDocumentEmailed).not.toHaveBeenCalled();
  });

  it('preserves authentication status after a valid same-origin CSRF check', async () => {
    vi.mocked(getCurrentSiteMember).mockResolvedValueOnce(null);

    const route = await import('../route');
    const response = await route.POST(request(), { params });

    expect(response.status).toBe(401);
    expect(listBookings).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendBookingBillingDocument).not.toHaveBeenCalled();
  });

  it('does not consume the member limit for a booking the member does not own', async () => {
    vi.mocked(listBookings).mockResolvedValue([]);

    const route = await import('../route');
    const response = await route.POST(request(), { params });

    expect(response.status).toBe(404);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(getService).not.toHaveBeenCalled();
    expect(getStaff).not.toHaveBeenCalled();
    expect(sendBookingBillingDocument).not.toHaveBeenCalled();
  });

  it('marks a current document emailed only after confirmed delivery', async () => {
    const issuedDocument = billingDocument();
    const sourceBooking = booking(issuedDocument);
    const emailedDocument = billingDocument({ status: 'emailed_stub', emailedAt: '2026-05-03T00:00:00.000Z' });
    const emailedBooking = { ...sourceBooking, billingDocuments: [emailedDocument] };
    vi.mocked(listBookings).mockResolvedValue([sourceBooking]);
    vi.mocked(sendBookingBillingDocument).mockResolvedValue({ ok: true, provider: 'resend', id: 'email-member-test' });
    vi.mocked(markBookingBillingDocumentEmailed).mockResolvedValue({
      booking: emailedBooking,
      document: emailedDocument,
    });

    const route = await import('../route');
    const response = await route.POST(request(), { params });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, booking: emailedBooking, document: emailedDocument });
    expect(checkRateLimit).toHaveBeenCalledWith(
      'member-booking-document-email:member-1',
      6,
      60_000,
    );
    expect(markBookingBillingDocumentEmailed).toHaveBeenCalledWith('bk-member-email', 'bdoc-member-email');
  });

  it('rate limits only after booking and document ownership and before email side effects', async () => {
    const issuedDocument = billingDocument();
    const sourceBooking = booking(issuedDocument);
    vi.mocked(listBookings).mockResolvedValue([sourceBooking]);
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterMs: 2_100,
    });

    const route = await import('../route');
    const response = await route.POST(request(), { params });

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('3');
    await expect(response.json()).resolves.toEqual({ error: 'too_many_requests' });
    expect(listBookings).toHaveBeenCalledOnce();
    expect(getService).not.toHaveBeenCalled();
    expect(getStaff).not.toHaveBeenCalled();
    expect(sendBookingBillingDocument).not.toHaveBeenCalled();
    expect(markBookingBillingDocumentEmailed).not.toHaveBeenCalled();
  });

  it('fails closed without exposing booking data when the shared limiter is unavailable', async () => {
    vi.mocked(listBookings).mockResolvedValue([booking()]);
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });

    const route = await import('../route');
    const response = await route.POST(request(), { params });

    expect(response.status).toBe(503);
    expect(response.headers.get('Retry-After')).toBeNull();
    await expect(response.json()).resolves.toEqual({ error: 'rate_limit_unavailable' });
    expect(sendBookingBillingDocument).not.toHaveBeenCalled();
    expect(markBookingBillingDocumentEmailed).not.toHaveBeenCalled();
  });

  it.each([
    ['unconfigured', 503, 'email_unconfigured'],
    ['provider_error', 502, 'email_provider_error'],
  ] as const)(
    'keeps the member document issued when delivery fails with %s',
    async (reason, expectedStatus, expectedError) => {
      const issuedDocument = billingDocument();
      const sourceBooking = booking(issuedDocument);
      vi.mocked(listBookings).mockResolvedValue([sourceBooking]);
      vi.mocked(sendBookingBillingDocument).mockResolvedValue({ ok: false, provider: 'resend', reason });

      const route = await import('../route');
      const response = await route.POST(request(), { params });

      expect(response.status).toBe(expectedStatus);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        error: expectedError,
        booking: sourceBooking,
        document: issuedDocument,
      });
      expect(markBookingBillingDocumentEmailed).not.toHaveBeenCalled();
      expect(issuedDocument.status).toBe('issued');
    },
  );

  it('does not expose marker persistence failures after confirmed delivery', async () => {
    const issuedDocument = billingDocument();
    const sourceBooking = booking(issuedDocument);
    vi.mocked(listBookings).mockResolvedValue([sourceBooking]);
    vi.mocked(sendBookingBillingDocument).mockResolvedValue({
      ok: true,
      provider: 'resend',
      id: 'email-member-test',
    });
    vi.mocked(markBookingBillingDocumentEmailed).mockRejectedValueOnce(
      new Error('storage details and recipient must stay private'),
    );

    const route = await import('../route');
    const response = await route.POST(request(), { params });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'marker_persist_failed_after_delivery',
      booking: sourceBooking,
      document: issuedDocument,
    });
    expect(issuedDocument.status).toBe('issued');
  });
});
