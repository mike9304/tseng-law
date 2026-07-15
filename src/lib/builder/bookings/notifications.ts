import { createHash } from 'node:crypto';
import type {
  Booking,
  BookingBillingDocument,
  BookingReminderType,
  BookingService,
  Staff,
} from '@/lib/builder/bookings/types';
import { renderBookingEmail } from '@/lib/builder/bookings/email-templates';

export function isBookingEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export type BookingEmailDeliveryResult =
  | { ok: true; provider: 'resend'; id?: string }
  | {
    ok: false;
    provider: 'resend';
    reason: 'unconfigured' | 'provider_error';
    status?: number;
  };

export type BookingConfirmationDeliveryResult = {
  ok: boolean;
  customer: BookingEmailDeliveryResult;
  admin?: BookingEmailDeliveryResult;
};

function emailIdempotencyKey(kind: string, ...parts: string[]): string {
  const digest = createHash('sha256')
    .update([kind, ...parts].join('\u001f'))
    .digest('hex');
  return `booking-email:v1:${kind}:${digest}`;
}

async function sendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
}): Promise<BookingEmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, provider: 'resend', reason: 'unconfigured' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const { idempotencyKey, ...emailPayload } = payload;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey.slice(0, 256) } : {}),
      },
      body: JSON.stringify({
        from: process.env.BOOKINGS_EMAIL_FROM || 'bookings@hoveringlaw.com.tw',
        ...emailPayload,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        provider: 'resend',
        reason: 'provider_error',
        status: response.status,
      };
    }

    const body = await response.json().catch(() => null) as unknown;
    const id = body && typeof body === 'object' && 'id' in body && typeof body.id === 'string'
      ? body.id.trim()
      : '';
    return id
      ? { ok: true, provider: 'resend', id }
      : { ok: true, provider: 'resend' };
  } catch {
    return { ok: false, provider: 'resend', reason: 'provider_error' };
  } finally {
    clearTimeout(timeout);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendBookingConfirmation(
  booking: Booking,
  context: { service?: BookingService | null; staff?: Staff | null } = {},
): Promise<BookingConfirmationDeliveryResult> {
  const customerEmail = await renderBookingEmail('customer-confirmation', booking, context);
  const customer = await sendEmail({
    to: booking.customer.email,
    subject: customerEmail.subject,
    html: customerEmail.html,
    text: customerEmail.text,
    idempotencyKey: emailIdempotencyKey('confirmation-customer', booking.bookingId),
  });

  const adminTo = (
    context.staff?.email || process.env.BOOKINGS_ADMIN_EMAIL || process.env.FORMS_EMAIL_FROM || ''
  ).trim();
  if (adminTo) {
    const adminEmail = await renderBookingEmail('admin-notification', booking, context);
    const admin = await sendEmail({
      to: adminTo,
      subject: adminEmail.subject,
      html: adminEmail.html,
      text: adminEmail.text,
      idempotencyKey: emailIdempotencyKey('confirmation-admin', booking.bookingId),
    });
    return { ok: customer.ok && admin.ok, customer, admin };
  }

  return { ok: customer.ok, customer };
}

export async function sendBookingReminder(
  booking: Booking,
  context: {
    reminderType: BookingReminderType;
    service?: BookingService | null;
    staff?: Staff | null;
  },
): Promise<BookingEmailDeliveryResult> {
  const reminderEmail = await renderBookingEmail('customer-reminder', booking, context);
  return sendEmail({
    to: booking.customer.email,
    subject: reminderEmail.subject,
    html: reminderEmail.html,
    text: reminderEmail.text,
    idempotencyKey: emailIdempotencyKey('reminder', booking.bookingId, context.reminderType),
  });
}

export async function sendBookingCancellation(
  booking: Booking,
  context: { service?: BookingService | null; staff?: Staff | null } = {},
): Promise<BookingEmailDeliveryResult> {
  const cancellationEmail = await renderBookingEmail('customer-cancellation', booking, context);
  return sendEmail({
    to: booking.customer.email,
    subject: cancellationEmail.subject,
    html: cancellationEmail.html,
    text: cancellationEmail.text,
    idempotencyKey: emailIdempotencyKey('cancellation', booking.bookingId),
  });
}

export async function sendBookingBillingDocument(
  booking: Booking,
  document: BookingBillingDocument,
  context: { service?: BookingService | null; staff?: Staff | null } = {},
): Promise<BookingEmailDeliveryResult> {
  const label = document.type === 'invoice' ? 'Invoice' : 'Receipt';
  const serviceName = context.service?.name?.[booking.customer.locale]
    || context.service?.name?.ko
    || context.service?.name?.en
    || booking.serviceId;
  const formattedAmount = new Intl.NumberFormat('en', {
    currency: document.currency,
    style: 'currency',
  }).format(document.amount / (document.currency === 'KRW' || document.currency === 'JPY' ? 1 : 100));
  const formattedBalance = new Intl.NumberFormat('en', {
    currency: document.currency,
    style: 'currency',
  }).format(document.balanceDue / (document.currency === 'KRW' || document.currency === 'JPY' ? 1 : 100));
  const text = [
    `${label} ${document.number}`,
    `Service: ${serviceName}`,
    `Amount: ${formattedAmount}`,
    `Balance due: ${formattedBalance}`,
    `Booking: ${booking.bookingId}`,
  ].join('\n');
  return sendEmail({
    to: booking.customer.email,
    subject: `[Hojeong] ${label} ${document.number}`,
    html: `
      <p>${label} <strong>${escapeHtml(document.number)}</strong></p>
      <p><strong>Service</strong>: ${escapeHtml(serviceName)}</p>
      <p><strong>Amount</strong>: ${escapeHtml(formattedAmount)}</p>
      <p><strong>Balance due</strong>: ${escapeHtml(formattedBalance)}</p>
      <p><strong>Booking</strong>: ${escapeHtml(booking.bookingId)}</p>
    `,
    text,
    idempotencyKey: emailIdempotencyKey('billing-document', booking.bookingId, document.documentId),
  });
}
