import { describe, expect, it } from 'vitest';
import { effectiveReminderHours, reminderWindowsForService } from '@/lib/builder/bookings/reminders';

describe('booking reminder schedule helpers', () => {
  it('keeps legacy services on the 24 hour reminder by default', () => {
    expect([...effectiveReminderHours(null)]).toEqual([24]);
    expect(reminderWindowsForService({}, 'email').map((window) => window.type)).toEqual(['email-reminder-24h']);
    expect(reminderWindowsForService(undefined, 'sms').map((window) => window.type)).toEqual(['sms-reminder-24h']);
  });

  it('treats an explicit empty schedule as reminders off', () => {
    expect([...effectiveReminderHours({ reminderOffsetsHours: [] })]).toEqual([]);
    expect(reminderWindowsForService({ reminderOffsetsHours: [] }, 'email')).toEqual([]);
    expect(reminderWindowsForService({ reminderOffsetsHours: [] }, 'sms')).toEqual([]);
  });

  it('maps the same service schedule to email and SMS reminder windows', () => {
    const service = { reminderOffsetsHours: [24, 1] };

    expect(reminderWindowsForService(service, 'email').map((window) => window.type)).toEqual([
      'email-reminder-24h',
      'email-reminder-1h',
    ]);
    expect(reminderWindowsForService(service, 'sms').map((window) => window.type)).toEqual([
      'sms-reminder-24h',
      'sms-reminder-1h',
    ]);
  });
});
