import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  BookingBillingDocumentError,
  issueBookingBillingDocument,
  markBookingBillingDocumentEmailed,
} from '@/lib/builder/bookings/billing-documents';
import { sendBookingBillingDocument } from '@/lib/builder/bookings/notifications';
import { getStaff } from '@/lib/builder/bookings/storage';
import type {
  Booking,
  BookingBillingDocument,
  BookingService,
  Staff,
} from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/billing-documents', () => {
  class BookingBillingDocumentError extends Error {
    constructor(
      public readonly code: string,
      public readonly status = 400,
    ) {
      super(code);
    }
  }

  return {
    BookingBillingDocumentError,
    issueBookingBillingDocument: vi.fn(async () => {
      throw new BookingBillingDocumentError('booking_not_found', 404);
    }),
    markBookingBillingDocumentEmailed: vi.fn(async () => {
      throw new BookingBillingDocumentError('document_not_found', 404);
    }),
  };
});

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingBillingDocument: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getStaff: vi.fn(async () => null),
}));

function service(overrides: Partial<BookingService> = {}): BookingService {
  return {
    serviceId: 'svc-route-test',
    slug: 'initial-consultation',
    name: { ko: '초기 상담', 'zh-hant': '初步諮詢', en: 'Initial consultation' },
    description: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
    durationMinutes: 30,
    priceTwd: 5000,
    staffIds: ['staff-route-test'],
    requiredResourceIds: [],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    maxParticipants: 1,
    slotStepMinutes: 30,
    isActive: true,
    paymentMode: 'paid',
    priceCurrency: 'TWD',
    meetingMode: 'in-person',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function staff(overrides: Partial<Staff> = {}): Staff {
  return {
    staffId: 'staff-route-test',
    name: { ko: '담당자', 'zh-hant': '員工', en: 'Staff' },
    title: { ko: '상담사', 'zh-hant': '顧問', en: 'Advisor' },
    email: 'staff@example.com',
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function document(overrides: Partial<BookingBillingDocument> = {}): BookingBillingDocument {
  return {
    documentId: 'bdoc-route-test',
    type: 'invoice',
    number: 'INV-2026-001',
    status: 'issued',
    currency: 'TWD',
    amount: 5000,
    refundedAmount: 0,
    balanceDue: 5000,
    recipientEmail: 'client@example.com',
    recipientName: 'Client',
    actor: 'admin',
    issuedAt: '2026-05-02T00:00:00.000Z',
    ...overrides,
  };
}

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-document-route-test',
    serviceId: 'svc-route-test',
    staffId: 'staff-route-test',
    customer: {
      name: 'Client',
      email: 'client@example.com',
      locale: 'ko',
    },
    startAt: '2099-01-05T01:00:00.000Z',
    endAt: '2099-01-05T01:30:00.000Z',
    status: 'confirmed',
    source: 'admin',
    reminders: [],
    paymentStatus: 'paid',
    paymentAmount: 5000,
    paymentCurrency: 'TWD',
    billingDocuments: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/bk-document-route-test/documents?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/[id]/documents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized validation errors for invalid document payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ type: 'statement' }, 'zh-hant'), {
      params: { id: 'bk-document-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認帳單文件資料。');
    expect(payload.errorCode).toBe('invalid_document_payload');
    expect(payload.details).toHaveLength(1);
    expect(issueBookingBillingDocument).not.toHaveBeenCalled();
  });

  it('returns localized booking billing document engine errors', async () => {
    vi.mocked(issueBookingBillingDocument).mockRejectedValueOnce(
      new BookingBillingDocumentError('receipt_requires_paid_booking', 409),
    );
    const route = await import('../route');
    const response = await route.POST(postRequest({ type: 'receipt' }, 'ko'), {
      params: { id: 'bk-document-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '영수증은 결제가 완료된 예약에서만 발급할 수 있습니다.',
      errorCode: 'receipt_requires_paid_booking',
    });
  });

  it('normalizes unknown billing document engine codes to localized fallback failures', async () => {
    vi.mocked(issueBookingBillingDocument).mockRejectedValueOnce(
      new BookingBillingDocumentError('unexpected_document_state', 500),
    );
    const route = await import('../route');
    const response = await route.POST(postRequest({ type: 'invoice' }, 'en'), {
      params: { id: 'bk-document-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      error: 'Document action failed.',
      errorCode: 'document_action_failed',
    });
  });

  it('issues booking billing documents with valid payloads', async () => {
    const issuedBooking = booking();
    const issuedDocument = document();
    const issuedService = service();
    vi.mocked(issueBookingBillingDocument).mockResolvedValueOnce({
      booking: issuedBooking,
      document: issuedDocument,
      reused: false,
      service: issuedService,
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({ type: 'invoice', notes: 'Office copy' }, 'ko'), {
      params: { id: 'bk-document-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ booking: issuedBooking, document: issuedDocument, reused: false });
    expect(issueBookingBillingDocument).toHaveBeenCalledWith('bk-document-route-test', {
      type: 'invoice',
      notes: 'Office copy',
    });
    expect(sendBookingBillingDocument).not.toHaveBeenCalled();
    expect(markBookingBillingDocumentEmailed).not.toHaveBeenCalled();
  });

  it('emails issued booking billing documents and returns the emailed version', async () => {
    const issuedBooking = booking();
    const issuedDocument = document({ type: 'receipt' });
    const issuedService = service();
    const emailedBooking = booking({ updatedAt: '2026-05-03T00:00:00.000Z' });
    const emailedDocument = document({
      type: 'receipt',
      status: 'emailed_stub',
      emailedAt: '2026-05-03T00:00:00.000Z',
    });
    const assignedStaff = staff();
    vi.mocked(issueBookingBillingDocument).mockResolvedValueOnce({
      booking: issuedBooking,
      document: issuedDocument,
      reused: true,
      service: issuedService,
    });
    vi.mocked(getStaff).mockResolvedValueOnce(assignedStaff);
    vi.mocked(markBookingBillingDocumentEmailed).mockResolvedValueOnce({
      booking: emailedBooking,
      document: emailedDocument,
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({ type: 'receipt', email: true }, 'en'), {
      params: { id: 'bk-document-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ booking: emailedBooking, document: emailedDocument, reused: true });
    expect(sendBookingBillingDocument).toHaveBeenCalledWith(issuedBooking, issuedDocument, {
      service: issuedService,
      staff: assignedStaff,
    });
    expect(markBookingBillingDocumentEmailed).toHaveBeenCalledWith('bk-document-route-test', 'bdoc-route-test');
  });
});
