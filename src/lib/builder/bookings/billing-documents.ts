import { randomUUID } from 'node:crypto';
import type {
  Booking,
  BookingBillingDocument,
  BookingBillingDocumentType,
  BookingService,
} from '@/lib/builder/bookings/types';
import {
  commitBillingDocumentNumber,
  reserveBillingDocumentNumber,
  voidBillingDocumentNumber,
} from '@/lib/builder/billing-document-numbering';
import { appendPaymentLinkHistory } from '@/lib/builder/billing-payment-link-history';
import { getBooking, getService, saveBooking } from '@/lib/builder/bookings/storage';
import {
  bookingPaymentAmountFor,
  bookingPaymentBalanceDue,
  bookingPaymentCurrencyFor,
} from '@/lib/builder/bookings/payments';

export class BookingBillingDocumentError extends Error {
  constructor(
    public readonly code: string,
    public readonly status = 400,
  ) {
    super(code);
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function refundedAmountFor(booking: Booking, amount: number): number {
  if (booking.paymentStatus === 'refunded') return amount;
  if (booking.paymentStatus === 'partial-refund') return Math.ceil(amount / 2);
  return 0;
}

function matchesSnapshot(
  document: BookingBillingDocument,
  type: BookingBillingDocumentType,
  snapshot: Pick<BookingBillingDocument, 'amount' | 'balanceDue' | 'currency' | 'refundedAmount' | 'recipientEmail'>,
): boolean {
  return document.type === type
    && (document.status === 'issued' || document.status === 'emailed_stub')
    && document.amount === snapshot.amount
    && document.balanceDue === snapshot.balanceDue
    && document.currency === snapshot.currency
    && document.refundedAmount === snapshot.refundedAmount
    && document.recipientEmail === snapshot.recipientEmail;
}

export async function issueBookingBillingDocument(
  bookingId: string,
  input: {
    type: BookingBillingDocumentType;
    actor?: string;
    notes?: string;
  },
): Promise<{ booking: Booking; document: BookingBillingDocument; reused: boolean; service: BookingService | null }> {
  const booking = await getBooking(bookingId);
  if (!booking) throw new BookingBillingDocumentError('booking_not_found', 404);
  if (input.type !== 'invoice' && input.type !== 'receipt') {
    throw new BookingBillingDocumentError('invalid_document_type', 400);
  }
  if (
    input.type === 'receipt'
    && booking.paymentStatus !== 'paid'
    && booking.paymentStatus !== 'refunded'
    && booking.paymentStatus !== 'partial-refund'
  ) {
    throw new BookingBillingDocumentError('receipt_requires_paid_booking', 409);
  }

  const service = await getService(booking.serviceId);
  const amount = bookingPaymentAmountFor(booking, service);
  const currency = bookingPaymentCurrencyFor(booking, service);
  const refundedAmount = refundedAmountFor(booking, amount);
  const balanceDue = bookingPaymentBalanceDue(booking, service);
  const snapshot = {
    amount,
    balanceDue,
    currency,
    refundedAmount,
    recipientEmail: booking.customer.email,
  };
  const currentDocuments = booking.billingDocuments ?? [];
  const existing = currentDocuments.find((document) => matchesSnapshot(document, input.type, snapshot));
  if (existing) return { booking, document: existing, reused: true, service };

  const issuedAt = nowIso();
  const numberReservation = await reserveBillingDocumentNumber(input.type, issuedAt);
  const document: BookingBillingDocument = {
    documentId: `bdoc-${randomUUID()}`,
    type: input.type,
    number: numberReservation.number,
    numberReservationId: numberReservation.reservationId,
    status: 'issued',
    currency,
    amount,
    refundedAmount,
    balanceDue,
    recipientEmail: booking.customer.email,
    recipientName: booking.customer.name,
    actor: input.actor ?? 'admin',
    issuedAt,
    ...(input.notes ? { notes: input.notes } : {}),
  };
  const next = {
    ...booking,
    paymentAmount: booking.paymentAmount ?? amount,
    paymentCurrency: booking.paymentCurrency ?? currency,
    billingDocuments: [...currentDocuments, document],
    updatedAt: issuedAt,
  };
  try {
    await saveBooking(next);
  } catch (error) {
    await voidBillingDocumentNumber(numberReservation.reservationId, 'booking_document_save_failed').catch(() => null);
    throw error;
  }
  await commitBillingDocumentNumber(numberReservation.reservationId, {
    ownerSource: 'booking',
    ownerId: booking.bookingId,
    documentId: document.documentId,
  });
  return { booking: next, document, reused: false, service };
}

export async function markBookingBillingDocumentEmailed(
  bookingId: string,
  documentId: string,
): Promise<{ booking: Booking; document: BookingBillingDocument }> {
  const booking = await getBooking(bookingId);
  if (!booking) throw new BookingBillingDocumentError('booking_not_found', 404);
  const documents = booking.billingDocuments ?? [];
  const found = documents.find((document) => document.documentId === documentId);
  if (!found) throw new BookingBillingDocumentError('document_not_found', 404);
  if (found.status !== 'issued' && found.status !== 'emailed_stub') {
    throw new BookingBillingDocumentError('document_not_current', 409);
  }
  const emailedAt = nowIso();
  const nextDocument: BookingBillingDocument = {
    ...found,
    status: 'emailed_stub',
    emailedAt: found.emailedAt ?? emailedAt,
  };
  const next = {
    ...booking,
    billingDocuments: documents.map((document) => (
      document.documentId === documentId ? nextDocument : document
    )),
    updatedAt: emailedAt,
  };
  await saveBooking(next);
  return { booking: next, document: nextDocument };
}

export async function voidBookingBillingDocument(
  bookingId: string,
  documentId: string,
  input: {
    reason?: string;
  } = {},
): Promise<{ booking: Booking; document: BookingBillingDocument }> {
  const booking = await getBooking(bookingId);
  if (!booking) throw new BookingBillingDocumentError('booking_not_found', 404);
  const documents = booking.billingDocuments ?? [];
  const found = documents.find((document) => document.documentId === documentId);
  if (!found) throw new BookingBillingDocumentError('document_not_found', 404);
  if (found.status !== 'issued' && found.status !== 'emailed_stub') {
    throw new BookingBillingDocumentError('document_not_current', 409);
  }

  const now = nowIso();
  const shouldRevokePaymentLink = Boolean(found.paymentLinkCreatedAt) && !found.paymentLinkRevokedAt;
  const revokedDocument: BookingBillingDocument = {
    ...found,
    status: 'voided',
    voidedAt: now,
    voidReason: input.reason?.trim() || 'Voided by admin',
    shareLinkRevokedAt: found.shareLinkCreatedAt ? now : found.shareLinkRevokedAt,
    paymentLinkRevokedAt: shouldRevokePaymentLink ? now : found.paymentLinkRevokedAt,
    paymentLinkRevokedReason: shouldRevokePaymentLink ? 'document_voided' : found.paymentLinkRevokedReason,
    paymentLinkRevokedBalanceDue: shouldRevokePaymentLink ? found.balanceDue : found.paymentLinkRevokedBalanceDue,
    paymentLinkRevokedByPaymentId: shouldRevokePaymentLink ? undefined : found.paymentLinkRevokedByPaymentId,
  };
  const nextDocument = shouldRevokePaymentLink
    ? appendPaymentLinkHistory(revokedDocument, {
      type: 'revoked',
      actor: 'admin',
      createdAt: now,
      paymentLinkId: found.paymentLinkId,
      reason: 'document_voided',
      balanceDue: found.balanceDue,
    })
    : revokedDocument;
  const next = {
    ...booking,
    billingDocuments: documents.map((document) => (
      document.documentId === documentId ? nextDocument : document
    )),
    updatedAt: now,
  };
  await saveBooking(next);
  return { booking: next, document: nextDocument };
}

export async function supersedeBookingBillingDocument(
  bookingId: string,
  documentId: string,
  input: {
    reason?: string;
    notes?: string;
  } = {},
): Promise<{ booking: Booking; document: BookingBillingDocument; supersededDocument: BookingBillingDocument; service: BookingService | null }> {
  const booking = await getBooking(bookingId);
  if (!booking) throw new BookingBillingDocumentError('booking_not_found', 404);
  const documents = booking.billingDocuments ?? [];
  const found = documents.find((document) => document.documentId === documentId);
  if (!found) throw new BookingBillingDocumentError('document_not_found', 404);
  if (found.status !== 'issued' && found.status !== 'emailed_stub') {
    throw new BookingBillingDocumentError('document_not_current', 409);
  }

  const service = await getService(booking.serviceId);
  const amount = bookingPaymentAmountFor(booking, service);
  const currency = bookingPaymentCurrencyFor(booking, service);
  const refundedAmount = refundedAmountFor(booking, amount);
  const balanceDue = bookingPaymentBalanceDue(booking, service);
  const issuedAt = nowIso();
  const numberReservation = await reserveBillingDocumentNumber(found.type, issuedAt);
  const replacement: BookingBillingDocument = {
    documentId: `bdoc-${randomUUID()}`,
    type: found.type,
    number: numberReservation.number,
    numberReservationId: numberReservation.reservationId,
    status: 'issued',
    currency,
    amount,
    refundedAmount,
    balanceDue,
    recipientEmail: booking.customer.email,
    recipientName: booking.customer.name,
    actor: 'admin',
    issuedAt,
    notes: input.notes?.trim() || `Supersedes ${found.number}`,
    supersedesDocumentId: found.documentId,
  };
  const shouldRevokePaymentLink = Boolean(found.paymentLinkCreatedAt) && !found.paymentLinkRevokedAt;
  const revokedSupersededDocument: BookingBillingDocument = {
    ...found,
    status: 'superseded',
    voidReason: input.reason?.trim() || 'Superseded by admin',
    supersededByDocumentId: replacement.documentId,
    shareLinkRevokedAt: found.shareLinkCreatedAt ? issuedAt : found.shareLinkRevokedAt,
    paymentLinkRevokedAt: shouldRevokePaymentLink ? issuedAt : found.paymentLinkRevokedAt,
    paymentLinkRevokedReason: shouldRevokePaymentLink ? 'document_superseded' : found.paymentLinkRevokedReason,
    paymentLinkRevokedBalanceDue: shouldRevokePaymentLink ? found.balanceDue : found.paymentLinkRevokedBalanceDue,
    paymentLinkRevokedByPaymentId: shouldRevokePaymentLink ? undefined : found.paymentLinkRevokedByPaymentId,
  };
  const supersededDocument = shouldRevokePaymentLink
    ? appendPaymentLinkHistory(revokedSupersededDocument, {
      type: 'revoked',
      actor: 'admin',
      createdAt: issuedAt,
      paymentLinkId: found.paymentLinkId,
      reason: 'document_superseded',
      balanceDue: found.balanceDue,
    })
    : revokedSupersededDocument;
  const next = {
    ...booking,
    paymentAmount: booking.paymentAmount ?? amount,
    paymentCurrency: booking.paymentCurrency ?? currency,
    billingDocuments: [
      ...documents.map((document) => (
        document.documentId === documentId ? supersededDocument : document
      )),
      replacement,
    ],
    updatedAt: issuedAt,
  };
  try {
    await saveBooking(next);
  } catch (error) {
    await voidBillingDocumentNumber(numberReservation.reservationId, 'booking_supersede_save_failed').catch(() => null);
    throw error;
  }
  await commitBillingDocumentNumber(numberReservation.reservationId, {
    ownerSource: 'booking',
    ownerId: booking.bookingId,
    documentId: replacement.documentId,
  });
  return { booking: next, document: replacement, supersededDocument, service };
}
