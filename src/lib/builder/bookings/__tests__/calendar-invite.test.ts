import { describe, expect, it } from 'vitest';
import { buildBookingCalendarInvite, buildBookingCalendarInviteFilename } from '../calendar-invite';

describe('buildBookingCalendarInvite', () => {
  it('serializes a download-safe ICS payload', () => {
    const ics = buildBookingCalendarInvite(
      {
        bookingId: 'bk-ics-1',
        serviceName: 'Consultation',
        staffName: 'Alice',
        startAt: '2099-01-05T01:00:00.000Z',
        endAt: '2099-01-05T01:30:00.000Z',
        detailPath: '/ko/account/bookings/bk-ics-1',
        meetingLink: 'https://example.com/meet',
      },
      'en',
    );

    expect(buildBookingCalendarInviteFilename('bk-ics-1')).toBe('booking-bk-ics-1.ics');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Booking: Consultation');
    expect(ics).toContain('DESCRIPTION:Booking ID: bk-ics-1\\nService: Consultation\\nStaff: Alice\\nBooking details: /ko/account/bookings/bk-ics-1\\nMeeting link: https://example.com/meet');
    expect(ics).toContain('LOCATION:https://example.com/meet');
    expect(ics).toContain('URL:/ko/account/bookings/bk-ics-1');
    expect(ics).toMatch(/DTSTART:20990105T010000Z/);
    expect(ics).toMatch(/DTEND:20990105T013000Z/);
  });
});
