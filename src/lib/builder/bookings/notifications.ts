import type { Booking, BookingBillingDocument, BookingService, Staff } from '@/lib/builder/bookings/types';
import { renderBookingEmail } from '@/lib/builder/bookings/email-templates';

export function isBookingEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

async function sendEmail(payload: { to: string | string[]; subject: string; html: string; text?: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info('[bookings] RESEND_API_KEY not configured; skipped email:', payload.subject);
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.BOOKINGS_EMAIL_FROM || 'bookings@hoveringlaw.com.tw',
        ...payload,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (error) {
    console.error('[bookings] email send failed:', error);
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
): Promise<void> {
  const customerEmail = await renderBookingEmail('customer-confirmation', booking, context);
  await sendEmail({
    to: booking.customer.email,
    subject: customerEmail.subject,
    html: customerEmail.html,
    text: customerEmail.text,
  });

  const adminTo = context.staff?.email || process.env.BOOKINGS_ADMIN_EMAIL || process.env.FORMS_EMAIL_FROM;
  if (adminTo) {
    const adminEmail = await renderBookingEmail('admin-notification', booking, context);
    await sendEmail({
      to: adminTo,
      subject: adminEmail.subject,
      html: adminEmail.html,
      text: adminEmail.text,
    });
  }
}

export async function sendBookingReminder(
  booking: Booking,
  context: { service?: BookingService | null; staff?: Staff | null } = {},
): Promise<void> {
  const reminderEmail = await renderBookingEmail('customer-reminder', booking, context);
  await sendEmail({
    to: booking.customer.email,
    subject: reminderEmail.subject,
    html: reminderEmail.html,
    text: reminderEmail.text,
  });
}

export async function sendBookingCancellation(
  booking: Booking,
  context: { service?: BookingService | null; staff?: Staff | null } = {},
): Promise<void> {
  const cancellationEmail = await renderBookingEmail('customer-cancellation', booking, context);
  await sendEmail({
    to: booking.customer.email,
    subject: cancellationEmail.subject,
    html: cancellationEmail.html,
    text: cancellationEmail.text,
  });
}

export async function sendBookingBillingDocument(
  booking: Booking,
  document: BookingBillingDocument,
  context: { service?: BookingService | null; staff?: Staff | null } = {},
): Promise<void> {
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
  await sendEmail({
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
  });
}
