import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';
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
