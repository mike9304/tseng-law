import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendEmail(payload: { to: string | string[]; subject: string; html: string }): Promise<void> {
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

function bookingSummaryHtml(booking: Booking, service?: BookingService | null, staff?: Staff | null): string {
  const locale = booking.customer.locale;
  return `
    <p><strong>Service</strong>: ${escapeHtml(textForLocale(service?.name, locale) || booking.serviceId)}</p>
    <p><strong>Staff</strong>: ${escapeHtml(textForLocale(staff?.name, locale) || booking.staffId)}</p>
    <p><strong>Time</strong>: ${escapeHtml(new Date(booking.startAt).toLocaleString(locale))}</p>
    <p><strong>Name</strong>: ${escapeHtml(booking.customer.name)}</p>
    <p><strong>Email</strong>: ${escapeHtml(booking.customer.email)}</p>
    ${booking.customer.phone ? `<p><strong>Phone</strong>: ${escapeHtml(booking.customer.phone)}</p>` : ''}
    ${booking.customer.notes ? `<p><strong>Notes</strong>: ${escapeHtml(booking.customer.notes)}</p>` : ''}
  `;
}

export async function sendBookingConfirmation(
  booking: Booking,
  context: { service?: BookingService | null; staff?: Staff | null } = {},
): Promise<void> {
  await sendEmail({
    to: booking.customer.email,
    subject: '[Hojeong] Consultation booking confirmed',
    html: `<h2>Your consultation is confirmed</h2>${bookingSummaryHtml(booking, context.service, context.staff)}`,
  });

  const adminTo = context.staff?.email || process.env.BOOKINGS_ADMIN_EMAIL || process.env.FORMS_EMAIL_FROM;
  if (adminTo) {
    await sendEmail({
      to: adminTo,
      subject: `[Bookings] New consultation: ${booking.customer.name}`,
      html: `<h2>New consultation booking</h2>${bookingSummaryHtml(booking, context.service, context.staff)}`,
    });
  }
}

export async function sendBookingReminder(booking: Booking): Promise<void> {
  await sendEmail({
    to: booking.customer.email,
    subject: '[Hojeong] Consultation reminder',
    html: `<h2>Consultation reminder</h2><p>Your consultation starts at ${escapeHtml(
      new Date(booking.startAt).toLocaleString(booking.customer.locale),
    )}.</p>`,
  });
}
