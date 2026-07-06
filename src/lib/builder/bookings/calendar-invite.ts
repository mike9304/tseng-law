import type { Locale } from '@/lib/locales';

export interface BookingCalendarInviteInput {
  bookingId: string;
  serviceName: string;
  staffName: string;
  startAt: string;
  endAt: string;
  detailPath: string;
  meetingLink?: string;
}

const LABELS: Record<Locale, { bookingId: string; service: string; staff: string; booking: string; meeting: string; details: string }> = {
  ko: {
    bookingId: '예약 ID',
    service: '상담',
    staff: '담당',
    booking: '예약',
    meeting: '미팅 링크',
    details: '예약 상세',
  },
  'zh-hant': {
    bookingId: '預約 ID',
    service: '諮詢',
    staff: '負責人',
    booking: '預約',
    meeting: '會議連結',
    details: '預約詳情',
  },
  en: {
    bookingId: 'Booking ID',
    service: 'Service',
    staff: 'Staff',
    booking: 'Booking',
    meeting: 'Meeting link',
    details: 'Booking details',
  },
};

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function toIcsTimestamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'booking';
}

export function buildBookingCalendarInviteFilename(bookingId: string): string {
  return `${sanitizeFilename(`booking-${bookingId}`)}.ics`;
}

export function buildBookingCalendarInvite(
  input: BookingCalendarInviteInput,
  locale: Locale,
): string {
  const labels = LABELS[locale];
  const description = [
    `${labels.bookingId}: ${input.bookingId}`,
    `${labels.service}: ${input.serviceName}`,
    `${labels.staff}: ${input.staffName}`,
    `${labels.details}: ${input.detailPath}`,
    input.meetingLink ? `${labels.meeting}: ${input.meetingLink}` : null,
  ].filter(Boolean).join('\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tseng Law//Bookings Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeIcsText(`${input.bookingId}@tseng-law.local`)}`,
    `DTSTAMP:${toIcsTimestamp(new Date().toISOString())}`,
    `DTSTART:${toIcsTimestamp(input.startAt)}`,
    `DTEND:${toIcsTimestamp(input.endAt)}`,
    `SUMMARY:${escapeIcsText(`${labels.booking}: ${input.serviceName}`)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    input.meetingLink ? `LOCATION:${escapeIcsText(input.meetingLink)}` : null,
    `URL:${escapeIcsText(input.detailPath)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return `${lines.join('\r\n')}\r\n`;
}
