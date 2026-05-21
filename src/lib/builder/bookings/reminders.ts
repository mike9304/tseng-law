import type { BookingReminderType, BookingService } from './types';

export interface BookingReminderWindow {
  type: BookingReminderType;
  hoursAhead: 1 | 24;
  toleranceMinutes: number;
}

const EMAIL_WINDOWS: BookingReminderWindow[] = [
  { type: 'email-reminder-24h', hoursAhead: 24, toleranceMinutes: 30 },
  { type: 'email-reminder-1h', hoursAhead: 1, toleranceMinutes: 15 },
];

const SMS_WINDOWS: BookingReminderWindow[] = [
  { type: 'sms-reminder-24h', hoursAhead: 24, toleranceMinutes: 30 },
  { type: 'sms-reminder-1h', hoursAhead: 1, toleranceMinutes: 15 },
];

export function effectiveReminderHours(service?: Pick<BookingService, 'reminderOffsetsHours'> | null): Set<1 | 24> {
  if (!service || service.reminderOffsetsHours === undefined) return new Set([24]);
  return new Set(service.reminderOffsetsHours.filter((hours): hours is 1 | 24 => hours === 1 || hours === 24));
}

export function reminderWindowsForService(
  service: Pick<BookingService, 'reminderOffsetsHours'> | null | undefined,
  channel: 'email' | 'sms',
): BookingReminderWindow[] {
  const enabledHours = effectiveReminderHours(service);
  const windows = channel === 'email' ? EMAIL_WINDOWS : SMS_WINDOWS;
  return windows.filter((window) => enabledHours.has(window.hoursAhead));
}
