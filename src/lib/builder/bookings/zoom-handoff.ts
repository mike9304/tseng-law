import type { BookingService, StaffAvailability } from './types';
import { getStaffAvailability } from './storage';
import { createZoomMeeting } from './zoom-client';

function meetingModeRequiresZoom(meetingMode?: BookingService['meetingMode']): boolean {
  return meetingMode === 'zoom' || meetingMode === 'hybrid';
}

export async function maybeCreateBookingZoomLink(args: {
  service: Pick<BookingService, 'meetingMode' | 'name' | 'durationMinutes'>;
  staffId: string;
  startTimeISO: string;
  customerName: string;
  customerEmail?: string;
  timezone?: string;
}): Promise<{ meetingLink?: string; officeTimezone: string } | null> {
  if (!meetingModeRequiresZoom(args.service.meetingMode)) return null;

  const availability: StaffAvailability | null = args.timezone
    ? ({ staffId: args.staffId, timezone: args.timezone } as StaffAvailability)
    : await getStaffAvailability(args.staffId);

  const officeTimezone = availability.timezone;
  const meeting = await createZoomMeeting({
    topic: `${args.service.name?.ko || args.service.name?.en || 'Booking'} · ${args.customerName}`,
    startTimeISO: args.startTimeISO,
    durationMinutes: args.service.durationMinutes,
    timezone: officeTimezone,
    customerEmail: args.customerEmail,
  });
  return meeting.ok
    ? { meetingLink: meeting.meetingLink, officeTimezone }
    : { officeTimezone };
}
