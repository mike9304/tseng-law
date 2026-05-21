import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, BookingService } from '@/lib/builder/bookings/types';

const fixtures = vi.hoisted(() => ({
  booking: null as Booking | null,
  service: null as BookingService | null,
  saveBooking: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getBooking: vi.fn(async () => fixtures.booking),
  getService: vi.fn(async () => fixtures.service),
  saveBooking: fixtures.saveBooking,
}));

import {
  BookingBillingDocumentError,
  issueBookingBillingDocument,
  markBookingBillingDocumentEmailed,
} from '@/lib/builder/bookings/billing-documents';
import {
  bookingPaymentBalanceDue,
  recordBookingManualPayment,
  successfulBookingManualPaymentTotal,
} from '@/lib/builder/bookings/payments';

function service(): BookingService {
  return {
    serviceId: 'svc-paid',
    slug: 'paid-consultation',
    name: { ko: '유료 상담', 'zh-hant': '付費諮詢', en: 'Paid consultation' },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 30,
    priceTwd: 5000,
    priceAmount: 5000,
    priceCurrency: 'TWD',
    paymentMode: 'paid',
    category: 'consultation',
    staffIds: ['staff-1'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    slotStepMinutes: 30,
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
}

function booking(partial: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-doc-test',
    serviceId: 'svc-paid',
    staffId: 'staff-1',
    customer: { name: 'Client', email: 'client@example.com', locale: 'ko' },
    startAt: '2026-05-20T09:00:00.000Z',
    endAt: '2026-05-20T09:30:00.000Z',
    status: 'confirmed',
    source: 'web',
    paymentStatus: 'unpaid',
    paymentAmount: 5000,
    paymentCurrency: 'TWD',
    reminders: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...partial,
  };
}

describe('booking billing documents', () => {
  beforeEach(() => {
    fixtures.service = service();
    fixtures.booking = booking();
    fixtures.saveBooking.mockImplementation(async (next: Booking) => {
      fixtures.booking = next;
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-20T10:00:00.000Z'));
  });

  afterEach(() => {
    fixtures.saveBooking.mockReset();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('issues idempotent invoices and paid receipts for bookings', async () => {
    const invoice = await issueBookingBillingDocument('bk-doc-test', { type: 'invoice' });

    expect(invoice.reused).toBe(false);
    expect(invoice.document).toMatchObject({
      type: 'invoice',
      status: 'issued',
      currency: 'TWD',
      amount: 5000,
      balanceDue: 5000,
    });
    expect(fixtures.booking?.billingDocuments).toHaveLength(1);

    const duplicate = await issueBookingBillingDocument('bk-doc-test', { type: 'invoice' });
    expect(duplicate.reused).toBe(true);
    expect(fixtures.booking?.billingDocuments).toHaveLength(1);

    await expect(issueBookingBillingDocument('bk-doc-test', { type: 'receipt' })).rejects.toMatchObject({
      code: 'receipt_requires_paid_booking',
    } satisfies Partial<BookingBillingDocumentError>);

    fixtures.booking = { ...fixtures.booking!, paymentStatus: 'paid' };
    const receipt = await issueBookingBillingDocument('bk-doc-test', { type: 'receipt' });
    expect(receipt.document).toMatchObject({
      type: 'receipt',
      amount: 5000,
      balanceDue: 0,
      refundedAmount: 0,
    });

    const emailed = await markBookingBillingDocumentEmailed('bk-doc-test', receipt.document.documentId);
    expect(emailed.document.status).toBe('emailed_stub');
    expect(emailed.document.emailedAt).toBe('2026-05-20T10:00:00.000Z');
  });

  it('records partial manual payments separately from refunds and updates invoice balance', async () => {
    fixtures.booking = booking({
      billingDocuments: [
        {
          documentId: 'invoice-1',
          type: 'invoice',
          number: 'INV-1',
          status: 'issued',
          currency: 'TWD',
          amount: 5000,
          refundedAmount: 0,
          balanceDue: 5000,
          recipientEmail: 'client@example.com',
          recipientName: 'Client',
          actor: 'admin',
          issuedAt: '2026-05-19T00:00:00.000Z',
          paymentLinkId: 'paylink-1',
          paymentLinkCreatedAt: '2026-05-19T00:00:00.000Z',
          paymentLinkExpiresAt: '2026-05-26T00:00:00.000Z',
        },
      ],
    });

    const failed = await recordBookingManualPayment('bk-doc-test', {
      amountCents: 1000,
      method: 'bank_transfer',
      status: 'failed',
      reference: 'WIRE-FAILED',
      note: 'Rejected transfer',
    });

    expect(failed.error).toBeUndefined();
    expect(failed.manualPayment).toMatchObject({
      amountCents: 1000,
      status: 'failed',
      reference: 'WIRE-FAILED',
    });
    expect(failed.booking?.paymentStatus).toBe('unpaid');
    expect(successfulBookingManualPaymentTotal(failed.booking!)).toBe(0);
    expect(bookingPaymentBalanceDue(failed.booking!, fixtures.service)).toBe(5000);
    expect(failed.booking?.billingDocuments?.[0]?.balanceDue).toBe(5000);
    expect(failed.booking?.billingDocuments?.[0]?.paymentLinkRevokedAt).toBeUndefined();

    const partial = await recordBookingManualPayment('bk-doc-test', {
      amountCents: 2000,
      method: 'bank_transfer',
      status: 'succeeded',
      reference: 'WIRE-1',
      note: 'Partial payment',
    });

    expect(partial.error).toBeUndefined();
    expect(partial.booking?.paymentStatus).toBe('partially_paid');
    expect(partial.manualPayment).toMatchObject({
      amountCents: 2000,
      currency: 'TWD',
      method: 'bank_transfer',
      reference: 'WIRE-1',
      note: 'Partial payment',
    });
    expect(successfulBookingManualPaymentTotal(partial.booking!)).toBe(2000);
    expect(bookingPaymentBalanceDue(partial.booking!, fixtures.service)).toBe(3000);
    expect(partial.booking?.billingDocuments?.[0]).toMatchObject({
      balanceDue: 3000,
      paymentLinkRevokedAt: '2026-05-20T10:00:00.000Z',
    });
    await expect(issueBookingBillingDocument('bk-doc-test', { type: 'receipt' })).rejects.toMatchObject({
      code: 'receipt_requires_paid_booking',
    } satisfies Partial<BookingBillingDocumentError>);

    const invoice = await issueBookingBillingDocument('bk-doc-test', { type: 'invoice' });
    expect(invoice.document.balanceDue).toBe(3000);
    expect(invoice.reused).toBe(true);

    const final = await recordBookingManualPayment('bk-doc-test', {
      amountCents: 3000,
      method: 'cash',
    });
    expect(final.error).toBeUndefined();
    expect(final.booking?.paymentStatus).toBe('paid');
    expect(successfulBookingManualPaymentTotal(final.booking!)).toBe(5000);
    expect(bookingPaymentBalanceDue(final.booking!, fixtures.service)).toBe(0);
  });
});
